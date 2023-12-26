const canvas = document.getElementById('board'); // canvas 요소를 가져옴
const ctx = canvas.getContext('2d'); // 2D 그래픽을 그리기 위해 context를 가져옴
const canvasNext = document.getElementById('next'); // canvas 요소를 가져옴
const ctxNext = canvasNext.getContext('2d'); // 2D 그래픽을 그리기 위해 context를 가져옴

let accountValues = { // 게임 점수, 레벨, 라인을 저장하는 객체
  score: 0, // 점수
  level: 0, // 레벨
  lines: 0  // 라인
};

function updateAccount(key, value) { // 게임 점수, 레벨, 라인을 업데이트하는 함수
  let element = document.getElementById(key); // key에 해당하는 요소를 가져옴
  if (element) { // 요소가 있으면
    element.textContent = value; // 요소의 텍스트를 value로 설정
  }
}

let account = new Proxy(accountValues, { // accountValues 객체를 감싸는 프록시 객체
  set: (target, key, value) => { // 프록시 객체에 값을 설정하면
    target[key] = value; // 프록시 객체에 값을 저장
    updateAccount(key, value); // updateAccount 함수를 호출
    return true; // true를 반환
  }
});

let requestId = null; // 애니메이션 프레임을 저장하는 변수
let time = null; // 게임 시간을 저장하는 변수

const moves = { // 키보드 입력에 따라 블록을 움직이는 함수
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }), // 왼쪽 방향키를 누르면 블록을 왼쪽으로 이동
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }), // 오른쪽 방향키를 누르면 블록을 오른쪽으로 이동
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }), // 아래쪽 방향키를 누르면 블록을 아래로 이동
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }), // 스페이스바를 누르면 블록을 맨 아래로 이동
  [KEY.UP]: (p) => board.rotate(p, ROTATION.RIGHT), // 위쪽 방향키를 누르면 블록을 오른쪽으로 회전
  [KEY.X]: (p) => board.rotate(p, ROTATION.RIGHT), // X 키를 누르면 블록을 오른쪽으로 회전
  [KEY.Z]: (p) => board.rotate(p, ROTATION.LEFT) // Z 키를 누르면 블록을 왼쪽으로 회전
};

let board = new Board(ctx, ctxNext); // Board 객체를 생성

initNext(); // 다음 블록을 그리기 위해 initNext 함수를 호출
showHighScores(); // 최고 점수를 표시하기 위해 showHighScores 함수를 호출

function initNext() {
  // Calculate size of canvas from constants.
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
  if (event.keyCode === KEY.P) {
    pause();
  }
  if (event.keyCode === KEY.ESC) {
    gameOver();
  } else if (moves[event.keyCode]) {
    event.preventDefault();
    // Get new state
    let p = moves[event.keyCode](board.piece);
    if (event.keyCode === KEY.SPACE) {
      // Hard drop
      if (document.querySelector('#pause-btn').style.display === 'block') {
          // dropSound.play();
      }else{
        return;
      }
      
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    } else if (board.valid(p)) {
      if (document.querySelector('#pause-btn').style.display === 'block') {
        // movesSound.play();
      }
      board.piece.move(p);
      if (event.keyCode === KEY.DOWN && 
          document.querySelector('#pause-btn').style.display === 'block') {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function play() {
  addEventListener();
  if (document.querySelector('#play-btn').style.display == '') {
    resetGame();
  }

  // If we have an old game running then cancel it
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
  document.querySelector('#play-btn').style.display = 'none';
  document.querySelector('#pause-btn').style.display = 'block';
  // backgroundSound.play();
}

function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  // Clear board before drawing new state.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId);

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
  
  // sound.pause();
  // finishSound.play();
  // checkHighScore(account.score);

  document.querySelector('#pause-btn').style.display = 'none';
  document.querySelector('#play-btn').style.display = '';
}

function pause() {
  if (!requestId) {
    document.querySelector('#play-btn').style.display = 'none';
    document.querySelector('#pause-btn').style.display = 'block';
    animate();
    // backgroundSound.play();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
  document.querySelector('#play-btn').style.display = 'block';
  document.querySelector('#pause-btn').style.display = 'none';
  // sound.pause();
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    // const name = prompt('You got a highscore! Enter name:');
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  // 똑같은 이름이 있으면 삭제
  for (let i = 0; i < highScores.length; i++) {
    if (highScores[i].name == score.name) {
      highScores.splice(i, 1);
      break;
    }
  }
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('play-btn').click();
});
