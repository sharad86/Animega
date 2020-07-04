var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Anime = require("./models/anime");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var flash = require("connect-flash");


var commentRoutes = require("./routes/comments"),
    animeRoutes = require("./routes/animes"),
    indexRoutes = require("./routes/index");
mongoose.connect("mongodb+srv://animega:8oPKUhoObBdbtzJo@cluster0.q8kbb.mongodb.net/animega?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
  console.log("connected to DB!");
}).catch(err=> {
  console.log("ERROR:", err.message);
})
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);


//seedDB();
//var Comment = require("./models/")
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello World!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/animes",animeRoutes);
app.use("/animes/:id/comments",commentRoutes);
app.listen(process.env.PORT ||3000,process.env.IP, function() { 
  console.log('Server listening on port 3000'); 
});