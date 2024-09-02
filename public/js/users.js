const socket = io();

// Hàm xử lý sự kiện thêm bạn
function handleAddFriend(button) {
    const userId = button.getAttribute("my-id");
    socket.emit("CLIENT_ADD_FRIEND", userId);
    button.classList.toggle("d-none");
    const cancelButton = document.querySelector(`button[cancel-button][my-id="${userId}"]`);
    if (cancelButton) cancelButton.classList.toggle("d-none");
    const sentButton = document.querySelector(`[sent-button][data-user-id="${userId}"]`);
    if (sentButton) sentButton.classList.toggle("d-none");
}

// Hàm xử lý sự kiện hủy yêu cầu kết bạn
function handleCancelRequest(button) {
    const userId = button.getAttribute("my-id");
    socket.emit("CLIENT_CANCEL_REQUEST", userId);
    button.classList.toggle("d-none");
    const addButton = document.querySelector(`button[add-button][my-id="${userId}"]`);
    if (addButton) addButton.classList.toggle("d-none");
    const sentButton = document.querySelector(`[sent-button][data-user-id="${userId}"]`);
    if (sentButton) sentButton.classList.toggle("d-none");
}

// Hàm xử lý sự kiện chấp nhận yêu cầu kết bạn
function handleAcceptRequest(button) {
    const userId = button.getAttribute("data-user-id");
    socket.emit("CLIENT_ACCEPT_REQUEST", userId);
    button.classList.toggle("d-none");
    const rejectButton = document.querySelector(`button[decline-button][data-user-id="${userId}"]`);
    if (rejectButton) rejectButton.classList.toggle("d-none");
    const acceptedButton = document.querySelector(`[accepted-button][data-user-id="${userId}"]`);
    if (acceptedButton) acceptedButton.classList.toggle("d-none");
    const lengthFriendRequest = document.querySelector("[friend-request-length]");
        if (lengthFriendRequest) {
            lengthFriendRequest.textContent = lengthFriendRequest.textContent - 1;
        }
}

// Hàm xử lý sự kiện xóa yêu cầu kết bạn
function handleDeleteRequest(button) {
    const userId = button.getAttribute("data-user-id");
    socket.emit("CLIENT_DELETE_REQUEST", userId);
    const boxUser = document.querySelector(`[box-user][data-user-id="${userId}"]`);
    if (boxUser) boxUser.remove();
    const lengthFriendRequest = document.querySelector("[friend-request-length]");
        if (lengthFriendRequest) {
            lengthFriendRequest.textContent = lengthFriendRequest.textContent - 1;
        }
}

// Hàm xử lý sự kiện hủy kết bạn
function handleUnfriend(button) {
    const userId = button.getAttribute("data-user-id");
    socket.emit("CLIENT_UNFRIEND", userId);
    
    const cardBody = button.closest('.card-body');
    if (cardBody) {
        const friendButton = cardBody.querySelector('button[friend-button]');
        const addButton = cardBody.querySelector('button[add-button]');
        
        if (friendButton) friendButton.classList.add('d-none');
        if (addButton) addButton.classList.remove('d-none');
        button.classList.add('d-none');
    }
}

// Thêm sự kiện cho các nút thêm bạn
const addFriendButtons = document.querySelectorAll("[add-button]");
addFriendButtons.forEach(button => {
    button.addEventListener("click", () => handleAddFriend(button));
});

// Thêm sự kiện cho các nút hủy yêu cầu kết bạn
const cancelRequestButtons = document.querySelectorAll("[cancel-button]");
cancelRequestButtons.forEach(button => {
    button.addEventListener("click", () => handleCancelRequest(button));
});

// Thêm sự kiện cho các nút chấp nhận yêu cầu kết bạn
const acceptButtons = document.querySelectorAll("[accept-button]");
acceptButtons.forEach(button => {
    button.addEventListener("click", () => handleAcceptRequest(button));
});

// Thêm sự kiện cho các nút xóa yêu cầu kết bạn
const deleteRequestButtons = document.querySelectorAll("[decline-button]");
deleteRequestButtons.forEach(button => {
    button.addEventListener("click", () => handleDeleteRequest(button));
});

// Thêm sự kiện cho các nút hủy kết bạn
document.addEventListener('DOMContentLoaded', function() {
    const unfriendButtons = document.querySelectorAll("[unfriend-button]");
    unfriendButtons.forEach(button => {
        button.addEventListener("click", () => handleUnfriend(button));
    });
});

