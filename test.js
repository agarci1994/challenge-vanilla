/**
 * @jest-environment jsdom
 */

const { addItem, removeSelectedItem, undoLastAction } = require("./script");

describe("Text manager", () => {
  let list, input;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="modal-overlay" style="display: none;"></div>
      <div id="modal" class="modal" style="display: none;"></div>
      <input type="text" id="input-text" />
      <ul id="list"></ul>
    `;

    list = document.querySelector("#list");
    input = document.querySelector("#input-text");
  });

  test("Must add an item to the list", () => {
    input.value = "Nuevo texto";
    addItem();

    expect(list.children.length).toBe(1);
    expect(list.children[0].textContent).toBe("Nuevo texto");
  });

  test("Must delete a selected item", () => {
    input.value = "Eliminar esto";
    addItem();

    list.children[0].classList.add("selected");
    removeSelectedItem();

    expect(list.children.length).toBe(0);
  });

  test("Should not delete if there are no items selected", () => {
    input.value = "Texto de prueba";
    addItem();

    removeSelectedItem();

    expect(list.children.length).toBe(1);
  });

  test("Must undo the last action", () => {
    input.value = "Elemento 1";
    addItem();

    input.value = "Elemento 2";
    addItem();

    expect(list.children.length).toBe(2);

    list.children[1].classList.add("selected");
    removeSelectedItem();

    expect(list.children.length).toBe(1);

    undoLastAction();

    expect(list.children.length).toBe(2);
    expect(list.children[1].textContent).toBe("Elemento 2");
  });
});
