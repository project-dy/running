
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
  window.newBrick = [];
  window.newBrickInfo = [];
  // 블록을 생성한다.
  const blockNum = Math.floor(Math.random() * 7);
  // const blockRotation = Math.floor(Math.random() * 4);
  const blockRotation = 0;
  // return [block, blockRotation];
  // console.log(blockNum, blockRotation);
  // console.log(block[blockNum][blockRotation]);
  if (x && y) {
    spawnBlockManual(blockNum, blockRotation, x, y);
  } else {
    spawnBlockManual(blockNum, blockRotation);
  }
  // console.log(newBrick);
  window.moveBlockInterval = setInterval(moveBlock, 100);
  // setTimeout(moveBlock, 1000);
  // setInterval(spawnBlock, 10);
}

function spawnBlockManual (blockNum, blockRotation, x, y) {
  const realX = x || 3;
  const realY = y || 0;

  if (window.newBrick.length != 0) {
    for (let i = 0; i < window.newBrick.length; i++) {
      const id = window.newBrick[i].id.split("-");
      const x = parseInt(id[1]);
      const y = parseInt(id[0]);
      drawBrick(0, x, y, true);
    }
  }

  window.newBrick = [];
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

function getBrickList() {
  // 블록 리스트를 생성한다.
  let bricks = [];
  for (let i = 0; i < window.newBrick.length; i++) {
    const id = window.newBrick[i].id.split("-");
    const x = parseInt(id[1]);
    const y = parseInt(id[0]);
    bricks.push([x, y]);
  }
  // console.log(bricks);
  let bricksY = [];
  for (let i = 0; i < bricks.length; i++) {
    bricksY.push(bricks[i][1]);
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
        bricksListAll[i][ii] = document.getElementById(`${i}-${ii}`).src.split("/")[6].split(".")[0];
      } else {
        bricksListAll[i][ii] = 0;
      }
    }
  }
  return { bricksYList, bricksListAll };
}

function moveBlock() {
  // window.newbrick에 있는 블록을 한칸 아래로 이동한다.
  let { bricksYList, bricksListAll } = getBrickList();
  // console.log(bricksYList, bricksListAll);
  // Y좌표가 큰 블록부터 움직인다.
  // console.log(bricksYList);

  for (let i = bricksYList.length - 1; i >= 0; i--) { // i = y
    const y = i;
    // const xList = bricksYList[i];
    const xList = bricksYList[i];
    if (!xList) continue;
    // console.log(y, xList);
    // 블록이 아래에 있는지 확인한다. 이때 maxX와 minX사이에 있는 블록 아래에도 있는지 확인한다. 블록이 아래에 있으면 return한다. 이때 maxY부터 확인한다. 이때 Y좌표가 같은 블록들은 가장 큰 Y좌표를 가진 블록만 확인한다.
    for (let ii = 0; ii < xList.length; ii++) { // ii = x
      const x = xList[ii];
      if (y == 19) {
        // console.log("stop");
        spawnBlock();
        return;
      }
      
      // 지금 체킹하는 블록
      const thisBlock = block[newBrickInfo[0]][newBrickInfo[1]];
      const Ylength = thisBlock.length;
      // console.log(x, y+Ylength);
      console.log(thisBlock[y]);
      // console.log(thisBlock);
      if (thisBlock[y]&&thisBlock[y][x] == 0) {
        // console.log("stop");
        continue;
      }

      // bricksYList를 이용하여 이 블록 꾸러미중 아래에 있는 블록이 있다면 return하지 않고 continue한다.
      console.log(bricksYList[y+1]);
      if (bricksYList[y+1] && bricksYList[y+1][x]) {
        console.log(bricksYList[y+Ylength]);
        // console.log("stop");
        // return;
        continue;
      } else if (!bricksYList[y+1]) {
        // console.log("stop");
        // return;
        if (bricksYList[0]) {
          console.log(bricksListAll[y+Ylength][x]);
          continue;
        }
        else {
          continue;
        }
      }
      if (bricksListAll[y+Ylength][x] != 0) {
        // console.log("stop");
        spawnBlock();
        return;
      }
      // console.log(x);
    }
  }
  // console.log(bricksYList);
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

