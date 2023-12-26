function initSocket(name){
  window.name = name;
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
    initInterval();
  };

  socket.onmessage = (event) => {
    window.event = event;
    let data;
    try {
      data = JSON.parse(event.data).data;
      if (data[0] == rnParam) {
        console.log("Our room!");
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        saveHighScore({score: data[2], name: data[1]}, highScores);
        showHighScores();
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

function initSync() {
  localStorage.setItem('highScores', JSON.stringify([]));
  fetch("/api/getip/name")
  .then((res) => {
    return res.text();
  })
  .then((res) => {
    console.log(res);
    // document.getElementById("ip").innerHTML = res;
    initSocket(res);
  })
  .catch((err) => {
    console.error(err);
  });
}
initSync();

function initInterval() {
  // 1초마다 반복
  setInterval(() => {
    // 서버에 메시지 전송
    socket.send(account.score);
  }, 1);
}