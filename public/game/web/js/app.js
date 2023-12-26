
/*block = [
  [ // 사각형
    [1, 1],
    [1, 1],
  ],
  [ // 막대기
    [1, 1, 1, 1],
  ],
  [ // ㄹ
    [1, 1, 0],
    [0, 1, 1],
  ],
  [ // 역 ㄹ
    [0, 1, 1],
    [1, 1, 0],
  ],
  [ // ㅗ
    [0, 1, 0],
    [1, 1, 1],
  ],
  [ // 역 ㄱ
    [1, 1, 1],
    [1, 0, 0],
  ],
  [ // ㄱ
    [1, 1, 1],
    [0, 0, 1],
  ],
];*/

const block = [
  [ // ㄹ
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ]
  ],
  [ // 역 ㄴ
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  ],
  [ // 사각형
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ]
  ],
  [ // 역 ㄹ
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ]
  ],
  [ // 막대기
    [
      [1, 1, 1, 1],
    ],
    [
      [1],
      [1],
      [1],
      [1],
    ],
    [
      [1, 1, 1, 1],
    ],
    [
      [1],
      [1],
      [1],
      [1],
    ]
  ],
  [ // ㄱ
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ]
  ],
  [ // ㅗ
    [
      [0, 1, 0],
      [1, 1, 1],
    ], 
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ]
  ]
];

window.block = block;

function init(ip){
  // URL에서 "rn" 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const rnParam = urlParams.get("rn");

  // WebSocket 연결
  const socket = new WebSocket(
    `ws://${location.href.split("/")[2]}/socket?rn=${rnParam}`
  );

  // WebSocket 이벤트 리스너 등록
  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    window.event = event;
    let data;
    try {
      data = JSON.parse(event.data).data;
      if (data[0] == rnParam && data[1] == ip) {
        console.log("Our room!");
      }
    } catch {
      data = event.data;
    }
    console.log("Received message:", event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    // 새로고침
    setTimeout(()=>{
      location.reload();
    }, 500);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  window.socket = socket;
}


document.addEventListener("DOMContentLoaded", () => {
  // init();
  fetch("/api/getip")
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      console.log(res);
      // document.getElementById("ip").innerHTML = res;
      init(res);
    })
    .catch((err) => {
      console.error(err);
    });
});

function drawInit() {
  // 20X10의 테트리스 칸을 그린다 이때 img태그를 사용한다. id에 0-0부터 19-9까지의 id를 부여한다.
  const tetris = document.getElementById("row");
  for (let i = 0; i < 20; i++) {
    const row = document.createElement("div");
    row.id = `row-${i}`; // row에 id를 부여한다.
    row.className = "roww";
    for (let ii = 0; ii < 10; ii++) {
      let img = document.createElement("img");
      img.id = `${i}-${ii}`;
      if (i == 19) { // CSS 확인용
        // img.src = `imgs/${ii+1}.png`;
      }
      row.appendChild(img);
    }
    tetris.appendChild(row);
    //tetris.appendChild(document.createElement("br"));
  }
  setTimeout(spawnBlock, 100);
  // setInterval(spawnBlock, 0);
}
drawInit();

function drawBrick(block, x, y, force) {
  // 블록을 그린다.
  /*for (let i = 0; i < block.length; i++) {
    for (let ii = 0; ii < block[0].length; ii++) {
      if (block[i][ii] == 1) {
        document.getElementById(`${y + i}-${x + ii}`).src = "imgs/1.png";
      }
    }
  }*/
  const tetris = document.getElementById("row");
  const row = tetris.childNodes[y];
  const img = row.childNodes[x];
  if (block == 0) {
    if (!force) return;
    // img.removeAttribute("src");
    // img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    // console.log(document.getElementById(`${y}-${x}`));
    const img = document.createElement("img");
    img.id = `${y}-${x}`;
    document.getElementById(`${y}-${x}`).replaceWith(img);
    return img;
  }
  img.src = `imgs/${block}.png`;
  return img;
}

window.drawBrick = drawBrick;

window.newBrick = [];
window.newBrickInfo = [];

