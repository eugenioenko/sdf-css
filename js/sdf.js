/**
 * SDF Query Plugin/Widget Controller
 * Simple utility for loading widgets and gadgets
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */

var sdf = (function(){

    'use strict';

    var widgets = [];
    var gadgets = [];
    var components = [];
    var elements = [];


    function addWidget(widget){
        widgets.push(widget);
    }

    function addGadget(gadget){
        gadgets.push(gadget);
    }

    function addComponent(component){
        components.push(component);
    }

    function initialize(){
        if(typeof window.sdf === "undefined"){
            throw new Error("sdf controller not initialized");
        }
        for(var i = 0; i < widgets.length; ++i){
            var elems = document.querySelectorAll(widgets[i].selector);
            for(var j = 0; j < elems.length; ++j){
                elements.push(new widgets[i].constructor(elems[j]));
            }
        }
        for (i = 0; i < components.length; i++) {
            sdf[components[i].name] = components[i].constructor;
        }
        for (i = 0; i < gadgets.length; i++) {
            sdf[gadgets[i].name] = new gadgets[i].constructor();
        }
    }

    return {
        addWidget: addWidget,
        addGadget: addGadget,
        addComponent: addComponent,
        initialize: initialize
    };

})();

window.addEventListener('load', function() {
    sdf.initialize();
});
/**
 * SDF Query
 * Simple utility for selecting and modifying DOM elements used by SDF CSS Framework
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @version 0.8.6
 */

