class Account {
    static #fixedRnd = Math.random();
    static #id = 1;
    /**
     * @param {String} name 
     * @param {Number} balance 
     */
    constructor(name, balance = 1000) {
        this.name = name;
        this.balance = balance;

        //generated random number based on current id
        const rnd_by_id = ((1 + Account.#id) ** Account.#fixedRnd).toString();
        //set the pincode to be to 4 last digits
        this.pincode = rnd_by_id.slice(rnd_by_id.length - 4, rnd_by_id.length)
        //set cardNumber to be a random fixed number (without the pincode)
        this.cardNumber = rnd_by_id.slice(0, rnd_by_id.length - 4).replace(".", "").slice(0, 12)

        Account.#id++;
    }
}