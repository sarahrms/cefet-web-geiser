
var express = require("express");
var app = express();

app.use(express.static("client/"));

var server = app.listen(3000, function () {
   var host = server.address().address;
   var port = server.address().port;   
   console.log("Listening at http://%s:%s", host, port);
});

app.set("view engine", "hbs");


const fs = require("fs");

let rawdata = fs.readFileSync("server/data/jogadores.json");  
let data = JSON.parse(rawdata);  

let rawGameData = fs.readFileSync("server/data/jogosPorJogador.json");  
let gameData = JSON.parse(rawGameData);

app.set("views", "server/views");

app.get("/", function (req, res) {
  res.render("index.hbs", data); 
});


app.get("/jogador/:path/", function (req, res) {	
	for(let player of data.players){
		if(player.steamid == req.params.path){
			let playerGameData = gameData[player.steamid];

			let playtimeList = [];
			let playedGames = 0;

			for(let game of playerGameData.games){
				if(game.playtime_forever != 0){
					playedGames++;
					playtimeList.push(game.playtime_forever);
				}				
			}

			let ordPlaytimeList = playtimeList.sort(function(a, b){return b-a}).slice(0,5);
			let ordPlayerGameData = [];
			
			for(let gameTime of ordPlaytimeList){
				for(let game of playerGameData.games){				
					if(game.playtime_forever == gameTime){					
						ordPlayerGameData.push(game);	
						break;
 					}
  				}
  			}

			let data = {
				player: player,
				quantidadeJogos: playerGameData.game_count,
				naoJogados: playerGameData.game_count - playedGames,
				topFive: ordPlayerGameData,
				top: ordPlayerGameData[0]
			}
			
			res.render("jogador.hbs", data); 
			return;
		}
	}
});