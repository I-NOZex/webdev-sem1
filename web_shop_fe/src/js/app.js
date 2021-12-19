'use strict';

import '../css/colors.css';
import '../css/buttons.css';
import '../css/icons.css';
import '../css/layout.css';

import VanillaSpaEngine from './vanilla-spa-engine.js';
import EventBus from './event-bus.js';
import ShopCart from './shop-cart';

const ShoppingCart = new ShopCart('#cart-counter');

const APP_CONTAINER = document.getElementById('app');
const ENABLE_TEMPLATE_CACHING = false;
const ENABLE_MODEL_CACHING = false;
const BASE_API_URL = 'http://127.0.0.1:8000/api';

let FILTERS = {categories:'', minPrice: '', maxPrice: '', body: '', sizes: ''};
let CATEGORIES = [];

const availableFilters = {
    price: [
        { label: 'Min', id: 'filter-price-min', filterArg: 'price_gte[]=', value: 0},
        { label: 'Max', id: 'filter-price-max', filterArg: 'price_lte[]=', value: 10000},
    ],

    body: [
        { label: 'All', id: 'filter-body-all', filterArg: 'body_has[]=', active: true},
        { label: 'Male', id: 'filter-body-male', filterArg: 'body_has[]=Male', active: false},
        { label: 'Female', id: 'filter-body-female', filterArg: 'body_has[]=Female', active: false},
    ],
    
    sizes: [
        { label: 'All', id: 'filter-sizes-all', filterArg: 'sizes_has[]=', active: true},
        { label: 'Teen', id: 'filter-sizes-teen', filterArg: 'sizes_has[]=Teen', active: false},
        { label: 'S', id: 'filter-sizes-s', filterArg: 'sizes_has[]=S', active: false},
        { label: 'M', id: 'filter-sizes-m', filterArg: 'sizes_has[]=M', active: false},
        { label: 'L', id: 'filter-sizes-l', filterArg: 'sizes_has[]=L', active: false},
        { label: 'XL', id: 'filter-sizes-xl', filterArg: 'sizes_has[]=X', active: false},
    ],
};

const fetchRemoteModel = async(contentUrl, model, ignoreCache = !ENABLE_MODEL_CACHING) => {    
    const absoluteUrl = BASE_API_URL + contentUrl;
    
    if (window.localStorage.getItem(absoluteUrl) !== null && !ignoreCache) {
        console.log(JSON.parse(window.localStorage.getItem(absoluteUrl)))
        return JSON.parse(window.localStorage.getItem(absoluteUrl));
    }
    console.log('fetching remote model')

    return await fetch(absoluteUrl)
    // The API call was successful!
    .then(async (response) => {
        return {[model] : await response.json(), [`${[model]}Headers`]: response.headers}
    })
    .then((json) => {
        window.localStorage.setItem(absoluteUrl, JSON.stringify(json));
        return json;
    })
}

const fetchRemoteModels = async(resources, ignoreCache) => {
    return await Promise.all(
        resources.map(async (curr, idx, a) => (await fetchRemoteModel(curr.contentUrl, curr.model, ignoreCache)))
    ).then(x => x.reduce((acc, val) => {
        return Object.assign(acc, val);
    },{}));
}

const routes = {
    '/' : {
        path: '/',
        template: '/_products-home.html',
        remoteModel: async() => await fetchRemoteModel('/products', 'products'),
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',
            list: [
                {label: 'tiago', title: 'i am tiago', href:'/', linkName: 'back home'},
                {label: 'marques', title: 'tiAGO MArques'},
            ]
        },
    },
    '/products' : {
        path: '/products',
        template: '/_products-list.html',
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',

            filters: availableFilters
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModels([
            {contentUrl:'/products', model:'products'},
            {contentUrl:'/categories', model:'categories'},
        ]).then(models => {
            const {categories, productsHeaders} = models;

            const filterCats = [
                { order: 1, label: 'T-Shirts', active: true, filterArg: 'categories[]='},
                { order: 2, label: 'Hoodies', active: false, filterArg: 'categories[]='},
                { order: 3, label: 'Sweats', active: false, filterArg: 'categories[]='},
            ]

            models.categories = CATEGORIES = categories?.map((cat) => {
                const auxCat = filterCats.find(c => c.label === cat.name)
                auxCat.filterArg += cat.id;
                if(auxCat){
                  return Object.assign({},cat,auxCat)
                }
             }).sort((a, b) => a.order - b.order);

             if(Object.keys(productsHeaders).length > 0 && productsHeaders.constructor === Object) {
                if(productsHeaders.has('X-Min-Price')) 
                    availableFilters.price.find(p => p.id === 'filter-price-min').value = productsHeaders.get('X-Min-Price')
                if(productsHeaders.has('X-Max-Price'))
                    availableFilters.price.find(p => p.id === 'filter-price-max').value = productsHeaders.get('X-Max-Price')
             }

            return models;
        })
    },

    '/products/[0-9]' : {
        path: '/products/(?<id>[0-9]+)',
        template: '/_product-detail.html',
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',
            list: [                {label: 'tiago', title: 'i am tiago', href:'/', linkName: 'back home'},
                {label: 'marques', title: 'tiAGO MArques'},
            ],
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModel(`/products/${Number.parseInt(window.history.state.id)}`, 'product')
    },

    '/cart' : {
        path: '/cart',
        template: '/_shop-cart.html',
        remoteModel: async() => await({'cartCost': await ShoppingCart.cost()}),
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',
            cart: (() => {
                return ShoppingCart.get();
            })(),
            /*cartCost: (() => {
                return ShoppingCart.cost;
            })()*/
        },
        
        //remoteModel: async() => await fetchRemoteModel(`/products/${Number.parseInt(window.history.state.id)}`, 'product')
    },    
}

