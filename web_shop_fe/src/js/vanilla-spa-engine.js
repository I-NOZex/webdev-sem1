/**
 * @author Tiago Marques <tiagofm.profissional@outlook.pt>
 */

class BindValue extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
}
  
const BIND_ATTRIBUTES = '[data-bind-content],[data-bind-attrs],[data-bind-loop],[data-bind-if]';
let inMemoryModel = null;

class Router {
    constructor(_routes, _templateEngine) {
        this.routes = _routes;
        this.templateEngine = _templateEngine;

        this.appContainer = null;
        this.currentRoute = null;

        window.customElements.define('bind-value', BindValue, {extends: 'span'});
        window.document.addEventListener('click', this.interceptClickEvent);
        window.addEventListener('popstate', this.onFreshLoad);
        window.addEventListener('load', this.onFreshLoad, { once: true });
    }

    get model() {
        const computedModel = this.currentRoute.remoteModel ? 
            (async () => {
                try {
                    return {...this.currentRoute.staticModel, ...await this.currentRoute?.remoteModel()}
                } catch(e) {
                    console.log(e)
                return {};  // fallback value
                }
            })() :
            (async () => this.currentRoute.staticModel)();
        inMemoryModel = computedModel;
        console.info('model rehydrated', computedModel)
        return computedModel;
    }

    get inMemoryModel() {
        return inMemoryModel ?? this.model;
    }

    onNavigateRequest = async (path) => {
        let route = this.routes[path];

        if(!route) {
            const routePath = Object.keys(this.routes).find(p => {
                const urlPattern = this.routes[p].path + '$';
                return path.match(new RegExp(urlPattern, 'i'));
            });

            route = this.routes[routePath];
        }

        if(!route) return;
    
        const urlPattern = route.path + '$';
        const matches = path.match(new RegExp(urlPattern, 'i'));
        if (!matches) {
            console.error('route not found')
            return;
        }
        let [relativePath, id] = matches;


        window.history.pushState({id, relativePath}, path, window.location.origin + '/#' + path);
        this.currentRoute = route;
        this.appContainer.classList.add('loading');

        const $oldActiveLink = document.querySelector(`#main-menu .main-menu__link.active`);
        $oldActiveLink?.classList.remove('active');
        const $newActiveLink = document.querySelector(`#main-menu .main-menu__link[href*="${relativePath}"]`);
        $newActiveLink?.classList.add('active');

        this.appContainer.innerHTML = await this.templateEngine.renderTemplate(route);
        window.sessionStorage.setItem('app-container', this.appContainer.innerHTML);
        this.templateEngine
            .bindData(this.appContainer, this.model)
            .then(() => {
                this.templateEngine.bindEvents(this.appContainer);
                this.appContainer.classList.remove('loading')
            })
    }

    onModelUpdated = async() => {
        //this.appContainer.innerHTML = await this.templateEngine.renderTemplate(this.currentRoute, await this.model);
        this.appContainer.innerHTML = window.sessionStorage.getItem('app-container')
        this.appContainer.classList.add('loading')
        this.templateEngine
            .bindData(this.appContainer, this.model)
            .then(() => {
                this.templateEngine.bindEvents(this.appContainer);
                this.appContainer.classList.remove('loading')
            })
    }
    
    onFreshLoad = () => {
        this.onNavigateRequest(window.location.pathname + window.location.hash.substring(2)) //substr to remove #
    }    
    
    // https://stackoverflow.com/a/33616981/1869192
    interceptClickEvent = (e) => {
        const target = e.target || e.srcElement;
        if (target.tagName === 'A') {
            const href = target.getAttribute('href');
    
            if (true) {
    
                if(href !== location.hash.substring(1)) {
                    this.onNavigateRequest(href);
                }
                //tell the browser not to respond to the link click
               e.preventDefault();
            }
        }
    }
}

class TemplateEngine {
    constructor() {
      this.cachingEnabled = false;
    }

    loadTemplate = async(templatePath) => {
        if (window.localStorage.getItem(templatePath) !== null && this.cachingEnabled) {
            const $auxNode = document.createElement('div');
            $auxNode.innerHTML = window.localStorage.getItem(templatePath)
            return $auxNode;
        }
    
        return await fetch(location.origin + templatePath)
            // The API call was successful!
            .then((response) => response.text())
    
            .then((html) => {
                // Convert the HTML string into a document object
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                window.localStorage.setItem(templatePath, doc.body.innerHTML);
    
                return doc.body;
            })
            .catch((err) => {
                // There was an error
                console.warn('Something went wrong.', err);
            });
    };
    
