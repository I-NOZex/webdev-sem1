'use strict';

import './colors.css';
import './buttons.css';
import './icons.css';
import './layout.css';

const VIEW_MODEL = {
    currentProduct: {},
    resultCount: 0,
    resultPage: 0,
    selectedFilters: []
}

/*
@ parses document to find dynamic containers denoted by the class "__dynamic-content__"
- reads 'data-template' attr to fetch the template file location
- reads 'data-url-pattern' attr to check if it should render in the current page/path location
- fetches the template layout
- accesses the appropiated "windows.$renders" so it can fetch data and bind it to the template
- outputs the processed template to the dynamic container, aka, .__dynamic-content__
*/
const renderTemplates = async(force) => {
    if (force) document.body = await getTemplate('/');
    const $oldContainers = document.querySelectorAll('.__computed-content__');
    $oldContainers.forEach(c => c.outerHTML = '');

    const $containers = document.querySelectorAll('.__dynamic-content__');
    $containers.forEach(async ($el) => {
        const templatePath = $el.dataset.template;
        const urlPattern = $el.dataset.urlPattern + '$'; // match EOL otherwise this matches all pages

        if( location.pathname.match(new RegExp(urlPattern, 'i')) ) {
            getTemplate(templatePath)
            .then(async (template) => {
                /*
                - calls 'data-render-fn' attr, if the template needs data bindings
                - fetchs 'data-content-url' to get the data to be bind
                */
               let $html = '';
                for(let i = 0; i < template.childElementCount; i++) {
                    const $container = template.children[i];
                    const fn = window.$renders[$container.dataset.renderFn];
                    const contentUrl = $container.dataset.contentUrl;
    
                    if (fn && typeof fn === "function") { // dynamic rendering
                        $html +=  await fn.apply($el, [contentUrl, $container]);    
                    } else { // static rendering
                        $html += $container.outerHTML;
                    }
                }


                $el.outerHTML = $html;
                document.body.setAttribute('data-page', location.pathname);
                setMenuActiveLink();

            })
        } else { // remove unused container
            $el.outerHTML = '';
        }
    })
};

/*
@ fetches and return the html content of a given html template file
- fetches
- parses
- parses
*/
const getTemplate = (templatePath) => {
    return fetch(location.origin + templatePath)
        // The API call was successful!
        .then((response) => response.text())

        .then((html) => {
            // Convert the HTML string into a document object
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            return doc.body;
        })
        .catch((err) => {
            // There was an error
            console.warn('Something went wrong.', err);
        });
};

window.getTemplate = getTemplate;

// to parse Object paths
const getObjPropByPath = (obj, path = '') => {
    if (path.split('.').length <= 1) return obj[path];

    /* ⚠ DONT USE THIS IN PRODUCTION */
    // all this code is proof of concept an may not follow the best practices at times
    // like the use of "eval", I just want to simplify my life ...             
    return eval(`obj.${path}`);
}

const mountBinds = ($childTemplate, model) => {
    const $item = $childTemplate.cloneNode(true);

    // data bind current limitation: It can either bind just one attribute; or just one innerHTML value injection
    $item.querySelectorAll('[data-bind]').forEach($el => {
        let dataBindValue = getObjPropByPath(model, $el.dataset.bind);

        if($el.dataset.bindFn) {
            // ⚠ CLOSE YOUR EYES! IT'S EVAL TIME AGAIN 😂
            // this will allow as to perform extra processing to the data bind value 😎
            dataBindValue = eval($el.dataset.bindFn)(dataBindValue);
        }

        if($el.dataset.bind && !$el.dataset.bindAttr) { // to inject content value
            if ($el.innerHTML.includes('{{value}}'))
                $el.innerHTML = $el.innerHTML.replace('{{value}}', dataBindValue);
            else
                $el.innerHTML = dataBindValue;

        } else if ($el.dataset.bindAttr && $el.dataset.bind) { // to inject attr value
            $el.setAttribute($el.dataset.bindAttr, dataBindValue);
        }
    });

    return $item;
}

