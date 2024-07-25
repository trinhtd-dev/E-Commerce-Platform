// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0 ){
    const formChangeStatus = document.querySelector("[form-change-status]");
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const newsStatus = "active" == button.getAttribute("data-status") ? "inactive" : "active";
            const dataPath = formChangeStatus.getAttribute("data-path");
            const dataId = button.getAttribute("data-id");
            const action =  `${dataPath}/${newsStatus}/${dataId}?_method=PATCH`;
            formChangeStatus.setAttribute("action", action);
            formChangeStatus.submit();
        });
    });
};

// Delete Product
const buttonDeleteProduct = document.querySelectorAll("[button-delete-product")
if(buttonDeleteProduct.length > 0) {
    buttonDeleteProduct.forEach(button => { 
        button.addEventListener("click", () => {
            isConfirmDeleteProduct = confirm("Are you sure you want to delete this product?");
            if(isConfirmDeleteProduct){
                const formDeleteProduct = document.querySelector("[form-delete-product]");
                const dataPath = formDeleteProduct.getAttribute("data-path");
                const dataId = button.getAttribute("data-id");
                const action =  `${dataPath}/${dataId}?_method=DELETE`;
                formDeleteProduct.setAttribute("action", action);
                formDeleteProduct.submit();
            }
            
        });
    });
}

