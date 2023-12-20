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
}
drawInit();

function drawBrick(block, x, y) {
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
    // img.removeAttribute("src");
    img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    return;
  }
  img.src = `imgs/${block}.png`;
}

window.drawBrick = drawBrick;

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
  ],
  [ // 역 ㄱ
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
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
  ]
];

let blockData;

blockData.ㅁ = block[0];
blockData.ㅣ = block[1];
blockData.ㄹ = block[2];
blockData.ㄹㄹ = block[3];
blockData.ㅗ = block[4];
blockData.ㄱ = block[5];
blockData.ㄱㄱ = block[6];