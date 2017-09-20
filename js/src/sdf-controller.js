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


    function addWidget(widget){
        widgets.push(widget);
    }

    function addGadget(gadget){
        gadgets.push(gadget);
    }

    function addComponent(component){
        components.push(component);
    }

    function init(){
        for(var i = 0; i < widgets.length; ++i){
            var elems = document.querySelectorAll(widgets[i].selector);
            for(var j = 0; j < elems.length; ++j){
                elements.push(new widgets[i].constructor(elems[j]));
            }
        }
        for (i = 0; i < components.length; i++) {
            if(typeof window["sdf"] === "undefined"){
                throw new Error("sdf controller not initialized");
            }
            sdf[components[i].name] = components[i].constructor;
        }
        for (i = 0; i < gadgets.length; i++) {
            if(typeof window["sdf"] === "undefined"){
                throw new Error("sdf controller not initialized");
            }
            sdf[gadgets[i].name] = new gadgets[i].constructor();
        }
    }

    return {
        addWidget: addWidget,
        addGadget: addGadget,
        addComponent: addComponent,
        init: init
    };

})();

window.addEventListener('load', function() {
    sdf.init();
});



/*
(function(){
    var sdfButton = function(element){
        this.element = element;
        this.initialize();
    };

    sdfButton.prototype.clickEvent_ = function(){
    };

    sdfButton.prototype.initialize = function(){
        this.clickEvent = this.clickEvent_.bind(this);
        this.element.addEventListener('click', this.clickEvent);

    };


    sdf.addWidget({
        constructor: sdfButton,
        selector: 'button'
    });

})();
*/

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

