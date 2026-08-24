/* ============================================================
 extractJson fixtures — used by tests/extractJson.test.html
 ============================================================
 Each fixture is { name, input, expected, kind }.
 kind: "ok" = expected deep-equal input's expected;
 "null" = expected null (and we expect _lastExtractError to be set);
 "skip" = currently unsupported (left as known-failing until later).

 Deep equality is structural (works for objects/arrays/primitives).
 ============================================================ */
const EXTRACT_FIXTURES = [
 // 1. happy path: clean JSON
 { name: 'clean JSON object', kind: 'ok',
 input: '{"a":1,"b":[2,3]}',
 expected: {a:1, b:[2,3]} },

 // 2. happy path: clean JSON array
 { name: 'clean JSON array', kind: 'ok',
 input: '[{"id":"q1","value":4},{"id":"q2","value":5}]',
 expected: [{id:'q1',value:4},{id:'q2',value:5}] },

 // 3. model talks before JSON
 { name: 'prose prefix', kind: 'ok',
 input: '下面是 JSON 结果：\n{"answers":[{"value":4}]}',
 expected: {answers:[{value:4}]} },

 // 4. model talks after JSON
 { name: 'prose suffix', kind: 'ok',
 input: '{"x":1}\n希望对您有帮助。',
 expected: {x:1} },

 // 5. fenced ```json block
 { name: 'fenced json block', kind: 'ok',
 input: '```json\n{"themes":[{"label":"A","count":3}]}\n```',
 expected: {themes:[{label:'A',count:3}]} },

 // 6. fenced block (no language tag)
 { name: 'fenced block no language', kind: 'ok',
 input: '```\n{"k":"v"}\n```',
 expected: {k:'v'} },

 // 7. BOM at start
 { name: 'BOM prefix', kind: 'ok',
 input: '﻿{"a":1}',
 expected: {a:1} },

 // 8. leading whitespace + newlines
 { name: 'leading whitespace', kind: 'ok',
 input: '\n\n \t{"a":1}',
 expected: {a:1} },

 // 9. trailing comma in object (NOT legal JSON, legal JS)
 { name: 'trailing comma in object', kind: 'ok',
 input: '{"a":1,"b":2,}',
 expected: {a:1,b:2} },

 // 10. trailing comma in array
 { name: 'trailing comma in array', kind: 'ok',
 input: '[1,2,3,]',
 expected: [1,2,3] },

 // 11. multiple trailing commas
 { name: 'multiple trailing commas (nested)', kind: 'ok',
 input: '{"a":[1,2,],"b":{"c":3,},}',
 expected: {a:[1,2],b:{c:3}} },

 // 12. // line comment before JSON
 { name: 'line comment before JSON', kind: 'ok',
 input: '// here is the answer\n{"a":1}',
 expected: {a:1} },

 // 13. // line comment inside object (between fields)
 { name: 'line comment between fields', kind: 'ok',
 input: '{\n "a": 1,\n // this is b\n "b": 2\n}',
 expected: {a:1,b:2} },

 // 14. /* block comment */ before JSON
 { name: 'block comment before JSON', kind: 'ok',
 input: '/* note */ {"a":1}',
 expected: {a:1} },

 // 15. // line comment AFTER JSON
 { name: 'line comment after JSON', kind: 'ok',
 input: '{"a":1}\n// end of response',
 expected: {a:1} },

 // 16. empty string
 { name: 'empty string', kind: 'null',
 input: '',
 expected: null },

 // 17. plain prose, no JSON
 { name: 'plain prose no JSON', kind: 'null',
 input: '对不起，我无法理解您的问题。',
 expected: null },

 // 18. unclosed brace
 { name: 'unclosed brace', kind: 'null',
 input: '{"a":1',
 expected: null },

 // 19. valid JSON but value is the literal schema description (regression for T04)
 // This is the KEY case for T07 to catch: extractJson parses it successfully
 // (it's syntactically valid JSON), but the value is the schema description
 // rather than an integer. Semantic validation lives in T07, not T01.
 { name: 'value is string where number expected (semantic — extractJson passes)', kind: 'ok',
 input: '{"answers":[{"value":"1-5的整数"}]}',
 expected: {answers:[{value:'1-5的整数'}]},
 note: 'ExtractJson must parse this. T07 should flag it as semantically wrong.' },

 // 20. // comment after colon inside string is fine (not actually a comment)
 { name: '// inside string is not a comment', kind: 'ok',
 input: '{"url":"https://example.com//path"}',
 expected: {url:'https://example.com//path'} },

 // 21. nested prose around JSON
 { name: 'prose before AND after', kind: 'ok',
 input: '好的，以下是您要的内容：\n```json\n{"ok":true}\n```\n如果还需要别的请告诉我。',
 expected: {ok:true} },

 // 22. two JSON blocks, take first
 { name: 'two JSON blocks, take first', kind: 'ok',
 input: '{"first":1}\n{"second":2}',
 expected: {first:1} },

 // 23. array with prose prefix
 { name: 'array with prose prefix', kind: 'ok',
 input: 'The answers are:\n[{"value":3}]',
 expected: [{value:3}] },

 // 24. deeply nested trailing commas
 { name: 'deeply nested trailing commas', kind: 'ok',
 input: '{"a":{"b":{"c":[1,2,],},},}',
 expected: {a:{b:{c:[1,2]}}} },

 // 25. unicode line separators around JSON
 { name: 'unicode line separator (skip — uncommon)', kind: 'skip',
 input: ' {"a":1}',
 expected: {a:1} }
];
