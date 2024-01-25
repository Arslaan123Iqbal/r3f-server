import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

const PORT = process.env.PORT || 3001;

io.listen(PORT);

function generateRandomPostion() {
  return [Math.random() * 3, 0, Math.random() * 3];
}

function generateRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
const characters = [];
io.on("connection", (socket) => {
  console.log("coneceted use");

  characters.push({
    id: socket.id,
    position: generateRandomPostion(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("Hello");

  io.emit("characters", characters);

  socket.on("move", (position)=> {
    const character = characters.find((character)=> character.id === socket.id);
    character.position = position;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected user");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );

    io.emit("characters", characters);
  });
});
