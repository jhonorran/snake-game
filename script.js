// ==== CONFIGURAÇÕES DO JOGO =====
// pega o canvas do HTML
const canvas = document.getElementById("game");
// contexto usado para desenhar no canvas
const ctx = canvas.getContext("2d");
// tamanho de cada bloco do jogo
const gridSize = 20;
//altura da área do HUD/pacar
const hudHeight = 60;

// ==== COBRINHA ====

// array que guarda todas as partes da cobra
const snake = [
    {
    x: 40,
    y: 100,
    }
];    
/// ==== COMIDA ====

// posição e tamanho da maçã
const food = {
    x: 200,
    y: 200,
    size: gridSize
};
// ==== VARIÁVEIS DO JOGO ====

// direção atual da cobrinha
let direction = "right";
// controla se o jogo terminou
let gameOver = false;
//impede q inicie sozinho o jogo
let gameStarted = false;
// pontuação atual
let score = 0;
// controla o pause
let paused = false;
// velocidade do jogo
let gameSpeed = 120;
// loop principal do jogo
let game = setInterval(gameLoop, gameSpeed);
// recorde do jogador
let highScore = 0;
//audio do jogo
let audioContext = null;

//  desenha todas as parte da cobrinha
function drawSnake() {
    snake.forEach((part, index) =>{

        if (index === 0){

            ctx.fillStyle = "#39ff14";
        }

        else{
            ctx.fillStyle = "#009900";
        }

    ctx.fillRect(
        part.x,
        part.y,
        gridSize,
        gridSize
    );
  }); 
}
// desenha a comida na tela
function drawFood() {

    const centerX = food.x + gridSize / 2;
    const centerY = food.y + gridSize / 2;
    const radius = gridSize / 2;
// brilho externo
    ctx.shadowColor = "red";
    ctx.shadowBlur = 25;
// maçã
   ctx.fillStyle = "red";
   ctx.beginPath();
   ctx.arc(
    centerX,
    centerY,
    radius,
    0,
    Math.PI * 2
   );
   
   ctx.fill();
// remove sombra para nao afetar outros desenhos
   ctx.shadowBlur = 0;
   
}
// movimenta a cobrinha
function moveSnake() {
// cria nova cabeça baseada na posição atual
    const head = {
        x: snake[0].x,
        y: snake[0].y
    };
// movimentação baseada na direção atual     
    if (direction === "right") {
        head.x += gridSize;
    }
    if (direction === "left") {
        head.x -= gridSize;
    }
    if (direction === "up") {
        head.y -= gridSize;
    }
    if (direction === "down") {
        head.y += gridSize;
    }
    // colisão com paredes
    if (head.x < 0) {
        endGame();
        return;
    }
    if (head.y < hudHeight) {
        endGame();
        return;
    }
    if (head.x >= canvas.width) {
        endGame();
        return;
    }
    if (head.y >= canvas.height) {
        endGame()
        return;
    }
// adiciona nova cabeça no começo do array
    snake.unshift(head);
// remove última parte do corpo    
    snake.pop();
}
// verifica se a cobrinha comeu a maçã
function checkFoodCollision() {
    if (
        Math.abs(snake[0].x - food.x) < gridSize &&
        Math.abs(snake[0].y - food.y) < gridSize
    ){
        playSound(400, 0.1);
// aumenta pontuação        
        score++;
// atualiza recorde        
    if (score > highScore){
        highScore = score;
    } 
// aumenta a velocidade do jogo       
    if(gameSpeed > 50) {
        gameSpeed -= 5;
        clearInterval(game);
        game = setInterval(gameLoop, gameSpeed);
    }     
// pega a última parte do corpo  
        const tail = snake[snake.length - 1];
// aumenta o tamanho da cobrinha      
        snake.push({
            x: tail.x,
            y: tail.y
        });
// gera uma nova posição aleatória da comida        
        food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize
        food.y = Math.floor((Math.random() * ((canvas.height - hudHeight) / gridSize)) ) * gridSize + hudHeight;

        console.log("comeu!");
        
    }
}
// verifica a colisão da cabeça com o próprio corpo
function checkSelfCollision() {
    const head = snake [0];
// começa do 4 porque cobras pequenas não conseguem colidir consigo mesmas    
    for (let i = 4; i < snake.length; i++){
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ){
            endGame();
        }
    }
}
// loop principal do jogo
function gameLoop() {
// limpa a tela antes de desenhar novamente  
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
// atualiza lógica do jogo
    if (gameStarted && !gameOver && !paused) {
    moveSnake();
    checkFoodCollision();
    checkSelfCollision();
    }
// desenha cobrinha e comida e HUD    
    drawGrid();
    drawSnake();
    drawFood();
    drawHud();

// mostra tela de game over
    if (gameOver) {

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", 80, 180);
        ctx.font = "20px Arial";
        ctx.fillText("Clique para reiniciar", 90, 230);
    }
// mostra tela de pause    
    if (paused) {

        ctx.fillStyle = "yellow";
        ctx.font = "40px Arial";
        ctx.fillText("PAUSADO", 90, 180);
    }
    if (!gameStarted) {

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
// fonte
        ctx.font = "25px Arial";
        ctx.fillText("Pressione ENTER para começar", canvas.width / 2, 260);
// instruções
        ctx.font = "16px Arial";
        ctx.fillText("SETAS = mover", canvas.width / 2, 310);
        ctx.fillText("ESPAÇO = pausar", canvas.width / 2, 340);
// volta alinhamento normal
        ctx.textAlign = "start";
    }
}
function drawGrid() {
    ctx.strokeStyle = "#444";
// linhas verticais
    for (let x = 0; x < canvas.width; x += gridSize) {

        ctx.beginPath();
        ctx.moveTo(x, hudHeight);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

    }
  
// linhas horizontais
    for (let y = hudHeight; y < canvas.height; y += gridSize) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }   
}    
// ======= HUD =====
function drawHud(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, 60);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 60, canvas.width, 2);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("Recorde: " + highScore, 10, 50);
}   

// detecta teclas do teclado
document.addEventListener("keydown", changeDirection);
// reinicia o jogo ao clicar no canvas
canvas.addEventListener("click", restartGame);
// pausa o jogo ao apertar espaço
function changeDirection(event) {
    if (!gameStarted && event.key === "Enter") {
        gameStarted = true;
        return;
    }
    if (event.key === " "){
        paused = !paused;
    }

    if (gameOver) return;
// altera direção da cobrinha
    if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }
    if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }
    if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
    if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }
}
// finaliza o jogo
function endGame() {
    console.log("MORREU");
    if (gameOver) return;
    gameOver = true;
    playSound(80, 0.8);

}
// reinicia todas as variáveis do jogo
function restartGame() {
   
    if (gameOver) {
       snake.length = 1;
       snake[0] = {
        x: 40,
        y: 100
       };

       direction = "right";

       food.x = 200;
       food.y = 200;

       score = 0;

       gameSpeed = 200;

       clearInterval(game);
       game = setInterval(gameLoop, gameSpeed);

       gameOver = false;
    }
}
//cria efeitos sonoros simples
function playSound(frequency, duration) {
    if(!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}