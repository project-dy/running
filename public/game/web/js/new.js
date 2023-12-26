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

const row = document.querySelector('#row');

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

function getRandomValue() {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 4294967295; // Normalize to [0, 1)
  } else {
    return Math.random();
  }
}

function spawnBlock() {
  window.autoDown = setInterval(() => {
    moveBlock(window.blockObj, "down");
  }, 500);
  const blockType = Math.floor(getRandomValue() * 7); // 0~6
  const blockRotation = Math.floor(getRandomValue() * 4); // 0~3
  // const blockColor = Math.floor(getRandomValue() * 7);
  const blockColor = blockType; // 블록의 색깔은 블록의 종류와 같다.
  const blockPosition = [0, 3]; // 블록의 시작 위치
  const blockData = block[blockType][blockRotation]; // 블록의 데이터
  const blockId = Math.floor(getRandomValue() * 1000000000); // 블록의 고유 ID

  const blockObj = {
    blockType,
    blockRotation,
    blockColor,
    blockPosition,
    blockData,
    blockId,
  };

  window.blockObj = blockObj;

  console.log(blockObj);
  drawBlock(blockObj);
}

function drawBlock(blockObj) {
  const blockData = blockObj.blockData; // 블록의 데이터
  const blockColor = blockObj.blockColor; // 블록의 색깔
  const blockId = blockObj.blockId; // 블록의 고유 ID
  const blockPosition = blockObj.blockPosition; // 블록의 시작 위치

  for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
    for (let ii = 0; ii < blockData[i].length; ii++) { // ii는 블록의 가로
      if (blockData[i][ii] == 1) {
        const img = document.getElementById(
          `${blockPosition[0] + i}-${blockPosition[1] + ii}`
        );
        img.src = `imgs/${blockColor + 1}.png`;
        img.className = `block-${blockId}`;
      }
    }
  }
}

function removeBlock(y, x) { // img태그의 특성상 src를 비우면 이미지 로드 실패 문양이 남기때문에 img태그를 삭제하고 다시 생성한다.
  const img = document.getElementById(
    `${y}-${x}`
  );
  img.remove();
  const newImg = document.createElement("img");
  newImg.id = `${y}-${x}`;
  // newImg.src = `imgs/0.png`;
  const row = document.getElementById(`row-${y}`);
  // row.appendChild(newImg);
  // 마지막이 아닌 중간에 추가하기 위해 insertBefore를 사용한다.
  window.row = row;
  row.insertBefore(newImg, document.getElementById(`${y}-${x+1}`));
}

function moveBlock(blockObj, direction) {
  const blockData = blockObj.blockData;
  const blockColor = blockObj.blockColor;
  const blockId = blockObj.blockId;
  const blockPosition = blockObj.blockPosition;

  // for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
  for (let i = blockData.length-1; i >= 0; i--) { // i는 블록의 세로
    // TODO: 암튼 이거 수정해야함
    if (blockPosition[0] + i > 20 && i == blockData.length-1) { // 블록이 바닥에 닿았을 때
      clearInterval(window.autoDown);
      spawnBlock();
      return;
    }
    for (let ii = 0; ii < blockData[i].length; ii++) { // ii는 블록의 가로
      if (blockPosition[1] + ii < 0 || blockPosition[1] + ii >= 10) { // 블록이 벽에 닿았을 때
        clearInterval(window.autoDown);
        spawnBlock();
        return;
      }
      if (blockData[i][ii] == 1) {
        const img = document.getElementById(
          `${blockPosition[0] + i}-${blockPosition[1] + ii}`
          );
        removeBlock(blockPosition[0] + i, blockPosition[1] + ii);
        // img.src = `imgs/0.png`;
        // img.className = "removed";
      }
    }
  }

  /*document.querySelectorAll(`.removed`).forEach((img) => {
    const id = img.id.split("-");
    removeBlock(id[0], id[1]);
  });*/

  if (direction == "down") {
    blockObj.blockPosition[0]++;
  } else if (direction == "left") {
    blockObj.blockPosition[1]--;
  } else if (direction == "right") {
    blockObj.blockPosition[1]++;
  }

  for (let i = 0; i < blockData.length; i++) {
    for (let ii = 0; ii < blockData[i].length; ii++) {
      if (blockData[i][ii] == 1) {
        const img = document.getElementById(
          `${blockPosition[0] + i}-${blockPosition[1] + ii}`
        );
        img.src = `imgs/${blockColor + 1}.png`;
        img.className = `block-${blockId}`;
      }
    }
  }
}

function initEventListner() {
  document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowDown") {
      moveBlock(window.blockObj, "down");
    } else if (event.key == "ArrowLeft") {
      moveBlock(window.blockObj, "left");
    } else if (event.key == "ArrowRight") {
      moveBlock(window.blockObj, "right");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initEventListner();
});