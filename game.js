const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const buttonUp = document.querySelector('#up')
const buttonLeft = document.querySelector('#left')
const buttonRight = document.querySelector('#right')
const buttonDown = document.querySelector('#down')
const mensaje = document.querySelector('#vidas')
const tiempo = document.querySelector('#time')
const record = document.querySelector('#record')
window.addEventListener('load',setCanvasSize)
window.addEventListener('resize',setCanvasSize)

let canvasSize;
let elementSize;
let level =0;
var bombsPositions = []

let lives = 3;
let timeStart= 0;
let timeInterval;
let timeFinal;

const playerPosition = {
    x:undefined,
    y:undefined
}
const giftPosition = {
    x:undefined,
    y:undefined
}
const startPosition ={
    
    x:undefined,
    y:undefined
}


function setCanvasSize(){
    
    height = window.innerHeight
    width = window.innerWidth
    height>width ? canvasSize=width*0.8 : canvasSize=height*0.8
    
    canvas.setAttribute('width',canvasSize)
    canvas.setAttribute('height',canvasSize)
    
    setMap()
}

function setMap(){


    if (timeStart === 0){
        timeStart = Date.now()
        timeInterval = setInterval(showTime, 100)
    }

    elementSize = (canvasSize /10)
    game.font=elementSize+'px Verdana'
    game.textAlign= 'end';
    mensaje.textContent = lives
    
    const map = maps[level];
     if (!map){
         winGame()
         
        return;
     }
    const mapRows = map.trim().split('\n')
    const mapCol = mapRows.map(row=> row.trim().split(''))
    
    clearCanvas()
    bombsPositions = []
    mapCol.forEach((row, rowI) => {
        
        row.forEach( (col, colI) => {
            emoji = emojis[col]
            const posX = elementSize*(colI + 1)
            const posY = elementSize*(rowI + 1)
            
            if (col == 'O'){
                startPosition.x = colI+1;
                startPosition.y = rowI+1;
                if (playerPosition.x === undefined){
                    playerPosition.x = colI+1;
                    playerPosition.y = rowI+1;
                    
                }
            }else if (col == 'I'){
                giftPosition.x = colI+1;
                giftPosition.y = rowI+1;
                
            }else if (col =='X'){
                bombsPositions.push([colI+1, rowI+1])
            }
            game.fillText(emoji, posX, posY)
        })
    });
    movePlayer()
    

}

function listaContieneLista(listaPrincipal, listaSecundaria) {
    return listaPrincipal.some(sublista => JSON.stringify(sublista) === JSON.stringify(listaSecundaria));
  }

window.addEventListener("keydown",moveByKeys)
buttonUp.addEventListener('click',movebuttonUp)
buttonLeft.addEventListener('click',movebuttonLeft)
buttonRight.addEventListener('click',movebuttonRight)
buttonDown.addEventListener('click',movebuttonDown)

function clearCanvas(){
    game.clearRect(0,0,canvasSize,canvasSize)
}
function showTime(){
    if (playerPosition.x== startPosition.x &&playerPosition.y == startPosition.y && level == 0){
        tiempo.textContent= 0
        timeStart = Date.now()
    }
    else{
    tiempo.textContent = Date.now()- timeStart
    }
}

function movePlayer(){
        
        detectColisionRegalito()
        if (listaContieneLista(bombsPositions,[playerPosition.x,playerPosition.y])){
            levelFail()
        }
        game.fillText(emojis['PLAYER'], (playerPosition.x)*elementSize, playerPosition.y*elementSize)
        mensaje.textContent = "Vidas: " + '💚'.repeat(lives)
        record.textContent = localStorage.getItem('record')
    }
    
function levelFail(){
        lives --;
        if(lives <= 0){
            level = 0;
            lives =3;
            alert("Perdiste!!")
            timeStart = 0;
            
        }
        playerPosition.x = undefined
        playerPosition.y = undefined
        setMap()

}

function detectColisionRegalito (){
    if (playerPosition.x == giftPosition.x && playerPosition.y ==giftPosition.y){
        level += 1
        setMap()
    }
}
function moveByKeys(event){
    switch (event.key){
        case "ArrowUp": movebuttonUp() 
        break;
        case "ArrowDown":movebuttonDown()
        break;
        case "ArrowLeft": movebuttonLeft();
            break;
            case "ArrowRight": movebuttonRight();
            break;
        }
    }
    
    
    function winGame(){
        player_time= Date.now()-timeStart

        if(player_time < localStorage.getItem('record')){
            localStorage.setItem('record',finalTime-timeStart)

        }
        
        
        level = 0;
        lives = 3;
        
        alert("ganaste!")
        
        
        playerPosition.x = undefined
        playerPosition.y = undefined
        timeStart = 0;
        setMap()
    }
    
    function movebuttonUp(){
        if (playerPosition.y > 1){        
            playerPosition.y -= 1;
            setMap()
        }
    }
    function movebuttonLeft(){
        if (playerPosition.x > 1){        
            
            playerPosition.x -= 1;
            setMap()
        }
        
    }
    function movebuttonRight(){
        if (playerPosition.x < (10)){        
            playerPosition.x += 1;
            setMap()}
            
        }
        function movebuttonDown(){
            if (playerPosition.y < 10){        
            playerPosition.y += 1;
            setMap()}
            
    }


