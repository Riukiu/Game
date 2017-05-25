var $ = require("jquery");
var socket = require("socket.io-client")();
var ident = 0;
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var imagepointeur = new Image();
var background = new Image();
var balle = new Image();
var obstacle = new Image();
var stone = new Image();

imagepointeur.src = 'http://www.clipartkid.com/images/667/understanding-stereotypes-canada-vs-america-change-the-topic-zbYWuV-clipart.png';
background.src = 'http://pingouin.migrateur.free.fr/voyages/mexique/desert1.jpg';
balle.src = 'http://images.vectorhq.com/images/thumbs/ae6/sombrero-107306.png';
obstacle.src = 'http://img1.wikia.nocookie.net/__cb20140622060452/plantsvszombies/images/f/f0/138px-CactusPvZAS.png';
stone.src = 'http://www.pngall.com/wp-content/uploads/2016/03/Camel-PNG.png';


var environment = {
	players: {},
	objects: {},
	balle : {}
};

function drawPlayer(playerId) {
	var player = environment.players[playerId];
	context.drawImage(imagepointeur, player.x, player.y, 80,80);
	context.fillText(player.name + " : " + player.balls, player.x, player.y + 5);
}

function drawBalle(balls){
	var tacos = environment.balle[balls];
	context.drawImage(balle, tacos.x, tacos.y, 40,40);
}

function drawObject() {
var cactus1 = environment.objects[0];
var cactus2 = environment.objects[1];
var stone1 = environment.objects[2];
context.drawImage(obstacle, cactus1.x, cactus1.y, 80, 120);
context.drawImage(obstacle, cactus2.x, cactus2.y, 40, 70);
context.drawImage(stone, stone1.x, stone1.y, 100, 60);
}

function renderLoop(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.drawImage(background,0,0);
	Object.keys(environment.players).forEach(drawPlayer);
	Object.keys(environment.balle).forEach(drawBalle);
	Object.keys(environment.objects).forEach(drawObject);
	context.stroke();
	window.requestAnimationFrame(renderLoop);
}
renderLoop();
socket.on('updateEnvironment', function(newEnvironment){
	environment = newEnvironment;
});

socket.on('ident', function(data) {
	ident = data.ident;
	var name = prompt("Pseudo :");
	socket.emit('input', {cmd: 'NAME', clientId : ident, nom : name});

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
