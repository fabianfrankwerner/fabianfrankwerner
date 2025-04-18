let myLibrary = [
  {
    title: "test",
    author: "test",
    page: "123",
    read: true,
  },
];

// Object constructor
function Book(title, author, page, read) {
  this.bookId = `book${++Book.id}`;
  this.title = title;
  this.author = author;
  this.page = page;
  this.read = read;
}

//static property
Book.id = 0;

// Add new books to library
function addBookToLibrary() {
  let a = document.getElementById("formTitle").value;
  let b = document.getElementById("formAuthor").value;
  let c = document.getElementById("formPage").value;
  let d = document.getElementById("formRead").checked;

  if (a !== "" && b !== "" && c !== "") {
    myLibrary.push(new Book(a, b, c, d));
  }
}

const submit = document.getElementById("submitInput");
submit.addEventListener("submit", () => {
  event.preventDefault();
  addBookToLibrary();
  submit.reset();
  displayBooks();
});

// Display each book as cards

function displayBooks() {
  const currentDisplay = document.querySelector(".currentDisplay");
  currentDisplay.textContent = "";

  myLibrary.forEach((myLibrary) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.classList.add(`${myLibrary.bookId}`);
    currentDisplay.appendChild(card);

    for (let key in myLibrary) {
      const text = document.createElement("p");
      text.textContent = `${key}: ${myLibrary[key]}`;
      card.appendChild(text);
    }
    const readBtn = document.createElement("button");
    card.appendChild(readBtn);

    if (myLibrary.read === true) {
      readBtn.textContent = "Read";
    }
    if (myLibrary.read === false) {
      readBtn.textContent = "Not Read";
    }

    readBtn.addEventListener("click", () => {
      if (readBtn.textContent === "Read") {
        readBtn.textContent = "Not Read";
        myLibrary.read = false;
      } else if (readBtn.textContent === "Not Read") {
        readBtn.textContent = "Read";
        myLibrary.read = true;
      }
    });
    const remBtn = document.createElement("button");
    card.appendChild(remBtn);
    remBtn.textContent = "Remove";
    remBtn.onclick = remBook;
  });
}

// Remove book function
function remBook() {
  const bookId = this.parentElement.classList[1];

  const findBook = myLibrary.findIndex((element) => element.bookId === bookId);
  const delBook = myLibrary.splice(findBook, 1);
  this.parentElement.remove();
}

displayBooks();