(function(){

/**
 * Query Function
 *
 * This function enables you to select html elements from the DOM and return an object which
 * lets you modify their attributes, classes, values, styles and  add event handlers.
 *
 * @param  {string|object} selector A string which is gonna be used to query elements or a Node element
 * if selector starts with '#' getElementsById will be used limiting the result to 1
 * @param {number|optional}        limit If set to a number, will limit the results of the query
 * to the amount. If set to one, element will be selected by using querySelector instead of querySelectorAll.
 * @example
 * // adds an event handler for a button of id #button_id
 * sdf.$('#button_id').on('click', function(){});
 * @example
 * // sets the attribute data-item to all the li of a page
 * sdf.$('li').attr('data-item', 'value');
 * @example
 * // removes class .active from all h2 of the page
 * sdf.$('h2.active').removeClass('active');
 * // removes class .active from 3 of h2 of the page
 * sdf.$('h2.active', 3).removeClass('active');
 * @example
 * // Iterates over all the ul of a page and appends an li and prepends li
 * sdf.$('ul').append('<li>appended</li>').prepend('<li>prepended</li>');
 * @example
 *  // Custom iterator
 *  sdf.$('span').each(function(){ sdf.$(this).attr('data-active', 'false')});
 *  // Chaining
 *  sdf.$('span[data-attr="value"]').prepend('<br>').append('!');
 * @return {object} Which contains the methods for dom manipulation.
 *
 */
    function sdfQuery(selector, limit){

        var emptyNodeList = function(nodeList){
            return nodeList.length == 0;
        };
        var validArguments = function(args){
            if(args.length != (arguments.length-1)){
                return false;
            }
            for(var i = 0; i < args.length; ++i){
                if(arguments[i+1] === "any"){
                    // cast to string
                    args[i] = (args[i]).toString();
                } else if(arguments[i+1] === "str|obj"){
                    if(typeof args[i] !== "string" && typeof args[i] !== "object"){
                        args[i] = (args[i]).toString();
                    }
                } else {
                    if(typeof args[i] !== arguments[i+1]) return false;
                }
            }
            return true;
        };
        var emptyArguments = function(args){
            return args.length == 0;
        };
        var createClassList = function(classList){
            var classes = classList.split(' ');
            for (var i = 0; i < classes.length; ++i){
                classes[i] = classes[i].replace(' ', '');
            }
            return classes;
        };

        limit = (typeof limit === "undefined") ? -1 : limit;
        var elements =  [];
        var element = {};
        var method = '';
        if (arguments.length) {
            if (typeof selector === "string"){
                selector = selector.trim();
                if(selector.charAt(0) == '#'){
                    method = 'getElementById';
                    element = document.getElementById(selector.substring(1));
                    if(element){
                        elements.push(element);
                    }
                } else if(limit == 1){
                    method = "querySelector";
                    element = document.querySelector(selector);
                    if(element){
                        elements.push(element);
                    }
                } else {
                    method = "querySelectorAll";
                    var nodes = document.querySelectorAll(selector);
                    if(limit == -1){
                        limit = nodes.length;
                    } else {
                        limit = limit > nodes.length ? nodes.length : limit;
                    }
                    for(var i = 0; i < limit; ++i){
                        elements.push(nodes[i]);
                    }
                }
            } else if(typeof selector === "object" && selector instanceof Node){
                method = "element";
                elements.push(selector);
                selector = false;
            }else {
                method = "error";
                // selector is not a string nor a dom Node
                console.error(selector + " is not a string, 'query' requires a string as selector");
                selector = false;
            }
        } else {
            method ="null";
            // null selector used for create
            selector = false;
        }

        return {
            selector: selector,
            nodes: elements,
            length: elements.length,
            method: method,

        /**
         * Adds event listener to the selected elements
         * this points to the current iterated element
         * @param  {string}   event  Type of the event to listen to
         * @param  {function} method Method to execute on the event
         * @example
         * sdf.$('selector').on('click', function(){ //to do });
         * @return {object}   Query object for nesting
         */
            on: function(event, method){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for on method');
                    return this;
                }
                if(validArguments(arguments, "string", "function")){
                    // adding event listeners
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].addEventListener(event, method);
                    }
                } else {
                    throw new Error("'on' requires event {string} and method {function}");
                }
                return this;
            },
        /**
         * Iterates over the list of  nodes and passes the iterated element
         * as this to the function set in the argument
         * @param  {function} method A function to execute for each node,
         *   "this" is gonna be set to the current iterated element
         * @this Current iterated element
         * @example
         * // Iterates over buttons with class active, gets the attribute data-state,
         * does something and finally sets it to false
         * sdf.$('button.active').each(function(){
         *   var state = sdf.$(this).attr('data-state');
         *   // to do
         *   sdf.$(this).attr('data-state', 'false');
         * });
         * @return {object}        Query object for nesting
         */
            each: function(method){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for each');
                    return this;
                }
                if(validArguments(arguments, "function")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        method.call(this.nodes[i]);
                    }
                } else {
                    console.error(method + " is not a function, 'each' requires a function as argument");
                }
                return this;
            },
        /**
         * Sets the innerHTML of each elements in the list or
         * Gets the value of innerHTML of the first element if no arguments
         * @param  {string} value Optional, the new innerHTML value
         * @example
         * // sets inner conent of body
         * sdf.$('body', 1).html('<h1>Hello, World!</h1>');
         * // gets the html of the body
         * var body = sdf.$('body', 1).html();
         * @return {object|string}        Query object for nesting or value if getter
         */
            html: function(value){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for html');
                    return this;
                }
                if(emptyArguments(arguments)){
                    return this.nodes[0].innerHTML;
                }
                if(validArguments(arguments, "any")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].innerHTML = value;
                    }
                } else {
                    console.error("'html' takes value {any} as argument or no arguments.");
                }
                return this;
            },
        /**
         * Sets the textContent of each elements in the list or
         * Gets the value of textContent of the first element if no arguments
         * @param  {string} value Optional, the new textContent value
         * @example
         * // gets the textContent of the element with id #element
         * var text = sdf.$('#element').text();
         * // sets the textContent of all the first 3 li of ul#list
         * sdf.$('ul#list>li', 3).text('Hello, World!');
         * @return {mixed}        Query object for nesting or value if getter
         */
            text: function(value){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for text');
                    return this;
                }
                if(emptyArguments(arguments)){
                    return this.nodes[0].textContent;
                }
                if(validArguments(arguments, "any")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].textContent = value;
                    }
                } else {
                    console.error("'text' takes value {any} as argument or no arguments.");
                }
                return this;
            },
        /**
         * Sets the attribute of each elements in the list or
         * Gets the value of attribute of the first element if no arguments
         * @param {string} attr Attribute to be set
         * @param  {string} value Optional, the new attribute value
         * @example
         * // reads the attribute data-date from a clicked button
         * sdf.$('button').click(function(){
         *   var date = sdf.$(this).attr('data-date');
         *   // to do
         *   sdf.$(this).attr('data-date', date);
         * });
         * @return {mixed}        Query object for nesting or value if getter
         */
            attr: function(attr, value){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for text');
                    return this;
                }
                if(emptyArguments(arguments)){
                    console.error("'attr' requires at least one argument as attribute{string}");
                    return this;
                }
                if(arguments.length == 1){
                    if(validArguments(arguments, "string")){
                         return this.nodes[0].getAttribute(attr);
                    } else {
                        console.error("'attr' takes attribute {string} as argument for getter");
                        return this;
                    }
                }
                if(validArguments(arguments, "string", "any")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].setAttribute(attr, value);
                    }
                } else {
                    console.error("'attr' takes two attribute {string}, value{any} as setter");
                }
                return this;
            },
        /**
         * Sets the style of each elements in the list or
         * Gets the value of style of the first element if no arguments
         * @param {string} attr Attribute to be set
         * @param  {string} value Optional, the new style value
         * @example
         * // reads the style data-date from a clicked button
         * sdf.$('button').click(function(){
         *   var opacity = sdf.$(this).css('opacity');
         *   // to do
         *   opacity -= 0.3;
         *   sdf.$(this).css('opacity', opacity);
         *   sdf.$(this).css({opacity: 1, color: 'red'});
         * });
         * @return {mixed}        Query object for nesting or value if getter
         */
            css: function(style, value){
                var i = 0;
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for text');
                    return this;
                }
                if(emptyArguments(arguments)){
                    console.error("'css' requires at least one argument as style getter {string} or {object} as setter");
                    return this;
                }
                if(arguments.length == 1){
                    if(validArguments(arguments, "string")){
                        // getter
                         return this.nodes[0].style[style];
                    } else if(validArguments(arguments, "object")){
                        value = style;
                        // setter with object param
                        for (i = 0; i < this.nodes.length; ++i) {
                            for(var key in value){
                                if(!value.hasOwnProperty(key)) continue;
                                this.nodes[i].style[key] = value[key];
                            }
                        }
                        return this;
                    } else {
                        console.error("'css' takes style {string} as argument for getter or object as setter");
                        return this;
                    }
                }
                if(validArguments(arguments, "string", "str|obj")){
                    for (i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].style[style] = value;
                    }
                } else {
                    console.error("'css' takes value {string|object} as argument");
                    return this;
                }

                return this;
            },
        /**
         * Removes an attribute from each element in the list
         * @param  {string} attr Name of the attribute to be removed from the element
         * @example
         * // removes the attribute 'data-active' from all the div with data-active="false"
         * sdf.$('div[data-active="false"]').removeAttr('data-active');
         * @return {object}        Query object for nesting
         */
            removeAttr: function(attrName){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for append');
                    return this;
                }
                if(!validArguments(arguments, "any")){
                    console.error("'append' takes string{any} as argument");
                    return this;
                }
                for (var i = 0; i < this.nodes.length; ++i) {
                    this.nodes[i].removeAttribute(attrName);
                }
                return this;
            },
        /**
         * Sets the value of each elements in the list or
         * Gets the value of value of the first element if no arguments
         * @param  {string} val Optional, the new value value
         * @example
         * // gets the value of the input with id #input_1
         * var val = sdf.$('input#input_1').value();
         * @return {object}        Query object for nesting
         */
            value: function(val){
                if(emptyNodeList(this.nodes)) {
                    console.error("No inputs with selector: " + this.selector + ' for value');
                    return this;
                }
                if(emptyArguments(arguments)){
                    return this.nodes[0].value;
                }
                if(validArguments(arguments, "any")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].value = val;
                    }
                } else {
                    console.error("'value' takes value {string} as argument or no arguments.");
                }
                return this;
            },

        /**
         * Creates a html element to be later appended with append
         * @param  {string} type The type of element: div,li, button, a...
         * @param  {string} html Inner html of the element
         * @return {object}      Node element of DOM
         * @example
         * // creates a node and appends it
         * sdf.$('ul').append(sdf.$().create('li', 'list item A'));
         */
            create: function(type, html){
                if(validArguments(arguments, "string", "string")){
                    var element = document.createElement(type);
                    element.innerHTML = html;
                    return element;
                } else {
                    console.error("'create' takes type{string} and html{string} as argument");
                    return this;
                }

            },
        /**
         * Returns the first element in the list
         * @return {object} Element
         */
            element: function(){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for value');
                    return this;
                }
                return this.nodes[0];
            },
            first: function(){
                return this.element();
            },

        /**
         * Appends a string or Node to an element
         * If a string representing an html element is used, the function will iterate over
         * every element of the list from the selector. The append is gonna be done with innerHTML.
         * if a Node is used as argument, it will append it only to the first element of the list
         * with appendChild. Use 'each' if you want to iterate over every element
         * @param  {string|object} value String or Node to be appended
         * @example
         * // adds a '<i>!</i>' to every link
         * sdf.$('a').append('<i>!</i>');
         * // adds a '<span><i>!</i><i>!</i><i>!</i></span>' to the first link
         * sdf.$('a').append(sdf.$().create('span', '<i>!</i><i>!</i><i>!</i>'));
         * // same as above but for each element. Works the fastest most of the time;
         * sdf.$('a').each(function(){
         *   sdf.$(this).append(sdf.$().create('span', '<i>!</i><i>!</i><i>!</i>'));
         * });
         * @return {object}        Query object for nesting
         */
            append: function(value){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for append');
                    return this;
                }
                if(validArguments(arguments, "str|obj")){
                    if(typeof value === "string"){
                        for (var i = 0; i < this.nodes.length; ++i) {
                            this.nodes[i].innerHTML += value;
                        }
                    } else {
                        this.nodes[0].appendChild(value);
                    }
                } else {
                    console.error("'append' takes value{string|node} as argument");
                }
                return this;
            },
        /**
         * Prepends a string to each element in the list
         * @param  {string} value String to be prepended
         * @return {object}        Query object for nesting
         */
            prepend: function(value){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for prepend');
                    return this;
                }
                if(validArguments(arguments, "string")){
                    for (var i = 0; i < this.nodes.length; ++i) {
                        this.nodes[i].innerHTML = value + this.nodes[i].innerHTML;
                    }
                } else {
                    console.error("'prepend' takes string{string} as argument");
                }
                return this;

            },
        /**
         * Adds class to elements in the list
         * @param  {string} classList List of classes separated by space
         * @return {object}        Query object for nesting
         * @example
         * // adds classes through custom iterator
         * sdf.$('li').each(function(){
         *   sdf.$(this).addClass('class-1 class-2 class-3');
         * });
         * @example
         * // adds classes through method
         * sdf.$('li').addClass('class-1 class-2 class-3')
         */
            addClass: function(classList){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for addClass');
                    return this;
                }
                if(!validArguments(arguments, "string")){
                    console.error("'addClass' takes classList{string} as argument");
                    return this;
                }
                var classes = createClassList(classList);
                for (var i = 0; i < this.nodes.length; ++i) {
                    for(var j = 0; j < classes.length; ++j){
                        if(classes[j] != ''){
                            this.nodes[i].classList.add(classes[j]);
                        }
                    }
                }
                return this;
            },
        /**
         * Removes classes from  elements in the list
         * @param  {string} classList List of classes separated by space
         * @example
         *  // removes the classes ".class-1, .class-2" from the first 10 elements with class .class-0
         *  sdf.$('.class-0').removeclass('class-1 class-2');
         * @return {object}        Query object for nesting
         */
            removeClass: function(classList){
                if(emptyNodeList(this.nodes)) {
                    console.error("No elements with selector: " + this.selector + ' for removeClass');
                    return this;
                }
                if(!validArguments(arguments, "string")){
                    console.error("'removeClass' takes classList{string} as argument");
                    return this;
                }
                var classes = createClassList(classList);
                for (var i = 0; i < this.nodes.length; ++i) {
                    for(var j = 0; j < classes.length; ++j){
                        if(classes[j] != ''){
                            this.nodes[i].classList.remove(classes[j]);
                        }
                    }
                }
                return this;
            },
        /**
         * Removes each element from the page
         * @return {object}        Query object for nesting
         * @example
         * // destroys the body
         * sdf.$('body', 1).remove();
         */
            remove: function(){
                for (var i = 0; i < this.nodes.length; ++i) {
                    this.nodes[i].parentNode.removeChild(this.nodes[i]);
                }
                this.nodes = [];
                this.selector = null;
                this.length = 0;
                return this;
            }
        };
    }


    sdf.addComponent({
        constructor: sdfQuery,
        name: '$'
    });

})();
/**
 * SDF Toasts
 * Toast Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */

