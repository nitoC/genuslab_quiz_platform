// import { io } from "socket.io-client";

// // const config = {
// //   "user-agent": "Custom Ws Client",
// // };

// const domain = "http://localhost:8000/notification-events";

// export const socket = io(domain, {
//   transports: ["websocket"],
//   // withCredentials: true,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
//   auth: {
//     userAgent: "Custom Ws Client",
//   },
// });

// socket.on("connect", () => {
//   console.log(`Connected with session ID: ${socket.id}`); // Unique 20-character ID
// });

// socket.on("disconnect", (reason) => {
//   console.warn("⚠️ Disconnected:", reason);

//   // server forced disconnect - must reconnect manually
//   socket.connect();

//   console.log("Disconnected from server. Handle reconnect or cleanup here.");
// });
