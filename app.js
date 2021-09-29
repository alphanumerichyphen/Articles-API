//requiring
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//initializing
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));


//first step connect
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});
//set schema
const articleSchema = {
    title: String,
    content: String
};
//set model              //collection name
const Article = mongoose.model("Article", articleSchema);


app.route("/articles")          //route chaining means 'chaining verbs' and not the url path

.get(function(req, res) {
    Article.find(function(err, foundArticles) {
        if(!err)
            res.send(foundArticles);
        else
            res.send(err);
    });
})

.post(function(req, res) {

    const newarticle = new Article(
        {
            title: req.body.title,
            content: req.body.content
        }
    );
    newarticle.save(function(err) {     //can add callback function for errors like usual: function(err){ if(err) res.send("..."); else res.send("...") };
        if(err)
            res.send(err);
        else
            res.send("Article created successfully.");
    });
})

.delete(function(req, res) {
    Article.deleteMany(function(err) {
        if(err)
            res.send(err);
        else
            res.send("Deleted all records successfully.");
    });
});


app.route("/articles/:articlename")     //using route parameters, req.params

.get(function(req, res) {
    Article.findOne({title: req.params.articlename}, function(err, foundarticle) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(foundarticle)
                res.send(foundarticle);
            else
                res.send("No article by that name found!");
        }
    });
})

.put(function(req, res) {
    Article.replaceOne(
        {title: req.params.articlename},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(!err)
                res.send("Successfully updated article.");
            else
                res.send(err);
        }
    );
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.articlename},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(err)
                res.send(err);
            else
                res.send("Successfully updated article.");
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne({title: req.params.articlename}, function(err) {
        if(err)
            res.send(err);
        else
            res.send("Article deleted successfully.");
    });
});


app.listen(3000, function() {
    console.log("Server is listening at port 3000");
});