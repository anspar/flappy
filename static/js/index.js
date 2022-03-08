var block = document.getElementById("block");
var hole = document.getElementById("hole");
var character = document.getElementById("character");
var game = document.getElementById("game");
var score = document.getElementById("score");
var best = document.getElementById("best");
var cd = document.getElementById("countdown");
var jumping = 0;
var counter = 0;
var start_game = false;
var counting = false;
hole.addEventListener('animationiteration', () => {
    if (start_game) {
        var random = -((Math.random() * 300) + 150);
        hole.style.top = random + "px";
        counter++;
        score.innerHTML = "Score: " + counter;
    }
});


async function play() {
    if (start_game) {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var gameBottom = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
        if (jumping == 0) {
            character.style.top = (characterTop + 4) + "px";
        }
        var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
        var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
        var cTop = -(gameBottom - characterTop);
        if ((characterTop > gameBottom) || ((blockLeft < 20) && (blockLeft > -50) && ((cTop < holeTop) || (cTop > holeTop + 130)))) {
            window.parent.postMessage(`${counter}`, "*"); // send the score to anspar  
            let pos = Math.random() * 100;
            character.style.top = ((pos > 80 || pos < 20) ? 50 : pos) + "%";
            best.innerHTML = parseInt(best.innerHTML) < counter ? counter : best.innerHTML;
            counter = 0;
            start_game = false;
            hole.classList.remove("play");
            block.classList.remove("play");
            score.innerHTML = "Score: " + counter;
            cd.innerHTML = "3";
        }
    }
}

let playI = setInterval(play, 10);

async function sleep(delay) {
    await (new Promise(resolve => setTimeout(resolve, delay)));
}

async function jump() {
    if (counting) { return }
    if (!start_game) {
        counting = true;
        await sleep(1000);
        cd.innerHTML = "2";
        await sleep(1000);
        cd.innerHTML = "1";
        await sleep(1000);
        cd.innerHTML = "";
    }
    counting = false;
    start_game = true;
    hole.classList.add("play");
    block.classList.add("play");
    jumping = 1;
    let jumpCount = 0;
    var jumpInterval = setInterval(function () {
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        if ((characterTop > 6) && (jumpCount < 15)) {
            character.style.top = (characterTop - 6) + "px";
        }
        if (jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = 0;
            jumpCount = 0;
        }
        jumpCount++;
    }, 10);
}

document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        jump();
    }
}

