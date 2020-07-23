var origBoard;
var huPlayer='X';
var aiPlayer='O';
const cells = document.querySelectorAll('.cell');
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

	function hasClass(el, className) {
	if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
		if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
	}
	function removeClass(el, className) {
		if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
			el.className = el.className.replace(reg, ' ');
		}
	}

	var depth = -1;
	var Human_symbol=1;
	startGame(depth,Human_symbol);

	document.getElementById("depth").addEventListener("click", function (event) {
		if (event.target.tagName !== "LI" || event.target.dataset.value===-1) return;

		var depth_choices = document.querySelectorAll(".depth_choices ul li");
		depth_choices.forEach(function (choice) {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');
		depth = event.target.dataset.value;
	}, false);

	document.getElementById("symbol").addEventListener("click", function (event) {

		Human_symbol=event.target.dataset.value;
		var symbol_choices = document.querySelectorAll(".symbol_choices ul li");
		symbol_choices.forEach(function (choice) {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');

	}, false);

	document.getElementById("newgame").addEventListener('click', function () {
		startGame(depth,Human_symbol);
	});

function startGame(depth,Human_symbol) {
	
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());

	if(Human_symbol==1){
			huPlayer='X';
			aiPlayer='O';
	}if(Human_symbol==0){
			huPlayer='O';
			aiPlayer='X';
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}


function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
		    gameWon.player == huPlayer ? " blue" : " red";
		    
	}
	declareWinner(gameWon.player == huPlayer ? "Yipee.. You win!" : "You lose. Better luck next Time");
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer,window.depth).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game. Try to win next time!");
		return true;
	}
	return false;
}

function minimax(newBoard, player) {

	var availSpots = emptySquares();
	var my_depth=window.depth;

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		
			for(var i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}

		if(my_depth==-1){
			return moves[bestMove];
		}
		if(my_depth==1){
			var random=moves[Math.floor(Math.random()*moves.length)];
			return random;

		}
		/*if(depth==2){


		}else if(depth==3){


		}else if(depth==4){


		}*/
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

