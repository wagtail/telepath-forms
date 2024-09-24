export const runScript = (script) => {
  /**
   * Runs the given script element.
   */
  if (!script.type || script.type === 'application/javascript') {
    const newScript = document.createElement('script');
    Array.from(script.attributes).forEach((key) =>
      newScript.setAttribute(key.nodeName, key.nodeValue || ''),
    );
    newScript.text = script.text;
    script.replaceWith(newScript);
  }
};

export const runInlineScripts = (element) => {
  /**
   * Runs any inline scripts contained within the given DOM element or fragment.
   */
  const selector = 'script:not([src])';
  if (element instanceof HTMLElement && element.matches(selector)) {
    runScript(element);
  } else {
    const scripts = element.querySelectorAll(selector);
    scripts.forEach(runScript);
  }
};