const EVENTBUS = window.EVENTBUS = new EventBus();

const App = new VanillaSpaEngine({
    routes: routes,
    appContainer: APP_CONTAINER,
    enableCaching: ENABLE_TEMPLATE_CACHING,
});


const filter = (e, filterType) => {
if(filterType === 'price') {
    if(e.detail.origin.target.id === 'filter-price-min')
        FILTERS.minPrice = e.detail.args + Number.parseInt(e.detail.origin.target.value);
    if(e.detail.origin.target.id === 'filter-price-max')
        FILTERS.maxPrice = e.detail.args + Number.parseInt(e.detail.origin.target.value);

} else {

    FILTERS[filterType] = e.detail.args;
}
const queryString = Object.values(FILTERS).filter(v => v.length > 0).join('&');

 App.updateCurrentModel({
    remoteModel: async() => await fetchRemoteModel(`/products?${queryString}`, 'products'),

    staticModel: {
        categories: (() => {
            if(filterType === 'categories') {
                CATEGORIES.forEach((el)=>{el.active = false});
                CATEGORIES.find(c => c.filterArg === e.detail.args).active = true;
            }
            return CATEGORIES;
        })(),
        filters: (() => {
            if(filterType === 'body') {
                availableFilters.body.forEach((el)=>{el.active = false});
                availableFilters.body.find(b => b.filterArg === e.detail.args).active = true;
            }
            if(filterType === 'price') {
                availableFilters.price.find(b => b.filterArg === e.detail.args).value = e.detail.origin.target.value;
            }
            if(filterType === 'sizes') {
                availableFilters.sizes.forEach((el)=>{el.active = false});
                availableFilters.sizes.find(b => b.filterArg === e.detail.args).active = true;
            }            
            return availableFilters;
    })()

    }
})

 
}

const addToCart = async(e) => {
    const productId = Number.parseInt(e.detail.args);
    
    const {products} = await App.getCurrentModel();
    const productInstance = products.find(p => p.id === productId);

    ShoppingCart.add(productInstance)
}

const changeQuantity = async(e, amount) => {
    const productId = Number.parseInt(e.detail.args);
    
    const model = await App.getCurrentModel();
    const cartItem = model.cart.find(c => c.product.id === productId);

    ShoppingCart.changeQuantity(cartItem, amount);

    App.updateCurrentModel({
        remoteModel: async() => await({'cartCost': await ShoppingCart.cost()}),
        staticModel: {
            ...model
        }
    })
}

const clearCart = async() => {
    ShoppingCart.clear();
    const model = await App.getCurrentModel();
    App.updateCurrentModel({
        staticModel: {
            ...model,
            ...{cart: []}
        }
    })
}

const removeFromCart = async(e) => {
    const productId = Number.parseInt(e.detail.args);
    
    const model = await App.getCurrentModel();
    const cartItem = model.cart.find(c => c.product.id === productId);
    ShoppingCart.remove(cartItem);

    App.updateCurrentModel({
        staticModel: {
            ...model,
        }
    })
}


EVENTBUS.on('product-filter-category', (e) => filter(e, 'categories'))
EVENTBUS.on('product-filter-body', (e) => filter(e, 'body'))
EVENTBUS.on('product-filter-price', (e) => filter(e, 'price'))
EVENTBUS.on('product-filter-sizes', (e) => filter(e, 'sizes'))
EVENTBUS.on('product-add-to-cart', (e) => addToCart(e))
EVENTBUS.on('product-increment-cart', (e) => changeQuantity(e, +1))
EVENTBUS.on('product-decrement-cart', (e) => changeQuantity(e, -1))
EVENTBUS.on('product-clear-cart', (e) => clearCart())
EVENTBUS.on('product-remove-from-cart', (e) => removeFromCart(e))
