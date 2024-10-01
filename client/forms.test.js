import { Form, FormSet } from "./forms";
import { Widget } from "./widgets";


beforeEach(() => {
  document.body.innerHTML = "";
});


describe('Form', () => {
  it('can be bound', () => {
    const form = new Form({
      name: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
      email: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
    });

    document.body.innerHTML = `
      <form>
        <input type="text" name="name" id="id_name" value="Bob">
        <input type="text" name="email" id="id_email" value="bob@example.com">
      </form>
    `;

    const boundForm = form.bind(document.body);
    expect(boundForm.getValue()).toStrictEqual({name: "Bob", email: "bob@example.com"});
    expect(boundForm.getState()).toStrictEqual({name: "Bob", email: "bob@example.com"});
  });

  it('can be bound when a prefix is in use', () => {
    const form = new Form({
      name: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
      email: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
    }, "person");

    document.body.innerHTML = `
      <form>
        <input type="text" name="person-name" id="id_person-name" value="Bob">
        <input type="text" name="person-email" id="id_person-email" value="bob@example.com">
      </form>
    `;

    const boundForm = form.bind(document.body);
    expect(boundForm.getValue()).toStrictEqual({name: "Bob", email: "bob@example.com"});
    expect(boundForm.getState()).toStrictEqual({name: "Bob", email: "bob@example.com"});
  });
});


describe('FormSet', () => {
  it('can be bound', () => {
    const form = new Form({
      name: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
      email: new Widget('<input type="text" name="__NAME__" id="__ID__">', "__ID__"),
    }, "people-___prefix___");
    const formSet = new FormSet(form, "people");

    document.body.innerHTML = `
      <form>
        <input type="hidden" name="people-TOTAL_FORMS" id="id_people-TOTAL_FORMS" value="2">
        <input type="hidden" name="people-INITIAL_FORMS" id="id_people-INITIAL_FORMS" value="0">
        <input type="hidden" name="people-MIN_NUM_FORMS" id="id_people-MIN_NUM_FORMS" value="0">
        <input type="hidden" name="people-MAX_NUM_FORMS" id="id_people-MAX_NUM_FORMS" value="1000">
        <input type="text" name="people-0-name" id="id_people-0-name" value="Vic">
        <input type="text" name="people-0-email" id="id_people-0-email" value="vic@example.com">
        <input type="text" name="people-1-name" id="id_people-1-name" value="Bob">
        <input type="text" name="people-1-email" id="id_people-1-email" value="bob@example.com">
      </form>
    `;

    const boundFormSet = formSet.bind(document.body);
    expect(boundFormSet.getValue()).toStrictEqual([
      {name: "Vic", email: "vic@example.com"},
      {name: "Bob", email: "bob@example.com"},
    ]);
    expect(boundFormSet.getState()).toStrictEqual([
      {name: "Vic", email: "vic@example.com"},
      {name: "Bob", email: "bob@example.com"},
    ]);
  });
});
