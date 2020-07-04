var Anime = require("../models/anime");
var Comment = require("../models/comment");
var middlewareObj = {};
middlewareObj.checkAnimeOwnership=function(req, res, next){
  if(req.isAuthenticated()){
      Anime.findById(req.params.id, function(err, foundAnime){
    if(err){
      res.redirect("back");
    }else{
      if(foundAnime.author.id.equals(req.user.id)){
           next();
      }else{
           req.flash("error", "You don't have permission to do that");
           res.redirect("back");
      }
      
    }
  });
  }else{
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership=function(req, res, next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }else{
      if(foundComment.author.id.equals(req.user.id)){
           next();
      }else{
           req.flash("error", "You don't have permission");
           res.redirect("back");
      }
      
    }
  });
  }else{
    req.flash("error", "First login to do that");
    res.redirect("back");
  }
}
middlewareObj.isLoggedIn=function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!")
    res.redirect("/login");
}
module.exports=middlewareObj;