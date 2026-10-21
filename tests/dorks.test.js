const test = require('node:test');
const assert = require('node:assert');
const D = require('../dorks.js');

test('ids únicos y categorías existentes', () => {
  const ids = D.DORKS.map((d) => d.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  const cats = new Set(D.CATEGORIES.map((c) => c.id));
  for (const d of D.DORKS) assert.ok(cats.has(d.cat), `${d.id}: categoría ${d.cat}`);
  for (const c of D.CATEGORIES.filter((c) => c.id !== 'all')) {
    assert.ok(D.DORKS.some((d) => d.cat === c.id), `categoría vacía ${c.id}`);
  }
});

test('cada dork tiene textos en español e inglés', () => {
  for (const d of D.DORKS) {
    for (const lang of ['es', 'en']) {
      assert.ok(d[lang].title && d[lang].desc, `${d.id}: falta texto ${lang}`);
    }
  }
});

test('comillas equilibradas y sin operadores retirados', () => {
  for (const d of D.DORKS) {
    assert.strictEqual((d.query.match(/"/g) || []).length % 2, 0, `${d.id}: comillas impares`);
    for (const op of D.RETIRED_OPERATORS) {
      assert.ok(!new RegExp(`(^|\s|-)${op}`).test(d.query), `${d.id}: usa ${op}`);
    }
    assert.ok(!/site:"/.test(d.query), `${d.id}: site: con comillas`);
  }
});

test('normaliza el objetivo', () => {
  assert.deepStrictEqual(D.normalizeTarget('https://www.Ejemplo.com:8080/ruta?x=1#a'), { value: 'ejemplo.com', valid: true });
  assert.deepStrictEqual(D.normalizeTarget('  ejemplo.es.  '), { value: 'ejemplo.es', valid: true });
  assert.deepStrictEqual(D.normalizeTarget('*.ejemplo.com'), { value: 'ejemplo.com', valid: true });
  assert.deepStrictEqual(D.normalizeTarget('192.168.1.10'), { value: '192.168.1.10', valid: true });
  assert.strictEqual(D.normalizeTarget('<img src=x onerror=alert(1)>').valid, false);
  assert.strictEqual(D.normalizeTarget('ejemplo').valid, false);
  assert.strictEqual(D.normalizeTarget('300.1.1.1').valid, false);
  assert.deepStrictEqual(D.normalizeTarget(''), { value: '', valid: true });
});

test('construye la consulta y limita al objetivo', () => {
  assert.strictEqual(D.buildQuery('site:{TARGET} ext:env', 'ejemplo.com', true), 'site:ejemplo.com ext:env');
  assert.strictEqual(D.buildQuery('intitle:"index of" ".bash_history"', 'ejemplo.com', true), 'site:ejemplo.com intitle:"index of" ".bash_history"');
  assert.strictEqual(D.buildQuery('intitle:"index of" ".bash_history"', 'ejemplo.com', false), 'intitle:"index of" ".bash_history"');
  // si el dork ya lleva site: (p. ej. LinkedIn) no se añade otro
  assert.strictEqual(D.buildQuery('site:linkedin.com/in "{TARGET}"', 'ejemplo.com', true), 'site:linkedin.com/in "ejemplo.com"');
  assert.strictEqual(D.needsTarget('intitle:"Kibana"', true), true);
  assert.strictEqual(D.needsTarget('intitle:"Kibana"', false), false);
  assert.strictEqual(D.needsTarget('site:{TARGET}', false), true);
});

test('la URL de Google codifica la consulta', () => {
  assert.strictEqual(D.googleUrl('site:a.com "x y"'), 'https://www.google.com/search?q=site%3Aa.com%20%22x%20y%22');
});

test('el resaltado escapa HTML', () => {
  const html = D.colorizeQuery('site:{TARGET} "<script>alert(1)</script>" OR x');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('<span class="op">site:</span>'));
  assert.ok(html.includes('<span class="op">OR</span>'));
});