(function(){
    'use strict';
    var sdfToast = function(){
        this.id = 0;
        this.toasts = [];
        this.containers = {};
        this.createContainers();
    };
    sdfToast.prototype.createContainers = function() {
        var positions = ["top", "bottom"];
        for(var i = 0; i < positions.length; ++i){
            var position = positions[i];
            if(!document.querySelector('.sdf-toast-container-' + position)){
                var container = document.createElement('div');
                container.className = 'sdf-toast-container-' + position;
                document.body.appendChild(container);
                this.containers[position] = container;
            }
        }

    };
    sdfToast.prototype.createButton = function(action){
        var config = {
            text: 'OK',
            class: 'sdf-btn sdf-primary',
            action: false
        };
        if(typeof action !== "undefined"){
            for(var key in action) config[key] = action[key];
        }
        var button = document.createElement('button');
        button.className = config.class;
        button.innerHTML = config.text;
        if(config.action){

        }
        button.addEventListener('click', (function(method, that, toast_id){
            return function(){
                if(method){
                    method.bind(that)();
                }
                that.hide(toast_id);
            };
        })(config.action, this, this.id));
        return button;

    };

    sdfToast.prototype.createButtonGroup = function(config){
        var group = document.createElement('div');
        group.className = "sdf-alert-footer sdf-btn-group " + config.group;
        for(var i = 0; i < config.buttons.length; ++i){
            group.appendChild(this.createButton(config.buttons[i]));
        }
        return group;
    };

    sdfToast.prototype.createBody = function(message, align){
        var body = document.createElement('div');
        body.className = "sdf-alert-body " + align + ' ';
        body.innerHTML += message;
        return body;
    };

    sdfToast.prototype.hide = function(id){
        if(this.toasts[id]){
            var position = this.toasts[id].getAttribute('data-position');
            if(position == "top") {
                this.toasts[id].style.bottom = "0";
            } else{
                this.toasts[id].style.top = "0";
            }
            setTimeout(
                (function(toasts, id){
                    return function(){
                        toasts[id].remove();
                        toasts[id] = false;
                    };
                })(this.toasts, id),1000);
        }
    };

    sdfToast.prototype.show = function (message, settings){
        var config = {
            class: "sdf-primary",
            align: "sdf-text-center",
            position: "bottom",
            group: "sdf-horizontal-right",
            duration: 4000,
            buttons: []
        };
        if(typeof settings !== "undefined"){
            for(var key in settings) config[key] = settings[key];
        }
        var container = this.containers[config.position];
        var dom_id = 'sdf-toast-' + this.id;
        var toast = document.createElement('div');
        toast.setAttribute('id', dom_id);
        toast.className = "sdf-alert sdf-toast sdf-toast-" +
            config.position + ' ' + config.class;
        toast.setAttribute('data-position', config.position);
        toast.appendChild(this.createBody(message, config.align));
        if(config.buttons.length){
            toast.appendChild(this.createButtonGroup(config));
        }
        if(config.position == "top") {
            toast.style.bottom = "0";
        } else{
            toast.style.top = "0";
        }

        container.appendChild(toast);
        this.toasts.push(toast);

        //animation
        if(config.position == "top") {
            toast.style.bottom = '-' + toast.clientHeight + "px";
        } else{
            toast.style.top = '-' + toast.clientHeight + "px";
        }

        //destruct afte duration timeout
        setTimeout(
            (function(that, toast_id){
                return function(){
                    that.hide(toast_id);
                };
            })(this, this.id), config.duration);

        return (this.id++);
    };

    //register component

    sdf.addGadget({
        constructor: sdfToast,
        name: 'toast'
    });

})();
/**
 * SDF Toasts
 * Toast Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfDropdown = function(){
        this.dropdowns = {};
        this.selector = '[sdf-dropdown-menu]';
        this.initialize();
    };

    sdfDropdown.prototype.hide = function(id){
        var popup = this.dropdowns[id];
        if(popup && popup.element.getAttribute('sdf-transitioning') == 'false'){
            popup.open = false;
            popup.element.setAttribute('sdf-transitioning', 'true');
            popup.element.setAttribute('aria-hidden', 'true');
            setTimeout(
                (function(element){
                    return function(){
                        element.style.display = 'none';
                        element.setAttribute('sdf-transitioning', 'false');
                    };
                })(popup.element), 500);
            if(popup.toggle){
                popup.toggle.setAttribute('aria-expanded', 'false');
            }
        }
    };
    sdfDropdown.prototype.hideAll = function(){
        for(var id in this.dropdowns){
            if(
                this.dropdowns.hasOwnProperty(id) &&
                this.dropdowns[id].open == true
            ){
                this.hide(id);
            }
        }
    };

    sdfDropdown.prototype.show = function (id){
        this.hideAll();
        var popup = this.dropdowns[id];
        if(popup && popup.element.getAttribute('sdf-transitioning') == 'false'){
            popup.open = true;
            popup.element.setAttribute('sdf-transitioning', 'true');
            popup.element.style.display = 'block';
            setTimeout(
                (function(element){
                    return function(){
                        element.setAttribute('sdf-transitioning', 'false');
                        element.setAttribute('aria-hidden', 'false');
                    };
                })(popup.element), 10);
            if(popup.toggle){
                popup.toggle.setAttribute('aria-expanded', 'true');
            }
        }

    };
    var clickEventGenerator = function(that, id){
        return function(){
            that.hide(id);
        };
    };
    sdfDropdown.prototype.initialize = function(){
        var elements = document.querySelectorAll(this.selector);
        for (var i = elements.length - 1; i >= 0; i--) {
            var element = elements[i];
            // gets or creates an id for the dropdown
            var id = element.getAttribute('id');
            if(!id){
                id = "sdf-dropdown-" + i;
                element.setAttribute('id', id);
            }
            // gets or sets initial state for dropdown: closed or opened
            element.setAttribute('aria-hidden', 'true');
            element.setAttribute('sdf-transitioning', 'false');
            var toggle = document.querySelector('[sdf-dropdown-toggle="' + id + '"]');
            if(toggle){
                var toggleId = toggle.getAttribute('id');
                if(!toggleId){
                    toggleId = "sdf-dropdown-toggle-" + i;
                    toggle.setAttribute('id', toggleId);
                }
                toggle.setAttribute('aria-expanded', 'false');
                element.setAttribute('aria-labelledby', toggleId);
            }
            // sets position of dropdown to top-left if no option set
            var position = element.getAttribute('sdf-dropdown-menu');
            if(!position){
                element.setAttribute('sdf-dropdown-menu', 'top-left');
            }
            // puts the current dropdown into the list
            this.dropdowns[id] = {
                element: element,
                toggle: toggle,
                open: false
            };
            element.addEventListener('click', clickEventGenerator(this, id));
            document.body.addEventListener('click', (function(dropdown){
                return function(){
                    dropdown.hideAll();
                };
            })(this));
        }
    };

    //register component
    sdf.addGadget({
        constructor: sdfDropdown,
        name: 'dropdown'
    });

})();

 (function(){
    var sdfDropdownToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-dropdown-toggle');
        this.initialize();
    };

    sdfDropdownToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.dropdown.show(this.target);
        } else {
            sdf.dropdown.hide(this.target);
        }
    };

    sdfDropdownToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfDropdownToggle,
        selector: '[sdf-dropdown-toggle]'
    });

})();
/**
 * SDF Collapse
 * Collapse Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfCollapse = function(){
        this.collapses = {};
        this.selector = '.sdf-collapse';
        this.initialize();
    };

    sdfCollapse.prototype.hide = function(id){
        var collapse = this.collapses[id];
        if(collapse && collapse.element.getAttribute('sdf-transitioning') == 'false'){
            collapse.open = false;
            collapse.element.setAttribute('sdf-transitioning', 'true');
            var height = collapse.element.offsetHeight;
            collapse.element.style.height = height;
            TweenLite.to(collapse.element.style, 0.5, {
                height: 0,
                onCompleteScope: collapse.element,
                onComplete: function(){
                    this.setAttribute('sdf-transitioning', 'false');
                    collapse.element.setAttribute('aria-hidden', 'true');
                    this.style.display = '';
                    this.style.height = '';
                }
            });

            if(collapse.toggle){
                collapse.toggle.setAttribute('aria-expanded', 'false');
            }
        }
    };

    sdfCollapse.prototype.show = function (id){
        var collapse = this.collapses[id];
        if(collapse && collapse.element.getAttribute('sdf-transitioning') == 'false'){
            collapse.open = true;
            collapse.element.setAttribute('sdf-transitioning', 'true');
            collapse.element.style.visibility = 'hidden';
            collapse.element.style.display = 'block';
            var height = collapse.element.offsetHeight;
            collapse.element.style.height = 0;
            TweenLite.to(collapse.element.style, 0.5, {
                visibility: 'visible',
                height: height,
                onCompleteScope: collapse.element,
                onComplete: function(){
                    this.setAttribute('sdf-transitioning', 'false');
                    collapse.element.setAttribute('aria-hidden', 'false');
                    this.style.visibility = '';
                    this.style.display = '';
                    this.style.height = '';
                }
            });
            if(collapse.toggle){
                collapse.toggle.setAttribute('aria-expanded', 'true');
            }
        }

    };
    var clickEventGenerator = function(that, id){
        return function(){
            that.hide(id);
        };
    };
    sdfCollapse.prototype.checkTweenLite = function(){
        if(typeof TweenLite == "undefined"){
            console.warn("sdfCollapse requies TweenLite.js, please add it to your source. otherwise collapse functionality will stay disabled");
            return false;
        }
        return true;
    };
    sdfCollapse.prototype.initialize = function(){
        if(!this.checkTweenLite()){
            return;
        }
        var elements = document.querySelectorAll(this.selector);
        for (var i = elements.length - 1; i >= 0; i--) {
            var element = elements[i];
            // gets or creates an id for the collapse
            var id = element.getAttribute('id');
            if(!id){
                id = "sdf-collapse-" + i;
                element.setAttribute('id', id);
            }
            // gets or sets initial state for collapse: closed or opened
            element.setAttribute('aria-hidden', 'true');
            element.setAttribute('sdf-transitioning', 'false');
            element.style.display = 'none';
            var toggle = document.querySelector('[sdf-collapse-toggle="' + id + '"]');
            if(toggle){
                var toggleId = toggle.getAttribute('id');
                if(!toggleId){
                    toggleId = "sdf-collapse-toggle-" + i;
                    toggle.setAttribute('id', toggleId);
                }
                element.setAttribute('aria-labelledby', toggleId);
                toggle.setAttribute('aria-expanded', 'false');
            }
            // puts the current collapse into the list
            this.collapses[id] = {
                element: element,
                toggle: toggle,
                open: false
            };
            element.addEventListener('click', clickEventGenerator(this, id));
        }
    };

    //register component
    sdf.addGadget({
        constructor: sdfCollapse,
        name: 'collapse'
    });

})();

 (function(){
    var sdfCollapseToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-collapse-toggle');
        this.initialize();
    };

    sdfCollapseToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.collapse.show(this.target);
        } else {
            sdf.collapse.hide(this.target);
        }
    };

    sdfCollapseToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfCollapseToggle,
        selector: '[sdf-collapse-toggle]'
    });

})();
/**
 * SDF Side Menu
 * Side Menu Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfMenu = function(){
        this.menus = {};
        this.selector = '[sdf-menu]';
        this.initialize();
    };

    sdfMenu.prototype.hide = function(id){
        if(this.menus[id] && this.menus[id].getAttribute('sdf-transitioning') == 'false'){
            this.menus[id].setAttribute('aria-hidden', 'true');
            this.menus[id].setAttribute('sdf-transitioning', 'true'); 
            setTimeout(
                (function(element){
                    return function(){
                        element.style.visibility = 'hidden';
                        element.setAttribute('sdf-transitioning', 'false');
                    };
                })(this.menus[id]), 500);
        }
    };
    sdfMenu.prototype.hideAll = function(){
        for(var key in this.menus){
            if(!this.menus.hasOwnProperty(key)) continue;
            if(this.menus[key].getAttribute('aria-hidden') == 'false'){
                this.hide(key);
            }
        }
    };

    sdfMenu.prototype.show = function (id){
        if(this.menus[id] && this.menus[id].getAttribute('sdf-transitioning') == 'false'){
            this.menus[id].style.visibility = 'visible';
            this.menus[id].setAttribute('aria-hidden', 'false');  
            this.menus[id].setAttribute('sdf-transitioning', 'true'); 
            setTimeout(
                (function(element){
                    return function(){
                        element.setAttribute('sdf-transitioning', 'false');
                    };
                })(this.menus[id]), 500); 
        } 
    };

    sdfMenu.prototype.initialize = function(){
        var menus = document.querySelectorAll(this.selector);
        for (var i = menus.length - 1; i >= 0; i--) {
            var menu = menus[i];
            menu.setAttribute('sdf-transitioning', 'false');
            menu.setAttribute('aria-hidden', 'true');
            var position = menu.getAttribute('sdf-menu');
            if(!position){
                position = "left";
            }
            var id = menu.getAttribute('id');
            if(!id){
                id = 'sdf-menu-' + i;
                menu.setAttribute('id', id);
            }
            this.menus[id] = menu;

        }
        document.body.addEventListener('click', (function(menu){
            return function(){
                menu.hideAll();
            };
        })(this));
    };


    //register component
    sdf.addGadget({
        constructor: sdfMenu,
        name: 'menu'
    });

})();


 (function(){
    var sdfMenuToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-menu-toggle');
        this.initialize();
    };

    sdfMenuToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(sdf.menu.menus[this.target].getAttribute('aria-hidden') == 'true'){
            sdf.menu.show(this.target);
        } else {
            sdf.menu.hide(this.target);
        }
    };

    sdfMenuToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.element.setAttribute('aria-expanded', 'false');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };

    sdf.addWidget({
        constructor: sdfMenuToggle,
        selector: '[sdf-menu-toggle]'
    });

})();
/**
 * SDF Tabs
 * Tabs Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfTab = function(id, toggle, tabview, parent){
        this.toggle = toggle;
        this.tabview = tabview;
        this.parent = parent;

        toggle.setAttribute('aria-haspopup', 'true');
        var expanded = toggle.getAttribute('aria-expanded');
        if(!expanded){
            expanded = 'false';
            toggle.setAttribute('aria-expanded', 'false');
        }
        if(expanded == 'false'){
            tabview.setAttribute('aria-hidden', 'true');
        } else {
            tabview.setAttribute('aria-hidden', 'false');
            this.parent.active = id;
        }
       toggle.addEventListener('click', (function(tabMenu, id){
            return function(){
                tabMenu.show(id);
            };
        })(this.parent, id));

    };

    var sdfTabMenu = function(element, index){
        this.element = element;
        this.id = element.getAttribute('id');
        this.tabs = {};
        this.active = {};
        if(!this.id){
            this.id = "sdf-tab-menu-" + index;
            this.element.setAttribute('id', this.id);
        }
        var toggles = this.element.querySelectorAll('[sdf-tab-toggle]');
        for(var i = 0; i < toggles.length; ++i) {
            var toggle = toggles[i];
            var tabId = toggle.getAttribute('sdf-tab-toggle');
            var tabview = document.getElementById(tabId);
            if(tabview){
                this.tabs[tabId] = new sdfTab(tabId, toggle, tabview, this);
            }else{
                this.tabs[this.id] = false;
            }
        }
    };
    sdfTabMenu.prototype.show = function(id){
        this.tabs[this.active].tabview.setAttribute('aria-hidden', 'true');
        this.tabs[this.active].toggle.setAttribute('aria-expanded', 'false');
        this.tabs[id].tabview.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');
        this.active = id;
    };

    var sdfTabs = function(){
        this.tabMenus = {};
        this.initialize();
    };


    sdfTabs.prototype.show = function(id){
        var tab = this.tabs[id];

        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');

        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');
    };

    sdfTabs.prototype.initialize = function(){
        var tabMenus = document.querySelectorAll('[sdf-tab-menu]');
        for (var i = tabMenus.length - 1; i >= 0; i--) {
            var tabMenu = new sdfTabMenu(tabMenus[i], i);
            this.tabMenus[tabMenu.id] = tabMenu;
        }
    };

    //register component
    sdf.addGadget({
        constructor: sdfTabs,
        name: 'tab'
    });

})();

 (function(){
    var sdfTabsToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-dropdown-toggle');
        this.initialize();
    };

    sdfTabsToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.dropdown.show(this.target);
        } else {
            sdf.dropdown.hide(this.target);
        }
    };

    sdfTabsToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfTabsToggle,
        selector: '[sdf-dropdown-toggle]'
    });

})();
/**
 * SDF Side Menu
 * Side Menu Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfLayoutMenu = function(){
        this.elements = {};
        this.selector = '.sdf-wrapper';
        this.activated = false;
        this.open = false;
        this.initialize();
    };
    sdfLayoutMenu.prototype.hide = function(){
        if(this.activated){
            this.elements.navbar.setAttribute('sdf-state', 'content');
            this.elements.content.setAttribute('sdf-state', 'content');
            this.elements.menu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'initial';
            this.open = false;
        }
    };

    sdfLayoutMenu.prototype.show = function (){
        if(this.activated){
            this.elements.navbar.setAttribute('sdf-state', 'menu');
            this.elements.content.setAttribute('sdf-state', 'menu');
            this.elements.menu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            this.open = true;
        }
    };

    sdfLayoutMenu.prototype.initialize = function(){
        var wrapper = document.querySelector('.sdf-layout-wrapper');
        if(wrapper){
            var menu = document.querySelector('.sdf-layout-menu');
            var content = document.querySelector('.sdf-layout-content');
            var navbar = document.querySelector('.sdf-layout-navbar');
            if(navbar){
                navbar.setAttribute('sdf-state', 'content');
            }
            if(menu && content){
                var hidden = menu.getAttribute('aria-hidden');
                if(hidden != 'false'){
                    menu.setAttribute('aria-hidden', 'true');
                }
                var position = menu.getAttribute('sdf-position');
                if(!position){
                    menu.setAttribute('sdf-position', 'left');
                }
                menu.setAttribute('aria-hidden', 'true');
                menu.setAttribute('sdf-state', 'content');
                content.setAttribute('sdf-state', 'content');
                this.elements = {
                    menu: menu,
                    content: content,
                    navbar: navbar
                };
                this.activated = true;
            }
        }
        document.body.addEventListener('click', (function(mainmenu){
            return function(){
                mainmenu.hide();
            };
        })(this));
    };

    //register component
    sdf.addGadget({
        constructor: sdfLayoutMenu,
        name: 'mainmenu'
    });

})();


 (function(){
    var sdfLayoutMenuToggle = function(element){
        this.element = element;
        this.initialize();
    };

    sdfLayoutMenuToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(!sdf.mainmenu.open){
            sdf.mainmenu.show();
            this.element.setAttribute('aria-expanded', 'true');
        } else {
            sdf.mainmenu.hide();
            this.element.setAttribute('aria-expanded', 'false');
        }
    };

    sdfLayoutMenuToggle.prototype.initialize = function(){
        this.element.setAttribute('aria-haspopup', 'true');
        this.element.setAttribute('aria-expanded', 'false');
        this.clickEvent = this.clickEvent_.bind(this);
        this.element.addEventListener('click', this.clickEvent);
    };

    sdf.addWidget({
        constructor: sdfLayoutMenuToggle,
        selector: '.sdf-layout-menu-toggle'
    });

})();


/*
 *
 * This content is released under the MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */