var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj2, key, value) => key in obj2 ? __defProp(obj2, key, { enumerable: true, configurable: true, writable: true, value }) : obj2[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj2, key, value) => {
  __defNormalProp(obj2, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var colors = "";
var buttons = "";
var icons = "";
var layout = "";
class BindValue extends HTMLElement {
  constructor() {
    super();
  }
}
const BIND_ATTRIBUTES = "[data-bind-content],[data-bind-attrs],[data-bind-loop],[data-bind-if]";
let inMemoryModel = null;
class Router {
  constructor(_routes, _templateEngine) {
    __publicField(this, "onNavigateRequest", async (path2) => {
      let route = this.routes[path2];
      if (!route) {
        const routePath = Object.keys(this.routes).find((p) => {
          const urlPattern2 = this.routes[p].path + "$";
          return path2.match(new RegExp(urlPattern2, "i"));
        });
        route = this.routes[routePath];
      }
      if (!route)
        return;
      const urlPattern = route.path + "$";
      const matches = path2.match(new RegExp(urlPattern, "i"));
      if (!matches) {
        console.error("route not found");
        return;
      }
      let [relativePath, id] = matches;
      window.history.pushState({ id, relativePath }, path2, window.location.origin + "/#" + path2);
      this.currentRoute = route;
      this.appContainer.classList.add("loading");
      const $oldActiveLink = document.querySelector(`#main-menu .main-menu__link.active`);
      $oldActiveLink == null ? void 0 : $oldActiveLink.classList.remove("active");
      const $newActiveLink = document.querySelector(`#main-menu .main-menu__link[href*="${relativePath}"]`);
      $newActiveLink == null ? void 0 : $newActiveLink.classList.add("active");
      this.appContainer.innerHTML = await this.templateEngine.renderTemplate(route);
      window.sessionStorage.setItem("app-container", this.appContainer.innerHTML);
      this.templateEngine.bindData(this.appContainer, this.model).then(() => {
        this.templateEngine.bindEvents(this.appContainer);
        this.appContainer.classList.remove("loading");
      });
    });
    __publicField(this, "onModelUpdated", async () => {
      this.appContainer.innerHTML = window.sessionStorage.getItem("app-container");
      this.appContainer.classList.add("loading");
      this.templateEngine.bindData(this.appContainer, this.model).then(() => {
        this.templateEngine.bindEvents(this.appContainer);
        this.appContainer.classList.remove("loading");
      });
    });
    __publicField(this, "onFreshLoad", () => {
      this.onNavigateRequest(window.location.pathname + window.location.hash.substring(2));
    });
    __publicField(this, "interceptClickEvent", (e) => {
      const target = e.target || e.srcElement;
      if (target.tagName === "A") {
        const href = target.getAttribute("href");
        {
          if (href !== location.hash.substring(1)) {
            this.onNavigateRequest(href);
          }
          e.preventDefault();
        }
      }
    });
    this.routes = _routes;
    this.templateEngine = _templateEngine;
    this.appContainer = null;
    this.currentRoute = null;
    window.customElements.define("bind-value", BindValue, { extends: "span" });
    window.document.addEventListener("click", this.interceptClickEvent);
    window.addEventListener("popstate", this.onFreshLoad);
    window.addEventListener("load", this.onFreshLoad, { once: true });
  }
  get model() {
    const computedModel = this.currentRoute.remoteModel ? (async () => {
      var _a;
      try {
        return __spreadValues(__spreadValues({}, this.currentRoute.staticModel), await ((_a = this.currentRoute) == null ? void 0 : _a.remoteModel()));
      } catch (e) {
        console.log(e);
        return {};
      }
    })() : (async () => this.currentRoute.staticModel)();
    inMemoryModel = computedModel;
    console.info("model rehydrated", computedModel);
    return computedModel;
  }
  get inMemoryModel() {
    return inMemoryModel != null ? inMemoryModel : this.model;
  }
}
class TemplateEngine {
  constructor() {
    __publicField(this, "loadTemplate", async (templatePath) => {
      if (window.localStorage.getItem(templatePath) !== null && this.cachingEnabled) {
        const $auxNode = document.createElement("div");
        $auxNode.innerHTML = window.localStorage.getItem(templatePath);
        return $auxNode;
      }
      return await fetch(location.origin + templatePath).then((response) => response.text()).then((html) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        window.localStorage.setItem(templatePath, doc.body.innerHTML);
        return doc.body;
      }).catch((err) => {
        console.warn("Something went wrong.", err);
      });
    });
    __publicField(this, "getObjPropByPath", (obj, path = "") => {
      if (path.split(".").length <= 1 && !path.match(/^\w+\[\d+\]/g))
        return obj[path];
      try {
        return eval(`obj.${path}`);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.error(e.message);
        }
      }
    });
    __publicField(this, "mapBind", ($el, model, recursive = false) => {
      const computeValue = (val) => {
        if (!$el.dataset.bindFn || val === null || val === void 0)
          return val;
        return eval($el.dataset.bindFn)(val);
      };
      if ($el.dataset.bindIf) {
        let dataBindValue;
        const negate = $el.dataset.bindIf.startsWith("!");
        if (negate)
          dataBindValue = this.getObjPropByPath(model, $el.dataset.bindIf.substring(1));
        else
          dataBindValue = this.getObjPropByPath(model, $el.dataset.bindIf);
        if (dataBindValue) {
          if (negate) {
            $el.remove();
            return;
          }
        } else {
          if (!negate) {
            $el.remove();
            return;
          }
        }
      }
      if ($el.dataset.bindContent) {
        let dataBindValue = this.getObjPropByPath(model, $el.dataset.bindContent);
        if ($el.childElementCount < 1) {
          $el.innerHTML = computeValue(dataBindValue) + $el.innerHTML;
        } else {
          $el.childNodes.forEach(($node) => {
            if ($node.tagName !== "VALUE")
              return;
            $node.innerHTML = computeValue(dataBindValue);
          });
        }
      }
      if ($el.dataset.bindAttrs) {
        const dataBindAttrs = $el.dataset.bindAttrs.replace(/\s+/g, "").split(",");
        dataBindAttrs.forEach((binding) => {
          let [attr, value] = binding.split(":");
          let dataBindValue = this.getObjPropByPath(model, value);
          $el.setAttribute(attr, computeValue(dataBindValue));
        });
      }
      if ($el.dataset.bindLoop) {
        let dataBindValues = this.getObjPropByPath(model, $el.dataset.bindLoop);
        if (!dataBindValues) {
          console.error(`Property "${$el.dataset.bindLoop}" not found in model [${Object.keys(model)}]`);
        }
        $el.innerHTML = $el.firstElementChild.outerHTML;
        dataBindValues == null ? void 0 : dataBindValues.forEach((subModel) => {
          const $loopContainer = $el.firstElementChild.cloneNode(true);
          $el.appendChild($loopContainer);
          const $childBindContainer = $loopContainer.querySelectorAll("*");
          $childBindContainer.forEach(($child) => {
            this.mapBind($child, subModel, true);
          });
        });
        $el.firstElementChild.remove();
      }
    });
    __publicField(this, "bindData", async ($template, model2) => {
      const $bindingContainers = $template.querySelectorAll(BIND_ATTRIBUTES);
      await model2.then((computedModel) => {
        $bindingContainers.forEach(($el2) => this.mapBind($el2, computedModel));
      });
    });
    __publicField(this, "bindEvents", ($dom) => {
      const $bindingContainers = $dom.querySelectorAll("[data-bind-event]");
      $bindingContainers.forEach(($el2) => {
        var _a, _b;
        if ($el2.dataset.bindEvent) {
          const pattern = /(?<trigger>\w+):(?<eventName>[\w-]+)\(?(?<args>[^(|)]+)?\)?/;
          const eventDetail = pattern.exec($el2.dataset.bindEvent);
          if (eventDetail && eventDetail.groups.trigger && eventDetail.groups.eventName) {
            let eventArgs = (_b = eventDetail.groups.args) != null ? _b : (_a = $el2.dataset) == null ? void 0 : _a.bindEventArgs;
            const event = (e) => {
              window.EVENTBUS.emit(eventDetail.groups.eventName, { args: eventArgs, origin: e });
            };
            $el2.addEventListener(eventDetail.groups.trigger, event);
          }
        }
      });
    });
    __publicField(this, "renderTemplate", async (route, model2) => {
      let $staticTemplate = await this.loadTemplate(route.template);
      return $staticTemplate.innerHTML;
    });
    this.cachingEnabled = false;
  }
}
class VanillaSpaEngine {
  constructor({ routes: routes2, appContainer, enableCaching }) {
    this.templateEngine = new TemplateEngine();
    this.router = new Router(routes2, this.templateEngine);
    this.router.appContainer = appContainer;
    this.templateEngine.cachingEnabled = enableCaching != null ? enableCaching : false;
  }
  updateCurrentModel({ remoteModel, staticModel }) {
    remoteModel && (this.router.currentRoute.remoteModel = remoteModel);
    staticModel && (this.router.currentRoute.staticModel = __spreadValues(__spreadValues({}, this.router.currentRoute.staticModel), staticModel));
    this.router.onModelUpdated();
  }
  getCurrentModel() {
    return this.router.inMemoryModel;
  }
}
class EventBus {
  constructor() {
    this.bus = document.createElement("eventbus-proxy");
    this.eventList = [];
  }
  on(event, callback, options = {}) {
    this.bus.addEventListener(event, callback, options);
    this.eventList.push({ type: event, fn: callback.toString(), options });
  }
  off(event, callback) {
    this.bus.removeEventListener(event, callback);
    this.eventList = this.eventList.filter((ev) => !(ev.type === event && ev.fn.toString() === callback.toString()));
  }
  emit(event, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }));
    this.eventList = this.eventList.filter((ev) => {
      var _a;
      return !(ev.type === event && ((_a = ev.options) == null ? void 0 : _a.once) === true);
    });
  }
  listAllEventListeners() {
    return this.eventList.sort((a, b) => a.type.localeCompare(b.type));
  }
}
let cart = [];
class ShopCart {
  constructor(selector) {
    __publicField(this, "$counterElement", null);
    __publicField(this, "onShopCartModified", null);
    cart = JSON.parse(localStorage.getItem("shop-cart")) || [];
    this.$counterElement = document.querySelector(selector);
    this.$counterElement.innerText = this.count;
  }
  get count() {
    return cart.reduce((prev, curr) => prev + curr.quantity, 0);
  }
  async cost() {
    return cart.reduce((prev, curr) => prev + curr.product.price * curr.quantity, 0);
  }
  get() {
    return cart;
  }
  add(product) {
    const match = cart.find((c) => c.product.id === product.id);
    if (!match) {
      cart.push({ product, quantity: 1 });
      this.saveShopCart();
    } else {
      this.changeQuantity(match, 1);
    }
  }
  changeQuantity(cartItem, amount = 1) {
    const match = cart.find((c) => c.product.id === cartItem.product.id);
    if (match) {
      const result = match.quantity - -amount;
      match.quantity = result < 0 ? 0 : result;
    }
    this.saveShopCart();
    return match;
  }
  remove(cartItem) {
    const match = cart.findIndex((c) => c.product.id === cartItem.product.id);
    if (match >= 0) {
      cart.splice(match, 1);
    }
    this.saveShopCart();
  }
  clear() {
    cart = [];
    this.saveShopCart();
  }
  saveShopCart() {
    console.info("Shop cart saved!", cart);
    localStorage.setItem("shop-cart", JSON.stringify(cart));
    this.$counterElement.innerText = this.count;
  }
}
const ShoppingCart = new ShopCart("#cart-counter");
const APP_CONTAINER = document.getElementById("app");
const ENABLE_TEMPLATE_CACHING = false;
const ENABLE_MODEL_CACHING = false;
const BASE_API_URL = "http://127.0.0.1:8000/api";
let FILTERS = { categories: "", minPrice: "", maxPrice: "", body: "", sizes: "" };
let CATEGORIES = [];
const availableFilters = {
  price: [
    { label: "Min", id: "filter-price-min", filterArg: "price_gte[]=", value: 0 },
    { label: "Max", id: "filter-price-max", filterArg: "price_lte[]=", value: 1e4 }
  ],
  body: [
    { label: "All", id: "filter-body-all", filterArg: "body_has[]=", active: true },
    { label: "Male", id: "filter-body-male", filterArg: "body_has[]=Male", active: false },
    { label: "Female", id: "filter-body-female", filterArg: "body_has[]=Female", active: false }
  ],
  sizes: [
    { label: "All", id: "filter-sizes-all", filterArg: "sizes_has[]=", active: true },
    { label: "Teen", id: "filter-sizes-teen", filterArg: "sizes_has[]=Teen", active: false },
    { label: "S", id: "filter-sizes-s", filterArg: "sizes_has[]=S", active: false },
    { label: "M", id: "filter-sizes-m", filterArg: "sizes_has[]=M", active: false },
    { label: "L", id: "filter-sizes-l", filterArg: "sizes_has[]=L", active: false },
    { label: "XL", id: "filter-sizes-xl", filterArg: "sizes_has[]=X", active: false }
  ]
};
const fetchRemoteModel = async (contentUrl, model2, ignoreCache = !ENABLE_MODEL_CACHING) => {
  const absoluteUrl = BASE_API_URL + contentUrl;
  if (window.localStorage.getItem(absoluteUrl) !== null && !ignoreCache) {
    console.log(JSON.parse(window.localStorage.getItem(absoluteUrl)));
    return JSON.parse(window.localStorage.getItem(absoluteUrl));
  }
  console.log("fetching remote model");
  return await fetch(absoluteUrl).then(async (response) => {
    return { [model2]: await response.json(), [`${[model2]}Headers`]: response.headers };
  }).then((json) => {
    window.localStorage.setItem(absoluteUrl, JSON.stringify(json));
    return json;
  });
};
const fetchRemoteModels = async (resources, ignoreCache) => {
  return await Promise.all(resources.map(async (curr, idx, a) => await fetchRemoteModel(curr.contentUrl, curr.model, ignoreCache))).then((x) => x.reduce((acc, val2) => {
    return Object.assign(acc, val2);
  }, {}));
};
const routes = {
  "/": {
    path: "/",
    template: "/_products-home.html",
    remoteModel: async () => await fetchRemoteModel("/products", "products"),
    staticModel: {
      user_name: "Tiago",
      labelTitle: "test title",
      xpto: "a xpto val",
      xpto2: "a xpto2 title",
      list: [
        { label: "tiago", title: "i am tiago", href: "/", linkName: "back home" },
        { label: "marques", title: "tiAGO MArques" }
      ]
    }
  },
  "/products": {
    path: "/products",
    template: "/_products-list.html",
    staticModel: {
      user_name: "Tiago",
      labelTitle: "test title",
      xpto: "a xpto val",
      xpto2: "a xpto2 title",
      filters: availableFilters
    },
    remoteModel: async () => await fetchRemoteModels([
      { contentUrl: "/products", model: "products" },
      { contentUrl: "/categories", model: "categories" }
    ]).then((models) => {
      const { categories, productsHeaders } = models;
      const filterCats = [
        { order: 1, label: "T-Shirts", active: true, filterArg: "categories[]=" },
        { order: 2, label: "Hoodies", active: false, filterArg: "categories[]=" },
        { order: 3, label: "Sweats", active: false, filterArg: "categories[]=" }
      ];
      models.categories = CATEGORIES = categories == null ? void 0 : categories.map((cat) => {
        const auxCat = filterCats.find((c) => c.label === cat.name);
        auxCat.filterArg += cat.id;
        if (auxCat) {
          return Object.assign({}, cat, auxCat);
        }
      }).sort((a, b) => a.order - b.order);
      if (Object.keys(productsHeaders).length > 0 && productsHeaders.constructor === Object) {
        if (productsHeaders.has("X-Min-Price"))
          availableFilters.price.find((p) => p.id === "filter-price-min").value = productsHeaders.get("X-Min-Price");
        if (productsHeaders.has("X-Max-Price"))
          availableFilters.price.find((p) => p.id === "filter-price-max").value = productsHeaders.get("X-Max-Price");
      }
      return models;
    })
  },
  "/products/[0-9]": {
    path: "/products/(?<id>[0-9]+)",
    template: "/_product-detail.html",
    staticModel: {
      user_name: "Tiago",
      labelTitle: "test title",
      xpto: "a xpto val",
      xpto2: "a xpto2 title",
      list: [
        { label: "tiago", title: "i am tiago", href: "/", linkName: "back home" },
        { label: "marques", title: "tiAGO MArques" }
      ]
    },
    remoteModel: async () => await fetchRemoteModel(`/products/${Number.parseInt(window.history.state.id)}`, "product")
  },
  "/cart": {
    path: "/cart",
    template: "/_shop-cart.html",
    remoteModel: async () => await { "cartCost": await ShoppingCart.cost() },
    staticModel: {
      user_name: "Tiago",
      labelTitle: "test title",
      xpto: "a xpto val",
      xpto2: "a xpto2 title",
      cart: (() => {
        return ShoppingCart.get();
      })()
    }
  }
};
const EVENTBUS = window.EVENTBUS = new EventBus();
const App = new VanillaSpaEngine({
  routes,
  appContainer: APP_CONTAINER,
  enableCaching: ENABLE_TEMPLATE_CACHING
});
const filter = (e, filterType) => {
  if (filterType === "price") {
    if (e.detail.origin.target.id === "filter-price-min")
      FILTERS.minPrice = e.detail.args + Number.parseInt(e.detail.origin.target.value);
    if (e.detail.origin.target.id === "filter-price-max")
      FILTERS.maxPrice = e.detail.args + Number.parseInt(e.detail.origin.target.value);
  } else {
    FILTERS[filterType] = e.detail.args;
  }
  const queryString = Object.values(FILTERS).filter((v) => v.length > 0).join("&");
  App.updateCurrentModel({
    remoteModel: async () => await fetchRemoteModel(`/products?${queryString}`, "products"),
    staticModel: {
      categories: (() => {
        if (filterType === "categories") {
          CATEGORIES.forEach((el) => {
            el.active = false;
          });
          CATEGORIES.find((c) => c.filterArg === e.detail.args).active = true;
        }
        return CATEGORIES;
      })(),
      filters: (() => {
        if (filterType === "body") {
          availableFilters.body.forEach((el) => {
            el.active = false;
          });
          availableFilters.body.find((b) => b.filterArg === e.detail.args).active = true;
        }
        if (filterType === "price") {
          availableFilters.price.find((b) => b.filterArg === e.detail.args).value = e.detail.origin.target.value;
        }
        if (filterType === "sizes") {
          availableFilters.sizes.forEach((el) => {
            el.active = false;
          });
          availableFilters.sizes.find((b) => b.filterArg === e.detail.args).active = true;
        }
        return availableFilters;
      })()
    }
  });
};
const addToCart = async (e) => {
  var _a;
  const productId = Number.parseInt(e.detail.args);
  const { products, product } = await App.getCurrentModel();
  const productInstance = (_a = products == null ? void 0 : products.find((p) => p.id === productId)) != null ? _a : product;
  ShoppingCart.add(productInstance);
};
const changeQuantity = async (e, amount) => {
  const productId = Number.parseInt(e.detail.args);
  const model2 = await App.getCurrentModel();
  const cartItem = model2.cart.find((c) => c.product.id === productId);
  ShoppingCart.changeQuantity(cartItem, amount);
  App.updateCurrentModel({
    remoteModel: async () => await { "cartCost": await ShoppingCart.cost() },
    staticModel: __spreadValues({}, model2)
  });
};
const clearCart = async () => {
  ShoppingCart.clear();
  const model2 = await App.getCurrentModel();
  App.updateCurrentModel({
    staticModel: __spreadValues(__spreadValues({}, model2), { cart: [] })
  });
};
const removeFromCart = async (e) => {
  const productId = Number.parseInt(e.detail.args);
  const model2 = await App.getCurrentModel();
  const cartItem = model2.cart.find((c) => c.product.id === productId);
  ShoppingCart.remove(cartItem);
  App.updateCurrentModel({
    staticModel: __spreadValues({}, model2)
  });
};
EVENTBUS.on("product-filter-category", (e) => filter(e, "categories"));
EVENTBUS.on("product-filter-body", (e) => filter(e, "body"));
EVENTBUS.on("product-filter-price", (e) => filter(e, "price"));
EVENTBUS.on("product-filter-sizes", (e) => filter(e, "sizes"));
EVENTBUS.on("product-add-to-cart", (e) => addToCart(e));
EVENTBUS.on("product-increment-cart", (e) => changeQuantity(e, 1));
EVENTBUS.on("product-decrement-cart", (e) => changeQuantity(e, -1));
EVENTBUS.on("product-clear-cart", (e) => clearCart());
EVENTBUS.on("product-remove-from-cart", (e) => removeFromCart(e));
