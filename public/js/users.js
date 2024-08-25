const socket = io();
// ADD FRIEND
const addFrinendButtons = document.querySelectorAll("[add-button]");
if(addFrinendButtons.length > 0)
    addFrinendButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("my-id");
            socket.emit("CLIENT_ADD_FRIEND", userId);
            button.classList.toggle("d-none");
            const cancelButton = document.querySelector(`button[cancel-button][my-id="${userId}"]`);
            cancelButton.classList.toggle("d-none");
        })
    });

// CANCEL REQUEST

const cancelRequestButtons = document.querySelectorAll("[cancel-button]");
if(cancelRequestButtons.length > 0)
    cancelRequestButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("my-id");
            socket.emit("CLIENT_CANCEL_REQUEST", userId);
            button.classList.toggle("d-none");
            const addButton = document.querySelector(`button[add-button][my-id="${userId}"]`);
            addButton.classList.toggle("d-none");
        })
    });

// Friend Request
const acceptButtons = document.querySelectorAll("[accept-button]");
if(acceptButtons.length > 0){
    acceptButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("data-user-id");
            socket.emit("CLIENT_ACCEPT_REQUEST", userId);
            button.classList.toggle("d-none");
            const rejectButton = document.querySelector(`button[decline-button][data-user-id="${userId}"]`);
            rejectButton.classList.toggle("d-none");
            const acceptedButton = document.querySelector(`[accepted-button][data-user-id="${userId}"]`);
            acceptedButton.classList.toggle("d-none");
        });
    });
}

//Delete Request
const deleteRequest = document.querySelectorAll("[decline-button]");

if(deleteRequest.length > 0){
    deleteRequest.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("data-user-id");
            socket.emit("CLIENT_DELETE_REQUEST", userId);
            const boxUser = document.querySelector(`[box-user][data-user-id="${userId}"]`);
            boxUser.remove();
        });
    });
}