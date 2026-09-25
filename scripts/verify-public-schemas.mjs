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
for (const key of ["platform", "bundle", "resources", "service", "serviceAccount", "acl", "actions"]) if (!schema.required?.includes(key)) fail(`required field is missing: ${key}`);
const commands = schema.$defs?.action?.properties?.command?.enum;
if (!Array.isArray(commands) || !commands.includes("sc.exe") || !commands.includes("systemctl")) fail("platform command allowlist is incomplete");
console.log(`Verified public schema: ${relative}`);