/*
@ global render methods definitions for different contents
- 
*/
window.$renders = {
    /*
    - given the content url, fetchs the data
    - uses the 'template' element ref to inject the template html
    - parses the teplate in look for 'data-bind' attributes an inject the value in their innerHTML (useful for text content)
    OR
    - parses the teplate in look for 'data-bind-attr' and injects the value of the 'data-bind' to their given attr (eg: useful to set image src)
    */
    renderProductsHome: (contentUrl, template) => {
            console.log('renderProductsHome')
    
            const $parent = template;
            const $childTemplate = $parent.firstElementChild.cloneNode(true);
            $parent.innerHTML = '';
    
            return fetch(contentUrl)
            // The API call was successful!
            .then((response) => response.json())
    
            .then((json) => {
                console.log('api result')
                json.forEach(model => {
                    const $item = mountBinds($childTemplate, model);

                    // Change this to div.childNodes to support multiple top-level nodes
                    $parent.appendChild($item); 
                })

                $parent.classList.add('__computed-content__');
                return $parent.outerHTML;

            })
            .catch((err) => {
                // There was an error
                console.warn('Something went wrong.', err);
            });

    },

    renderProductDetail: (contentUrl, template) => {
            console.log('renderProductDetail')
    
            const $parent = template;
            const $childTemplate = $parent.firstElementChild.cloneNode(true);
            $parent.innerHTML = '';
    
            return fetch(contentUrl)
            // The API call was successful!
            .then((response) => response.json())
    
            .then((model) => {
                console.log('api result')

                const $item = mountBinds($childTemplate, model);

                // Change this to div.childNodes to support multiple top-level nodes
                $parent.appendChild($item); 

                $parent.classList.add('__computed-content__');
                return $parent.outerHTML;

            })
            .catch((err) => {
                // There was an error
                console.warn('Something went wrong.', err);
            });

    },

    renderProductsList: (contentUrl, template) => {
        console.log('renderProductsList')

        const $parent = template;
        const $childTemplate = $parent.lastElementChild.cloneNode(true);
        const $countResultsTemplate = $parent.firstElementChild.cloneNode(true);
        $parent.innerHTML = '';

        return fetch(contentUrl)
        // The API call was successful!
        .then((response) => response.json())

        .then((json) => {
            console.log('api result')
            VIEW_MODEL.resultCount = json.length;
            const $item = mountBinds($countResultsTemplate, {resultCount: json.length});
            $parent.appendChild($item); 


            json.forEach(model => {
                const $item = mountBinds($childTemplate, model);

                // Change this to div.childNodes to support multiple top-level nodes
                $parent.appendChild($item); 
                
            })
            
            $parent.classList.add('__computed-content__');

            return $parent.outerHTML;
        })
        .catch((err) => {
            // There was an error
            console.warn('Something went wrong.', err);
        });

    },

    renderProductsResultCounter: (contentUrl, template) => {
        console.log('renderProductsResultCounter')

        const $parent = template;
        const $childTemplate = $parent.firstElementChild;
        $parent.innerHTML = '';

        const $item = mountBinds($childTemplate, VIEW_MODEL);

            // Change this to div.childNodes to support multiple top-level nodes
        $parent.appendChild($item); 

        
        $parent.classList.add('__computed-content__');

        return $parent.outerHTML;

    }
};

// start dynamically render templates after dom ready
document.addEventListener('DOMContentLoaded', renderTemplates, { once: true });
document.addEventListener('DOMContentLoaded', () => console.dir(location.pathname), { once: true });

// https://stackoverflow.com/a/33616981/1869192
const interceptClickEvent = (e) => {
    const target = e.target || e.srcElement;
    if (target.tagName === 'A') {
        const href = target.getAttribute('href');

        if (true) {
            if(href !== location.pathname) {

                history.pushState(null, null, href);
                renderTemplates(true);
            }
            //tell the browser not to respond to the link click
           e.preventDefault();
        }
    }
}


// this helps us to intercept navigations and dynamically render content 😎
if (document.addEventListener) {
    document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
    document.attachEvent('onclick', interceptClickEvent);
}


const setMenuActiveLink = () => {
    const $activeLink = document.querySelector(`#main-menu .main-menu__link[href="${document.body.dataset.page}"]`)
    $activeLink.classList.toggle('active')
}



/************************************** */

const updateRenderContainer = (templatePath, contentUrl) => {
    return getTemplate(templatePath)
        .then(async (template) => {
            /*
            - calls 'data-render-fn' attr, if the template needs data bindings
            - fetchs 'data-content-url' to get the data to be bind
            */
        let $html = '';
            for(let i = 0; i < template.childElementCount; i++) {
                const $container = template.children[i];
                const fn = window.$renders[$container.dataset.renderFn];

                if (fn && typeof fn === "function") { // dynamic rendering
                    $html +=  await fn.apply($container, [contentUrl, $container]);    
                } else { // static rendering
                    $html += $container.outerHTML;
                }
            }
            return $html;

        })
}

 const applyFilter = window.doit = (filter) => {
    const $productsContainer = document.querySelector('.products-list');
    const productsTemplatePath = '/products-list.tpl.html'
    const baseContentUrl =  'http://localhost:8008/products-filter?'

    let filterArgs = '';
    Object.keys(filter).forEach((key) => {
        filterArgs += `${key}=${filter[key]}&`;
    })

    const filterUrl = baseContentUrl + filterArgs;
    console.dir(filterUrl)

    updateRenderContainer(productsTemplatePath, filterUrl)
        .then((html) => {
            $productsContainer.innerHTML = html;
        })
}