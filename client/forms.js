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
  constructor(widgets) {
    this.widgets = widgets;
  }

  bind(container) {
    const boundWidgets = {};
    for (const [name, widget] of Object.entries(this.widgets)) {
      boundWidgets[name] = widget.getByName(name, container);
    }
    return new BoundForm(boundWidgets);
  }
}

adapters['telepath.forms.Form'] = Form;
