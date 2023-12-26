// TODO: 게임 윈도우만들고 타이머 사용설정 하기.
document.getElementById('title').innerHTML = `${window.sn} ${window.name}님 환영합니다`;

/**
 * 
 * @param {HTMLElement} element 로딩중일때 ...이 표시되 요소를 넣습니다.
 * @returns Nothing.
 * @description 정지를 하시려면 window.loadingInterval을 0으로 설정하십시오.
*/
function loading(element) {
  // const defaultVal = String(element.innerHTML);
  const interval = setInterval(() => {
    if (window.loadingInterval === 0) {
      // clearInterval(interval);
      return;
    }
    element.innerHTML = `.`;
    setTimeout(() => {
      element.innerHTML = `..`;
      setTimeout(() => {
        element.innerHTML = `...`;
      }, 200);
    }, 200);
  }, 600);
}

function findGame() {
  document.getElementById('info').innerHTML = `게임을 찾는중 입니다`;
  fetch('/game/find', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    return res.json();
  }).then((res) => {
    if (res.status === '200 OK') {
      document.getElementById('info').innerHTML = `게임을 찾았습니다`;
      window.location.href = `/game/${res.gameId}`;
    } else if (res.status === '205 Reset Content') {
      document.getElementById('info').innerHTML = `게임방 리스트를 찾았습니다`;
      console.log(res.game);
      /* {
        "gameId": "1",
        "description": "1번방입니다."
      } 을 <div id="interectArea"></div>하위에 표생성*/
      const table = document.getElementById('gameTable');
      table.innerHTML = '';
      const th1 = document.createElement('th');
      const th2 = document.createElement('th');
      const th3 = document.createElement('th');
      th1.innerHTML = '방 번호';
      th2.innerHTML = '방 설명';
      th3.innerHTML = '방 입장';
      th1.classList.add('leftAlign');
      th2.classList.add('leftAlign');
      th3.classList.add('leftAlign');
      th3.classList.add('enter');
      table.appendChild(th1);
      table.appendChild(th2);
      table.appendChild(th3);
      console.log(res.game.length);
      for (let i = 0; i < res.game.length; i++) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        td1.innerHTML = res.game[i].gameId;
        td2.innerHTML = res.game[i].description;
        td3.innerHTML = `<a href="/game/web/real.html?rn=${res.game[i].url}">입장</a>`;
        td1.classList.add('centerAlign');
        td2.classList.add('leftAlign');
        td3.classList.add('leftAlign');
        td3.classList.add('enter');
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
      }
      // document.getElementById('interectArea').appendChild(table);
    } else if (res.status === '404 Not Found') {
      document.getElementById('info').innerHTML = `게임을 찾지 못했습니다`;
    } else {
      document.getElementById('info').innerHTML = `알 수 없는 오류가 발생했습니다`;
      console.log(res);
    }
  }).catch((err) => {
    console.log(err);
    document.getElementById('info').innerHTML = `알 수 없는 오류가 발생했습니다`;
  });
}

loading(document.getElementById('loadingDot'));

findGame();