// UI variables
let n_ame = document.querySelector('#name')
let locationL = document.querySelector('#location')
let guestForm = document.querySelector("#guest-form")
let submitBtn = document.querySelector('.submit-btn')
let list = document.querySelector('.main-table')
const alert = document.querySelector(".alert");


guestForm.addEventListener('submit', submitData) //submit form
window.addEventListener('DOMContentLoaded', setUpItem) //load item

// list.addEventListener('click', clickList)
// list.addEventListener('click', clickLists)


let element;
let myEditElement1;
let myEditElement2;
let myEditElement3;
let myHold;
let myName;
let myLocation;
let myEditID = "";
let myEditFlag = false;
let myDate;
let months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
]



function submitData(e) {
    e.preventDefault();

    const id = new Date().getTime().toString();
    const day = new Date().getDate();
    const year = new Date().getFullYear()


    myName = n_ame.value;
    myLocation = locationL.value;
    myDate = `${day}-${year}`

    if (myName && myLocation && !myEditFlag) {
        createListItem(id, myName, myLocation, myDate)
        displayAlert("Item added to the list", "success")

        // add to local storage
        addToLocalStorage(id, myName, myLocation, myDate)

        setBackToDefault()

    } else if (myName && myLocation && myEditFlag) {
        myEditElement1.innerHTML = myLocation;
        myEditElement2.innerHTML = myName;
        displayAlert("Value changed", "success")
            // edit local storage
        editLocalStorage(myEditID, myName, myLocation);
        setBackToDefault()
    } else {
        alert.textContent = "Field can't be empty";
        displayAlert('Please enter value', "danger")
    }


}


// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 2000);
}

function addToLocalStorage(id, myName, myLocation) {
    const guest = { id: id, myName: myName, myLocation: myLocation };
    let items = getLocalStorage();
    console.log(items);
    items.push(guest);
    localStorage.setItem('guests', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if (item.id !== id) {
            return item
        }
    })
    localStorage.setItem('guests', JSON.stringify(items))
}

function editLocalStorage(id, myName, myLocation) {
    let items = getLocalStorage();

    items = items.map((item) => {
        if (item.id === id) {
            item.myName = myName;
            item.myLocation = myLocation
        }
        return item;
    });
    localStorage.setItem('guests', JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem('guests') ? JSON.parse(localStorage.getItem('guests')) : []
}

let setBackToDefault = () => {
    n_ame.value = "";
    locationL.value = "";
    myEditFlag = false;
    myEditID = "";
    submitBtn.textContent = "Add Guest"
}


function editItem(e) {
    const element = e.currentTarget.parentElement.previousElementSibling;
    // set edit item
    const elementID = e.currentTarget.parentElement.parentElement;
    myEditElement1 = element.previousElementSibling;
    myEditElement2 = myEditElement1.previousElementSibling;
    myEditElement3 = myEditElement1.nextElementSibling;
    // set form value
    locationL.value = myEditElement1.innerHTML;
    n_ame.value = myEditElement2.innerHTML;
    myEditFlag = true;
    myEditID = elementID.dataset.id;
    submitBtn.textContent = "Edit"


}
let deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id; // get the id
    list.removeChild(element)

    displayAlert("Item removed", 'danger');
    setBackToDefault();
    removeFromLocalStorage(id)
}

function setUpItem() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(item => {
            createListItem(item.id, item.myName, item.myLocation, item.myDate)
        });
    }
}

function createListItem(id, myName, myLocation, myDate) {
    //Create tr element
    element = document.createElement('tr');
    // add id
    let attr = document.createAttribute('data-id')
    attr.value = id;
    element.setAttributeNode(attr)
    element.innerHTML = `
    <td>${myName}</td>
    <td>${myLocation}</td>
    <td>${myDate}</td>
    <td><button type="button" class="update-btn">UPDATE</button></td>
    <td><button type="button" class="delete-btn">DELETE</button></td>
    `
        // accessing the edit-btn class 
    const editBtn = element.querySelector('.update-btn')
    editBtn.addEventListener('click', editItem)

    // accessing the delete-btn class
    const deleteBtn = element.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)

    list.appendChild(element)
}


/*   Event Bubbling
function clickList(e) {
    if (e.target.classList.contains("update-btn")) {
        console.log("update btn clicked");
    }
}

function clickLists(e) {
    if (e.target.classList.contains("delete-btn")) {
        console.log("delete btn clicked");
    }
}

*/