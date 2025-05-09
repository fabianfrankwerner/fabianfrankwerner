const books = document.querySelector(".books");
const showButton = document.getElementById("showDialog");
const favDialog = document.getElementById("favDialog");
const outputBox = document.querySelector("output");
const selectEl = favDialog.querySelector("select");
const confirmBtn = favDialog.querySelector("#confirmBtn");

const myLibrary = [];

class Book {
  constructor(id, title, pages, author, read) {
    this.id = id;
    this.title = title;
    this.pages = pages;
    this.author = author;
    this.read = read;
  }

  info() {
    return `${this.title} from ${this.author}`;
  }
}

function addBookToLibrary(title, pages, author, read = false) {
  myLibrary.push(new Book(crypto.randomUUID(), title, pages, author, read));
}

addBookToLibrary("The Great Gatsby", 180, "F. Scott Fitzgerald", true);
addBookToLibrary("To Kill a Mockingbird", 281, "Harper Lee", false);
addBookToLibrary("1984", 328, "George Orwell", true);
addBookToLibrary("The Hobbit", 295, "J.R.R. Tolkien");

function displayAllBooks() {
  books.innerHTML = "";

  myLibrary.forEach((book) => {
    const bookElement = document.createElement("li");
    bookElement.setAttribute("data-uuid", book.id);

    const bookInfo = document.createElement("span");
    bookInfo.textContent = book.info();

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeBook(book.id));

    const toggleReadStatus = document.createElement("button");
    toggleReadStatus.textContent = `${book.read ? "Read" : "Unread"}`;
    toggleReadStatus.addEventListener("click", () => {
      book.read = !book.read;
      displayAllBooks();
    });

    bookElement.appendChild(bookInfo);
    bookElement.appendChild(removeButton);
    bookElement.appendChild(toggleReadStatus);
    books.appendChild(bookElement);
  });
}

function removeBook(bookId) {
  const index = myLibrary.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayAllBooks();
  }
}

displayAllBooks();

showButton.addEventListener("click", () => {
  favDialog.showModal();
});

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const pages = document.getElementById("pages").value;
  const author = document.getElementById("author").value;
  const read = document.getElementById("read").checked;

  addBookToLibrary(title, pages, author, read);

  displayAllBooks();

  favDialog.close();

  document.querySelector("form").reset();
});
