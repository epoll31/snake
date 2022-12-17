
window.onload = (_) => {
	gfx.canvas = document.getElementById('canvas');
	gfx.ctx = gfx.canvas.getContext("2d");

	reset();
	requestAnimationFrame(draw);
}
const gfx = {
	drawSnake: (x, y) => {
		gfx.ctx.fillStyle = "#493843";
		gfx.ctx.fillRect(10 * x, 10 * y, 10, 10);
	},
	drawFood: (x, y) => {
		gfx.ctx.fillStyle = "#BA3B46";
		gfx.ctx.fillRect(10 * x, 10 * y, 10, 10);
	},
	clear: () => {
		gfx.ctx.clearRect(0, 0, gfx.canvas.width, gfx.canvas.height);
	}
};
let snakes = []; 
let food = [];
let foodCount = 1;
let add = 0;
const speed = 300;
let gameLoop = undefined;
let direction = 'right';


const update = () => {
	const wrap = [];
	if (add) {
		const snake = Object.assign({}, snakes.at(snakes.length - 1));

		wrap.push(snake);
		add--;
	}

	let prev = direction;
	snakes.forEach(snake => {
		const curr = snake.direction;

		snake.direction = prev;
		switch (prev) {
			case 'up': {
				snake.y--;
			}break;
			case 'down': {
				snake.y++;
			}break;
			case 'left': {
				snake.x--;
			}break;
			case 'right': {
				snake.x++;
			}break;
		}

		prev = curr;
	});
	snakes = [...snakes, ...wrap];

	const head = snakes.at(0);
	if (head && (head.x < 0 || head.y < 0 || head.x >= 40 || head.y >= 30)) {
		gameOver();
	}
	snakes.filter((_, i) => i != 0).forEach(body => {
		if (head.x == body.x && head.y == body.y) {
			gameOver();
		}
	});
	let fc = undefined;
	food.forEach(f => {
		if (f.x == head.x && f.y == head.y) {
			fc = f;
		}
	});
	if (fc) {
		food = food.filter(f => f != fc);
		add++;
	}

	while (food.length < foodCount) {
		let newPos = undefined;
		do {
			newPos = { 
				x: Math.floor(Math.random() * 40), 
				y: Math.floor(Math.random() * 30)
			};
		} while ([...food, ...snakes].filter(
			f => f.x == newPos.x && f.y == newPos.y).length);
		
		food.push(newPos);
	}
};
const draw = () => {
	gfx.clear();
	snakes.forEach(snake => {
		gfx.drawSnake(snake.x, snake.y);
	});
	food.forEach(food => {
		gfx.drawFood(food.x, food.y);
	});

	if (!isGameOver) {
		requestAnimationFrame(draw);
	}
};

window.onkeydown = (event) => { 
	if (isGameOver) {
		return;
	}
	let force = false;
	switch (event.key) {
		case 'w':
		case 'W':
		case 'ArrowUp': {		
			if (direction !== 'down') {
				direction = 'up';
				force = true;
			}
		}; break;
		case 's':
		case 'S':
		case 'ArrowDown': {
			if (direction !== 'up') {
				direction = 'down';
				force = true;
			}
		}; break;
		case 'a':
		case 'A':
		case 'ArrowLeft': {
			if (direction !== 'right') {
				direction = 'left';
				force = true;
			}
		}; break;
		case 'd':
		case 'D':
		case 'ArrowRight': {
			if (direction !== 'left') {
				direction = 'right';
				force = true;
			}
		}; break;
		case ' ': {
			add++;
		}; break;
	}
	if (force) {
		forceUpdate();
	}
};

const reset = () => {
	if (gameLoop) {
		clearInterval(gameLoop);
	}
	gameLoop = setInterval(update, speed);

	snakes = [ {
		x: 20,
		y: 15,
		direction: direction 
	}];
	food = [];
	foodCount = 1;
};

const forceUpdate = () => {
	update();
	draw();
}

let isGameOver = false;

const gameOver = () => {
	isGameOver = true;
	const score = snakes.length * 5;
	
	gfx.canvas.classList.add('gameOver');	
		
	clearInterval(gameLoop);
}