function spawnBlock(x,y) { // random
  try {
    clearInterval(window.moveBlockInterval);
  }
  catch {}
  if (window.newBrick.length != 0) { // 블록이 있을때
    if (Number(window.newBrick[0].id.split("-")[0]) < block[window.newBrickInfo[0]][window.newBrickInfo[1]].length) { // 블록소환을위한 공간이 없을때
      clearInterval(window.moveBlockInterval);
      debugger;
      alert("Game Over");
      location.reload();
      return;
    }
  }
  window.newBrick = [];
  window.newBrickInfo = [];
  // 블록을 생성한다.
  const blockNum = Math.floor(getRandomValue() * 7);
  // const blockRotation = Math.floor(getRandomValue() * 4);
  const blockRotation = 0;
  // return [block, blockRotation];
  // console.log(blockNum, blockRotation);
  // console.log(block[blockNum][blockRotation]);

  let over = false;
  const bricksListAll = getBrickList().bricksListAll;
  bricksListAll[0].forEach((x, count)=>{
    if (x != 0) {
      console.log("Game Over");
      over = true;
      return;
    }
  });
  if (over) {
    clearInterval(window.moveBlockInterval);
    debugger;
    alert("Game Over");
    location.reload();
    return;
  };

  if (x && y) {
    spawnBlockManual(blockNum, blockRotation, x, y);
  } else {
    spawnBlockManual(blockNum, blockRotation);
  }
  // console.log(newBrick);
  window.moveBlockInterval = setInterval(moveBlock, 500);
  // setTimeout(moveBlock, 1000);
  // setInterval(spawnBlock, 10);
}

function eventInit() {
  document.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.key == "ArrowDown") {
      moveBlock();
    } else if (e.key == "ArrowLeft") {
      moveBlockLeft();
    } else if (e.key == "ArrowRight") {
      moveBlockRight();
    } else if (e.key == "ArrowUp") {
      rotateBlock();
    }
  });
}
eventInit();

function getRandomValue() {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 4294967295; // Normalize to [0, 1)
  } else {
    return Math.random();
  }
}
window.getRandomValue = getRandomValue;

function spawnBlockManual (blockNum, blockRotation, x, y) {
  const realX = x || 3;
  const realY = y || 0;

  if (window.newBrick.length != 0) { // 블록이 있을때
    for (let i = 0; i < window.newBrick.length; i++) { // i = y
      const id = window.newBrick[i].id.split("-"); // id = [y, x]
      const x = parseInt(id[1]); // x = x
      const y = parseInt(id[0]); // y = y
      drawBrick(0, x, y, true); // 블록을 지운다.
    }
  }

  window.newBrick = [];
  window.newBrickInfo = [];
  for (let i = 0; i < block[blockNum][blockRotation].length; i++) { // i = y
    for (let ii = 0; ii < block[blockNum][blockRotation][0].length; ii++) { // ii = x
      // console.log(`block[${blockNum}][${blockRotation}][${i}][${ii}]`);
      if (block[blockNum][blockRotation][i][ii] == 1) {
        const brick = drawBrick(blockNum + 1, ii + realX, i+realY);
        newBrick.push(brick);
      }
    }
  }
  window.newBrickInfo = [blockNum, blockRotation, realX, realY];
}

window.spawnBlock = spawnBlock;

function initBlock() {
  for (let i = 0; i < 20; i++) {
    for (let ii = 0; ii < 10; ii++) {
      const x=ii;
      const y=i;
      const img = document.createElement("img");
      img.id = `${y}-${x}`;
      document.getElementById(`${y}-${x}`).replaceWith(img);
    }
  }
}

window.initBlock = initBlock;

function drawBrickFromList(bricks, orgColor) {
  let nowBrick = [];
  for (let i = 0; i < bricks.length; i++) {
    for (let ii = 0; ii < bricks[i].length; ii++) {
      const x = ii;
      const y = i;
      const color = bricks[y][x];
      // console.log(x, y, color);
      if (color == -1) {
        const img = drawBrick(orgColor, x, y, true);
        // console.log(img);
        nowBrick.push(img);
        continue;
      }
      drawBrick(color, x, y, true);
    }
  }
  return nowBrick;
  /* 
  ex: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
  ]
   */
}

window.drawBrickFromList = drawBrickFromList;

