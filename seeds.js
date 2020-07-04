var mongoose = require("mongoose");
var Anime = require("./models/anime");
var Comment = require("./models/comment");
var data = [
{
	name: "Your Lie in April",
	image: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
	description:"Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano.Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again."
},
{
	name: "Your Lie in April",
	image: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
	description:"Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano.Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again."
},
{
	name: "Your Lie in April",
	image: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
	description:"Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano.Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again."
},
{
	name: "Your Lie in April",
	image: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
	description:"Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano.Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again."
}
]
 
function seedDB(){
	Anime.remove({}, function(err){
	if(err){
		console.log(err);
	}
	console.log("removed animes!");
	data.forEach(function(seed){
    	Anime.create(seed, function(err,anime){
    		if(err){
    			console.log(err);
    		}else{
    			console.log("added an anime");
    			Comment.create(
    			{
    				text:"a great anime",
    				author:"Bahar"
    			}, function(err,comment){
    				if(err){
    					console.log(err);
    				}else{
    				  anime.comments.push(comment);
                      anime.save();
                      console.log("created new comment");	
    				}
    			});
    		}
    	});
    });  
});
    
	
}
module.exports = seedDB;



