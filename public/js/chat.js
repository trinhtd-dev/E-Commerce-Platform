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
        files: upload.cachedFileArray
      };
          
      socket.emit('CLIENT_SEND_DATA', messageData);
      inputMessage.value = '';
      upload.resetPreviewPanel();
    }
  });

  socket.on("SERVER_SEND_DATA", (message) => {
    const liMessage = document.createElement('li');
    liMessage.classList.add('mb-3');

    if (message.userId === userId) {
      liMessage.classList.add('d-flex', 'justify-content-end');
      liMessage.innerHTML = `
        <div class="message-bubble bg-primary text-white p-2 rounded">
          <p class="mb-0">${message.content}</p>
          ${message.images && message.images.length > 0 ? `
            <div class="message-images mt-2">
              ${message.images.map(image => `<img src="${image}" alt="Image" class="img-fluid rounded" style="max-width: 150px;">`).join('')}
            </div>
          ` : ''}
          <small class="text-light d-block text-right mt-1">${message.time}</small>
        </div>
      `;
    } else {
      liMessage.classList.add('d-flex');
      const avatar = message.userInfo.avatar || 'https://via.placeholder.com/40';
      liMessage.innerHTML = `
        <img class="rounded-circle mr-2" src="${avatar}" alt="${message.userInfo.fullName}" style="width: 40px; height: 40px;">
        <div class="message-content">
          <div class="d-flex align-items-center mb-1">
            <strong class="mr-2">${message.userInfo.fullName}</strong>
            <small class="text-muted">${message.time}</small>
          </div>
          <div class="message-bubble bg-light p-2 rounded">
            <p class="mb-0">${message.content}</p>
            ${message.images && message.images.length > 0 ? `
              <div class="message-images mt-2">
                ${message.images.map(image => `<img src="${image}" alt="Image" class="img-fluid rounded" style="max-width: 150px;">`).join('')}
              </div>
            ` : ''}
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
      divTyping.setAttribute("class", "d-flex mb-3");
      divTyping.setAttribute("userId", user.id);
      divTyping.innerHTML = `
        <img class="rounded-circle mr-2" src="${avatar}" alt="${user.fullName}" style="width: 40px; height: 40px;">
        <div class="message-content">
          <div class="d-flex align-items-center mb-1">
            <strong class="mr-2">${user.fullName}</strong>
          </div>
          <div class="message-bubble bg-light p-2 rounded">
            <div class="typing-indicator">
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
    const inputUpload = document.querySelector("#file-upload-with-preview-my-unique-id");
    inputUpload.click();
    const divUpload = document.querySelector("[file-upload-with-preview");
    if(divUpload){
      divUpload.classList.remove("d-none");
    }
    chatBox.scrollTop = chatBox.scrollHeight;
    const imagePreview = document.querySelector(".image-preview");

  });
}

