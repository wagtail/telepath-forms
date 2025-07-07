import { Field, Form, FormSet } from "./forms";
import { BoundWidget, RadioSelect, Widget } from "./widgets";


beforeEach(() => {
  document.body.innerHTML = "";
});


const form = new Form([
  new Field({
    name: "name",
    label: "Name",
    helpText: "Enter your name",
    required: true,
    widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
  }),
  new Field({
    name: "email",
    label: "Email",
    helpText: "Enter your email",
    required: true,
    widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
  }),
  new Field({
    name: "secret",
    widget: new Widget('<input type="hidden" name="__NAME__" id="__ID__">', {isHidden: true}),
  }),
]);


describe('Form', () => {
  it('can be bound', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="name" id="id_name" value="Bob">
        <input type="text" name="email" id="id_email" value="bob@example.com">
        <input type="hidden" name="secret" id="id_secret" value="12345">
      </form>
    `;

    const boundForm = form.bind(document.body);
    expect(boundForm.getValue()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
    expect(boundForm.getState()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
  });

  it('can be bound when a prefix is in use', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="person-name" id="id_person-name" value="Bob">
        <input type="text" name="person-email" id="id_person-email" value="bob@example.com">
        <input type="hidden" name="person-secret" id="id_person-secret" value="12345">
      </form>
    `;

    const boundForm = form.bind(document.body, "person");
    expect(boundForm.getValue()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
    expect(boundForm.getState()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
  });

  it('can be rendered', () => {
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundForm = form.render(placeholder, "person");
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundForm.getValue()).toStrictEqual({name: "", email: "", secret: ""});
    expect(boundForm.getState()).toStrictEqual({name: "", email: "", secret: ""});
  });

  it('can be rendered without a prefix', () => {
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundForm = form.render(placeholder);
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(boundForm.getValue()).toStrictEqual({name: "", email: "", secret: ""});
    expect(boundForm.getState()).toStrictEqual({name: "", email: "", secret: ""});
  });

  it('can be rendered with initial state', () => {
    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const boundForm = form.render(placeholder, "person", {
      name: "Bob",
      email: "bob@example.com",
      secret: "12345",
    });
    expect(boundForm.getValue()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
    expect(boundForm.getState()).toStrictEqual({name: "Bob", email: "bob@example.com", secret: "12345"});
    expect(boundForm.boundWidgets.name.getValue()).toBe("Bob");
  });
});


describe('FormSet', () => {
  it('can be bound', () => {
    const formSet = new FormSet(form);

    document.body.innerHTML = `
      <form>
        <input type="hidden" name="people-TOTAL_FORMS" id="id_people-TOTAL_FORMS" value="2">
        <input type="hidden" name="people-INITIAL_FORMS" id="id_people-INITIAL_FORMS" value="0">
        <input type="hidden" name="people-MIN_NUM_FORMS" id="id_people-MIN_NUM_FORMS" value="0">
        <input type="hidden" name="people-MAX_NUM_FORMS" id="id_people-MAX_NUM_FORMS" value="1000">
        <input type="text" name="people-0-name" id="id_people-0-name" value="Vic">
        <input type="text" name="people-0-email" id="id_people-0-email" value="vic@example.com">
        <input type="hidden" name="people-0-secret" id="id_people-0-secret" value="12345">
        <input type="text" name="people-1-name" id="id_people-1-name" value="Bob">
        <input type="text" name="people-1-email" id="id_people-1-email" value="bob@example.com">
        <input type="hidden" name="people-1-secret" id="id_people-1-secret" value="67890">
      </form>
    `;

    const boundFormSet = formSet.bind(document.body, "people");
    expect(boundFormSet.getValue()).toStrictEqual([
      {name: "Vic", email: "vic@example.com", secret: "12345"},
      {name: "Bob", email: "bob@example.com", secret: "67890"},
    ]);
    expect(boundFormSet.getState()).toStrictEqual([
      {name: "Vic", email: "vic@example.com", secret: "12345"},
      {name: "Bob", email: "bob@example.com", secret: "67890"},
    ]);
  });
});


describe('Field', () => {
  it('can be rendered as a field group', () => {
    const field = new Field({
      name: "name",
      id: "id_name",
      label: "Name",
      helpText: "Enter your name",
      required: true,
      widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const widget = field.renderAsFieldGroup(placeholder, "person", {"class": "form-control"});
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(widget).toBeInstanceOf(BoundWidget);
    expect(widget.getValue()).toBe("Bob");
  });

  it('preserves existing aria-describedby', () => {
    const field = new Field({
      name: "name",
      id: "id_name",
      label: "Name",
      helpText: "Enter your name",
      required: true,
      widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    field.renderAsFieldGroup(placeholder, "person", {"aria-describedby": "some-other-id"});
    const input = document.querySelector('#id_person-name');
    expect(input.getAttribute('aria-describedby')).toBe("some-other-id id_person-name_helptext");
  });

  it('can be rendered without a label', () => {
    const field = new Field({
      name: "name",
      id: "id_name",
      helpText: "Enter your name",
      required: true,
      widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const widget = field.renderAsFieldGroup(placeholder, "person", {"class": "form-control"});
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(widget).toBeInstanceOf(BoundWidget);
    expect(widget.getValue()).toBe("Bob");
  });

  it('can be rendered without help text', () => {
    const field = new Field({
      name: "name",
      id: "id_name",
      label: "Name",
      required: true,
      widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const widget = field.renderAsFieldGroup(placeholder, "person", {"class": "form-control"});
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(widget).toBeInstanceOf(BoundWidget);
    expect(widget.getValue()).toBe("Bob");
  });

  it('can be rendered as a widget', () => {
    const field = new Field({
      name: "name",
      id: "id_name",
      label: "Name",
      helpText: "Enter your name",
      required: true,
      widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    const widget = field.renderWidget(placeholder, "person");
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(widget).toBeInstanceOf(BoundWidget);
    expect(widget.getValue()).toBe("Bob");
  });

  it('fails if no name is supplied', () => {
    expect(() => {
      new Field({
        id: "id_name",
        label: "Name",
        helpText: "Enter your name",
        required: true,
        widget: new Widget('<input type="text" name="__NAME__" id="__ID__">', {isHidden: false}),
      });
    }).toThrow("Field must have a name");
  });
  it('fails if no widget is supplied', () => {
    expect(() => {
      new Field({
        name: "name",
        id: "id_name",
        label: "Name",
        helpText: "Enter your name",
        required: true,
      });
    }).toThrow("Field must have a widget");
  });

  it('omits for attribute on label if useIdForLabel is false', () => {
    const field = new Field({
      name: "beverage",
      id: "id_beverage",
      label: "Beverage",
      widget: new RadioSelect(`
        <div id="__ID__">
          <div>
            <label for="__ID___0">
              <input type="radio" name="__NAME__" value="tea" id="__ID___0">
              Tea
            </label>
          </div>
          <div>
            <label for="__ID___1">
              <input type="radio" name="__NAME__" value="coffee" id="__ID___1">
              Coffee
            </label>
          </div>
        </div>
      `, {isHidden: false}),
      initialState: "Bob",
    });

    const placeholder = document.createElement('div');
    document.body.appendChild(placeholder);

    field.renderAsFieldGroup(placeholder);
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
