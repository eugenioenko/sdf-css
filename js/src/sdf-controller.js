/**
 * SDF Framework Widged/Gadget strucutre
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

