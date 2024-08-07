// Change Status
const statusButtons = document.querySelectorAll("[status-button]");
if (statusButtons.length > 0) {
    let url = new URL(window.location.href);
    statusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const statusValue = button.getAttribute('status-button')
            console.log(statusValue);
            if (statusValue)
                url.searchParams.set('status', statusValue);
            else
                url.searchParams.delete('status');

            window.location.href = url.href;
        });
    });
}

//Detele Record
const buttonDeleteRecord = document.querySelectorAll("[button-delete-record")
if(buttonDeleteRecord.length > 0) {
    buttonDeleteRecord.forEach(button => { 
        button.addEventListener("click", () => {
            isConfirmDeleteRecord= confirm("Are you sure you want to delete it?");
            if(isConfirmDeleteRecord){
                const formDeleteRecord = document.querySelector("[form-delete-record]");
                console.log(formDeleteRecord);

                const dataPath = formDeleteRecord.getAttribute("data-path");
                const dataId = button.getAttribute("data-id");
                const action =  `${dataPath}/${dataId}?_method=DELETE`;
                formDeleteRecord.setAttribute("action", action);
                formDeleteRecord.submit();
            }
        });
    });
}


// Search Products----------------------------------------------------------------------------------------------------------------
const formSearch = document.querySelector("#form-search");
if(formSearch){
    formSearch.addEventListener('submit', (event) => {
        event.preventDefault();
        let url = new URL(window.location.href)
        const keyword = event.target.elements.keyword.value;
        if (keyword)
            url.searchParams.set('keyword', keyword);
        else
            url.searchParams.delete('keyword');
    
        window.location.href = url.href;
    });
}

// Pagination  ----------------------------------------------------------------------------------------------------------------
const pageList = document.querySelectorAll('.page-link');
if (pageList.length > 0) {
    pageList.forEach(page => {
        page.addEventListener("click", (e) => {
            e.preventDefault();
            let url = new URL(window.location.href);
            url.searchParams.set('page', page.getAttribute('page'));
            window.location.href = url.href;
        });
    });
}

//Change Multi  ----------------------------------------------------------------------------------------------------------------
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const checkboxAll = checkboxMulti.querySelector("input[name=checkAll]");
    const checkboxId = checkboxMulti.querySelectorAll("input[name=id]");
    checkboxAll.addEventListener("change", () => {
        checkboxId.forEach(checkbox => {
            checkbox.checked = checkboxAll.checked;
        });
    });
    checkboxId.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
            const checkTrue = checkboxMulti.querySelectorAll("input[name=id]:checked");
            if (checkTrue.length === checkboxId.length)
                checkboxAll.checked = true;
            else
                checkboxAll.checked = false;
        });
    });
}

//Form Change Multi  ----------------------------------------------------------------------------------------------------------------
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const trueCheckbox = checkboxMulti.querySelectorAll("input[name=id]:checked");
        if (trueCheckbox.length > 0) {

            const typeChange = event.target.elements.type.value;
            // Confirm Delete
            if (typeChange == "delete") {
                const isConfirm = confirm(`Are you sure you want to delete`);
                if (!isConfirm) return;
            }

            let ids = [];
            //Change Position
            if(typeChange == "change-position"){
                trueCheckbox.forEach(input => {
                    const position = input.closest("tr").querySelector("input[name=position]");
                    ids.push(`${input.value}-${position.value}`);
                });
            }
            else{
                trueCheckbox.forEach(input => {
                ids.push(input.value);
            });
            }
            

            const inputIds = formChangeMulti.querySelector("input[name=ids]");
            inputIds.value = ids.join(',');
            formChangeMulti.submit();
        }else
            alert("Please select at least one item.");
    });
}

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

//Prevew Images

const formUpload = document.querySelector("[form-upload]");
if(formUpload){
    const inputUpload = formUpload.querySelector("[input-upload]");
    const previewImages = formUpload.querySelector("[preview-upload]");
    inputUpload.addEventListener("change", () => {
        const [file] = inputUpload.files
        if (file) {
            previewImages.src = URL.createObjectURL(file)
        }
        console.log(previewImages);

    });
}

// Sorting --------------------------------------------------------------------------------------------------------------------
const sort = document.querySelector("[sort]");
if(sort){
    let url = new URL(window.location.href);
    const selectSort = sort.querySelector("[select-sort]");
        selectSort.addEventListener("change", () => {
            const sorting = selectSort.value;
            if (sorting)
                url.searchParams.set('sorting', sorting);
            else
                url.searchParams.delete('sorting');
        
            window.location.href = url.href;
        });
    const buttonReset = sort.querySelector("[button-reset]");
    buttonReset.addEventListener("click", () => {
        url.searchParams.delete('sorting');
        window.location.href = url.href;
    });
    const optionSort = selectSort.querySelector(`option[value=${url.searchParams.get('sorting')}]`);
    if(optionSort)
        optionSort.selected = true;
}



