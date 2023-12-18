const path = require('path'); // path 모듈 불러오기
const publicPath = path.resolve(__dirname, '../../public').toString(); // public 폴더의 절대경로를 publicPath에 저장
const dataPath = path.resolve(__dirname, '../../data').toString(); // data 폴더의 절대경로를 dataPath에 저장

const fs = require('fs'); // fs 모듈 불러오기

function find(query) {
  /**
   *
   * @param {String} status 상태 코드와 정보를 담은 문자열
   * @param {*} game 실제로 보내야할 정보
   */
  function sendIt(status, game) {
    /*// sendIt 함수 정의
            res.writeHead(200, { "Content-Type": "application/json" }); // 헤더 설정
            res.write(JSON.stringify({ status, game })); // status와 game을 JSON형식으로 변환하여 보냄
            res.end(); // 응답 종료*/
    return [`${status.split(" ")[0]}`, JSON.stringify({ status, game })];
  }
  // 게임방 찾을때 사용되는 라우터 등록
  console.log(query); // 쿼리 확인
  if (query.gameId != undefined) {
    // 쿼리에 gameId가 존재하는 경우
    console.log("exist"); // 존재한다고 출력
    const gameId = query.gameId; // gameId에 쿼리의 gameId를 저장
    try {
      const data = fs.readFileSync(path.resolve(publicPath, "../data/game.json")).toString();
      // game.json을 읽어옴
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      game.games.forEach((game) => {
        // game.games의 각각의 game에 대하여 아래 코드 실행
        if (game.gameId === gameId) {
          // game.gameId가 gameId와 같은 경우
          console.log("exist"); // 존재한다고 출력
          return sendIt(`200 OK`, game); // 200 OK와 game을 보냄
          return; // 함수 종료
        }
      });
      // 존재하지 않는 경우 (위에서 존재하는 경우 함수를 종료시켰기 때문에 이 코드는 존재하지 않는 경우에만 실행됨)
      return sendIt(`404 Not Found`, err); // 404 Not Found와 null을 보냄
    } catch (err) {
      console.log(err);
      return sendIt(`500 Internal Server Error`, err);
    }
  } else {
    try {
      const data = fs.readFileSync(path.resolve(publicPath, "../data/game.json")).toString();
      // game.json을 읽어옴
      // if (err) throw err; // 오류 발생시 오류 출력
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      if (game.games.length === 0) {
        // game.games의 길이가 0인 경우
        return sendIt(`404 Not Found`, null); // 404 Not Found와 null을 보냄
        return; // 함수 종료
      } else {
        // game.games의 길이가 0이 아닌 경우
        return sendIt(`205 Reset Content`, game.games); // 205 Reset Content와 game.games를 보냄
      }
    } catch (err) {
      console.log(err);
      return sendIt(`500 Internal Server Error`, err);
    }
  }
}

module.exports = find;

/*
  // 게임방 찾을때 사용되는 라우터 등록
  console.log(req.query); // 쿼리 확인
  if (req.query.gameId != undefined) {
    // 쿼리에 gameId가 존재하는 경우
    console.log("exist"); // 존재한다고 출력
    const gameId = req.query.gameId; // gameId에 쿼리의 gameId를 저장
    fs.readFile(path.resolve(publicPath, "../data/game.json"), (err, data) => {
      // game.json을 읽어옴
      if (err) throw err; // 오류 발생시 오류 출력
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      game.games.forEach((game) => {
        // game.games의 각각의 game에 대하여 아래 코드 실행
        if (game.gameId === gameId) {
          // game.gameId가 gameId와 같은 경우
          console.log("exist"); // 존재한다고 출력
          sendIt(`200 OK`, game); // 200 OK와 game을 보냄
          return; // 함수 종료
        }
      });
      // 존재하지 않는 경우 (위에서 존재하는 경우 함수를 종료시켰기 때문에 이 코드는 존재하지 않는 경우에만 실행됨)
      sendIt(`404 Not Found`, null); // 404 Not Found와 null을 보냄
      /**
       *
       * @param {String} status 상태 코드와 정보를 담은 문자열
       * @param {*} game 실제로 보내야할 정보
       *//*
      function sendIt(status, game) {
        // sendIt 함수 정의
        res.writeHead(200, { "Content-Type": "application/json" }); // 헤더 설정
        res.write(JSON.stringify({ status, game })); // status와 game을 JSON형식으로 변환하여 보냄
        res.end(); // 응답 종료
      }
    });
  } else {
    fs.readFile(path.resolve(publicPath, "../data/game.json"), (err, data) => {
      // game.json을 읽어옴
      if (err) throw err; // 오류 발생시 오류 출력
      const game = JSON.parse(data); // game.json을 JSON형식으로 파싱하여 game 변수에 저장
      console.log(game); // game 변수 출력
      if (game.games.length === 0) {
        // game.games의 길이가 0인 경우
        sendIt(`404 Not Found`, null); // 404 Not Found와 null을 보냄
        return; // 함수 종료
      } else {
        // game.games의 길이가 0이 아닌 경우
        sendIt(`205 Reset Content`, game.games); // 205 Reset Content와 game.games를 보냄
      }
      function sendIt(status, game) {
        // sendIt 함수 정의
        res.writeHead(200, { "Content-Type": "application/json" }); // 헤더 설정
        res.write(JSON.stringify({ status, game })); // status와 game을 JSON형식으로 변환하여 보냄
        res.end(); // 응답 종료
      }
    });
  }
*/