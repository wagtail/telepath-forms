import { Widget, CheckboxInput, RadioSelect, Select } from "./widgets";


beforeEach(() => {
  document.body.innerHTML = "";
});


describe('Widget', () => {
  it('can be rendered', () => {
    const widget = new Widget(
      '<input type="text" name="__NAME__" id="__ID__">', "__ID__"
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "name", "id_name", "Bob", {
      attributes: {"aria-describedby": "id_name-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.idForLabel).toBe("id_name");
    expect(boundWidget.getValue()).toBe("Bob");
    expect(boundWidget.getState()).toBe("Bob");

    boundWidget.setState("Alice");
    expect(boundWidget.getValue()).toBe("Alice");
    expect(boundWidget.getState()).toBe("Alice");
    expect(boundWidget.getTextLabel()).toBe("Alice");
    expect(boundWidget.getTextLabel({maxLength: 4})).toBe("Ali…");

    boundWidget.focus();
    expect(document.activeElement).toBe(boundWidget.input);
  });

  it('can be rendered when input is not a top-level element', () => {
    const widget = new Widget(
      '<div><input type="text" name="__NAME__" id="__ID__"></div>', "__ID__"
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "name", "id_name", "Bob", {
      attributes: {"aria-describedby": "id_name-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe("Bob");
    expect(boundWidget.getState()).toBe("Bob");
    boundWidget.setState("Alice");
    expect(boundWidget.getValue()).toBe("Alice");
    expect(boundWidget.getState()).toBe("Alice");
  });
});

describe('CheckboxInput', () => {
  it('can be rendered', () => {
    const widget = new CheckboxInput(
      '<input type="checkbox" name="__NAME__" id="__ID__">', "__ID__"
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "extra_cheese", "id_extra_cheese", false, {
      attributes: {"aria-describedby": "id_extra_cheese-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe(false);
    expect(boundWidget.getState()).toBe(false);
    boundWidget.setState(true);
    expect(boundWidget.getValue()).toBe(true);
    expect(boundWidget.getState()).toBe(true);
  });
});

describe('RadioSelect', () => {
  it('can be rendered', () => {
    const widget = new RadioSelect(`
      <div id="__ID__">
        <div>
          <label for="__ID___0">
            <input type="radio" name="__NAME__" value="red" id="__ID___0">
            Red
          </label>
        </div>
        <div>
          <label for="__ID___1">
            <input type="radio" name="__NAME__" value="green" id="__ID___1">
            Green
          </label>
        </div>
        <div>
          <label for="__ID___2">
            <input type="radio" name="__NAME__" value="blue" id="__ID___2">
            Blue
          </label>
        </div>
      </div>
    `, "");

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "color", "id_color", ["green"], {
      attributes: {"aria-describedby": "id_color-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.idForLabel).toBe("");
    expect(boundWidget.getValue()).toBe("green");
    expect(boundWidget.getState()).toStrictEqual(["green"]);

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toBe("blue");
    expect(boundWidget.getState()).toStrictEqual(["blue"]);

    boundWidget.focus();
    expect(document.activeElement.value).toBe("red");
  });
});

describe('multiple choice RadioSelect', () => {
  it('can be rendered', () => {
    const widget = new RadioSelect(`
      <div id="__ID__">
        <div>
          <label for="__ID___0">
            <input type="checkbox" name="__NAME__" value="red" id="__ID___0">
            Red
          </label>
        </div>
        <div>
          <label for="__ID___1">
            <input type="checkbox" name="__NAME__" value="green" id="__ID___1">
            Green
          </label>
        </div>
        <div>
          <label for="__ID___2">
            <input type="checkbox" name="__NAME__" value="blue" id="__ID___2">
            Blue
          </label>
        </div>
      </div>
    `, "");

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "color", "id_color", ["red", "green"], {
      attributes: {"aria-describedby": "id_color-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toStrictEqual(["red", "green"]);
    expect(boundWidget.getState()).toStrictEqual(["red", "green"]);
    boundWidget.setState(["green", "blue"]);
    expect(boundWidget.getValue()).toStrictEqual(["green", "blue"]);
    expect(boundWidget.getState()).toStrictEqual(["green", "blue"]);
  });
});

describe('Select', () => {
  it('can be rendered', () => {
    const widget = new Select(`
      <select name="__NAME__" id="__ID__">
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select>
    `, "__ID__");

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "color", "id_color", ["green"], {
      attributes: {"aria-describedby": "id_color-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe("green");
    expect(boundWidget.getState()).toStrictEqual(["green"]);
    expect(boundWidget.getTextLabel()).toBe("Green");

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toBe("blue");
    expect(boundWidget.getState()).toStrictEqual(["blue"]);
  });
});

describe('multiple choice Select', () => {
  it('can be rendered', () => {
    const widget = new Select(`
      <select name="__NAME__" id="__ID__" multiple>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select>
    `, "__ID__");

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "color", "id_color", ["green"], {
      attributes: {"aria-describedby": "id_color-help-text"}
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toStrictEqual(["green"]);
    expect(boundWidget.getState()).toStrictEqual(["green"]);
    expect(boundWidget.getTextLabel()).toBe("Green");

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toStrictEqual(["blue"]);
    expect(boundWidget.getState()).toStrictEqual(["blue"]);
  });
});
