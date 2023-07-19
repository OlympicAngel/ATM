
//#region update gui time
function updateTimer() { timeView.innerText = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) }
setInterval(updateTimer, 1000);
updateTimer();
//#endregion

/** @type {Account[]} */
const users = [];
users.push(new Account("Almog BZ", 1000))
users.push(new Account("Noam Adari", 200))
users.push(new Account("Emma Snow", 800))
users.push(new Account("Anton Chekov", 69))
users.push(new Account("Beni Bad Boy", 69))


/**
 * Creates credit card html view as div
 * @param {Account} account 
 * @returns {HTMLDivElement}
 */
function createCardHTML(account) {
    const el = document.createElement("div")
    el.className = "ccView flex";
    el.innerHTML = `<div class="space"></div>
        <label class="number">${account.cardNumber.slice(0, 4) + " " + account.cardNumber.slice(4, 8) + " " + account.cardNumber.slice(8, 12)}</label>
        <label class="name" pin="${account.pincode}">${account.name}</label>`;
    return el;
}

//load cards according to all users
function loadCardsView() {
    const cardsDiv = document.querySelector("#creditCardList");
    cardsDiv.innerHTML = ""; //empty div
    //for each user generate a card div
    users.forEach(acc => {
        const el = createCardHTML(acc)
        el.addEventListener("click", loadLoginScreen.bind(null, acc.cardNumber, "cardNumber"))
        cardsDiv.appendChild(el)
    });
}
loadCardsView();

/** @type {Account} stores the current logged in user*/
let currentUser;
/**
 * searches for an account by files / value
 * @param {String} searchTerm 
 * @param {String} field 
 */
function loadLoginScreen(searchTerm, field = "name") {
    const user = users.find(acc => acc[field]?.toLowerCase() == searchTerm.toLowerCase());
    if (user) {
        //sets current user fo later use
        currentUser = user;
        //changes the screen to pin code input
        pincode_screen.click();
    }
    else {
        alert(`Could not found a user with ${field.toUpperCase()} of - ${searchTerm.toUpperCase()}`)
    }

}

//triggers when loading pincode screen
function onPincodeScreenLoad() {
    //update greeting name
    document.querySelector("#pincode_screen + .screen #namePlaceholder").innerText = currentUser.name.toUpperCase()
    //copy & replace credit card view
    const ccViewPincode = document.querySelector("#ccViewPincode");
    const newCradView = createCardHTML(currentUser);
    newCradView.setAttribute("style", ccViewPincode.getAttribute("style"));
    newCradView.id = "namePlaceholder"
    ccViewPincode.replaceWith(newCradView)
}

// indicates id currently a user is logged in - used to block onkeys event when not needded
let loggedIn = false;

function verifyPincode(code) {
    const isCorrectPincode = code == currentUser.pincode;
    if (!isCorrectPincode)
        return alert("Wrong pincode!!\n(Hint: the code is shown on bottom right on the credit card)")

    document.querySelector("#menu_screen").click();

}