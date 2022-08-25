const todos = [];
const RENDER_EVENT = 'render-data';
const STORAGE_KEY = 'SET_NEEDS';

function generateTodoObject(id, textTable, nominalBudget) {
  return {
    id,
    textTable,
    nominalBudget,
  };
};

function findTodoIndex(objectId) {
  for (const index in todos) {
    if (todos[index].id === objectId) {
      return index;
    };
  };
  return -1;
};

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Your Browser not support web storage');
    return false;
  };
  return true;
};

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
  };
};

function loadDataFromStorage() {
  const loadData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(loadData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    };
  };

  document.dispatchEvent(new Event(RENDER_EVENT));
};

function makeTodo(todoObject) {
  const {id, textTable, nominalBudget} = todoObject;

  const list_needs = document.createElement('p');
  list_needs.setAttribute('class', 'list-needs');
  list_needs.innerText = textTable;

  const list_budget = document.createElement('p');
  list_budget.setAttribute('class', 'list-budget');
  list_budget.innerText = 'Rp.' + nominalBudget;

  const container = document.createElement('div');

  container.append(list_needs, list_budget);
  container.setAttribute('id', `list-${id}`);
  container.classList.add('list-wrapper');

  const btn_delete = document.createElement('button');
  btn_delete.classList.add('delete-button');
  btn_delete.innerText = 'x';
  btn_delete.addEventListener('click', function () {
    removeTaskFromCompleted(id);
  });
  container.append(btn_delete);

  return container;
};

function addObligation() {
  const textNeeds = document.getElementById('input-text-needs');
  const nominalBudget = document.getElementById('input-budget-needs');
  
  const valueText = textNeeds.value;
  const valueNominal = nominalBudget.value;

  const generatedID = +new Date();
  const obligationObject = generateTodoObject(generatedID, valueText, valueNominal);
  todos.push(obligationObject);

  validationInput();

  textNeeds.value = '';
  nominalBudget.value = '';
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function validationInput() {
  if(todos.length > 5) {
    todos.pop();
    alert('list maksimal 5');
  };
};

function removeTaskFromCompleted(objectId) {
  const todoTarget = findTodoIndex(objectId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addObligation();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  };
});

document.addEventListener(RENDER_EVENT, function () {
  const listText = document.getElementById('list');
  listText.innerHTML = '';

  for (const listItem of todos) {
    const todoElement = makeTodo(listItem);
    listText.append(todoElement);
  };
});