export function schemaErrors(value, schema, rootSchema=schema, at="$", out=[]) {
  if (schema.$ref) {
    const parts = schema.$ref.replace(/^#\//, "").split("/");
    let resolved = rootSchema;
    for (const part of parts) resolved = resolved?.[part.replaceAll("~1","/").replaceAll("~0","~")];
    if (!resolved) out.push(`${at}: unresolved schema ref ${schema.$ref}`);
    else schemaErrors(value, resolved, rootSchema, at, out);
    return out;
  }
  if (schema.allOf) for (const branch of schema.allOf) schemaErrors(value, branch, rootSchema, at, out);
  if (schema.anyOf && !schema.anyOf.some(branch=>schemaErrors(value,branch,rootSchema,at,[]).length===0)) out.push(`${at}: no anyOf branch matched`);
  if (schema.oneOf && schema.oneOf.filter(branch=>schemaErrors(value,branch,rootSchema,at,[]).length===0).length!==1) out.push(`${at}: expected exactly one oneOf branch`);
  if (schema.not && schemaErrors(value,schema.not,rootSchema,at,[]).length===0) out.push(`${at}: matched forbidden schema`);
  if (schema.if) {
    const conditionMatches = schemaErrors(value,schema.if,rootSchema,at,[]).length===0;
    if (conditionMatches && schema.then) schemaErrors(value,schema.then,rootSchema,at,out);
    if (!conditionMatches && schema.else) schemaErrors(value,schema.else,rootSchema,at,out);
  }
  if (Object.hasOwn(schema,"const") && value !== schema.const) out.push(`${at}: expected const ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some(x=>JSON.stringify(x)===JSON.stringify(value))) out.push(`${at}: value is outside enum`);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = value===null ? "null" : Array.isArray(value) ? "array" : Number.isInteger(value) ? "integer" : typeof value;
    const typeOk = types.includes(actual) || (actual==="integer" && types.includes("number"));
    if (!typeOk) { out.push(`${at}: expected ${types.join("|")}, found ${actual}`); return out; }
  }
  if (typeof value === "string") {
    if (schema.minLength!=null && value.length<schema.minLength) out.push(`${at}: shorter than minLength`);
    if (schema.pattern && !(new RegExp(schema.pattern)).test(value)) out.push(`${at}: does not match pattern`);
  }
  if (typeof value === "number") {
    if (schema.minimum!=null && value<schema.minimum) out.push(`${at}: below minimum`);
    if (schema.maximum!=null && value>schema.maximum) out.push(`${at}: above maximum`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems!=null && value.length<schema.minItems) out.push(`${at}: fewer than minItems`);
    if (schema.maxItems!=null && value.length>schema.maxItems) out.push(`${at}: more than maxItems`);
    if (schema.items) value.forEach((item,i)=>schemaErrors(item,schema.items,rootSchema,`${at}[${i}]`,out));
    if (schema.contains && !value.some(item=>schemaErrors(item,schema.contains,rootSchema,"$contains",[]).length===0)) out.push(`${at}: contains condition not met`);
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of schema.required || []) if (!Object.hasOwn(value,key)) out.push(`${at}: missing required '${key}'`);
    for (const [key,child] of Object.entries(schema.properties || {})) if (Object.hasOwn(value,key)) schemaErrors(value[key],child,rootSchema,`${at}.${key}`,out);
    const known = new Set(Object.keys(schema.properties || {}));
    for (const key of Object.keys(value)) if (!known.has(key)) {
      if (schema.additionalProperties===false) out.push(`${at}: unexpected property '${key}'`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") schemaErrors(value[key],schema.additionalProperties,rootSchema,`${at}.${key}`,out);
    }
  }
  return out;
}
