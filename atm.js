
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
    document.querySelector(`[onclick="atmShow('${page}')"]`)?.classList.add("current");

    const container = document.querySelector(".dynContent");
    switch (page) {
        case "home":
            allowKeybinds = true;
            container.innerHTML = `
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

        case "deposit":
            container.innerHTML = `
            <div class="flex breakMobile">
                <div>
                    <h2><i class="fa-solid fa-money-bills"></i> Deposit:</h2>
                    <p>You may deposit here money into your account,<br>
                    <strong>Notice:</strong> you can only deposit bills of <strong>20 / 50 / 100 / 200<strong>.</p>
                </div>
                <form id="depositForm" onsubmit="event.preventDefault(); atmDeposit(depositValue.value)">
                    <p>How much would you like to Deposit?</p>
                    <input id="depositValue" required placeholder="20 / 50 / 100 / 200 ...">
                    <button>Deposit</button>
                </form>
            </div>`
            break;

        case "withdraw":
            container.innerHTML = `
            <div class="flex breakMobile">
                <div>
                    <h2><i class="fa-solid fa-money-bill-transfer"></i> Withdraw:</h2>
                    <p>You may deposit here money into your account,<br>
                    <strong>Notice:</strong> you can only deposit bills of <strong>20 / 50 / 100 / 200<strong>.</p>
                </div>
                <form id="depositForm" onsubmit="event.preventDefault(); atmDeposit(depositValue.value)">
                    <p>How much would you like to Deposit?</p>
                    <input id="depositValue" required placeholder="20 / 50 / 100 / 200 ...">
                    <button>Deposit</button>
                </form>
            </div>`
            break;
    }
}
document.addEventListener("keydown", (e) => {
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

async function atmDeposit(amount) {
    if (amount <= 0)
        return;
    //check if the amount can be just from 20s
    const multiply20 = amount % 20 == 0;
    //if the amount is more then 50 AND its modulo is 10 then the amount is combination of 1*50 & X*20
    const combinationOf20n50 = amount % 20 == 10 && amount >= 50;
    if (!multiply20 && !combinationOf20n50)
        return alert("You can only deposit amount in bills..\n(using 20 / 50 / 100 / 200)")

    document.getElementById("depositForm").innerHTML = `
    <div style="text-align:center">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-10x"></i>
        <p>Depositing to your account: ${amount.toLocaleString()}$, Please wait...</p>
    </div>`;
    currentUser.balance += amount;
    await sleep(1000);
    atmShow("home")
}

const sleep = async ms => new Promise(res => setTimeout(res, ms))