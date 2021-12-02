'use strict';

import '../css/colors.css';
import '../css/buttons.css';
import '../css/icons.css';
import '../css/layout.css';

import VanillaSpaEngine from './vanilla-spa-engine.js';
import EventBus from './event-bus.js';

const APP_CONTAINER = document.getElementById('app');
const ENABLE_CACHING = false;

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
        remoteModel: async() => await fetchRemoteModel('http://localhost:8008/products', 'products'),
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
                    { label: '1', active: true},
                    { label: '2', active: false},
                    { label: '3', active: false},
                ],

                price: [
                    { label: 'caro'},
                    { label: 'carote'},
                    { label: 'barato'},
                ],
            },
            //resultCount: 0,
        },
        
        remoteModel: async() => await fetchRemoteModel('http://localhost:8008/products?price_gte=15', 'product')
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
        
        remoteModel: async() => await fetchRemoteModel(`http://localhost:8008/products/${Number.parseInt(window.history.state.id)}`, 'product')
    },
}


const fetchRemoteModel = async(contentUrl, model, ignoreCache = false) => {     
    if (window.localStorage.getItem(contentUrl) !== null && !ignoreCache) {
        return JSON.parse(window.localStorage.getItem(contentUrl));
    }
    console.log('fetching remote model')

    return await fetch(contentUrl)
    // The API call was successful!
    .then(async (response) => ({[model] : await response.json()}))
    .then((json) => {
        window.localStorage.setItem(contentUrl, JSON.stringify(json));
        return json;
    })
}

const EVENTBUS = window.EVENTBUS = new EventBus();

const App = new VanillaSpaEngine({
    routes: routes,
    appContainer: APP_CONTAINER,
    enableCaching: ENABLE_CACHING,
});


const filter = () => {
 App.updateCurrentModel({
    remoteModel: async() => await fetchRemoteModel('http://localhost:8008/products-filter?price_gte=7', 'products',true),
    staticModel: {
        filters: {
            categories : [
                { label: '1', active: false},
                { label: '2', active: true},
                { label: '3', active: false},
            ],
       },
    }
})

 
}

EVENTBUS.on('product-filter', (e) => filter())
