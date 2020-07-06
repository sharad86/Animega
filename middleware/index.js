var Anime = require("../models/anime");
var Comment = require("../models/comment");
var Review = require("../models/review");
var middlewareObj = {};
middlewareObj.checkAnimeOwnership=function(req, res, next){
  if(req.isAuthenticated()){
      Anime.findById(req.params.id, function(err, foundAnime){
    if(err|| !foundAnime){
      req.flash("error", "Anime not found");
      res.redirect("back");
    }else{
      if(foundAnime.author.id.equals(req.user.id)||req.user.isAdmin){
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
};

middlewareObj.checkCommentOwnership=function(req, res, next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err|| !foundComment){
      res.redirect("back");
    }else{
      if(foundComment.author.id.equals(req.user.id)||req.user.isAdmin){
           next();
      }else{
           req.flash("error", "You don't have permission");
           res.redirect("back");
      }
      
    }
  });
  }else{
    req.flash("error", "Please login to do that");
    res.redirect("back");
  }
};

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};


middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Anime.findById(req.params.id).populate("reviews").exec(function (err, foundAnime) {
            if (err || !foundAnime) {
                req.flash("error", "anime not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundAnime.reviews
                var foundUserReview = foundAnime.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/animes/" + foundAnime._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn=function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!")
    res.redirect("/login");
}
module.exports=middlewareObj;