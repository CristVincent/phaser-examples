var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() 
{
    game.load.atlasJSONArray('turtle', 'assets/plugins/astar/turtle.png', 'assets/plugins/astar/turtle.json');
    game.load.tilemap('map', 'assets/plugins/astar/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tileset', 'assets/plugins/astar/tileset-claytus.jpg');
}

var turtle;
var map;
var layer;
var astar;
var cursors;
var speed = 4;

function create() {

	game.stage.backgroundColor = '#ffffff';

	map = game.add.tilemap('map');
	map.addTilesetImage('claytus', 'tileset');

	layer = map.createLayer('maze');
	layer.resizeWorld();

	astar =  game.plugins.add(Phaser.Plugin.AStar);
	astar.setAStarMap(map, 'maze', 'claytus');

	turtle = game.add.sprite(150, 150, 'turtle');
	turtle.anchor.x = .5;
	turtle.anchor.y = .5;
	
	turtle.animations.add('walk-west', Phaser.Animation.generateFrameNames('frame_', 1, 16, '', 4), 60, true);
	turtle.animations.add('walk-est', Phaser.Animation.generateFrameNames('frame_', 17, 32, '', 4), 60, true);
	turtle.animations.add('walk-north', Phaser.Animation.generateFrameNames('frame_', 33, 48, '', 4), 60, true);
	turtle.animations.add('walk-south', Phaser.Animation.generateFrameNames('frame_', 49, 64, '', 4), 60, true);

	cursors = game.input.keyboard.createCursorKeys();

	game.input.onDown.add(find, this);

	game.camera.follow(turtle);
}

function update() 
{

	if (cursors.up.isDown)
	{
		turtle.animations.play('walk-north');
		turtle.y -= speed;
	}
	else if (cursors.down.isDown)
	{
		turtle.animations.play('walk-south');
		turtle.y += speed;
	}
	else if (cursors.left.isDown)
	{
		turtle.animations.play('walk-west');
		turtle.x -= speed;
	}
	else if (cursors.right.isDown)
	{
		turtle.animations.play('walk-est');
		turtle.x += speed;
	}
	else
	{
		turtle.animations.stop();
	}
}

function render() {
	game.debug.AStar(astar, 20, 20, '#ff0000');
	//game.debug.spriteInfo(turtle, 20, 150);
	//game.debug.renderSpriteBounds(turtle, '#00ff00')
}

//Find a path from the turtle to the click event position
function find(e)
{
	var start = layer.getTileXY(turtle.x, turtle.y, {});
	var goal = layer.getTileXY(e.positionDown.x + game.camera.view.x, e.positionDown.y + game.camera.view.y, {});
	var path = astar.findPath(start, goal);
}