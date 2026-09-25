import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relative = "public/schemas/native-install-plan.schema.json";
const file = path.join(root, relative);
const fail = (message) => { throw new Error(`Public schema validation failed: ${message}`); };
if (!fs.existsSync(file)) fail(`${relative} is missing`);
let schema;
try { schema = JSON.parse(fs.readFileSync(file, "utf8")); } catch { fail(`${relative} is not valid JSON`); }
if (schema.$id !== "https://carmediahub.github.io/schemas/native-install-plan.schema.json") fail("schema id is incorrect");
if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") fail("schema draft is incorrect");
if (schema.type !== "object" || schema.additionalProperties !== false) fail("schema root is not closed");
if (schema.properties?.service?.oneOf?.length !== 2 || schema.$defs?.windowsService?.additionalProperties !== false || schema.$defs?.linuxService?.additionalProperties !== false) fail("service variants are not closed");
if (schema.allOf?.length !== 4 || schema.allOf.filter((rule) => rule.then?.properties?.service?.$ref !== undefined).length !== 2) fail("platform and service variants are not linked");
if (schema.allOf.filter((rule) => rule.then?.properties?.actions?.items?.properties?.command?.enum !== undefined).length !== 2) fail("platform action command allowlists are not linked");
if (schema.properties?.schemaVersion?.const !== 1 || !schema.required?.includes("schemaVersion")) fail("schema version is missing or unsupported");
for (const key of ["platform", "bundle", "resources", "service", "serviceAccount", "acl", "actions"]) if (!schema.required?.includes(key)) fail(`required field is missing: ${key}`);
const commands = schema.$defs?.action?.properties?.command?.enum;
if (!Array.isArray(commands) || !commands.includes("sc.exe") || !commands.includes("systemctl")) fail("platform command allowlist is incomplete");
console.log(`Verified public schema: ${relative}`);
const matrixRelative = "public/schemas/component-release-matrix.schema.json";
const matrixFile = path.join(root, matrixRelative);
if (!fs.existsSync(matrixFile)) fail(`${matrixRelative} is missing`);
let matrix;
try { matrix = JSON.parse(fs.readFileSync(matrixFile, "utf8")); } catch { fail(`${matrixRelative} is not valid JSON`); }
if (matrix.$id !== "https://carmediahub.github.io/schemas/component-release-matrix.schema.json" || matrix.$schema !== "https://json-schema.org/draft/2020-12/schema") fail("component release matrix schema identity is incorrect");
if (matrix.type !== "object" || matrix.additionalProperties !== false || matrix.properties?.schemaVersion?.const !== 1) fail("component release matrix root is invalid");
for (const key of ["componentId", "version", "platforms", "releases"]) if (!matrix.required?.includes(key)) fail(`component release matrix required field is missing: ${key}`);
if (matrix.properties?.releases?.items?.properties?.release?.$ref !== "component-release.schema.json#/$defs/release") fail("component release matrix must reference the release payload definition");
console.log(`Verified public schema: ${matrixRelative}`);
const releaseRelative = "public/schemas/component-release.schema.json";
const releaseFile = path.join(root, releaseRelative);
if (!fs.existsSync(releaseFile)) fail(`${releaseRelative} is missing`);
let release;
try { release = JSON.parse(fs.readFileSync(releaseFile, "utf8")); } catch { fail(`${releaseRelative} is not valid JSON`); }
if (release.$id !== "https://carmediahub.github.io/schemas/component-release.schema.json" || release.$schema !== "https://json-schema.org/draft/2020-12/schema") fail("component release schema identity is incorrect");
if (release.type !== "object" || release.additionalProperties !== false || release.$defs?.release?.additionalProperties !== false) fail("component release schema is not closed");
console.log(`Verified public schema: ${releaseRelative}`);
