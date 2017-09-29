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