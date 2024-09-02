const formCreateGroup = document.getElementById('formCreateGroup');
const alertMessage = document.querySelector('.custom-alert');
const buttonCreateGroup = formCreateGroup.querySelector('button[type="submit"]');
buttonCreateGroup.addEventListener('click', (event) => {
    event.preventDefault();
    const title = formCreateGroup.querySelector('input[name="title"]').value;
    const checkboxes = formCreateGroup.querySelectorAll('input[name="participants"]');
    const participants = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    if(!participants || participants.length < 2) {
        return;
    }
    formCreateGroup.submit();
   
});