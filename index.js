const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { createProxyMiddleware } = require("http-proxy-middleware");

// 모든 도메인에게 서버에 요정 및 응답을 받을 수 있도록 해주는 기능
app.use(cors());

// app.use(
//   createProxyMiddleware({
//     // proxy할 주소, 즉, 백단의 주소를 적어줍니다.
//     target: "http://localhost:9999",
//     changeOrigin: true,
//   })
// );

// const path = __dirname + "../client/index.html";
// app.use(express.static(path));

// 서버 생성 - 변수에 담아주는 이유 ?
// http.createServer() 메소드가 생성후 객체를 리턴하기 때문
// 제어를 위해서 server 변수에 담아준다 !
const server = http.createServer(app);

// 소켓을 전달 받을 서버 객체 설정
const io = new Server(server, {
  cors: {
    // // cose 정책에 따라 해당 서버 접근 허용
    origin: true,
    credentials: true,
    methods: ["GET", "POST"], // 요청방식
  },
});

// 연결 io 생성
io.on("connection", (socket) => {
  console.log(socket.id);

  // 서버에서 받아온 소켓의 값(roon no)을 읽어오는 코드 !
  socket.on("room", (data) => {
    console.log(data);
    // 소켓에게 입력한 데이터값 전달.
    // 같은 룸으로 채팅방 참여
    socket.join(data);
  });

  // 서버에서 받아온 소켓의 값을 읽어오기 !
  // -> 전달한 메세지 읽어오기
  socket.on("message", (data) => {
    console.log(data, "dataaa"); //서버에 전달된것 확인
    // 받아온 메세지를 읽은 후 바로 보내줌
    // console.log(data)
    socket.to(data.room).emit("messageReturn", data);
  });
});

// 포트 생성
const PORT = 9999;

server.listen(PORT, () => {
  console.log("server is running on port : 9999");
});
