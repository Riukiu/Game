var environment = {
	players: {},
	objects: {},
	balle : {}
};
var express = require('express');
var app = express();
var ident = 0;
var ident_ball = 1;
var cident = 0;
var play_width = 80
var play_height = 80
var server = require('http').Server(app);
var io = require('socket.io')(server);

function updatePlayer(playerId) {
	var player = environment.players[playerId];
	var colisions = resolveColisionsPlayers(playerId);
	var colisionsObj = resolveColisionsObjects(playerId);
	var pSpeed = (player.speed/30);

	if (player.x +(player.direction.x*pSpeed) > 0 & player.x +(player.direction.x * pSpeed) < 900 & !colisions)
		player.x += player.direction.x * pSpeed;
	if (player.y +(player.direction.y*pSpeed) > 10 & player.y +(player.direction.y * pSpeed) < 500 & !colisions)
		player.y += player.direction.y * pSpeed;
	if (colisions || colisionsObj) {
		if (player.x - player.direction.x*20 < 900 & player.x - player.direction.x*20 > 0)
			player.x -= player.direction.x*20;
		if (player.y - player.direction.y*20 < 500 & player.y - player.direction.y*20 > 10)
			player.y -= player.direction.y*20;

	}
}

function updateBalls(balle_id) {
	var tacos = environment.balle[balle_id];
	tacos.x += tacos.direction.x/(tacos.x+1) * (player.speed/30);
	tacos.y += tacos.direction.x/(tacos.y+1) * (player.speed/30);
}

function showObjetcs(){
	var cactus1 = environment.objects[0];
	var cactus2 = environment.objects[1];
	var stone = environment.objects[2];
	cactus1.x = 10;
	cactus1.y = 310;
	cactus2.x = 700;
	cactus2.y = 390;
	stone.x = 400;
	stone.y = 400;
}

function updateEnvironment() {

	Object.keys(environment.players).forEach(updatePlayer);
	Object.keys(environment.balle).forEach(updateBalls);
	Object.keys(environment.objects).forEach(showObjetcs);
}

function processInput(input){
	var player = environment.players[input.clientId];
	switch(input.cmd) {
		case 'UP_PRESSED':
			player.direction.y = -1;
			break;
		case 'UP_RELEASED':
			player.direction.y = 0;
			break;
		case 'DOWN_PRESSED':
			player.direction.y = 1;
			break;
		case 'DOWN_RELEASED':
			player.direction.y = 0;
			break;
		case 'LEFT_PRESSED':
			player.direction.x = -1;
			break;
		case 'LEFT_RELEASED':
			player.direction.x = 0;
			break;
		case 'RIGHT_PRESSED':
			player.direction.x = 1;
			break;
		case 'RIGHT_RELEASED':
			player.direction.x = 0;
			break;
	case 'CLICK':
			onClick(input);

	}
}

function onClick(input) {
	environment.balle[ident_ball] = {direction : {x : input.mouseX, y: input.mouseY}, speed : 400, x : environment.player[input.clientId].x , y: environment.player[input.clientId].y, ident : ident_ball};
	ident_ball = ident_ball + 1;

}

function resolveColisionsPlayers(ide){
	for (var i in environment.players) {
		if (i != ide){
			if (collide_players(ide,i)){
				return true;
			}
		}
	}
return false;
}

function resolveColisionsObjects(ide){
	for (var i in environment.objects){
		if(collide_objects(ide, i)){
			return true;
		}
	}
	return false;
}



function collide_players(obj1,obj2) {
	var play1 = environment.players[obj1];
	var play2 = environment.players[obj2];
	return (play1.x + (play1.direction.x*play1.speed/30)) + play_width > play2.x &&
		   (play2.x + (play2.direction.x*play2.speed/30)) + play_width > play1.x &&
		   (play1.y + (play1.direction.y*play1.speed/30)) + play_height > play2.y &&
		   (play2.y + (play2.direction.y*play2.speed/30))+ play_height > play1.y;
}

function collide_objects(obj1, obj2){
	var play  = environment.players[obj1];
	var obj = environment.objects[obj2];
	return (play.x + (play.direction.x*play.speed/30)) + play_width > obj.x &&
				(obj.x + play_width) > play.x &&
				(play.y + (play.direction.y*play.speed/30)) + play_height > obj.y &&
				(obj.y + play_height) > play.y;
}

function gameLoop() {
	updateEnvironment();
	io.emit('updateEnvironment', environment);
}
setInterval(gameLoop, 1000/30);

function newConnection(socket){
	environment.players[ident] = {direction : {x : 0, y: 0}, speed : 400, x : Math.random()*849, y: Math.random()*499, ident : ident, balls : 0 };
	environment.objects[0] = {x:0, y:0};
	environment.objects[1] = {x:0, y:0};
	environment.objects[2] = {x:0, y:0};
	socket.emit('ident', {ident: ident});
	ident += 1;
	socket.on('input', function(userInputs) {
		processInput(userInputs);

	});
}
io.on('connection', newConnection);
app.use(express.static('public'));
server.listen(process.env.PORT || 5000, function() {
	console.log('Jeu lancé, écoute sur le port' + process.env.PORT);
});
