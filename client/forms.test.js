import { Form } from "./forms";
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
});
