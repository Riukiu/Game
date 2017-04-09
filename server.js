var environment = {
	players: {},
	objects: []
};
var express = require('express');
var app = express();
var ident = 0;
var cident = 0;
var play_width = 80
var play_height = 80
var server = require('http').Server(app);
var io = require('socket.io')(server);

function updatePlayer(playerId) {
	var player = environment.players[playerId];
	var colisions = resolveColisions(playerId);
	if (player.x +(player.direction.x*player.speed/30) > 0 & player.x +(player.direction.x * player.speed/30) < 850 & !colisions)
		player.x += player.direction.x * player.speed/30;
	if (player.y +(player.direction.y*player.speed/30) > 10 & player.y +(player.direction.y * player.speed/30) < 500 & !colisions)
		player.y += player.direction.y * player.speed/30;
	if (colisions ) {
		if (player.x - player.direction.x*20 < 850 & player.x - player.direction.x*20 > 0)
			player.x -= player.direction.x*20;
		if (player.y - player.direction.y*20 < 500 & player.y - player.direction.y*20 > 10)
			player.y -= player.direction.y*20;
	}
}

function updateEnvironment() {

	Object.keys(environment.players).forEach(updatePlayer);
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

	}
}
function resolveColisions(ide){
	for (var i in environment.players) {
		if (i != ide){
			if (collide_players(ide,i)){
				return true;
			}
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
function gameLoop() {
	//Object.keys(userInputs).forEach(processInput);
	//processUserInputs();
	updateEnvironment();
	io.emit('updateEnvironment', environment);
}
setInterval(gameLoop, 1000/30);

function newConnection(socket){
	environment.players[ident] = {direction : {x : 0, y: 0}, speed : 400, x : Math.random()*849, y: Math.random()*499, ident : ident };
	socket.emit('ident', {ident: ident});
	ident += 1;
	socket.on('input', function(userInputs) {
		processInput(userInputs);

	});
}
io.on('connection', newConnection);

app.use(express.static('public'));

server.listen(3000, function() {

	console.log('Jeu lancé, écoute sur le port 3000');
});