/*function getBrickList() {
  // 블록 리스트를 생성한다.
  let bricks = [];
  for (let i = 0; i < window.newBrick.length; i++) { // i = brick index
    const id = window.newBrick[i].id.split("-"); // id = 'y-x'
    const x = parseInt(id[1]); // x = x
    const y = parseInt(id[0]); // y = y
    bricks.push([x, y]);
  }
  console.log(bricks);
  let bricksY = [];
  for (let i = 0; i < bricks.length; i++) {
    bricksY.push(bricks[i][0]);
  }
  // console.log(bricksY);
  // y좌표를 기준으로 블록을 구분한다.
  let bricksYList = [];
  for (let i = 0; i < bricksY.length; i++) {
    if (!bricksYList.includes(bricksY[i])) {
      // bricksYList.push(bricksY[i]);
      // bricksYList.push([bricksY[i], []]);
      // 해당 y좌표에 있는 블록들을 리스트에 추가한다.
      let bricksXList = [];
      for (let ii = 0; ii < bricks.length; ii++) {
        if (bricksY[i] == bricks[ii][1]) {
          bricksXList.push(bricks[ii][0]);
        }
      }
      // bricksYList.push([bricksY[i], bricksXList]);
      bricksYList[bricksY[i]] = bricksXList;
    }
  }
  // console.log(bricksYList);
  // 전체 블록 리스트를 생성한다.
  let bricksListAll = [];
  for (let i = 0; i < 20; i++) {
    bricksListAll[i] = [];
    for (let ii = 0; ii < 10; ii++) {
      // bricksListAll[i][ii] = 0;
      if (document.getElementById(`${i}-${ii}`).src.includes("imgs/")) {
        bricksListAll[i][ii] = Number(document.getElementById(`${i}-${ii}`).src.split("/")[6].split(".")[0]);
      } else {
        bricksListAll[i][ii] = 0;
      }
    }
  }
  return { bricksYList, bricksListAll };
}*/

function getBrickList() {
  // 전체 블록 리스트를 생성한다.
  let bricksListAll = [];
  for (let i = 0; i < 20; i++) {
    bricksListAll[i] = [];
    for (let ii = 0; ii < 10; ii++) {
      // bricksListAll[i][ii] = 0;
      if (document.getElementById(`${i}-${ii}`).src.includes("imgs/")) {
        bricksListAll[i][ii] = Number(document.getElementById(`${i}-${ii}`).src.split("/")[6].split(".")[0]);
      } else {
        bricksListAll[i][ii] = 0;
      }
    }
  }
  // console.log(bricksListAll);

  // y좌표를 기준으로 블록을 구분한다.
  let bricksYList = [];
  for (let i = 0; i < bricksListAll.length; i++) {
    bricksYList.push([]);
    for (let ii = 0; ii < bricksListAll[i].length; ii++) {
      if (bricksListAll[i][ii] != 0) {
        bricksYList[i].push(ii);
      }
    }
  }
  // console.log(bricksYList);
  return { bricksYList, bricksListAll };
}

function moveBlock() {
  // window.newbrick에 있는 블록을 한칸 아래로 이동한다.
  let { bricksYList, bricksListAll } = getBrickList();
  // 지금 체킹하는 블록
  const thisBlock = block[newBrickInfo[0]][newBrickInfo[1]];
  // console.log(thisBlock);
  const Ylength = thisBlock.length;
  console.log(Ylength);
  const y = newBrickInfo[3]+Ylength; // 가장 아래에 있는 블록의 y좌표
  /*let y;
  if (newBrickInfo[3] == 0) {
    y = newBrickInfo[3]+Ylength-1;
  } else {
    y = newBrickInfo[3]+Ylength;
  }*/
  // console.log(y);
  const Xlength = thisBlock[0].length;
  const xList = bricksYList[y] || []; // 가장 아래에 있는 블록의 한칸 아래의 x좌표 리스트
  const thisxList = bricksYList[y-1] || []; // 가장 아래에 있는 블록의 x좌표 리스트
  // const xList = bricksYList[bricksYList.length-1]; // 가장 아래에 있는 블록의 x좌표 리스트
  // console.log(bricksYList);
  // const x = newBrickInfo[2];
  // console.log((bricksListAll[y+1]||[undefined,undefined,undefined,undefined])[x]);

  console.log(xList);
  let stop = false;
  // console.log(y, newBrickInfo[3], Ylength, xList);
  console.log(bricksListAll);
  console.log(y, xList);

  if (y == 20) { // 바닥에 닿을때
    // console.log("stop");
    debugger;
    spawnBlock();
    return;
  }
  // for문으로 xList를 돌면서 xList에 있는 x좌표에 있는 블록이  이 블록 꾸러미의 가장 밑에 또한 있는지 확인한다.
  for (let i = 0; i < xList.length; i++) {
    const x = xList[i];
    if (thisxList.includes(x)) {
      // console.log("stop");
      console.log('꾸러미 아님: ', x, y, xList, thisxList);
      stop = true;
      break;
    }
  }
  /*xList.forEach((x, count)=>{
    // return;
    if (x == 0) return;
    // console.log(x);
    if (stop == true) return;
    if (bricksListAll[y+1] == undefined) {
      // console.log("stop");
      // console.log('꾸러미 아님: ', y+Ylength, x, bricksListAll);
      stop = true;
      return;
    }
    if (bricksListAll[y][count+1] != 0) {
      // console.log("stop");
      console.log('꾸러미 아님: ', y, count+1, bricksListAll[y], bricksListAll[y][count+1]);
      debugger;
      stop = true;
      return;
    }
  });*/
  console.log(bricksYList);
  /*xList.forEach((x, count)=>{ // TODO: 고쳐야 함 아무튼 이거 고치면 됨 진짜 고쳐야 함 안고치면 안됨 진짜 중요함 안고치면 테트리스가 안됨 진짜 중요함 진짜진짜임 거짓말 안함 진짜임 진심임 진짜라고고ㅗㅘㅓㅘㄴ미ㅗ리ㅏㅓ롸ㅣㅎ
    // return;
    if (x == 0) return;
    // console.log(x);
    // if (stop == true) return;
    if (bricksYList[y] == []) { // 줄이 비어있을때
      // console.log("stop");
      // console.log('꾸러미 아님: ', y+Ylength, x, bricksListAll);
      // stop = true;
      spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3] + 1);
      return;
    }
    if (stop == true) {
      if (bricksYList[y].includes(x)) {
        // console.log("stop");
        console.log('꾸러미 아님: ', x, y, count+1, bricksYList[y], bricksYList[y][count+1]);
        stop = true;
        return;
      } else {
        stop = null;
        return;
      }
    }
    if (bricksYList[y+1] && bricksYList[y+1].includes(x)) {
      // console.log("stop");
      console.log('꾸러미 아님: ', x, y, count+1, bricksYList[y+1], bricksYList[y+1][count+1]);
      stop = true;
      if (!(y < Ylength+1)) {
        spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3]);
        return;
      }
      // debugger;
      // return;
    }
  });*/
  if (stop) { debugger;spawnBlock();return; };
  let color;

  // drawBrickFromList(bricksListAll, color);
  spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3] + 1);
}

