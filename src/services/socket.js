import io from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_NOTIFICATION_SERVER || "http://localhost:3001";
let socket = null;
const accessToken = localStorage.getItem("access_token");
export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token: `Bearer ${accessToken}` },
      query: { userId },
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Connected to notification server");
      socket.emit("join", userId);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from notification server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    } );
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return socket;
};

export const isSocketInitialized = () => !!socket;
