const ENTER = 'Enter';
const ESCAPE = 'Escape';
const ELEMENTS_COUNT = 5;

const addButton = document.querySelector('#button-add');
const addInput = document.querySelector('.input-todo');
const elementList = document.querySelector('.elem-list');
const filterButtons = document.querySelector('.buttons-container');
const pagesList = document.querySelector('.pages-list');
const checkAllAndDelete = document.querySelector('.first-li');

let todos = [];
let filterType = 'all';
let currentPage = 1;
let checkedAll = false;

const pagination = (filteredArray) => {
  let pageNumber = '';
  const calculatePage = Math.ceil(filteredArray.length / ELEMENTS_COUNT);

  for (let i = 1; i <= calculatePage; i += 1) {
    const activeClass = (i === currentPage) ? 'active-page' : '';
    pageNumber
            += `<button class="pagination-button ${activeClass}">${i}</button>`;
  }
  pagesList.innerHTML = pageNumber;
};

const createListItem = (id, status, text) => {
  const checked = status ? 'checked' : '';
  const listItem = `<li data-id="${id}">
  <input type="checkbox" class="completed" ${checked} />
  <span class="text">${text}</span>
  <input class="edit" type="text" hidden />
  <button class="delete-button">X</button>
  </li>`;
  return listItem;
};

const filtration = () => {
  let array = [];
  
  switch (filterType) {
    case 'active':
      array = todos.filter((element) => !element.status);
      return array;
    case 'completed':
      array = todos.filter((element) => element.status);
      return array;
    default:
      return [...todos];
  }
};

const render = () => {
  let todoList = '';
  const arrayOfItems = filtration();

  arrayOfItems.slice((currentPage * ELEMENTS_COUNT - ELEMENTS_COUNT), currentPage * ELEMENTS_COUNT)
    .forEach((element) => {
      todoList += createListItem(element.id, element.status, element.text);
    });

  pagination(arrayOfItems);

  elementList.setAttribute('todo-list', todoList);
  console.log(todos);
  elementList.innerHTML = todoList;
};

const setCurrentPage = (event) => {
  if (event.target.className !== 'pages-list') {
    currentPage = Number(event.target.innerHTML);
    console.log(currentPage)
    render();
  }
};

const saveOrCancelValue = (event) => {
  const currentSpan = event.target.parentNode.children[1];
  const editInput = event.target;
  const liId = event.target.parentNode.dataset.id;

  if (event.key === ENTER) {
    currentSpan.hidden = false;
    todos.forEach((element) => {
      if (element.id === Number(liId)) element.text = editInput.value
    });
    editInput.hidden = true;
  }
  if (event.key === ESCAPE) {
    currentSpan.hidden = false;
    editInput.hidden = true;
  }
};

const saveOnBlur = (event) => {
  const currentSpan = event.target.parentNode.children[1];
  const editInput = event.target;
  const liId = event.target.parentNode.dataset.id;

  currentSpan.hidden = false;
  todos.forEach((element) => {
    if (element.id === Number(liId)) element.text = editInput.value
  });
  editInput.hidden = true;
  render();
};

const editTodo = (event, parent) => {
  const currentSpan = event.target;
  const editInput = parent.children[2];

  currentSpan.hidden = true;
  editInput.hidden = false;
  editInput.value = currentSpan.innerHTML;
  editInput.focus();

  editInput.addEventListener('keydown', saveOrCancelValue);
  editInput.addEventListener('blur', saveOnBlur);
  saveOrCancelValue(event);
  
};

const createTodo = () => {
  if (!addInput.value) return;
  const inputText = _.escape(addInput.value.replace(/\s+/g, ' ').trim());
  if (inputText === '') {
    addInput.value = '';
    return;
  }

  if (inputText !== '') {
    const obj = {
      text: inputText,
      status: false,
      id: Date.now(),
    };
    todos.push(obj);
    addInput.value = '';

    render();
  }
};

const handleClick = (event) => {
  if (event.key === ENTER) {
    createTodo();
  }
};

const choiceFunction = (event) => {
  const { className, parentNode } = event.target;
  const { id } = parentNode.dataset;

  if (className === 'completed') {
    todos.forEach((element) => {
      if (element.id === Number(id)) element.status = !element.status;
    });
  }
  if (className === 'text' && event.detail === 2) {
    editTodo(event, parentNode);
  }
  if (className === 'delete-button') {
    todos = todos.filter((element) => element.id !== Number(id));
    render();
  }
};

const setActiveClassForButton = (activeElement, children) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i] === activeElement) {
      activeElement.classList.add('active');
    } else {
      children[i].classList.remove('active');
    }
  }
}

const setFilterType = (event) => {
  const children = event.target.parentNode.children;
  const buttonClass = event.target.className;
  
  if (buttonClass === 'button-all') {
    filterType = 'all';
    setActiveClassForButton(children[0], children);
  }
  if (buttonClass === 'button-active') {
    filterType = 'active';
    setActiveClassForButton(children[1], children);
  }
  if (buttonClass === 'button-completed') {
    filterType = 'completed';
    setActiveClassForButton(children[2], children);
  }

  currentPage = 1;
  render()
};

const transactionsWithAll = (event) => {
  const classOfElement = event.target.className;
  if (classOfElement === 'first-checkbox') {
    todos.forEach((element) => {
      element.status = !checkedAll;
    })
    checkedAll = !checkedAll;
    render();
  }
  if (classOfElement === 'delete-select-button') {
    todos = todos.filter((element) => element.status === false);
    render();
  }
}

addButton.addEventListener('click', createTodo);
addInput.addEventListener('keydown', handleClick);
elementList.addEventListener('click', choiceFunction);
filterButtons.addEventListener('click', setFilterType);
pagesList.addEventListener('click', setCurrentPage);
checkAllAndDelete.addEventListener('click', transactionsWithAll);