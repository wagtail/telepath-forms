import { replacePlaceholder } from './utils.js';

export const adapters = {};

export class Field {
  constructor(options) {
    this.name = options.name;
    if (!this.name) {
      throw new Error('Field must have a name');
    }
    this.label = options.label || '';
    this.helpText = options.helpText || '';
    this.required = options.required || false;
    this.widget = options.widget;
    if (!this.widget) {
      throw new Error('Field must have a widget');
    }
    this.initialState = options.initialState || null;

    this.isHidden = this.widget.isHidden;
  }

  renderWidget(placeholder, prefix, attributes = {}, state) {
    const prefixedName = prefix ? `${prefix}-${this.name}` : this.name;
    const id = `id_${prefixedName}`;

    const widgetAttributes = {
      name: prefixedName,
      id: id,
      ...attributes,
    }
    if (state === undefined) {
      state = this.initialState;
    }
    return this.widget.render(placeholder, state, widgetAttributes);
  }

  renderAsFieldGroup(placeholder, prefix, attributes = {}, state) {
    const prefixedName = prefix ? `${prefix}-${this.name}` : this.name;
    const id = `id_${prefixedName}`;

    const widgetAttributes = {
      name: prefixedName,
      id: id,
      ...attributes,
    }

    let lastElement = placeholder;

    if (this.label) {
      const labelElement = document.createElement('label');
      labelElement.textContent = `${this.label}: `;
      if (this.widget.useIdForLabel) {
        labelElement.setAttribute('for', id);
      }
      lastElement.after(labelElement);
      lastElement = labelElement;
    }
 
    if (this.helpText) {
      const helpTextId = `${id}_helptext`;
      const helpTextElement = document.createElement('div');
      helpTextElement.className = 'helptext';
      helpTextElement.id = helpTextId;
      helpTextElement.innerHTML = this.helpText;
      lastElement.after(helpTextElement);
      lastElement = helpTextElement;

      if ('aria-describedby' in widgetAttributes) {
        widgetAttributes['aria-describedby'] += ` ${helpTextId}`;
      } else {
        widgetAttributes['aria-describedby'] = helpTextId;
      }
    }

    const fieldPlaceholder = document.createElement('div');
    lastElement.after(fieldPlaceholder);
    lastElement = fieldPlaceholder;

    if (state === undefined) {
      state = this.initialState;
    }

    const widget = this.widget.render(fieldPlaceholder, state, widgetAttributes);
    placeholder.remove();

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
    for (const field of this.fields) {
      const prefixedName = prefix ? `${prefix}-${field.name}` : field.name;
      boundWidgets[field.name] = field.widget.getByName(prefixedName, container);
    }
    return new BoundForm(boundWidgets);
  }

  render(placeholder, prefix, state) {
    const boundWidgets = {};
    let lastContainer = placeholder;
    for (const field of this.fields) {
      if (field.isHidden) {
        // If the field is hidden, just render the widget directly
        const hiddenPlaceholder = document.createElement('div');
        lastContainer.after(hiddenPlaceholder);
        lastContainer = hiddenPlaceholder;
        if (state && state[field.name] !== undefined) {
          boundWidgets[field.name] = field.renderWidget(hiddenPlaceholder, prefix, {}, state[field.name]);
        } else {
          boundWidgets[field.name] = field.renderWidget(hiddenPlaceholder, prefix, {});
        }
      } else {
        const container = document.createElement('div');
        lastContainer.after(container);
        lastContainer = container;

        const fieldPlaceholder = document.createElement('div');
        container.appendChild(fieldPlaceholder);

        if (state && state[field.name] !== undefined) {
          boundWidgets[field.name] = field.renderAsFieldGroup(fieldPlaceholder, prefix, {}, state[field.name]);
        } else {
          boundWidgets[field.name] = field.renderAsFieldGroup(fieldPlaceholder, prefix, {});
        }
      }
    }
    placeholder.remove();
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
