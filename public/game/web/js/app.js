// URL에서 "rn" 매개변수 가져오기
const urlParams = new URLSearchParams(window.location.search);
const rnParam = urlParams.get('rn');

// WebSocket 연결
const socket = new WebSocket(`ws://${location.href.split('/')[2]}/socket?rn=${rnParam}`);

// WebSocket 이벤트 리스너 등록
socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
  console.log('Received message:', event.data);
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
