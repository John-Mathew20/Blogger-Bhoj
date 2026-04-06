const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Blog = require("./modules/blog.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const url = "mongodb://localhost:27017/BLOGGERBHOG";

async function main() {
  await mongoose.connect(url);
}

main()
  .then(() => {
    console.log(`Connected on ${url}`);
  })
  .catch((err) => {
    console.log(`Error in the connection ${err}`);
  });

app.get("/", (req, res) => {
  res.send("server working well");
});
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({});
  console.log(blogs);
  res.render("index.ejs", { blogs });
});

app.get("/blogs/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/blogs/:id", async (req, res) => {
  let { id } = req.params;
  const blogs = await Blog.findById(id);
  res.render("show.ejs", { blogs });
});

app.post("/blogs/new", async (req, res) => {
  let newBlog = new Blog(req.body.blog);
  await newBlog.save();
  res.redirect("/blogs");
});

app.get("/testBlog", async (req, res) => {
  let sampleBlog = new Blog({
    title: "My First Blog",
    author: "John._.Mathew20",
    content: "lorem Inspum",
    Tags: { tag1: "Html", tag2: "css" },
  });

  await sampleBlog.save();
  console.log(sampleBlog.Image);
  let img = sampleBlog.Image;
  res.send(`<img src = "${img}">`);
  console.log("he");
});
console.log("hello");
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
