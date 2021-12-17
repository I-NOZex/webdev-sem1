'use strict';

import '../css/colors.css';
import '../css/buttons.css';
import '../css/icons.css';
import '../css/layout.css';

import VanillaSpaEngine from './vanilla-spa-engine.js';
import EventBus from './event-bus.js';

const APP_CONTAINER = document.getElementById('app');
const ENABLE_CACHING = false;
const BASE_API_URL = 'http://127.0.0.1:8008';

const fetchRemoteModel = async(contentUrl, model, ignoreCache = false) => {    
    const absoluteUrl = BASE_API_URL + contentUrl;
    
    if (window.localStorage.getItem(absoluteUrl) !== null && !ignoreCache) {
        return JSON.parse(window.localStorage.getItem(absoluteUrl));
    }
    console.log('fetching remote model')

    return await fetch(absoluteUrl)
    // The API call was successful!
    .then(async (response) => ({[model] : await response.json()}))
    .then((json) => {
        window.localStorage.setItem(absoluteUrl, JSON.stringify(json));
        return json;
    })
}

let activeFilters = {
    categories : {
        tshirt: true,
        hoodie: false,
        sweeter: false,
    }
}

const routes = {
    '/' : {
        path: '/',
        template: '/_products-home.html',
        remoteModel: async() => await fetchRemoteModel('/products', 'products', true),
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
            filters: {
                categories : [
                    { id: 'filter-cat-shirt', label: 'T-shirts', active: true, filterArg: 'price_gte=1'},
                    { id: 'filter-cat-hoodie', label: 'Hoodies', active: false, filterArg: 'price_gte=7'},
                    { id: 'filter-cat-sweat', label: 'Sweaters', active: false, filterArg: 'price_gte=15'},
                ],

                price: [
                    { label: 'caro'},
                    { label: 'carote'},
                    { label: 'barato'},
                ],
            },
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModel('/products-filter?price_gte=1', 'products', true)
    },

    '/products?hoodies' : {
        path: '/products[?]hoodies',
        template: '/_products-list.html',
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',
            filters: {
                categories : [
                    { id: 'filter-cat-shirt', label: 'T-shirts', active: false, filterArg: 'price_gte=1'},
                    { id: 'filter-cat-hoodie', label: 'Hoodies', active: true, filterArg: 'price_gte=7'},
                    { id: 'filter-cat-sweat', label: 'Sweaters', active: false, filterArg: 'price_gte=15'},
                ],

                price: [
                    { label: 'caro'},
                    { label: 'carote'},
                    { label: 'barato'},
                ],
            },
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModel('/products-filter?price_gte=7', 'products', true)
    },    


    '/products?sweaters' : {
        path: '/products[?]sweaters',
        template: '/_products-list.html',
        staticModel: {
            user_name: 'Tiago',
            labelTitle: 'test title',
            xpto: 'a xpto val',
            xpto2: 'a xpto2 title',
            filters: {
                categories : [
                    { id: 'filter-cat-shirt', label: 'T-shirts', active: false, filterArg: 'price_gte=1'},
                    { id: 'filter-cat-hoodie', label: 'Hoodies', active: false, filterArg: 'price_gte=7'},
                    { id: 'filter-cat-sweat', label: 'Sweaters', active: true, filterArg: 'price_gte=15'},
                ],

                price: [
                    { label: 'caro'},
                    { label: 'carote'},
                    { label: 'barato'},
                ],
            },
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModel('/products-filter?price_gte=15', 'products', true)
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
}

const EVENTBUS = window.EVENTBUS = new EventBus();

const App = new VanillaSpaEngine({
    routes: routes,
    appContainer: APP_CONTAINER,
    enableCaching: ENABLE_CACHING,
});


const filter = (e) => {
//console.log(e)
 App.updateCurrentModel({
    remoteModel: async() => await fetchRemoteModel(`/products-filter?${e.detail.args}`, 'products', true),
    staticModel: {
        filters: {
            categories: [
                { id: 'filter-cat-shirt', label: 'T-shirts', active: (e.detail.args === 'price_gte=1'), filterArg: 'price_gte=1'},
                { id: 'filter-cat-hoodie', label: 'Hoodies', active: (e.detail.args === 'price_gte=7'), filterArg: 'price_gte=7'},
                { id: 'filter-cat-sweat', label: 'Sweaters', active: (e.detail.args === 'price_gte=15'),  filterArg: 'price_gte=15'},
            ],
       },
    }
})

 
}

EVENTBUS.on('product-filter', (e) => filter(e))
