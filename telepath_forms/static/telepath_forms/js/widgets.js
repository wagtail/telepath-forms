const runScript = (script) => {
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

const runInlineScripts = (element) => {
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


class BoundWidget {
  constructor(
    elementOrNodeList,
    name,
    idForLabel,
    initialState,
    options,
  ) {
    // if elementOrNodeList not iterable, it must be a single element
    const nodeList = elementOrNodeList.forEach
      ? elementOrNodeList
      : [elementOrNodeList];

    // look for an input element with the given name, as either a direct element of nodeList
    // or a descendant
    const selector = `:is(input,select,textarea,button)[name="${name}"]`;

    for (let i = 0; i < nodeList.length; i += 1) {
      const element = nodeList[i];
      if (element.nodeType === Node.ELEMENT_NODE) {
        if (element.matches(selector)) {
          this.input = element;
          break;
        } else {
          const input = element.querySelector(selector);
          if (input) {
            this.input = input;
            break;
          }
        }
      }
    }

    this.idForLabel = idForLabel;
    this.setState(initialState);
    this.options = options;
  }

  getValue() {
    return this.input.value;
  }

  getState() {
    return this.input.value;
  }

  setState(state) {
    this.input.value = state;
  }

  getTextLabel(opts) {
    const val = this.getValue();
    if (typeof val !== 'string') return null;
    const maxLength = opts && opts.maxLength;
    if (maxLength && val.length > maxLength) {
      return val.substring(0, maxLength - 1) + '…';
    }
    return val;
  }

  focus() {
    this.input.focus();
  }
}

class Widget {
  constructor(html, idPattern) {
    this.html = html;
    this.idPattern = idPattern;
  }

  boundWidgetClass = BoundWidget;

  render(
    placeholder,
    name,
    id,
    initialState,
    options = {},
  ) {
    const html = this.html.replace(/__NAME__/g, name).replace(/__ID__/g, id);
    const idForLabel = this.idPattern.replace(/__ID__/g, id);

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
    if (typeof options?.attributes === 'object') {
      Object.entries(options.attributes).forEach(([key, value]) => {
        childElements[0].setAttribute(key, value);
      });
    }

    // eslint-disable-next-line new-cap
    return new this.boundWidgetClass(
      childElements.length === 1 ? childElements[0] : childNodes,
      name,
      idForLabel,
      initialState,
      options,
    );
  }
}
window.telepath.register('telepath.forms.Widget', Widget);

class BoundCheckboxInput extends BoundWidget {
  getValue() {
    return this.input.checked;
  }

  getState() {
    return this.input.checked;
  }

  setState(state) {
    this.input.checked = state;
  }
}

class CheckboxInput extends Widget {
  boundWidgetClass = BoundCheckboxInput;
}
window.telepath.register('telepath.forms.CheckboxInput', CheckboxInput);

class BoundRadioSelect {
  constructor(element, name, idForLabel, initialState) {
    this.element = element;
    this.name = name;
    this.idForLabel = idForLabel;
    this.isMultiple = !!this.element.querySelector(
      `input[name="${name}"][type="checkbox"]`,
    );
    this.selector = `input[name="${name}"]:checked`;
    this.setState(initialState);
  }

  getValue() {
    if (this.isMultiple) {
      return Array.from(this.element.querySelectorAll(this.selector)).map(
        (el) => el.value,
      );
    }
    return this.element.querySelector(this.selector)?.value;
  }

  getState() {
    return Array.from(this.element.querySelectorAll(this.selector)).map(
      (el) => el.value,
    );
  }

  setState(state) {
    const inputs = this.element.querySelectorAll(`input[name="${this.name}"]`);
    for (let i = 0; i < inputs.length; i += 1) {
      inputs[i].checked = state.includes(inputs[i].value);
    }
  }

  focus() {
    this.element.querySelector(`input[name="${this.name}"]`)?.focus();
  }
}

class RadioSelect extends Widget {
  boundWidgetClass = BoundRadioSelect;
}
window.telepath.register('telepath.forms.RadioSelect', RadioSelect);

class BoundSelect extends BoundWidget {
  getTextLabel() {
    return Array.from(this.input.selectedOptions)
      .map((option) => option.text)
      .join(', ');
  }

  getValue() {
    if (this.input.multiple) {
      return Array.from(this.input.selectedOptions).map(
        (option) => option.value,
      );
    }
    return this.input.value;
  }

  getState() {
    return Array.from(this.input.selectedOptions).map((option) => option.value);
  }

  setState(state) {
    const options = this.input.options;
    for (let i = 0; i < options.length; i += 1) {
      options[i].selected = state.includes(options[i].value);
    }
  }
}

class Select extends Widget {
  boundWidgetClass = BoundSelect;
}
window.telepath.register('telepath.forms.Select', Select);

class ValidationError {
  constructor(messages) {
    this.messages = messages;
  }
}
window.telepath.register('telepath.forms.ValidationError', ValidationError);
