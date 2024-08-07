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




//update Quantity Product In Cart--------------------------------------------------------------------------------------------------------------------
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if(inputQuantity.length > 0){
    inputQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const formQuantity = e.target.parentElement.parentElement;
            formQuantity.submit();
        });
    });
}

//dec-button and inc-button--------------------------------------------------------------------------------------------------------------------
const decButton = document.querySelectorAll("[dec-button]");
const incButton = document.querySelectorAll("[inc-button]");
if(decButton.length > 0){
    decButton.forEach(button => {
        button.addEventListener("click", (e) => {
            const inputQuantity = e.target.parentElement.parentElement.querySelector("input[name='quantity']");
            if(inputQuantity.value > 1 ){
                inputQuantity.value = parseInt(inputQuantity.value) - 1;
                const formQuantity = inputQuantity.parentElement.parentElement;
                formQuantity.submit();
            }
        });
    });
}
if(incButton){
    incButton.forEach(button => {
        button.addEventListener("click", (e) => {
            const inputQuantity = e.target.parentElement.parentElement.querySelector("input[name='quantity']");
            inputQuantity.value = parseInt(inputQuantity.value) + 1;
            const formQuantity = inputQuantity.parentElement.parentElement;
            formQuantity.submit();
        });
    });
}

//Checkbox in cart--------------------------------------------------------------------------------------------------------------------
const tableCart = document.querySelector("[table-cart]");
if(tableCart){
    const checkboxAll = tableCart.querySelector("input[name='checkboxAll']");
    const checkboxs = tableCart.querySelectorAll("input[name='checkbox']");
    checkboxAll.addEventListener("change", (e) => {
        checkboxs.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
    checkboxs.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const checked = Array.from(checkboxs).filter(item => item.checked);
            checkboxAll.checked = checked.length === checkboxs.length;
        });
    });
}
