var express = require("express");
var router = express.Router();
var Anime = require("../models/anime");
var middleware = require("../middleware/index");
router.get("/", function(req, res){
     Anime.find({}, function(err, allAnimes){
      if(err){
        console.log(err);
      } else{
        res.render("animes/index", {animes:allAnimes,page:'animes',currentUser:req.user});
      }
     });
     //res.render("landing");
});


router.post("/", middleware.isLoggedIn, function(req, res){
	var image = req.body.image;
	var name = req.body.name;
  var desc = req.body.description;
  var author = {
    id:req.user._id,
    username:req.user.username
  }
	var newanime = {name: name, image: image,description:desc,author:author}
	//animes.push(newanime);
  Anime.create(newanime, function(err, newlyAdded){
    if(err){
      console.log(arr);
    } else {
      res.redirect("/animes");
    }
  });
	
});

router.get("/new",middleware.isLoggedIn, function(req,res){
   res.render("animes/new");
});

router.get("/:id", function(req,res){
  Anime.findById(req.params.id).populate("comments").exec(function(err, foundAnime){
       if(err){
        console.log(err);
       } else{
          console.log(foundAnime);
          res.render("animes/show", {animes:foundAnime});
       }
  }); 
});

router.get("/:id/edit",middleware.checkAnimeOwnership, function(req, res){
  Anime.findById(req.params.id, function(err, foundAnime){
  res.render("animes/edit",{animes:foundAnime});
});
});
router.put("/:id",middleware.checkAnimeOwnership, function(req, res){
  Anime.findByIdAndUpdate(req.params.id, req.body.anime, function(err, updatedAnime){
    if(err){
        res.redirect("/animes");
    }else{
        res.redirect("/animes/" + req.params.id);
    }
  });
});

router.delete("/:id",middleware.checkAnimeOwnership, function(req, res){
   Anime.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/animes");
      } else {
          res.redirect("/animes");
      }
   });
});



module.exports = router;
