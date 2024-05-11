// server.ts
import http from "http";
import { Server, Socket } from "socket.io";
import { app } from "./app";
import auth_controllers from "./controllers/auth";
import { connect } from "./utils/db";

const server: http.Server = http.createServer(app);
export var io: Server = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var socketIds: Set<string> = new Set();

io.on("connection", (socket: Socket) => {
  console.log("USER CONNECTED:", socket.id);
  // socket.emit("livetrading", "User connected to trading page backend");
  socket.on("live-trading", () => {
    socketIds.add(socket.id);
    console.log("User connected to trading page");
    socket.join("live-trading");
  });

  socket.on("createOffer", (data: any) => {
    console.log("createOffer event - data", data);
    try {
      auth_controllers.createOffer(data);
    } catch (e) {
      console.log("error");
      return;
    }
    io.sockets.fetchSockets().then((sockets) => {
      console.log("connected sockets: ", sockets.length);
    });

    io.to("live-trading").emit("offerCreated", data);
    // socketIds.forEach((socketId) => {
    //   io.to(socketId).emit("offerCreated", data);
    // });
  });

  socket.on("acceptOffer", async (data) => {
    console.log("acceptOffer event");
    let inv;
    try {
      inv = await auth_controllers.acceptOffer(data);
      io.to("live-trading").emit("offerAccepted", inv);
      // io.in("live-trading").fetchSockets().then((sockets) => {
      //   console.log("connected sockets in live-trading: ", sockets.length);
      // });
    } catch (e) {
      console.log("error");
      return;
    }
    // socketIds.forEach((socketId) => {
    //   io.to(socketId).emit("offerAccepted", data);
    // });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED:", socket.id);
  });
});

// io.on("livetrading", (socket: Socket) => {
//   console.log("User connected to trading page backend");
//   // socket.join("livetrading");
//   });

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

connect();
