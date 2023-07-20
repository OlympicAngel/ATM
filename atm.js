
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
let currentUser = users[0];
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
    document.querySelector("#pincode_screen + .screen #namePlaceholder").innerText = currentUser.name.toUpperCase();
    document.querySelector(".header .displayName").innerText = "Hello " + currentUser.name;
    //copy & replace credit card view
    const ccViewPincode = document.querySelector("#ccViewPincode");
    const newCradView = createCardHTML(currentUser);
    newCradView.setAttribute("style", ccViewPincode.getAttribute("style"));
    newCradView.id = "namePlaceholder"
    ccViewPincode.replaceWith(newCradView)
}


/** on user enter pincode */
function verifyPincode(code) {
    const isCorrectPincode = code == currentUser.pincode;
    if (!isCorrectPincode)
        return alert("Wrong pincode!!\n(Hint: the code is shown on bottom right on the credit card)")

    //on good login
    document.querySelector("#menu_screen").click();
    atmShow("home")
}

//indicates if key down events will trigger binds
let allowKeybinds = false;
function atmShow(page) {
    allowKeybinds = false;
    //clear current style
    document.querySelectorAll(`.atmNav label`).forEach(label => label.classList.remove("current"))
    //add style to current
    document.querySelector(`[onclick="atmShow('${page}')"]`)?.classList.add("current")
    switch (page) {
        case "home":
            allowKeybinds = true;
            document.querySelector(".dynContent").innerHTML = `
            <h2>ATM MENU:</h2>
            <p>To interact with the ATM you can click on the menu above, OR press user shortcuts on your keyboard:</p>
            <h4>Shortcuts Cheat-Sheet:</h4>
            <ul>
                <li><strong>D</strong> - to deposit money.</li>
                <li><strong>W</strong> - to withdraw money.</li>
                <li><strong>C</strong> - to check current balance.</li>
                <li><strong>P</strong> - to change account pincode.</li>
                <li><strong>Q</strong> - to quit back to main menu.</li>
            </ul>`
            break;

    }
    allowKeybinds = true;
}
document.addEventListener("keydown",
    /** @param {KeyboardEvent} e */
    (e) => {
        if (!allowKeybinds)
            return;

        switch (e.key) {
            case "d":
                atmShow("deposit")
                break;
            case "w":
                atmShow("withdraw")
                break;
            case "c":
                atmShow("check")
                break;
            case "p":
                atmShow("pincode")
                break;
            case "q":
                atmShow("quit")
                break;
        }
    })