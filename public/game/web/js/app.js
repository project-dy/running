
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
      [1, 0],
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
  setInterval(spawnBlock, 0);
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
    return;
  }
  img.src = `imgs/${block}.png`;
  return img;
}

window.drawBrick = drawBrick;

window.newBrick = [];
window.newBrickInfo = [];

function spawnBlock(x,y) { // random
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
  setInterval(moveBlock, 0);
  // setInterval(spawnBlock, 1000);
}

function spawnBlockManual (blockNum, blockRotation, x, y) {
  const realX = x || 3;
  const realY = y || 0;
  for (let i = realY; i < block[blockNum][blockRotation].length + realY; i++) { // i = y
    for (let ii = 0; ii < block[blockNum][blockRotation][0].length; ii++) { // ii = x
      if (block[blockNum][blockRotation][i][ii] == 1) {
        const brick = drawBrick(blockNum + 1, ii + 3, i);
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

function moveBlock() {
  // window.newbrick에 있는 블록을 한칸 아래로 이동한다.
  // console.log(newBrick);
  // for (let i = 0; i < window.newBrick.length; i++) {
  for (let i = window.newBrick.length - 1; i >= 0; i--) {
    const id = window.newBrick[i].id.split("-");
    // console.log(id);
    const x = parseInt(id[1]);
    const y = parseInt(id[0]);
    if (y == 19) {
      // console.log("stop");
      return;
    }
    // console.log(x, y);
    const color = window.newBrick[i].src.split("/")[6].split(".")[0];
    drawBrick(0, x, y, true);
    const brick = drawBrick(color, x, y + 1);
    window.newBrick[i] = brick;
  }
  // spawnBlockManual(window.newBrickInfo[0], window.newBrickInfo[1], window.newBrickInfo[2], window.newBrickInfo[3] + 1);
}

window.moveBlock = moveBlock;