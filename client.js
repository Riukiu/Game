var $ = require("jquery");
var socket = require("socket.io-client")();
var ident = 0;
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var imagepointeur = new Image();
var background = new Image();

imagepointeur.src = 'http://www.clipartkid.com/images/667/understanding-stereotypes-canada-vs-america-change-the-topic-zbYWuV-clipart.png';
background.src = 'http://pingouin.migrateur.free.fr/voyages/mexique/desert1.jpg';

var environment = {
	players: {},
	objects: []
};

function drawPlayer(playerId) {
	var player = environment.players[playerId];
	context.drawImage(imagepointeur, player.x, player.y, 80,80);

}

function drawObject(object) {


}

function renderLoop(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(background,0,0);
	Object.keys(environment.players).forEach(drawPlayer);
	context.stroke();
	window.requestAnimationFrame(renderLoop);
}
renderLoop();
socket.on('updateEnvironment', function(newEnvironment){
	environment = newEnvironment;
});

socket.on('ident', function(data) {
	ident = data.ident;

});



$(document).on('keydown', function(event){
	if(event.keyCode == 38)
		socket.emit('input', {cmd: 'UP_PRESSED', clientId : ident});
	if(event.keyCode == 40)
		socket.emit('input', {cmd: 'DOWN_PRESSED', clientId : ident});
	if(event.keyCode == 37)
		socket.emit('input', {cmd: 'LEFT_PRESSED', clientId : ident});
	if(event.keyCode == 39)
		socket.emit('input', {cmd: 'RIGHT_PRESSED', clientId : ident});

});

$(document).on('keyup', function(event){
	if(event.keyCode == 38)
		socket.emit('input', {cmd: 'UP_RELEASED', clientId : ident});
	if(event.keyCode == 40)
		socket.emit('input', {cmd: 'DOWN_RELEASED', clientId : ident});
	if(event.keyCode == 37)
		socket.emit('input', {cmd: 'LEFT_RELEASED', clientId : ident});
	if(event.keyCode == 39)
		socket.emit('input', {cmd: 'RIGHT_RELEASED', clientId : ident});

});