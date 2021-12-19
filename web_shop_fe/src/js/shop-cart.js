let cart = [];

class ShopCart {

    $counterElement = null;
    onShopCartModified = null;

    constructor(selector) {
        cart = JSON.parse(localStorage.getItem('shop-cart')) || [];
        this.$counterElement = document.querySelector(selector);
        this.$counterElement.innerText = this.count;
    }

    get count() {
        return cart.reduce((prev, curr) => prev + curr.quantity, 0);
    }

    async cost() {
        return cart.reduce((prev, curr) => prev + (curr.product.price * curr.quantity), 0);
    }

    get() {
        return cart;
    }

    add (product) {
        const match = cart.find(c => c.product.id === product.id);
        if(!match) {
            cart.push({product: product, quantity: 1});
            this.saveShopCart();
        } else {
            this.changeQuantity(match, +1);
        }
    }

    changeQuantity (cartItem, amount = +1) {
        const match = cart.find(c => c.product.id === cartItem.product.id);
        if(match) {
            const result = match.quantity - -amount;
            match.quantity = result < 0 ? 0 : result;
        }
        this.saveShopCart();

        return match;
    }    

    remove (product) {
        const match = cart.findIndex(c => c.product.id === product.id);
        if(match) {
            cart.splice(match, 1);
        }
        this.saveShopCart();
    }
    
    clear () {
        cart = [];
        this.saveShopCart();
    }

    saveShopCart() {
        console.info('Shop cart saved!', cart)
        localStorage.setItem('shop-cart', JSON.stringify(cart));
        this.$counterElement.innerText = this.count;
    }
}

export default ShopCart;