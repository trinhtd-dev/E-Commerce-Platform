const socket = io();

const form = document.querySelector("[form-chat]");
const input = form.querySelector('input');
if(form){
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('CLIENT_SEND_DATA', input.value);
      input.value = '';
    }
  });
  
  socket.on("SERVER_SEND_DATA", (message) => {
    const listMessage = document.querySelector("[list-message]");
    const liMessage = document.createElement("li");
    liMessage.classList.add("list-group-item");
    const userId = form.getAttribute("my-id");
  
    if (message.userId === userId) {
      liMessage.classList.add("text-right", "bg-light", "rounded");
      liMessage.innerHTML = `
        <div class="d-flex justify-content-end">
          <p class="mb-0 font-weight-normal">${message.content}</p>
          <small class="text-muted ml-2 mt-1">${message.time}</small>
        </div>
      `;
    } else {
      const avatar = message.userInfo.avatar || "https://via.placeholder.com/40";
      liMessage.innerHTML = `
        <div class="d-flex align-items-start">
          <img class="rounded-circle" src="${avatar}" alt="${message.userInfo.fullName}" style="width: 40px; height: 40px; margin-right: 10px;">
          <div class="ml-3 d-flex flex-column rounded">
            <div class="d-flex justify-content">
              <p class="font-weight-bold mb-0">${message.userInfo.fullName}</p>
              <small class="text-muted ml-2">${message.time}</small>
            </div>
            <p class="mb-0 font-weight-normal mt-2">${message.content}</p>
          </div>
        </div>
      `;
    }
  
    listMessage.appendChild(liMessage);
    liMessage.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống dưới cùng
  });
}