window.moveBlock = moveBlock;

function moveBlockLeft() {
  // window.newbrick에 있는 블록을 한칸 아래로 이동한다.
  // console.log(newBrick);
  for (let i = 0; i < window.newBrick.length; i++) {
  // for (let i = window.newBrick.length - 1; i >= 0; i--) {
    const id = window.newBrick[i].id.split("-");
    // console.log(id);
    const x = parseInt(id[1]);
    const y = parseInt(id[0]);
    if (x == 0) {
      // console.log("stop");
      return;
    }
    // console.log(x, y);
    const color = window.newBrick[i].src.split("/")[6].split(".")[0];
    drawBrick(0, x, y, true);
    const brick = drawBrick(color, x - 1, y);
    window.newBrick[i] = brick;
  }
  // spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3] + 1);
}
window.moveBlockLeft = moveBlockLeft;

function moveBlockRight() {
  // window.newbrick에 있는 블록을 한칸 아래로 이동한다.
  // console.log(newBrick);
  for (let i = window.newBrick.length - 1; i >= 0; i--) {
    const id = window.newBrick[i].id.split("-");
    // console.log(id);
    const x = parseInt(id[1]);
    const y = parseInt(id[0]);
    if (x == 9) {
      // console.log("stop");
      return;
    }
    // console.log(x, y);
    const color = window.newBrick[i].src.split("/")[6].split(".")[0];
    drawBrick(0, x, y, true);
    const brick = drawBrick(color, x + 1, y);
    window.newBrick[i] = brick;
  }
  // spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3] + 1);
}
window.moveBlockRight = moveBlockRight;

function rotateBlock() {
  const blockNum = window.newBrickInfo[0];
  const blockRotation = window.newBrickInfo[1];
  const x = window.newBrickInfo[2];
  const y = window.newBrickInfo[3];
  const newBlockRotation = (blockRotation + 1) % 4;
  const newBlock = block[blockNum][newBlockRotation];
  const newBlockInfo = [blockNum, newBlockRotation, x, y];
  const newBrick = [];
  for (let i = y; i < newBlock.length + y; i++) { // i = y
    for (let ii = 0; ii < newBlock[0].length; ii++) { // ii = x
      if (newBlock[i - y][ii] == 1) {
        const brick = drawBrick(blockNum + 1, ii + x, i);
        newBrick.push(brick);
      }
    }
  }
  window.newBrick = newBrick;
  window.newBrickInfo = newBlockInfo;
}
window.rotateBlock = rotateBlock;

