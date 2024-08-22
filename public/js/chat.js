const socket = io();

const form = document.querySelector("[form-chat]");
const chatBox = document.querySelector('.chat-box');
const listMessage = document.querySelector("[list-message]");
const boxTyping = document.querySelector("[box-typing]");
const emojiPicker = document.querySelector('#emoji-picker');

if (form) {
  const inputMessage = form.querySelector('input[name="message"]');
  const userId = form.getAttribute("my-id");

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (inputMessage.value || upload.cachedFileArray.length > 0) {
      const messageData = {
        message: inputMessage.value,
        userId: userId,
        files: []
      };

      // Chuyển đổi các tệp thành base64
      upload.cachedFileArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          messageData.files.push({
            name: file.name,
            type: file.type,
            data: event.target.result
          });

          // Kiểm tra nếu tất cả các tệp đã được chuyển đổi
          if (messageData.files.length === upload.cachedFileArray.length) {
            socket.emit('CLIENT_SEND_DATA', messageData);
            inputMessage.value = '';
            upload.resetPreviewPanel();
          }
        };
        reader.readAsDataURL(file);
      });

      // Nếu không có tệp, gửi tin nhắn ngay lập tức
      if (upload.cachedFileArray.length === 0) {
        socket.emit('CLIENT_SEND_DATA', messageData);
        inputMessage.value = '';
      }
    }
  });

  socket.on("SERVER_SEND_DATA", (message) => {
    const liMessage = document.createElement("li");
    liMessage.classList.add("list-group-item");
  
    if (message.userId === userId) {
      liMessage.classList.add("text-right", "bg-light", "rounded");
      liMessage.innerHTML = `
        <div class="d-flex justify-content-end">
          <p class="mb-0 font-weight-normal">${message.content}</p>
        </div>
        <small class="text-muted ml-2 mt-1">${message.time}</small>
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
            ${message.files.map(file => `<img src="${file.data}" alt="${file.name}" style="max-width: 100%;">`).join('')}
          </div>
        </div>
      `;
    }
  
    listMessage.appendChild(liMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Xóa thông báo "đang gõ"
    const divTyping = boxTyping.querySelector(`[userId="${message.userInfo.userId}"]`);
    if (divTyping) {
      divTyping.remove();
    }
  });

  // Scroll to the bottom of the chat box when the page loads
  document.addEventListener("DOMContentLoaded", function() {
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  // Emoji picker functionality
  if (emojiPicker) {
    const emojiButton = document.querySelector("[emoji-button]");
    emojiButton.addEventListener('click', () => {
      emojiPicker.classList.toggle("d-none");
    });

    emojiPicker.addEventListener('emoji-click', event => {
      inputMessage.value += event.detail.unicode;
      inputMessage.focus();
    });
  }

  // Typing indicator
  if (boxTyping) {
    inputMessage.addEventListener('input', () => {
      socket.emit('CLIENT_TYPING', userId);
    });

    socket.on('SERVER_TYPING', (user) => {
      if (boxTyping.querySelector(`[userId="${user.id}"]`)) {
        return;
      }
      const divTyping = document.createElement('div');
      const avatar = user.avatar || "https://via.placeholder.com/40";
      divTyping.setAttribute("class", "bg-light rounded");
      divTyping.setAttribute("userId", user.id);
      divTyping.innerHTML = `
        <div class="d-flex align-items-start">
          <img class="rounded-circle" src="${avatar}" alt="${user.fullName}" style="width: 40px; height: 40px; margin-right: 10px;">
          <div class="ml-3 d-flex flex-column rounded">
            <div class="d-flex justify-content">
              <p class="font-weight-bold mb-0">${user.fullName}</p>
            </div>
            <div class="typing-indicator mb-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;
      boxTyping.appendChild(divTyping);

      var timeOut 
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        const divTyping = boxTyping.querySelector(`[userId="${user.id}"]`);
        if (divTyping) {
          divTyping.remove();
        }
      }, 2000);

    });
  }
}

//File upload with preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('my-unique-id', {
  multiple: true,
  accept: 'image/*',
  maxFileSize: 5 * 1024 * 1024, // 5MB
});
const uploadButton = document.querySelector("[upload-button]");
if(uploadButton) {
  uploadButton.addEventListener('click', () => {
    const divUpload = document.querySelector("[file-upload-with-preview");
    if(divUpload){
      divUpload.classList.toggle("d-none");
    }
    chatBox.scrollTop = chatBox.scrollHeight;

  });
}