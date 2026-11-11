let music = new Audio("");
let audioTurn = new Audio("teo.mp3");
let gameover = new Audio("gameover.mp3");
let turn = "X";
let isgameover = false;

music.loop = true;
music.volume = 0.3;

// Play a sound from the start every time (and log any audio error)
const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play().catch((err) => console.log("Audio error:", err));
};

// Stop a sound completely and rewind it
const stopSound = (sound) => {
  sound.pause();
  sound.currentTime = 0;
};

// Function to change the turn
const changeTurn = () => {
  return turn === "X" ? "0" : "X";
};

const drawLine = (a, c) => {
  const boxes = document.getElementsByClassName("box");
  const line = document.querySelector(".line");
  const parent = line.offsetParent || document.body;
  const p = parent.getBoundingClientRect();
  const r1 = boxes[a].getBoundingClientRect();
  const r2 = boxes[c].getBoundingClientRect();

  // dono boxes ke center (parent ke hisaab se)
  const x1 = r1.left + r1.width / 2 - p.left;
  const y1 = r1.top + r1.height / 2 - p.top;
  const x2 = r2.left + r2.width / 2 - p.left;
  const y2 = r2.top + r2.height / 2 - p.top;

  const length = Math.hypot(x2 - x1, y2 - y1) + r1.width * 0.6;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  line.style.width = length + "px";
  line.style.left = (x1 + x2) / 2 + "px";
  line.style.top = (y1 + y2) / 2 + "px";
  line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
};

// Function to check for a win
const checkwin = () => {
  let boxtext = document.getElementsByClassName("boxtext");
  let wins = [
    [0, 1, 2, 5, 5, 0],
    [3, 4, 5 ,5 ,15, 0],
    [6, 7, 8, 5, 25, 0],
    [0, 3, 6, -5, 15, 90],
    [1, 4, 7, 5, 15, 90],
    [2, 5, 8, 15, 15, 90],
    [0, 4, 8, 5, 15, 45],
    [2, 4, 6, 5, 15, 135],
  ];
  wins.forEach((e) => {
    if (
      boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[0]].innerText !== ""
    ) {
      document.querySelector(".info").innerText =
        boxtext[e[0]].innerText + " Won";
      isgameover = true;
      stopSound(music);
      playSound(gameover);
      document.querySelector(".imgbox").getElementsByTagName("img")[0].style.width = "200px";
      document.querySelector(".line").style.width = "20vw";
      document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`
      // document.querySelector(".line").style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
      drawLine(e[0], e[2]);
    }
  });
};

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
  let boxtext = element.querySelector(".boxtext");
  element.addEventListener("click", () => {
    if (boxtext.innerText === "" && !isgameover) {
      boxtext.innerText = turn;
      turn = changeTurn();
      if (music.paused) playSound(music); // starts on the first click (browsers block autoplay)
      playSound(audioTurn);
      checkwin();
      if (!isgameover) {
        document.getElementsByClassName("info")[0].innerText =
          "Turn for " + turn;
      }
    }
  });
});

// Reset button: clear the board, stop ALL sounds, start a fresh game
document.getElementById("reset").addEventListener("click", () => {
  Array.from(document.querySelectorAll(".boxtext")).forEach((element) => {
    element.innerText = "";
  });
  turn = "X";
  isgameover = false;
      document.querySelector(".line").style.width = "0";
//   stopSound(music);
  stopSound(gameover);
  stopSound(audioTurn);
  document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
  document.querySelector(".imgbox").getElementsByTagName("img")[0].style.width = "0px";
});