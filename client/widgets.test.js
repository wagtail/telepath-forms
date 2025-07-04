import { Widget, CheckboxInput, RadioSelect, Select } from "./widgets";


beforeEach(() => {
  document.body.innerHTML = "";
});


describe('Widget', () => {
  it('can be rendered', () => {
    const widget = new Widget(
      '<input type="text" name="__NAME__" id="__ID__">'
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "Bob", {
      "aria-describedby": "id_name-help-text", name: "name", id: "id_name"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
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

  it('fails rendering when there is no input element', () => {
    const widget = new Widget(
      '<p>Not an input</p>'
    );
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);
    expect(() => {
      widget.render(placeholder, "Bob", {
        "aria-describedby": "id_name-help-text", name: "name", id: "id_name"
      });
    }).toThrow("No input found in rendered widget");
  });

  it('can be rendered when input is not a top-level element', () => {
    const widget = new Widget(
      '<div><input type="text" name="__NAME__" id="__ID__"></div>'
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, "Bob", {
      "aria-describedby": "id_name-help-text", name: "name", id: "id_name"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe("Bob");
    expect(boundWidget.getState()).toBe("Bob");
    boundWidget.setState("Alice");
    expect(boundWidget.getValue()).toBe("Alice");
    expect(boundWidget.getState()).toBe("Alice");
    // check that the value is actually being set on the input inside the div
    expect(document.querySelector("input").value).toBe("Alice");
  });

  it('can be retrieved for an existing form element', () => {
    const widget = new Widget(
      '<input type="text" name="__NAME__" id="__ID__">'
    );

    document.body.innerHTML = '<input type="text" name="name" id="id_name" value="Bob">';
    const boundWidget = widget.getByName("name", document.body.querySelector('#id_name'));
    expect(boundWidget.getValue()).toBe("Bob");
  });

  it('can be retrieved for an existing form element inside a container', () => {
    const widget = new Widget(
      '<input type="text" name="__NAME__" id="__ID__">'
    );

    document.body.innerHTML = '<div><input type="text" name="name" id="id_name" value="Bob"></div>';
    const boundWidget = widget.getByName("name", document.body);
    expect(boundWidget.getValue()).toBe("Bob");
  });

  it('throws an error if the element is not found', () => {
    const widget = new Widget(
      '<input type="text" name="__NAME__" id="__ID__">'
    );

    expect(() => {
      widget.getByName("name", document.body);
    }).toThrow('No input found with name "name"');
  });
});

describe('CheckboxInput', () => {
  it('can be rendered', () => {
    const widget = new CheckboxInput(
      '<input type="checkbox" name="__NAME__" id="__ID__">'
    );

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, false, {
      "aria-describedby": "id_extra_cheese-help-text", name: "extra_cheese", id: "id_extra_cheese"
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
    `);

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, ["green"], {
      "aria-describedby": "id_color-help-text", name: "color", id: "id_color"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe("green");
    expect(boundWidget.getState()).toStrictEqual(["green"]);

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toBe("blue");
    expect(boundWidget.getState()).toStrictEqual(["blue"]);

    // can also pass a non-array value to setState
    boundWidget.setState("red");
    expect(boundWidget.getValue()).toBe("red");
    expect(boundWidget.getState()).toStrictEqual(["red"]);

    boundWidget.focus();
    expect(document.activeElement.value).toBe("red");
  });

  it('can be retrieved by name', () => {
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
    `);

    document.body.innerHTML = `
      <div id="id_color">
        <div>
          <label for="id_color_0">
            <input type="radio" name="color" value="red" id="id_color_0">
            Red
          </label>
        </div>
        <div>
          <label for="id_color_1">
            <input type="radio" name="color" value="green" id="id_color_1" checked>
            Green
          </label>
        </div>
        <div>
          <label for="id_color_2">
            <input type="radio" name="color" value="blue" id="id_color_2">
            Blue
          </label>
        </div>
      </div>
    `;

    const boundWidget = widget.getByName("color", document.body.querySelector('#id_color'));

    expect(boundWidget.getValue()).toBe("green");
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
    `);

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, ["red", "green"], {
      "aria-describedby": "id_color-help-text", name: "color", id: "id_color"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toStrictEqual(["red", "green"]);
    expect(boundWidget.getState()).toStrictEqual(["red", "green"]);
    boundWidget.setState(["green", "blue"]);
    expect(boundWidget.getValue()).toStrictEqual(["green", "blue"]);
    expect(boundWidget.getState()).toStrictEqual(["green", "blue"]);
    boundWidget.setState(null);
    expect(boundWidget.getValue()).toStrictEqual([]);
    expect(boundWidget.getState()).toStrictEqual([]);
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
    `);

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, ["green"], {
      "aria-describedby": "id_color-help-text", name: "color", id: "id_color"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toBe("green");
    expect(boundWidget.getState()).toStrictEqual(["green"]);
    expect(boundWidget.getTextLabel()).toBe("Green");

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toBe("blue");
    expect(boundWidget.getState()).toStrictEqual(["blue"]);

    // can also pass a non-array value to setState
    boundWidget.setState("red");
    expect(boundWidget.getValue()).toBe("red");
    expect(boundWidget.getState()).toStrictEqual(["red"]);
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
    `);

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundWidget = widget.render(placeholder, ["green"], {
      "aria-describedby": "id_color-help-text", name: "color", id: "id_color"
    });

    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundWidget.getValue()).toStrictEqual(["green"]);
    expect(boundWidget.getState()).toStrictEqual(["green"]);
    expect(boundWidget.getTextLabel()).toBe("Green");

    boundWidget.setState(["blue"]);
    expect(boundWidget.getValue()).toStrictEqual(["blue"]);
    expect(boundWidget.getState()).toStrictEqual(["blue"]);

    boundWidget.setState(null);
    expect(boundWidget.getValue()).toStrictEqual([]);
    expect(boundWidget.getState()).toStrictEqual([]);
  });
});
