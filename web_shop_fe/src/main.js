'use strict';

import './colors.css';
import './buttons.css';
import './icons.css';
import './layout.css';

/*
@ parses document to find dynamic containers denoted by the class "__dynamic-content__"
- reads 'data-template' attr to fetch the template file location
- reads 'data-url-pattern' attr to check if it should render in the current page/path location
- fetches the template layout
- accesses the appropiated "windows.$renders" so it can fetch data and bind it to the template
- outputs the processed template to the dynamic container, aka, .__dynamic-content__
*/
const renderTemplates = () => {
    const $containers = document.querySelectorAll('.__dynamic-content__');
    $containers.forEach(async ($el) => {
        const templatePath = $el.dataset.template;
        const urlPattern = $el.dataset.urlPattern;

        if( location.pathname.match(new RegExp(urlPattern, 'i')) ) {
            getTemplate(templatePath)
            .then(async (template) => {
                /*
                - calls 'data-render-fn' attr, if the template needs data bindings
                - fetchs 'data-content-url' to get the data to be bind
                */
                const $container = template.firstElementChild;
                var fn = window.$renders[$container.dataset.renderFn];
                var contentUrl = $container.dataset.contentUrl;

                if (fn && typeof fn === "function") {
                    $el.outerHTML =  await fn.apply($el, [contentUrl, template]);    
                } else {
                    $el.outerHTML = template.innerHTML;
                }
            })
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
    return fetch(templatePath)
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
    
            const $parent = template.firstElementChild;
            const $childTemplate = $parent.firstElementChild.cloneNode(true);
            $parent.innerHTML = '';
    
            return fetch(contentUrl)
            // The API call was successful!
            .then((response) => response.json())
    
            .then((json) => {
                console.log('api result')
                json.forEach(x => {
                    const $item = $childTemplate.cloneNode(true);
                    console.log($item); 
                    $item.querySelectorAll('[data-bind]').forEach($el => {
                        if($el.dataset.bind && !$el.dataset.bindAttr) {
                            $el.innerHTML = x[$el.dataset.bind];

                        } else if ($el.dataset.bindAttr && $el.dataset.bind) {
                            $el.setAttribute($el.dataset.bindAttr, x[$el.dataset.bind]);
                        }                        
                    })
                  
                    // Change this to div.childNodes to support multiple top-level nodes
                    $parent.appendChild($item); 
                })

                return $parent.outerHTML;

            })
            .catch((err) => {
                // There was an error
                console.warn('Something went wrong.', err);
            });

    }
};

// start dynamically render templates after dom ready
document.addEventListener('DOMContentLoaded', renderTemplates, { once: true });