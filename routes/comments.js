var express = require("express");
var router = express.Router({mergeParams:true});
var Anime = require("../models/anime");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
router.get("/new",middleware.isLoggedIn, function(req,res){
  Anime.findById(req.params.id, function(err, anime){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{anime:anime});
    }
  })
  
});

router.post("/",middleware.isLoggedIn, function(req, res){
    Anime.findById(req.params.id, function(err, anime){
      if(err){
        console.log(err);
        res.redirect("/animes");
      }else{
          Comment.create(req.body.comment, function(err,comment){
            if(err){
              req.flash("error","error something went wrong");
              console.log(err);
            }else{
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
              comment.save();
              anime.comments.push(comment);
              anime.save();
              req.flash("success", "comment added successfully");
              res.redirect('/animes/' + anime._id);
            }
          });
      }
    });
});
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      }else{
        res.render("comments/edit",{anime_id:req.params.id, comment:foundComment});
      }
  });
  
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
      if(err){
        res.redirect("back");
      }else{
        res.redirect("/animes/" + req.params.id);
      }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted");
      res.redirect("/animes/" + req.params.id)
    }
   });
});


module.exports = router;