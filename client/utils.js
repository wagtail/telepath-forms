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

export const replacePlaceholder = (placeholder, html, attributes) => {
  /**
   * Replace the placeholder element with the given HTML fragment, attaching the passed attributes
   * to the first element and executing any scripts in the HTML. Return the child element if there
   * is only one element in the HTML, or the node list if not.
   */

  /* write the HTML into a temp container to parse it into a node list */
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = html.trim();
  const childNodes = Array.from(tempContainer.childNodes);

  /* replace the placeholder with the new nodes */
  placeholder.replaceWith(...childNodes);

  const childElements = childNodes.filter(
    (node) => node.nodeType === Node.ELEMENT_NODE,
  );

  /* execute any scripts in the new element(s) */
  childElements.forEach((element) => {
    runInlineScripts(element);
  });

  // Add any extra attributes we received to the first element of the widget
  if (typeof attributes === 'object') {
    Object.entries(attributes).forEach(([key, value]) => {
      childElements[0].setAttribute(key, value);
    });
  }

  return childElements.length === 1 ? childElements[0] : childNodes;
}