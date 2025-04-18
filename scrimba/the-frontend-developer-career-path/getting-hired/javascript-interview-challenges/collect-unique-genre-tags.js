const mediaData = [
  {
    id: 1,
    title: "Stranger Scrims",
    duration: 40,
    tags: ["supernatural", "horror", "drama"],
  },
  {
    id: 2,
    title: "The Scrim of the Dragon",
    duration: 60,
    tags: ["drama", "fantasy"],
  },
  {
    id: 3,
    title: "Scrim Hunters",
    duration: 22,
    tags: ["reality", "home improvement"],
  },
  {
    id: 4,
    title: "This Old Scrim",
    duration: 30,
    tags: ["reality", "home improvement"],
  },
  {
    id: 5,
    title: "What We Do in the Scrim",
    duration: 55,
    tags: ["drama", "comedy", "supernatural"],
  },
  {
    id: 6,
    title: "The Scrimdalorian",
    duration: 58,
    tags: ["fantasy", "sci-fi", "adventure"],
  },
];

/* Find All Unique Tags 

As a software dev at ScrimFlix, you're working on a feature 
to let users browse TV shows by tag. The first step is to collect all 
the tags from our data into a new array. Then we'll need 
to filter out the duplicate tags. 

Write a function that takes in the media data and returns
a flat array of unique tags.

Expected output: 
["supernatural", "horror", "drama",
"fantasy", "reality", "home improvement", "comedy", "sci-fi", "adventure"]

*/

function getUniqueTags(data) {
  const tags = data.map((tag) => tag.tags).flat();
  const result = [];
  tags.forEach((tag) => {
    if (!result.includes(tag)) {
      result.push(tag);
    }
  });
  return result;
}

console.log(getUniqueTags(mediaData));