    // to parse Object paths
    getObjPropByPath = (obj, path = '') => {
        if (path.split('.').length <= 1 && !path.match(/^\w+\[\d+\]/g)) return obj[path];

        /* ⚠ DONT USE THIS IN PRODUCTION */
        // all this code is proof of concept an may not follow the best practices at times
        // like the use of "eval", I just want to simplify my life ...             
        try {
            return eval(`obj.${path}`);
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error(e.message);
            }
        }
    }
    
    mapBind = ($el, model, recursive = false) => {
        const computeValue = (val) => {
            // ⚠ CLOSE YOUR EYES! IT'S EVAL TIME AGAIN 😂
            // this will allow as to perform extra processing to the data bind value 😎
            if(!$el.dataset.bindFn || val === null || val === undefined) return val;

            return eval($el.dataset.bindFn)(val);
        }

        if($el.dataset.bindIf) {
            let dataBindValue;
            const negate = $el.dataset.bindIf.startsWith('!');
            if(negate)
                dataBindValue = this.getObjPropByPath(model, $el.dataset.bindIf.substring(1));
            else
                dataBindValue = this.getObjPropByPath(model, $el.dataset.bindIf);

            const shouldRender = dataBindValue && !negate;
            if(dataBindValue){
                if(negate) {
                    $el.remove();
                    return;                    
                }
            } else {
                if(!negate) {
                    $el.remove();
                    return;                    
                }
            }
        }

        if($el.dataset.bindContent) {
            let dataBindValue = this.getObjPropByPath(model, $el.dataset.bindContent);

            if($el.childElementCount < 1) {
                $el.innerHTML = computeValue(dataBindValue) + $el.innerHTML;
            } else {
                $el.childNodes.forEach($node => {
                    if ($node.tagName !== 'VALUE') return;
                    $node.innerHTML = computeValue(dataBindValue);
                })
            }      

            //const modelKeyMap = `{{${$el.dataset.bindContent}}}`;
    
            //if ($el.innerHTML.includes(modelKeyMap)) {
                //$el.innerHTML = $el.innerHTML.replace(modelKeyMap, dataBindValue);
            //} else {
               // $el.innerHTML = dataBindValue || $el.innerHTML;
            //}
    
            //delete $el.dataset.bindContent;
        }
    
        if($el.dataset.bindAttrs) {
            const dataBindAttrs = $el.dataset.bindAttrs.replace(/\s+/g, '').split(',');
    
            dataBindAttrs.forEach((binding) => {
                let [attr, value] = binding.split(':');
                let dataBindValue = this.getObjPropByPath(model, value);
                $el.setAttribute(attr, computeValue(dataBindValue));
            })
    
            //delete $el.dataset.bindAttrs;
        }
    
        if($el.dataset.bindLoop) {
            let dataBindValues = this.getObjPropByPath(model, $el.dataset.bindLoop);
            if(!dataBindValues) {
                console.error(`Property "${$el.dataset.bindLoop}" not found in model [${Object.keys(model)}]`)
            }

            $el.innerHTML = $el.firstElementChild.outerHTML; //to reset the template for model updates

            dataBindValues?.forEach((subModel) => {
                const $loopContainer = $el.firstElementChild.cloneNode(true);
                $el.appendChild($loopContainer);

                const $childBindContainer = $loopContainer.querySelectorAll('*');
                
                $childBindContainer.forEach($child => {
                    this.mapBind($child, subModel, true);
                })                
            })
            $el.firstElementChild.remove();
        }
    };
    
    bindData = async($template, model) => {
        const $bindingContainers =  $template.querySelectorAll(BIND_ATTRIBUTES);
        await model.then((computedModel) => {
            $bindingContainers.forEach(($el) => this.mapBind($el, computedModel));
        })
    }

    bindEvents = ($dom) => {
        const $bindingContainers =  $dom.querySelectorAll('[data-bind-event]');

        $bindingContainers.forEach($el => {
            if($el.dataset.bindEvent) {
                const pattern = /(?<trigger>\w+):(?<eventName>[\w-]+)\(?(?<args>[^(|)]+)?\)?/;
                const eventDetail = pattern.exec($el.dataset.bindEvent);

                if(eventDetail && eventDetail.groups.trigger && eventDetail.groups.eventName) {
                    let eventArgs = eventDetail.groups.args ?? $el.dataset?.bindEventArgs;
                    const event = (e) => {
                        window.EVENTBUS.emit(eventDetail.groups.eventName, {args: eventArgs, origin: e})
                    }
                    $el.addEventListener(eventDetail.groups.trigger, event);
                }
            
                //delete $el.dataset.bindEvent;
            }        
        });
    }
    
    renderTemplate = async (route, model) => {
        let $staticTemplate = await this.loadTemplate(route.template);    
        return $staticTemplate.innerHTML;
    }
}

export default class VanillaSpaEngine {
    constructor({routes, appContainer, enableCaching}) {
        this.templateEngine = new TemplateEngine(); 
        this.router = new Router(routes, this.templateEngine);

        this.router.appContainer = appContainer;
        this.templateEngine.cachingEnabled = enableCaching ?? false;
    }

    updateCurrentModel({remoteModel, staticModel}) {
        remoteModel && (this.router.currentRoute.remoteModel = remoteModel);
        staticModel && (this.router.currentRoute.staticModel = {...this.router.currentRoute.staticModel, ...staticModel});

        this.router.onModelUpdated();
    }

    getCurrentModel() {
        return this.router.inMemoryModel
    }
}
