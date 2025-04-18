const modeToggle = document.getElementById("modeToggle");
const paragraphs = document.getElementsByTagName("p");
const body = document.body;

function setMode(isDarkMode) {
  if (isDarkMode) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    for (let p of paragraphs) {
      p.classList.remove("light-mode");
      p.classList.add("dark-mode");
    }
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    for (let p of paragraphs) {
      p.classList.remove("dark-mode");
      p.classList.add("light-mode");
    }
  }
}

modeToggle.addEventListener("change", () => {
  setMode(!modeToggle.checked);
});

const thumbnail = document.getElementById("file-upload");
const title = document.getElementById("search-field");

const contentDiv = document.querySelector(".content");

const thumbnailPreviews = [
  document.getElementById("thumbnail-preview-home"),
  document.getElementById("thumbnail-preview-search"),
  document.getElementById("thumbnail-preview-recommended"),
  document.getElementById("thumbnail-preview-mobile"),
];

const titlePreviews = [
  document.getElementById("title-preview-home"),
  document.getElementById("title-preview-search"),
  document.getElementById("title-preview-recommended"),
  document.getElementById("title-preview-mobile"),
];

thumbnail.addEventListener("change", function (event) {
  const file = event.target.files[0]; // Get the first uploaded file
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      thumbnailPreviews.forEach((preview) => {
        preview.src = e.target.result; // Set the src attribute to the file's data URL
        preview.style.display = "block"; // Make the img element visible
      });
      contentDiv.classList.remove("hidden"); // Show the content div
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
});

title.addEventListener("input", function (event) {
  const titleText = event.target.value; // Get the inputted title
  const formattedTitle = insertLineBreaks(titleText, 40); // Insert line breaks after every 35 characters
  titlePreviews.forEach((preview) => {
    preview.innerHTML = formattedTitle; // Set the innerHTML of each p element
  });
});

function insertLineBreaks(text, maxLength) {
  let result = "";
  while (text.length > maxLength) {
    result += text.substring(0, maxLength) + "<br>";
    text = text.substring(maxLength);
  }
  result += text;
  return result;
}
