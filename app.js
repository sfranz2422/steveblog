const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This a journal/blog created with Nodejs, ExpressJS server and EJS templating.  I'm using MongoDB with Mongoose for the backend.";
const aboutContent = "My background is diverse and fortunately I've had opportunities to improve my technical skills throughout my career. I've developed several native iOS applications related to math education and administration and some games as well! Two school districts used my iOS apps to manage teacher lesson plans and student assignments.  Also my walkthrough app was used by administrators for informal teacher evaluations. I've learned many technical skills in my career such as HTML 5, CSS, Bootstrap 4, Python, Django, PHP, JavaScript, React, Swift, Obj-C and C++. Currently, my focus is on web development.";
const contactContent = "Crow's nest squiffy rutters Buccaneer barkadeer lass spirits chandler heave to rum. Pressgang swab loot gally gangway heave down trysail keel handsomely American Main. Starboard fire in the hole quarterdeck heave to bring a spring upon her cable bucko matey log come about crack Jennys tea cup.";

const app = express();
const mongoose = require("mongoose");
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useUnifiedTopology', true);


const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [1, "Default Title"]
  },
  content: {
    type: String,
    required: [1, "Empty Post"]
  }
});
const Post = mongoose.model("Post", postsSchema);



app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    if (!err) {
      res.render("home.ejs", {
        homeStartingContent: homeStartingContent,
        homePosts: posts

      });
    }

  });

});


app.get("/posts/:postTitle.:index", function(req, res) {

  Post.find({}, function(err, posts) {
    if (!err) {
      res.render("post.ejs", {

        postTitle: posts[req.params.index].title,
        postContent: posts[req.params.index].content
      });
    }

  });




});

app.get("/about", function(req, res) {

  res.render("about.ejs", {
    aboutStartingContentText: aboutContent

  });
});

app.get("/contact", function(req, res) {

  res.render("contact.ejs", {
    contactStartingContentText: contactContent

  });
});

app.get("/compose", function(req, res) {

  res.render("compose.ejs", {


  });
});

app.post("/compose", async function(req, res) {


  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  //save to database
  await post.save();


  await res.redirect("/");
});


app.get("/post", function(req, res) {

  res.render("post.ejs", {


  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server running");
});
