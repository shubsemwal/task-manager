const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const filesDir = path.join(__dirname, "files");

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}
// HOME PAGE
app.get("/", function (req, res) {
  const dir = path.join(__dirname, "files");

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log("Error reading folder:", err);
      return res.render("index", { files: [] });
    }

    res.render("index", { files: files || [] });
  });
});

// CREATE TASK
app.post("/create", function (req, res) {
  const fileName = req.body.title.split(" ").join("") + ".txt";
  const filePath = path.join(__dirname, "files", fileName);

  fs.writeFile(filePath, req.body.description, function (err) {
    if (err) {
      console.log("File create error:", err);
    }

    res.redirect("/");
  });
});

// READ FILE
app.get("/file/:filename", function (req, res) {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.readFile(filePath, "utf-8", function (err, data) {
    if (err) {
      return res.send("File not found");
    }

    res.render("show", { filename: req.params.filename, content: data });
  });
});

// EDIT PAGE
app.get("/edit/:filename", function (req, res) {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.readFile(filePath, "utf-8", function (err, data) {
    if (err) {
      return res.send("File not found");
    }

    res.render("edit", { filename: req.params.filename, content: data });
  });
});

// UPDATE FILE
app.post("/update/:filename", function (req, res) {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.writeFile(filePath, req.body.description, function (err) {
    if (err) {
      console.log("Update error:", err);
    }

    res.redirect("/");
  });
});

// DELETE FILE
app.get("/delete/:filename", function (req, res) {
  const filePath = path.join(__dirname, "files", req.params.filename);

  fs.unlink(filePath, function (err) {
    if (err) {
      console.log("Delete error:", err);
    }

    res.redirect("/");
  });
});

// SERVER PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
