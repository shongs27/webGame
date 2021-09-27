const $timer = document.querySelector("#timer");
const $score = document.querySelector("#score");
const $game = document.querySelector("#game");
const $life = document.querySelector("#life");
const $start = document.querySelector("#start");
const $end = document.querySelector("#end");
const $$cells = document.querySelectorAll(".cell");

//timerId를 기록하는 구멍
const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let started = false;
let score = 0;
let time = 10;
let life = 3;
let timerId;
let tickId;

let initialTime = 5;
$start.addEventListener("click", () => {
  if (started) return;
  started = true;
  console.log("시작");
  timerId = setInterval(() => {
    time = (time * initialTime - 1) / initialTime;
    $timer.textContent = time;
    if (time === 0) {
      //그림이 0초 끝까지 보이기 위해서는 setTimout이 필요하다
      setTimeout(() => {
        clearInterval(timerId); //clearInterval을 쓰기 위해서는 변수 timerId를 알고 있어야 한다
        clearInterval(tickId);
        alert(`Game Over. 점수는 ${score}`);
        started = false;
        time = initialTime;
      }, 50);
    }
  }, 100);
  tickId = setInterval(tick, 1000);
  tick();
});

let gopherPercent = 0.3;
let bombPercent = 0.5;

function tick() {
  console.log(holes);
  holes.forEach((hole, index) => {
    if (hole) return;
    const randomValue = Math.random();
    if (randomValue < gopherPercent) {
      const $gopher = $$cells[index].querySelector(".gopher");
      // gopher 뽑혔지만 1초 뒤에는 다시 숨겨야 한다
      holes[index] = setTimeout(() => {
        $gopher.classList.add("hidden");
        holes[index] = 0;
      }, 1000);
      $gopher.classList.remove("hidden");
    } else if (randomValue < bombPercent) {
      const $bomb = $$cells[index].querySelector(".bomb");
      holes[index] = setTimeout(() => {
        $bomb.classList.add("hidden");
        holes[index] = 0;
      }, 1000);
      $bomb.classList.remove("hidden");
    }
  });

  $$cells.forEach(($cell, index) => {
    $cell.querySelector(".gopher").addEventListener("click", (event) => {
      if (!event.target.classList.contains("dead")) {
        score += 1;
        $score.textContent = score;
      }
      //두더지 클릭 이벤트
      event.target.classList.add("dead"); //일반 gopher이미지 위에 덮어씌우는거다
      event.target.classList.add("hidden");
      clearTimeout(holes[index]);
      setTimeout(() => {
        holes[index] = 0;
        event.target.classList.remove("dead");
      }, 1000);
    });
    $cell.querySelector(".bomb").addEventListener("click", (event) => {
      //폭탄 클릭 이벤트
      event.target.classList.add("boom");
      event.target.classList.add("hidden");
      clearTimeout(holes[index]);
      setTimeout(() => {
        holes[index] = 0;
        event.target.classList.remove("boom");
      }, 1000);
      life--;
      $life.textContent = life;
      if (life === 0) {
        clearInterval(timerId);
        clearInterval(tickId);
        setTimeout(() => {
          alert(`Game Over Score: ${score}`);
        });
      }
    });
  });
}
