var express = require("express");
var router = express.Router();
var Anime = require("../models/anime");
var Review = require("../models/review");
var middleware = require("../middleware/index");
var Comment = require("../models/comment");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'animega', 
  api_key: '538734537528623', 
  api_secret: 'uGNMBOrFEBd-D_mkU0RfZY6pP_E'
});
router.get("/", function(req, res){
     var noMatch = null;
     if(req.query.search){
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Anime.find({name: regex},function(err,allAnimes){
        if(err){
          console.log(err);
        }else{
          if(allAnimes.length < 1) {
                  noMatch = "No animes match that query, please try again.";
              }
          res.render("animes/index",{animes:allAnimes,noMatch: noMatch});
        }
       });
     }else{
     Anime.find({}, function(err, allAnimes){
      if(err){
        console.log(err);
      } else{
        res.render("animes/index", {animes:allAnimes,noMatch: noMatch,page:'animes',currentUser:req.user});
      }
     });
   }
     //res.render("landing");
});


router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
	cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the anime object under image property
  req.body.anime.image = result.secure_url;
  // add author to anime
  req.body.anime.author = {
    id: req.user._id,
    username: req.user.username
  }
  Anime.create(req.body.anime, function(err, anime) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/animes/' + anime.id);
  });
});
});

router.get("/new",middleware.isLoggedIn, function(req,res){
   res.render("animes/new");
});

router.get("/:id", function(req,res){
  Anime.findById(req.params.id).populate("comments").populate({
      path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundAnime){
       if(err){
        console.log(err);
       } else{
          //console.log(foundAnime);
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
   Anime.findByIdAndRemove(req.params.id, function(err, anime){
      if(err){
          res.redirect("/animes");
      } else {
          Comment.remove({"_id": {$in: anime.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/animes");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: anime.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/animes");
                    }
                    //  delete the campground
                    anime.remove();
                    req.flash("success", "anime deleted successfully!");
                    res.redirect("/animes");
                  });
              });
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
