# Introduction

Have you ever played Where’s Waldo? If not, that’s okay! Let us break it down: you are presented with a busy and crowded illustration that contains many different people, objects, and places. Your task is to find a particular character named Waldo, who is hidden somewhere in the illustration.

## Task

Build an app that, when it’s finished, will feel very similar to a photo tagging app. You’ll start with a large photograph containing several elements the user is meant to find, e.g. Waldo, The Wizard, Wilma etc. You can even name your own if you’d like to use custom pictures. The user will make selections for each character and they will be given feedback on whether they are correct or not.

To start with, you’ll need to choose a photo and identify where exactly each person is using its pixel position and save that to your database. When the user clicks the photo, it should place a targeting box around the portion of the photo the user has clicked. That box should contain a list of possible characters.

When the user selects one of these characters, you should check with your backend to see if that character is actually within the targeting box. Provide the user with appropriate feedback (e.g. if wrong, an error message). If correct, place a marker on the photo in the character’s location. In either case, remove the targeting box until the user clicks again.

Keep track of how long it takes from when the photo is first loaded to when the user finally identifies all of the characters. It is advisable to do this on the server side, otherwise the user could hack their score (but you should know this by now). Once a round is complete, ask the user for their name and record that time. This will get a bit tricky since you’ll have anonymous users you need to keep track of!

## Assignment

- [ ] Think about what you’ll need to do to get this all working together. This is where it’s really helpful to think it completely through on paper or a whiteboard ahead of time! A few minutes of thought can save you from wasting an hour on coding.
- [ ] Build the front end functionality without actually using any calls to the back end yet. Specifically, create the functionality that pops the targeting box and dropdown menu on the screen when the user clicks on the photo and removes it when the user clicks away.
- [ ] Now hook up the functionality for validating with your backend whether or not the user has clicked the right place for the character they selected from the dropdown. Note: Depending on how you are getting the coordinates of a user’s clicks, different screen sizes may produce different coordinates. This could cause your app to record coordinates properly on a large screensize, but not smaller ones. Knowing this, you may need to implement methods to your click logic that will normalize coordinates across different screensizes.
- [ ] Tie it into your frontend so you can seamlessly select characters, validate them, and place the appropriate markers on the map if the selection was correct.
- [ ] Add in the ability to time the user from when they first load the page and then display their “score” (time) when they successfully identify all characters. Create a popup that asks them to enter their name for the high scores table if they have earned it.
- [ ] Load many images into your database and allow the user to select from among them before starting the game.
