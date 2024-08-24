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