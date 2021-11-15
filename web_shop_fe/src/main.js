'use strict';

import './colors.css';
import './buttons.css';
import './icons.css';
import './layout.css';

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

const asyncTemplateRender = () => {


    const render = () => {
        const $containers = document.querySelectorAll('.__dynamic-content__');
        $containers.forEach(async ($el) => {
            const templatePath = $el.dataset.template;
            const urlPattern = $el.dataset.urlPattern;

            if( location.pathname.match(new RegExp(urlPattern, 'i')) ) {
                getTemplate(templatePath)
                .then(async (template) => {

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

    document.addEventListener('DOMContentLoaded', render, { once: true });
};

asyncTemplateRender();


window.$renders = {
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

                        }else if($el.dataset.bindAttr && $el.dataset.bind) {
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