import { querySelectorIncludingSelf, replacePlaceholder } from './utils.js';


export const adapters = {};


export class BoundWidget {
  constructor(input) {
    this.input = input;
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

export class Widget {
  constructor(html) {
    this.html = html;
  }

  boundWidgetClass = BoundWidget;

  _renderToElement(placeholder, attributes) {
    const {name, id, ...otherAttributes} = attributes || {};
    const html = this.html.replace(/__NAME__/g, name || '').replace(/__ID__/g, id || '');
    return replacePlaceholder(placeholder, html, otherAttributes);
  }

  render(
    placeholder,
    initialState,
    attributes = {},
  ) {
    const element = this._renderToElement(placeholder, attributes);

    const input = querySelectorIncludingSelf(element, ":is(input,select,textarea,button)");

    if (!input) {
      throw new Error("No input found in rendered widget");
    }

    // eslint-disable-next-line new-cap
    const boundWidget = new this.boundWidgetClass(input);
    boundWidget.setState(initialState);
    return boundWidget;
  }

  getByName(name, container) {
    const input = querySelectorIncludingSelf(container, `:is(input,select,textarea,button)[name="${name}"]`);

    if (!input) {
      throw new Error(`No input found with name "${name}"`);
    }

    // eslint-disable-next-line new-cap
    return new this.boundWidgetClass(input);
  }
}
adapters['telepath.forms.Widget'] = Widget;


export class BoundCheckboxInput extends BoundWidget {
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

export class CheckboxInput extends Widget {
  boundWidgetClass = BoundCheckboxInput;
}
adapters['telepath.forms.CheckboxInput'] = CheckboxInput;


export class BoundRadioSelect {
  constructor(inputs) {
    this.inputs = inputs;
    this.isMultiple = inputs.length > 0 && inputs[0].type === 'checkbox';
  }

  getValue() {
    const selectedValues = Array.from(this.inputs)
      .filter((input) => input.checked)
      .map((input) => input.value);
    if (this.isMultiple) {
      return selectedValues;
    } else {
      return selectedValues.length > 0 ? selectedValues[0] : null;
    }
  }

  getState() {
    return Array.from(this.inputs)
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  setState(state) {
    for (let i = 0; i < this.inputs.length; i += 1) {
      this.inputs[i].checked = state.includes(this.inputs[i].value);
    }
  }

  focus() {
    if (this.inputs.length > 0) this.inputs[0].focus();
  }
}

export class RadioSelect extends Widget {
  boundWidgetClass = BoundRadioSelect;

  render(
    placeholder,
    initialState,
    attributes = {},
  ) {
    const element = this._renderToElement(placeholder, attributes);
    const inputs = element.querySelectorAll('input');
    const boundWidget = new this.boundWidgetClass(inputs);
    boundWidget.setState(initialState);
    return boundWidget;
  }
  getByName(name, container) {
    const inputs = container.querySelectorAll(
      `input[name="${name}"]`,
    );
    // eslint-disable-next-line new-cap
    return new this.boundWidgetClass(inputs);
  }
}
adapters['telepath.forms.RadioSelect'] = RadioSelect;


export class BoundSelect extends BoundWidget {
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

export class Select extends Widget {
  boundWidgetClass = BoundSelect;
}
adapters['telepath.forms.Select'] = Select;


export class ValidationError {
  constructor(messages) {
    this.messages = messages;
  }
}
adapters['telepath.forms.ValidationError'] = ValidationError;
