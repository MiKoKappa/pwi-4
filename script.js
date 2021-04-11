const menu = document.querySelector(".menu");
const menu_elems = document.querySelectorAll(".menu__nav__element");
const menu_logo = document.querySelector(".menu__logo");
const maximizeMenu = () => {
	menu.style.width = "100%";
	menu_elems.forEach((elem)=>{
		elem.style.opacity = 1;
	});
	menu_logo.style.opacity=1;
}
const minimizeMenu = () => {
	menu.style.width = "0";
	menu_elems.forEach((elem)=>{
		elem.style.opacity = 0;
	});
	menu_logo.style.opacity=0;
}
//Getting all parts of board into single nodelist array
const tiles = document.querySelectorAll(".board__part");
//And buttons for player choosing
const playerButtons = document.querySelectorAll(".playerButton");

//First adding event listener to body to check for click bubbling on buttons and tiles
document.querySelector("body").addEventListener('click', (e) => {
	if(!e.target.classList.contains("board__part") && !e.target.classList.contains("playerButton") && !e.target.classList.contains("resetButton")){
		return
	}
	else if(e.target.classList.contains("playerButton")){
		e.preventDefault();
		playerSetter(e);
	}
	else if(e.target.classList.contains("resetButton")){
		e.preventDefault();
		resetGame();
	}
	else{
	changeTile(e);
	}
})

//Variables defining turns and players
let nowPlayer = -1;
let playerCount = -1;

//Array storing all winning configurations
const winning = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

//Function that changes tile background, swaps to other player and checks for win or draw
const changeTile = (e) => {
	if(nowPlayer!=-1 && playerCount!=-1 && e.target.classList.contains("empty")){
		e.target.classList.remove("empty");
		if(nowPlayer==1){
			e.target.classList.add("x");
			nowPlayer = 2;
			if(playerCount==2){
			changeDisplay("Now choosing: Player " + nowPlayer);
			}
			else{
			changeDisplay("Now choosing: Computer");
			}
			if(nowPlayer != -1 && playerCount==1 && document.querySelectorAll(".empty").length != 0){
				playerCount = -1;
				setTimeout(()=>{
					playerCount = 1;
					chooseRandom();
				}, 500)	
			}
		}
		else{
			if(nowPlayer != -1){
			e.target.classList.add("o");
			nowPlayer = 1;
			changeDisplay("Now choosing: Player " + nowPlayer);
			}
		}
		checkWin();
	}
}

const chooseRandom = () => {
	const chosen = Array.from(document.querySelectorAll(".empty"))[Math.floor(Math.random()*document.querySelectorAll(".empty").length)]
	chosen.dispatchEvent(new MouseEvent('click',{
    view: window,
    bubbles: true,
    cancelable: true
  }));
}

//Function checking if there is a win or a draw on board
const checkWin = () => {
	let flag = 0;
	winning.map((winPos)=>{
		let xArr = getPosArray("x");
		let oArr = getPosArray("o");
		if(winPos.every(i => xArr.includes(i))){
			changeDisplay("Player with X wins!");
			nowPlayer = -1;
			playerCount = -1;
			flag = 1;
			return
		}
		if(winPos.every(i => oArr.includes(i))){
			changeDisplay("Player with O wins!");
			nowPlayer = -1;
			playerCount = -1;
			flag = 1;
			return
		}
	})
	if(flag == 0 && document.querySelectorAll(".empty").length == 0){
		changeDisplay("It's a draw!");
			nowPlayer = -1;
			playerCount = -1;
			return
	}

}

const getPosArray = (symbol) => {
	let arr = []
	Array.from(tiles).map((tile, i)=>{
		if(tile.classList.contains(symbol)){
			arr = arr.concat(i);
		}
	})
	return arr;
}

//Function that sets number of players
const playerSetter = (e) => {
	resetGame();
	playerCount = parseInt(e.target.classList[3],10);
	nowPlayer = 1;
	changeDisplay("Now choosing: Player " + nowPlayer)
}

//Function used to change what is displaying in #infoDisplay
const changeDisplay = (text) => {
	document.querySelector("#infoDisplay").innerText = text;
}

//Funtion reseting the game to original state
const resetGame = () => {
	Array.from(tiles).map((tile)=> {
		tile.classList.remove("o");
		tile.classList.remove("x");
		tile.classList.add("empty");
		playerCount = -1;
		nowPlayer = -1;
		changeDisplay("Choose player count below");
	})
}