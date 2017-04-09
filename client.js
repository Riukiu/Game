var $ = require("jquery");
var socket = require("socket.io-client")();
var ident = 0;
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var imagepointeur = new Image();
var background = new Image();
var balle = new Image();

imagepointeur.src = 'http://www.clipartkid.com/images/667/understanding-stereotypes-canada-vs-america-change-the-topic-zbYWuV-clipart.png';
background.src = 'http://pingouin.migrateur.free.fr/voyages/mexique/desert1.jpg';
balle.src = 'http://www.fancyicons.com/free-icons/233/fast-foods/png/32/taco_32.png';

var environment = {
	players: {},
	objects: [],
	balle : {}
};

function drawPlayer(playerId) {
	var player = environment.players[playerId];
	context.drawImage(imagepointeur, player.x, player.y, 80,80);

}

function drawBalle(balls){
	var tacos = environment.balle[balls];
	context.drawImage(balle, tacos.x, tacos.y);

}

function drawObject(object) {


}

function renderLoop(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(background,0,0);
	Object.keys(environment.players).forEach(drawPlayer);
	Object.keys(environment.balle).forEach(drawBalle);
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

$(document).on('click', function(event){
	socket.emit('input', {cmd: 'CLICK', clientId : ident, mouseX : event.originalEvent.clientX, mouseY : event.originalEvent.clientY});
	console.log(event);
	});
