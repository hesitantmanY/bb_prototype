/* ============================================================
 SchemaCheck — light-weight schema validator.
 Loaded as a plain <script>. Attaches to window.SchemaCheck.

 Schema DSL (intentionally small — covers 6 types + 4 modifiers):
 {
 type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'any',
 required?: string[], // object: required top-level keys
 fields?: { [key]: Schema }, // object: per-field schema
 items?: Schema, // array: per-item schema
 minLength?: number, // string/array
 maxLength?: number,
 notEmpty?: boolean, // string: must be non-empty
 min?: number, max?: number, // number/integer
 enum?: any[] // must be one of these
 }

 Public API:
 validate(value, schema) → {ok:true, value} | {ok:false, errors:[{path,message,expected,got}]}
 formatErrorsForRetry(errors, schema) → string suitable for appending to a prompt
 ============================================================ */
(function(){
 'use strict';

 const TYPE_CHECK = {
 string: v => typeof v === 'string',
 number: v => typeof v === 'number' &&!isNaN(v),
 integer: v => typeof v === 'number' && Number.isFinite(v) && Math.floor(v) === v,
 boolean: v => typeof v === 'boolean',
 array: v => Array.isArray(v),
 object: v => v!== null && typeof v === 'object' &&!Array.isArray(v),
 any: () => true
 };

 function isType(v, t){
 const fn = TYPE_CHECK[t];
 if(!fn) throw new Error('SchemaCheck: unknown type "' + t + '"');
 return fn(v);
 }

 function fieldError(path, message, expected, got){
 const err = { path, message };
 if(expected!== undefined) err.expected = expected;
 if(got!== undefined) err.got = got;
 return err;
 }

 function validateValue(value, schema, path){
 if(!schema || typeof schema!== 'object'){
 // No schema = pass-through
 return [];
 }
 const t = schema.type || 'any';
 if(!isType(value, t)){
 return [fieldError(path, 'expected type ' + t, schema, value)];
 }

 const errs = [];

 if(t === 'string'){
 if(schema.notEmpty && value.length === 0)
 errs.push(fieldError(path, 'string must be notEmpty', schema, value));
 if(schema.minLength!= null && value.length < schema.minLength)
 errs.push(fieldError(path, 'string length < ' + schema.minLength, schema, value));
 if(schema.maxLength!= null && value.length > schema.maxLength)
 errs.push(fieldError(path, 'string length > ' + schema.maxLength, schema, value));
 if(Array.isArray(schema.enum) &&!schema.enum.includes(value))
 errs.push(fieldError(path, 'must be one of: ' + schema.enum.join(', '), schema, value));
 }
 else if(t === 'number' || t === 'integer'){
 if(schema.min!= null && value < schema.min)
 errs.push(fieldError(path, 'value < ' + schema.min, schema, value));
 if(schema.max!= null && value > schema.max)
 errs.push(fieldError(path, 'value > ' + schema.max, schema, value));
 if(Array.isArray(schema.enum) &&!schema.enum.includes(value))
 errs.push(fieldError(path, 'must be one of: ' + schema.enum.join(', '), schema, value));
 }
 else if(t === 'array'){
 if(schema.minLength!= null && value.length < schema.minLength)
 errs.push(fieldError(path, 'array length < ' + schema.minLength, schema, value));
 if(schema.items){
 value.forEach((item, i) => {
 const sub = validateValue(item, schema.items, path + '[' + i + ']');
 errs.push(...sub);
 });
 }
 }
 else if(t === 'object'){
 const required = schema.required || [];
 for(const key of required){
 if(!(key in value)){
 errs.push(fieldError(path + '.' + key, 'required field missing', null, undefined));
 }
 }
 if(schema.fields){
 for(const key of Object.keys(schema.fields)){
 if(key in value){
 const sub = validateValue(value[key], schema.fields[key], path + '.' + key);
 errs.push(...sub);
 }
 }
 }
 }
 return errs;
 }

 function validate(value, schema){
 if(schema == null) return { ok:true, value };
 const errors = validateValue(value, schema, '$');
 if(errors.length === 0) return { ok:true, value };
 return { ok:false, errors };
 }

 // Build a human-readable failure summary for appending to a retry prompt.
 function formatErrorsForRetry(errors){
 if(!errors ||!errors.length) return '';
 const lines = ['Your previous response did not match the required schema. Issues:'];
 for(const e of errors.slice(0, 5)){ // cap at 5 to keep prompt small
 let line = '- ' + e.path + ': ' + e.message;
 if(e.got!== undefined){
 const g = typeof e.got === 'object'? JSON.stringify(e.got): String(e.got);
 line += ' (got: ' + g.slice(0, 60) + (g.length > 60? '…': '') + ')';
 }
 lines.push(line);
 }
 if(errors.length > 5) lines.push('…(' + (errors.length - 5) + ' more)');
 lines.push('Please re-emit the JSON strictly matching the schema.');
 return lines.join('\n');
 }

 const SchemaCheck = { validate, formatErrorsForRetry };
 if(typeof window!== 'undefined') window.SchemaCheck = SchemaCheck;
 if(typeof module!== 'undefined' && module.exports) module.exports = SchemaCheck;
})();
