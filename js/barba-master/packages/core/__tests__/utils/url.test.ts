/* global jsdom */
import { url } from '../../src/utils';

it('get href', () => {
  const href = url.getHref();

  expect(href).toBe(window.location.href);
});

it('get origin', () => {
  const origin = url.getOrigin();

  expect(origin).toBe(window.location.origin);
});

it('get port', () => {
  expect(url.getPort()).toBe(80);

  (global as any).jsdom.reconfigure({ url: 'https://localhost/' });
  expect(url.getPort()).toBe(443);

  (global as any).jsdom.reconfigure({ url: 'https://localhost:6666/' });
  expect(url.getPort()).toBe(6666);

  (global as any).jsdom.reconfigure({ url: 'http://localhost/' });
});

it('get path', () => {
  expect(url.getPath()).toBe('/');

  (global as any).jsdom.reconfigure({
    url: 'http://localhost/qux.html?foo=bar#hash',
  });
  expect(url.getPath()).toBe('/qux.html');

  const path = url.getPath('http://localhost/foo.html?foo=bar#hash');

  expect(path).toBe('/foo.html');
});

// DEV: unused
// it('get query', () => {
//   const query = url.getQuery('http://localhost/foo.html?foo=bar#hash');

//   expect(query).toEqual({ foo: 'bar' });
// });

// it('get hash', () => {
//   const hash = url.getHash('http://localhost/foo.html?foo=bar#hash');

//   expect(hash).toBe('hash');
// });

it('parse minimal path', () => {
  const { path, query, hash } = url.parse('/');

  expect(path).toBe('/');
  expect(query).toEqual({});
  expect(hash).toBeUndefined();
});

it('parse full path', () => {
  const { path, query, hash } = url.parse('/foo?baz=qux#bar');

  expect(path).toBe('/foo');
  expect(query).toEqual({ baz: 'qux' });
  expect(hash).toBe('bar');
});

it('parse simple query', () => {
  const query = url.parseQuery('foo=bar');

  expect(query).toEqual({ foo: 'bar' });
});

it('parse complex query', () => {
  const query = url.parseQuery('foo=bar&baz=qux');

  expect(query).toEqual({ foo: 'bar', baz: 'qux' });
});

it('clean url', () => {
  // const result = url.clean('http://localhost/foo', window.location.origin);
  // expect(result).toBe('/foo');
  const result = url.clean('http://localhost/foo?bar=baz#qux');

  expect(result).toBe('http://localhost/foo?bar=baz');
});
