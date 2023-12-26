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
  if (window.blockObj && checkAvailableBlock(window.blockObj) == false) {
    alert("Game Over!");
    return;
  }
  window.autoDown = setInterval(() => {
    moveBlock(window.blockObj, "down");
  }, 500);
  const blockType = Math.floor(getRandomValue() * 7); // 0~6
  const blockRotation = Math.floor(getRandomValue() * 4); // 0~3
  // const blockColor = Math.floor(getRandomValue() * 7);
  const blockColor = blockType; // 블록의 색깔은 블록의 종류와 같다.
  const blockPosition = [0, 3]; // 블록의 시작 위치
  const blockData = block[blockType][blockRotation]; // 블록의 데이터
  let blockId = Math.floor(getRandomValue() * 1000000000); // 블록의 고유 ID
  const check = ()=>{if (window.blockObjList[blockId] != undefined) {
    blockId = Math.floor(getRandomValue() * 1000000000);
    check();
  }};
  check();

  const blockObj = {
    blockType,
    blockRotation,
    blockColor,
    blockPosition,
    blockData,
    blockId,
  };

  window.blockObj = blockObj;
  window.blockObjList[blockId] = blockObj;

  // console.log(blockObj);
  drawBlock(blockObj);
}
window.blockObjList = [];

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
  if (img == undefined) return;
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
  const blockList = getBlockList();

  const under = checkUnderBlock(blockObj);
  if (under) {
    clearInterval(window.autoDown);
    spawnBlock();
    return;
  }

  for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
  // for (let i = blockData.length-1; i >= 0; i--) { // i는 블록의 세로
    // TODO: 암튼 이거 수정해야함
    // console.log(blockPosition[0]+i);
    if (blockPosition[0] + blockData - i >= 19) { // TODO: 삭제
    // if (blockPosition[0] + i >= 19) { // 블록이 바닥에 닿았을 때
      clearInterval(window.autoDown);
      spawnBlock();
      return;
    }
    for (let ii = 0; ii < blockData[i].length; ii++) { // ii는 블록의 가로
      /*if (blockList[blockPosition[1]+1][blockPosition[0]] != 0) {
        console.log(blockPosition[1]+1, blockList[blockPosition[1]+1]);
        console.log(blockList);
        debugger;
        clearInterval(window.autoDown);
        spawnBlock();
        return;
      };*/

      if (blockData[i][ii] == 1) {
        const img = document.getElementById(
          `${blockPosition[0] + i}-${blockPosition[1] + ii}`
          );
        // debugger;
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
        if (img == undefined) continue;
        img.src = `imgs/${blockColor + 1}.png`;
        img.className = `block-${blockId}`;
      }
    }
  }
}

function rotateBlock(blockObj) {
  const blockData = blockObj.blockData;
  const blockColor = blockObj.blockColor;
  const blockId = blockObj.blockId;
  const blockPosition = blockObj.blockPosition;
  const blockRotation = blockObj.blockRotation;

  for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
  // for (let i = blockData.length-1; i >= 0; i--) { // i는 블록의 세로
    for (let ii = 0; ii < blockData[i].length; ii++) { // ii는 블록의 가로
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
  // debugger;
  /*document.querySelectorAll(`.removed`).forEach((img) => {
    const id = img.id.split("-");
    removeBlock(id[0], id[1]);
  });*/

  blockObj.blockRotation++;
  if (blockObj.blockRotation >= 4) blockObj.blockRotation = 0;
  blockObj.blockData = block[blockObj.blockType][blockObj.blockRotation];
  console.log(blockObj.blockData);

  drawBlock(blockObj);
  /*for (let i = 0; i < blockData.length; i++) {
    for (let ii = 0; ii < blockData[i].length; ii++) {
      if (blockData[i][ii] == 1) {
        const img = document.getElementById(
          `${blockPosition[0] + i}-${blockPosition[1] + ii}`
        );
        img.src = `imgs/${blockColor + 1}.png`;
        img.className = `block-${blockId}`;
        debugger;
      }
    }
  }*/
}

function checkAvailableBlock(blockObj) { // blockObj가 소환 가능한 공간이 있는지 (Y좌표) 확인한다.
  const blockData = blockObj.blockData;
  const blockPosition = blockObj.blockPosition;
  const blockRotation = blockObj.blockRotation;
  const blockList = getBlockList();

  for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
    for (let ii = 0; ii < blockData[i].length; ii++) { // ii는 블록의 가로
      if (blockData[i][ii] == 1) { // 블록이 있는 곳이라면
        if (blockList[i][blockPosition[1] + ii] != 0) { // 블록이 있는 곳에 블록이 있다면
          console.log(i, blockList[i]);
          // debugger;
          return false; // 소환할 수 없다.
        }
      }
    }
  }
  // 이 블록이 있는 곳에 블록이 없다면
  return true; // 소환할 수 있다.
}

