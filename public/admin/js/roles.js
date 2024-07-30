// Permission
const buttonPermission = document.querySelector("[button-permission]");
if(buttonPermission){
    buttonPermission.addEventListener("click", () => {
        const tablePermission = document.querySelector("[table-permission]");
        if(tablePermission){
            const rows = tablePermission.querySelectorAll("[data-name]");
            let permission = [];
            if(rows.length > 0){
                rows.forEach(row => {
                    const name =row.getAttribute("data-name");
                    if(name == 'id'){
                        const inputs = row.querySelectorAll('input');
                        inputs.forEach((input, index) => {
                            permission.push({
                                id: input.value,
                                permission: [],
                            });
                        });
                    }  
                    else{
                        const inputs = row.querySelectorAll('input');
                        inputs.forEach((input, index) => {
                            if(input.checked){
                                permission[index].permission.push(name);
                            }
                        });
                    }
                });
            }
            const formPermission = document.querySelector("[form-permission]");
            if(formPermission){
                const input = formPermission.querySelector("input");
                input.value = JSON.stringify(permission);
            }
            formPermission.submit();
        }

    });
}

//UPdate checkbox permissions
const dataRecords = document.querySelector("[data-records]");
if(dataRecords){
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    records.forEach((record, index) => {
        record.permissions.forEach(permission =>{
            const row = document.querySelector(`[data-name="${permission}"]`);
            const inputs = row.querySelectorAll("input");
            inputs[index].checked = true;
        });
    });
}