const library = [];
const addBook = document.getElementById("add-book");
addBook.addEventListener("click", addBookToLibrary);

function Book(title, author, pages, read) {
  this.bookId = `book${++Book.id}`;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.id = 0;

function addBookToLibrary() {
  const title = prompt("Book Title");
  const author = prompt("Book Author");
  const pages = prompt("Book Pages");
  const read = alert("Done") === "false";
  if (title !== "" && author !== "" && pages !== "") {
    library.push(new Book(title, author, pages, read));
  } else {
    alert("Please enter a title, author, and page count.");
  }

  displayLibrary();
}

function displayLibrary() {
  const libraryDisplay = document.getElementById("library-display");
  libraryDisplay.innerHTML = "";
  for (let i = 0; i < library.length; i++) {
    const book = library[i];

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.classList.add(`${library.bookId}`);

    const titleElement = document.createElement("h2");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerHTML = `<em>${book.author}</em>`;

    const pagesElement = document.createElement("p");
    pagesElement.innerHTML = `<strong>${book.pages} Pages</strong>`;

    const readElement = document.createElement("button");
    readElement.textContent = book.read ? "Read" : "Not Read";
    readElement.addEventListener("click", () => {
      if (readElement.textContent === "Read") {
        readElement.textContent = "Not Read";
        library.read = false;
      } else if (readElement.textContent === "Not Read") {
        readElement.textContent = "Read";
        library.read = true;
      }
    });

    const deleteElement = document.createElement("button");
    deleteElement.textContent = `Delete`;
    deleteElement.onclick = deleteBook;

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(pagesElement);
    bookCard.appendChild(readElement);
    bookCard.appendChild(deleteElement);

    libraryDisplay.appendChild(bookCard);
  }
}

function deleteBook() {
  const bookId = this.parentElement.classList[1];

  const findBook = library.findIndex((element) => element.bookId === bookId);
  const delBook = library.splice(findBook, 1);
  this.parentElement.remove();
}