function checkUnderBlock(blockObj) { // blockObj의 아래에 blockObj의 하강을 막는 블록이 있는지 확인한다.
  const blockData = blockObj.blockData;
  const blockPosition = blockObj.blockPosition;
  const blockRotation = blockObj.blockRotation;
  const blockList = getBlockList();
  const blockListObj = getBlockList("element");

  if (blockData.length == 4) { // 블록의 세로가 1이라면 (막대기 블록) 하강을 막는 로직을 다르게 한다.
    console.log('stick');
    // debugger;
    const i = blockData.length-1;
    const ii = 0;
    if (blockPosition[0] + i == 19) return true; // 블록이 바닥에 닿았을 때
    if (blockList[blockPosition[0] + i + 1] && blockList[blockPosition[0] + i + 1][blockPosition[1] + ii] != 0) { // 블록의 아래에 블록이 있다면
      const temp = blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii]
      // debugger;
      // if (blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className.split('-')[1] == blockObj.blockId) return false;
      // if (blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className.split('-')[1] == blockObj.blockId) continue; // 블록의 아래에 있는 블록이 자신의 블록이라면
      // console.log(blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className, blockObj.blockId);
      return true; // 하강을 막는다.
    }
    return false;
  }
  // for (let i = 0; i < blockData.length; i++) { // i는 블록의 세로
  for (let i = blockData.length-1; i >= 0; i--) { // i는 블록의 세로 (밑에서부터 확인) blockData.length-1은 블록의 세로 길이이지만 배열의 인덱스는 0부터 시작하기 때문에 -1을 해준다.
    if (blockPosition[0] + i == 19) return true; // 블록이 바닥에 닿았을 때
    for (let ii = 0; ii < blockData[i].length - 1; ii++) { // ii는 블록의 가로
      if (blockData[i][ii] == 1) { // 블록이 있는 곳이라면
        // console.log(blockList[blockPosition[0] + i + 1] && blockList[blockPosition[0] + i + 1][blockPosition[1] + ii] != 0);
        // debugger;
        if (blockList[blockPosition[0] + i + 1] && blockList[blockPosition[0] + i + 1][blockPosition[1] + ii] != 0) { // 블록의 아래에 블록이 있다면
          const temp = blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii]
          // debugger;
          if (blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className.split('-')[1] == blockObj.blockId) continue;
          // if (blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className.split('-')[1] == blockObj.blockId) continue; // 블록의 아래에 있는 블록이 자신의 블록이라면
          // console.log(blockListObj[blockPosition[0] + i + 1][blockPosition[1] + ii].className, blockObj.blockId);
          return true; // 하강을 막는다.
        }
      }
    }
  }
  // debugger;
  // 블록의 아래에 블록이 없다면
  return false; // 하강을 막지 않는다.
}

function getBlockPosition(blockObj) {
  const blockData = blockObj.blockData;
  const blockPosition = blockObj.blockPosition;
  const blockRotation = blockObj.blockRotation;

  const blockPositionList = [];

  for (let i = 0; i < blockData.length; i++) {
    for (let ii = 0; ii < blockData[i].length; ii++) {
      if (blockData[i][ii] == 1) {
        blockPositionList.push([blockPosition[0] + i, blockPosition[1] + ii]);
      }
    }
  }

  return blockPositionList;
}

function getBlockList(option) {
  const blockList = [];
  for (let i = 0; i < 20; i++) {
    blockList.push([]);
    for (let ii = 0; ii < 10; ii++) {
      // blockList[i].push(0);
      if (option == "element") {
        blockList[i].push(document.getElementById(`${i}-${ii}`));
        continue;
      }
      if (document.getElementById(`${i}-${ii}`).getAttribute("src")) {
        blockList[i].push(Number(document.getElementById(`${i}-${ii}`).getAttribute("src").split("/")[1].split(".")[0]));
      } else {
        blockList[i].push(0);
      }
    }
  }
  return blockList;
}

function initEventListner() {
  document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowDown") {
      moveBlock(window.blockObj, "down");
    } else if (event.key == "ArrowLeft") {
      moveBlock(window.blockObj, "left");
    } else if (event.key == "ArrowRight") {
      moveBlock(window.blockObj, "right");
    } else if (event.key == "ArrowUp") {
      rotateBlock(blockObj);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initEventListner();
});