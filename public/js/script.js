//Alert --------------------------------------------------------------------------------------------------------------------
const alertSuccess = document.querySelector("[alert-message]")
if(alertSuccess){
    setTimeout(() => {
        alertSuccess.classList.add("alert-hidden");
    
    }, parseInt(alertSuccess.getAttribute("data-time")));
    const buttonClose = document.querySelector("[close-alert]");
    buttonClose.addEventListener("click", () => {
        alertSuccess.classList.add("alert-hidden");
    });   
}
