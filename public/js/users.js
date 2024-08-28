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
    const userId = button.getAttribute("my-id");
    socket.emit("CLIENT_UNFRIEND", userId);
    button.classList.toggle("d-none");
    const friendButton = document.querySelector(`span[friend-button][data-user-id="${userId}"]`);
    if (friendButton) friendButton.classList.toggle("d-none");
    const addButton = document.querySelector(`button[add-button][my-id="${userId}"]`);
    if (addButton) addButton.classList.toggle("d-none");
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
const unfriendButtons = document.querySelectorAll("[unfriend-button]");
unfriendButtons.forEach(button => {
    button.addEventListener("click", () => handleUnfriend(button));
});

// Xử lý sự kiện từ server khi thêm bạn
socket.on("SERVER_ADD_FRIEND", (user, userId) => {
    const myId = document.querySelector("div[my-id]").getAttribute("my-id");
    if (myId == userId) {
        const boxFriendRequest = document.querySelector("[box-friend-request]");
        if (boxFriendRequest) {
            const divFriendRequest = document.createElement("div");
            divFriendRequest.classList.add("col-12", "col-md-6", "col-lg-3", "mb-4");
            divFriendRequest.setAttribute("box-user", "");
            divFriendRequest.setAttribute("data-user-id", user._id);
            divFriendRequest.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <img class="rounded-circle" src="${user.avatar}" alt="Profile picture" style="width: 50px; height: 50px;">
                            <div class="ml-3">
                                <h5 class="mb-0">${user.fullName}</h5>
                                <p class="text-muted mb-0">2 tuần</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-around mt-3">
                            <button class="btn btn-success border" accept-button data-user-id="${user._id}">Accept</button>
                            <button class="btn btn-danger border" decline-button data-user-id="${user._id}">Delete</button>
                            <span class="accepted-message text-success font-weight-bold border border-success rounded p-2 d-none" accepted-button data-user-id="${user._id}">Accepted</span>
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