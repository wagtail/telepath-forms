import { replacePlaceholder } from './utils.js';

export const adapters = {};

export class Field {
  constructor(options = {}) {
    this.name = options.name || '';
    this.label = options.label || '';
    this.id = options.id || `id_${this.name}`;
    this.helpText = options.helpText || '';
    this.required = options.required || false;
    this.widget = options.widget || null;
    this.initialState = options.initialState || null;
  }

  renderAsFieldGroup(placeholder, attributes = {}) {
    let labelHtml = '';
    if (this.label) {
      let labelForAttribute = '';
      if (this.id) {
        labelForAttribute = ` for="${this.id}"`;
      }
      labelHtml = `<label${labelForAttribute}>${this.label}</label>`;
    }

    let helpTextHtml = '';
    if (this.helpText) {
      let helpTextIdAttribute = '';
      if (this.id) {
        helpTextIdAttribute = ` id="${this.id}_helptext"`;
      }
      helpTextHtml = `<div class="helptext"${helpTextIdAttribute}>${this.helpText}</div>`;
    }

    const fieldHtml = `${labelHtml}${helpTextHtml}<div data-widget-placeholder></div>`;
    const fieldNodeList = replacePlaceholder(placeholder, fieldHtml, attributes);
    const fieldPlaceholder = fieldNodeList[fieldNodeList.length - 1];
    const widget = this.widget.render(fieldPlaceholder, this.initialState, {
      name: this.name,
      id: this.id,
      ...attributes,
    });
    return widget;
  }
}

adapters['telepath.forms.Field'] = Field;


export class BoundForm {
  constructor(boundWidgets) {
    this.boundWidgets = boundWidgets;
  }

  getState() {
    const state = {};
    for (const [name, widget] of Object.entries(this.boundWidgets)) {
      state[name] = widget.getState();
    }
    return state;
  }

  getValue() {
    const value = {};
    for (const [name, widget] of Object.entries(this.boundWidgets)) {
      value[name] = widget.getValue();
    }
    return value;
  }
}

export class Form {
  constructor(fields) {
    this.fields = fields;
  }

  bind(container, prefix) {
    const boundWidgets = {};
    for (const [name, field] of Object.entries(this.fields)) {
      const prefixedName = prefix ? `${prefix}-${name}` : name;
      boundWidgets[name] = field.widget.getByName(prefixedName, container);
    }
    return new BoundForm(boundWidgets);
  }
}

adapters['telepath.forms.Form'] = Form;


export class BoundFormSet {
  constructor(boundForms) {
    this.boundForms = boundForms;
  }

  getState() {
    return this.boundForms.map(form => form.getState());
  }

  getValue() {
    return this.boundForms.map(form => form.getValue());
  }
}

export class FormSet {
  constructor(form, prefix) {
    this.emptyForm = form;
    this.prefix = prefix;
  }

  bind(container) {
    const formCount = parseInt(container.querySelector(`input[name="${this.prefix}-TOTAL_FORMS"]`).value, 10);
    const boundForms = [];
    for (let i = 0; i < formCount; i++) {
      const formPrefix = `${this.prefix}-${i}`;
      boundForms.push(this.emptyForm.bind(container, formPrefix));
    }
    return new BoundFormSet(boundForms);
  }
}

adapters['telepath.forms.FormSet'] = FormSet;
