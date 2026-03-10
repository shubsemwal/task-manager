const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    fs.readdir('./files',function(err,files){
        res.render("index",{files:files});
    });
});

app.post('/create',function(req,res){
   fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,
   req.body.description,
   function(err){
      res.redirect('/');
   });
});

/* READ FILE */
app.get('/file/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        res.render("show",{filename:req.params.filename,content:data});
    });
});

/* EDIT PAGE */
app.get('/edit/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        res.render("edit",{filename:req.params.filename,content:data});
    });
});

/* UPDATE FILE */
app.post('/update/:filename',function(req,res){
    fs.writeFile(`./files/${req.params.filename}`,req.body.description,function(err){
        res.redirect('/');
    });
});

/* DELETE FILE */
app.get('/delete/:filename',function(req,res){
    fs.unlink(`./files/${req.params.filename}`,function(err){
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});