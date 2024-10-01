export const adapters = {};

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
  constructor(widgets, prefix) {
    this.widgets = widgets;
    this.prefix = prefix;
  }

  bind(container, prefix) {
    const boundWidgets = {};
    prefix = prefix || this.prefix;
    for (const [name, widget] of Object.entries(this.widgets)) {
      const prefixedName = prefix ? `${prefix}-${name}` : name;
      boundWidgets[name] = widget.getByName(prefixedName, container);
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
