function Book(title, pages, author) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.title = title;
  this.pages = pages;
  this.author = author;
  this.info = function () {
    return `${this.title}: ${this.pages} long, by ${this.author}`;
  };
}

const theHobbit = new Book("The Hobbit", "295 pages", "J.R.R. Tolkien");

console.log(theHobbit.info());
