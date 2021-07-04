//require all the packages
const express= require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");


const app=express();
app.use(bodyParser.urlencoded(
  {extended:true
}));
app.use(express.static("Public"));

app.set('view-engine','ejs');

//connect to mongodb server and create databse WikiDB
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

//Schema for documents inside WikiDB
const articleSchema={
  title: String,
  content:String
};

//creating mongoose model that will create articles collection which will follow articleSchem
const Article = mongoose.model("Article",articleSchema);


/////////////////////////////////////////REQUEST TARGETTING ALL ARTICLES////////////////////////////////////////////////

//chained route handlers->
app.route("/articles")
//get HTTP verb  for /articles route
.get(function(req,res){
   //using mongoose find() to fins the documents inside articles collection using Article Model
   Article.find(function(err, foundArticles){
     if(!err){ //if no errors
     res.send(foundArticles); //send the docs
   }else{
     res.send(err); //send the errors
   }
   });
})

// post HTTP verb for /articles route
.post(function(req,res){
  console.log();
  console.log();

 //creating a new doc of the tile and content sent thruogh post HTTP req
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  //save the doc in articles collection if it was Successful
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully saved the new document.");
    }else{
      res.send(err);
    }
  });
})

//to delete our docuemnts from /articles route using HTTP delete verb req
.delete(function(req,res){

  //using deleteMany() of mongoose on Article Model
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all the documents.");
    }else{
      res.send("err");
    }
  });
});




/////////////////////////////////////////REQUEST TARGETTING ALL ARTICLES////////////////////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){


 console.log(req.body.title);
 console.log(req.body.content);
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},

    {$set: {title: req.body.title, content: req.body.content}},

    {returnNewDocument: true, overwrite: true},

    function(err,data){
      if(!err){
        res.send("Successfully updated the selected article.");
        console.log(data);
      }else{
        console.log(err);
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});





app.listen(3000,function(req,res){
  console.log("Server started running at port 3000.")
});
