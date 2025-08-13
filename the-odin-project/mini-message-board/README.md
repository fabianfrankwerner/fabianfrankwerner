# Tasks

- [x] Set up a basic Express app by installing Express and EJS. Set up a basic index route and run your server. Create the required folders and files as discussed in the previous lessons.
- [x] We are going to have 2 routes, the index ("/") and a “new message” form ("/new").
- [x] Create an array at the top of your index router called messages and put a couple of sample messages inside of it.
- [x] Next, in your index template (in the "views" folder) loop through the messages array and for each one, display the user, text and the date the message was added. Don’t forget to make your messages available to your template by including it in the res.render ‘locals’ object (e.g. res.render("index", { title: "Mini Messageboard", messages: messages })).
- [ ] Next let’s set up the new message form. In the router add a router.get() for the "/new" route and point it to a template named "form". In the views directory create your form template. Add a heading, 2 inputs (one for the author’s name and one for the message text) and a submit button. To have the form make a network request you will need to define it with both a method and an action like so (we will learn how to handle forms in a later lesson).
- [ ] With your form set up like this, when you click on the submit button it should send a POST request to the url specified by the action attribute, so go back to your index router and add a router.post() for "/new".
- [ ]
- [ ]
- [ ]
- [ ]
