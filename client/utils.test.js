import { replacePlaceholder, runInlineScripts } from './utils';

describe('runInlineScripts', () => {
  it('runs inline scripts when invoked on container', () => {
    window.foo = "foo";

    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = '<script data-foo="foo">window.foo = "bar";</script>';

    expect(window.foo).toBe('foo');
    runInlineScripts(div);
    expect(window.foo).toBe('bar');
  });

  it('ignores non-javascript scripts', () => {
    window.foo = "foo";

    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = '<script type="application/x-piratescript">window.foo = "yarrr";</script>';

    runInlineScripts(div);
    expect(window.foo).toBe('foo');
  });

  it('runs inline scripts when invoked on script element', () => {
    window.foo = "foo";

    const div = document.createElement('div');
    document.body.appendChild(div);
    div.innerHTML = '<script data-foo>window.foo = "bar";</script>';

    expect(window.foo).toBe('foo');
    runInlineScripts(div.querySelector('script'));
    expect(window.foo).toBe('bar');
  });
});

describe('replacePlaceholder', () => {
  it('replaces placeholder with HTML and runs scripts', () => {
    window.foo = "foo";

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const html = '<p><script>window.foo = "bar";</script></p>';
    const element = replacePlaceholder(placeholder, html);

    expect(document.body.innerHTML).toContain('<p>');
    expect(window.foo).toBe('bar');
    expect(element instanceof HTMLElement).toBe(true);
  });

  it('adds attributes to the first element', () => {
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const html = '<input type="text"><input type="hidden">';
    const attributes = { 'data-test': 'value' };
    const elements = replacePlaceholder(placeholder, html, attributes);

    expect(elements[0].getAttribute('data-test')).toBe('value');
    expect(elements[1].getAttribute('data-test')).toBeNull();
  });
});
