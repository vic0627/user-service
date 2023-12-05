const socket = io();

socket.on("reload", () => {
  console.log("Reloading...");
  location.reload();
});
