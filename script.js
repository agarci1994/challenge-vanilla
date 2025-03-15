const SELECTORS = {
  modal: "#modal",
  inputText: "#input-text",
  list: "#list",
  selected: ".selected",
  overlay: ".modal-overlay",
};

const state = {
  history: [],
};

document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
});

function initializeEventListeners() {
  document.addEventListener("click", handleButtonClick);
  document
    .querySelector(SELECTORS.inputText)
    ?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addItem();
    });
}

function handleButtonClick(event) {
  const action = event.target.closest("button")?.dataset.action;
  if (!action) return;

  switch (action) {
    case "add":
      openModal();
      break;
    case "confirm-add":
      addItem();
      break;
    case "delete":
      removeSelectedItem();
      break;
    case "undo":
      undoLastAction();
      break;
    case "cancel":
      closeModal();
      break;
  }
}

function toggleModal(show) {
  const overlay = document.querySelector(SELECTORS.overlay);
  const modal = document.querySelector(SELECTORS.modal);
  const input = document.querySelector(SELECTORS.inputText);

  overlay.style.display = show ? "block" : "none";
  modal.style.display = show ? "block" : "none";

  if (show) input?.focus();
  else input.value = "";
}

function openModal() {
  toggleModal(true);
}

function closeModal() {
  toggleModal(false);
}

function addItem() {
  const input = document.querySelector(SELECTORS.inputText);
  const text = input.value.trim();
  if (text === "") return;

  const li = createListItem(text);
  document.querySelector(SELECTORS.list)?.appendChild(li);
  state.history.push({ action: "add", element: li });
  closeModal();
}

function createListItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  li.addEventListener("click", selectItem);
  li.addEventListener("dblclick", removeSelectedItem);
  return li;
}

function selectItem(event) {
  document
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("selected"));
  event.target.classList.add("selected");
}

function removeSelectedItem() {
  const selectedItem = document.querySelector(SELECTORS.selected);
  if (!selectedItem) return;

  selectedItem.classList.remove("selected");
  state.history.push({
    action: "remove",
    element: selectedItem,
    parent: selectedItem.parentNode,
    nextSibling: selectedItem.nextSibling,
  });

  selectedItem.remove();
}

function undoLastAction() {
  if (state.history.length === 0) return;
  const last = state.history.pop();

  switch (last.action) {
    case "add":
      last.element.remove();
      break;
    case "remove":
      last.parent.insertBefore(last.element, last.nextSibling);
      break;
  }
}

module.exports = { addItem, removeSelectedItem, undoLastAction };
