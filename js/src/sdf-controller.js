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

    function init(){
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
        gadgets: gadgets,
        elements: elements,
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