// Xử lý sự kiện từ server khi thêm bạn
socket.on("SERVER_ADD_FRIEND", (user, userId) => {
    const myId = document.querySelector("div[my-id]").getAttribute("my-id");
    if (myId == userId) {
        const boxFriendRequest = document.querySelector("[box-friend-request]");
        if (boxFriendRequest) {
            const divFriendRequest = document.createElement("div");
            divFriendRequest.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3", "mb-4");
            divFriendRequest.setAttribute("box-user", "");
            divFriendRequest.setAttribute("data-user-id", user.id);
            divFriendRequest.innerHTML = `
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="position-relative mr-3">
                                <img class="rounded-circle" src="${user.avatar}" alt="${user.fullName}" style="width: 60px; height: 60px; object-fit: cover;">
                                <div class="status-indicator bg-secondary"></div>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="mb-0 font-weight-bold">${user.fullName}</h5>
                            </div>
                        </div>
                        <hr class="my-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-success" accept-button data-user-id="${user.id}">
                                <i class="fas fa-check mr-1"></i>
                                Accept
                            </button>
                            <button class="btn btn-sm btn-outline-danger" decline-button data-user-id="${user.id}">
                                <i class="fas fa-times mr-1"></i>
                                Delete
                            </button>
                            <span class="text-success font-weight-bold d-none" accepted-button data-user-id="${user.id}">
                                <i class="fas fa-user-check mr-1"></i>
                                Accepted
                            </span>
                        </div>
                    </div>
                </div>
            `;
            boxFriendRequest.appendChild(divFriendRequest);

            // Thêm sự kiện cho các nút mới tạo
            const acceptButton = divFriendRequest.querySelector("[accept-button]");
            if (acceptButton) {
                acceptButton.addEventListener("click", () => handleAcceptRequest(acceptButton));
            }
            const deleteRequest = divFriendRequest.querySelector("[decline-button]");
            if (deleteRequest) {
                deleteRequest.addEventListener("click", () => handleDeleteRequest(deleteRequest));
            }
        }
    }
});

// Xử lý sự kiện từ server khi hủy yêu cầu kết bạn
socket.on("SERVER_CANCEL_REQUEST", (user, userId) => {
    const myId = document.querySelector("div[my-id]").getAttribute("my-id");
    if (myId == userId) {
        const boxUser = document.querySelector(`[box-user][data-user-id="${user._id}"]`);
        if (boxUser) boxUser.remove();
    }
});

// Cập nhật số lượng yêu cầu kết bạn
socket.on("SERVER_UPDATE_LENGTH_FRIEND_REQUEST", (userB) => {
    const myId = document.querySelector("div[my-id]").getAttribute("my-id");
    if(userB._id === myId) {
        const lengthFriendRequest = document.querySelector("[friend-request-length]");
        if (lengthFriendRequest) {
            lengthFriendRequest.textContent = userB.friendRequest.length;
        }
    };    
});

// LOGIN
socket.on("SERVER_LOGIN", (userId) => {
    console.log("Login")
    const onlineStatusDiv = document.querySelector(`[online-status][data-user-id="${userId}"]`);
    if(onlineStatusDiv)
        onlineStatusDiv.classList.toggle("d-none");
});

socket.on("SERVER_LOGOUT", (userId) => {
    console.log("Logout")
    const onlineStatusDiv = document.querySelector(`[online-status][data-user-id="${userId}"]`);
    if(onlineStatusDiv)
        onlineStatusDiv.classList.toggle("d-none");
});

// Xử lý sự kiện từ server khi hủy kết bạn
socket.on("SERVER_UNFRIEND", (user, userId) => {
    const myId = document.querySelector("div[my-id]").getAttribute("my-id");
    if (myId == userId) {
        const friendCard = document.querySelector(`[data-user-id="${user._id}"]`);
        if (friendCard) {
            const friendButton = friendCard.querySelector('button[friend-button]');
            const unfriendButton = friendCard.querySelector('button[unfriend-button]');
            const addButton = friendCard.querySelector('button[add-button]');
            
            if (friendButton) friendButton.classList.add('d-none');
            if (unfriendButton) unfriendButton.classList.add('d-none');
            if (addButton) addButton.classList.remove('d-none');
        }
    }
});
