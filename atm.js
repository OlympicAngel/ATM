
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
    console.log(searchTerm)
    const user = users.find(acc => acc[field]?.toLowerCase() == searchTerm.toLowerCase());
    console.log(user)
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
    newCradView.setAttribute("id", "ccViewPincode")
    ccViewPincode.replaceWith(newCradView)
}


/** on user enter pincode */
function verifyPincode(code) {
    const isCorrectPincode = code == currentUser.pincode;
    if (!isCorrectPincode)
        return alert("Wrong pincode!!\n(Hint: the code is shown on bottom right on the credit card)")

    document.getElementById("pincode").value = "";

    //on good login
    document.querySelector("#menu_screen").click();
    atmShow("home")
}

//indicates if key down events will trigger binds
let allowKeybinds = false;
function atmShow(page) {
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
             <h2><i class="fa-solid fa-money-bills"></i> Deposit:</h2>
               <div class="flex mobileBreak">
                    <p>You may deposit here money into your account,<br>
                    <strong>Notice:</strong> you can only deposit bills of <strong>20₪ / 50₪ / 100₪ / 200₪</strong>.</p>
                                    ${createCardHTML(currentUser).outerHTML}

                </div>
                <form id="depositForm" onsubmit="event.preventDefault(); atmDeposit(depositValue.value)">
                    <h3>How much would you like to Deposit?</h3>
                    <input id="depositValue" required placeholder="20 / 50 / 100 / 200 ...">
                    <button>Deposit</button>
                </form>
            <hr>
            <p style="text-align:center">No hidden fees! no risky staff here.. just you know.. give us your money! we will keep it for you ♥</p>`
            break;

        case "withdraw":
            container.innerHTML = `
            <h2><i class="fa-solid fa-money-bill-transfer"></i> Withdraw:</h2>
            <div class="flex mobileBreak">
                <p>You may withdraw your money into cash!<br>
                No fees, n limits! you just need to have that amount of money..</p>
                  ${createCardHTML(currentUser).outerHTML}
            </div>
            <h3>Choose withdrawal amount:</h3>
            <div class="flex mobileBreak warp" id="withdrawOptions">
                <button onclick="atmWithdraw(50)">50₪</button>
                <button onclick="atmWithdraw(100)">100₪</button>
                <button onclick="atmWithdraw(150)">150₪</button>
                <button onclick="atmWithdraw(300)">300₪</button>
                <form id="withdrawForm" onsubmit="event.preventDefault(); atmWithdraw(~~withdrawValue.value)">
                    <input id="withdrawValue" min=0 type="number" required placeholder="Custom ₪ amount..">
                    <button>Withdraw</button>
                </form>
            </div>`
            break;

        case "check":
            container.innerHTML = `
            <h2><i class="fa-solid fa-money-bill-trend-up"></i> Balance Check:</h2>
                <p>Your current balance stands on:</p>
                <div class="currentBalance">${currentUser.balance.toLocaleString()}₪</div>`
            break;

        case "pincode":
            container.innerHTML = `
            <h2><i class="fa-solid fa-lock"></i> Change Pincode:</h2>
            <div class="flex mobileBreak">
                <p>You may change your pincode here,<br>
                Notice! this pincode will serve your for later use, please do remember it!</p>
                  ${createCardHTML(currentUser).outerHTML}
            </div>
            <h3>Change pincode form:</h3>
            <form class="flex halfGap" id="changePincodeForm" onsubmit="event.preventDefault(); atmPincodeChange()">
                <div class="flex warp mobileBreak">
                    <div>
                        <label for="changePin_current">Current Pincode:</label>
                        <input id="changePin_current" type="password" required minlength="4" pattern="^([0-9]){4}" title="4 letters & numbers ONLY." maxlength="4" alt="sdf" placeholder="****"/>
                    </div>
                    <div>
                        <div>
                            <label for="changePin_new">New Pincode:</label>
                            <input id="changePin_new" type="password" required minlength="4" pattern="^([0-9]){4}" title="4 letters & numbers ONLY." maxlength="4" placeholder="****"/>
                        </div>
                        <div>
                            <label for="changePin_verify">Verify New Pincode:</label>
                            <input id="changePin_verify" type="password" required minlength="4" pattern="^([0-9]){4}" title="4 letters & numbers ONLY." maxlength="4" placeholder="****"/>
                        </div>
                    </div>
                </div>
               
                <button>Change</button>
            </form>`
            break;

        case "quit":
            allowKeybinds = false; //block binds
            currentUser = null; //remove current
            (async () => {
                document.querySelector(".logoutMsg").style.display = "flex";
                await sleep(2000);
                document.querySelector(".header .displayName").innerText = "Hello Guest"
                login_screen.click() //show login screen
                document.querySelector(".logoutMsg").style.display = "none";

            })()

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

    amount = Number(amount)
    //check if the amount can be just from 20s
    const multiply20 = amount % 20 == 0;
    //if the amount is more then 50 AND its modulo is 10 then the amount is combination of 1*50 & X*20
    const combinationOf20n50 = amount % 20 == 10 && amount >= 50;
    if (!multiply20 && !combinationOf20n50)
        return alert("You can only deposit amount in bills..\n(using 20 / 50 / 100 / 200)")

    allowKeybinds = false;

    document.getElementById("depositForm").innerHTML = `
    <div style="text-align:center">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-10x"></i>
        <p>Depositing to your account: ${amount.toLocaleString()}₪;<br> Please wait...</p>
    </div>`;
    currentUser.balance += amount;
    await sleep(2000);
    atmShow("home")
}

async function atmWithdraw(amount) {
    if (amount <= 0)
        return;

    if (currentUser.balance < amount)
        return alert("You don't have enough in your Balance for this operation!")

    allowKeybinds = false;

    document.getElementById("withdrawOptions").innerHTML = `
    <div style="text-align:center; width:100%">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-10x"></i>
        <p>Withdrawing ${amount.toLocaleString()}₪ from your account,<br> Please wait...</p>
    </div>`;
    currentUser.balance -= amount;
    await sleep(2000);
    atmShow("home")
}

async function atmPincodeChange() {
    const currentPincode = document.querySelector("#changePin_current").value,
        newPincode = document.querySelector("#changePin_new").value,
        nePincodeVerify = document.querySelector("#changePin_verify").value;

    if (currentPincode != currentUser.pincode)
        return alert("Current pincode entered doesn't match for this account!!")

    if (newPincode != nePincodeVerify)
        return alert("New pincode & verify pincode miss-match!")


    allowKeybinds = false;

    document.getElementById("changePincodeForm").innerHTML = `
    <div style="text-align:center; width:100%">
        <i class="fa-solid fa-spinner fa-spin-pulse fa-10x"></i>
        <p>Changing pincode for account - ${currentUser.cardNumber}..</p>
    </div>`;
    currentUser.pincode = newPincode;
    await sleep(2000);
    atmShow("home")

}

const sleep = async ms => new Promise(res => setTimeout(res, ms))