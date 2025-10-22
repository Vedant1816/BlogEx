import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

function slugify(title) {
  if (!title) return "";
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

let blogList = [];

app.get("/",(req,res)=>{
    res.render("home.ejs",{currentPage : "home"});
});

app.get("/create",(req,res)=>{
   res.render("create.ejs",{currentPage : "home"});
});

app.get("/library",(req,res)=>{
  res.render("library.ejs", {currentPage : "library"});
});


app.post("/user_library", (req,res)=> {
   var title = req.body.blogItem;
   const blog = {
    title: title,
    slug : slugify(title),
    content: req.body.blog,
  };
   blogList.push(blog);
   res.render("blogs.ejs",{blogItems : blogList, currentPage : "user_library"},);
});

app.post("/edit/:slug", (req, res) => {
  const blog = blogList.find(b => b.slug === req.params.slug);
  if (blog) {
    blog.content = req.body.blog;
    res.redirect("/user_library");
  } else {
    res.status(404).send("Blog not found");
  }
});

app.get("/edit/:slug", (req, res) => {
  const blog = blogList.find(b => b.slug === req.params.slug);
  if (blog) {
    res.render("edit.ejs", { blog, currentPage : "home" });
  } else {
    res.status(404).send("Blog not found");
  }
});

app.post("/delete/:slug" ,(req,res)=> {
   const slugToDelete = req.params.slug;
   blogList = blogList.filter(blog => blog.slug !== slugToDelete);
   res.redirect("/user_library");
})

app.get("/user_library", (req,res)=>{
  res.render("blogs.ejs",{blogItems : blogList,  currentPage : "user_library"});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



