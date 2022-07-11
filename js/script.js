
const toreads = [];
const RENDER_EVENT = 'render-toread';
const SAVED_EVENT = 'saved-toread';
const STORAGE_KEY = 'TOREAD_APPS';

function generateId() {
  return +new Date();
}

function generateToreadObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  };
}

function findToread(toreadId) {
  for (const toreadItem of toreads) {
    if (toreadItem.id === toreadId) {
      return toreadItem;
    }
  }
  return null;
}

function findToreadIndex(toreadId) {
  for (const index in toreads) {
    if (toreads[index].id === toreadId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert ('Browser kamu tidak mendukung localstorage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(toreads);
    localStorage.setItem(STORAGE_KEY,parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const toread of data) {
      toreads.push(toread);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeToread(toreadObject) {
  const {id, title, author, year, isCompleted} = toreadObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;
  
  const textYear = document.createElement('p');
  textYear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `toread-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', function() {
      undoTaskFromCompleted(id);
    });

    container.append(undoButton);

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function() {
      removeTaskFromCompleted(id);
    });

    container.append(trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function() {
      addTaskToCompleted(id);
    });

    container.append(checkButton);

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function() {
      removeTaskFromCompleted(id);
    });

    container.append(trashButton);
  }
  

  return container;
}

function addToread() {
  const textToread = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;

  const generateID = generateId();
  const toreadObject = generateToreadObject(generateID, textToread, author, year, false);
  toreads.push(toreadObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(toreadId) {
  const toreadTarget = findToread(toreadId);

  if (toreadTarget == null) return;

  toreadTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(toreadId) {
  const toreadTarget = findToread(toreadId);

  if (toreadTarget == null) return;
  
  toreadTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(toreadId) {
  const toreadTarget = findToreadIndex(toreadId);

  if (toreadTarget === -1) return;

  toreads.splice(toreadTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addToread();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
    }
  });

  document.addEventListener(SAVED_EVENT, () => {
    console.log('data berhasil di simpan.');
  });

  document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTOREADList = document.getElementById('toreads');
    const listCompleted = document.getElementById('completed-toreads');


    uncompletedTOREADList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const toreadItem of toreads) {
      const toreadElement = makeToread(toreadItem);
      if (toreadItem.isCompleted) {
        listCompleted.append(toreadElement);
      } else {
        uncompletedTOREADList.append(toreadElement);
      }
    }
  });
