/**
 * SDF Widget Template
 * In SDF Widgets are objects asociated with an html DOM element.
 * SDF Controller will query all the elements in the page which match the 
 * selector of the widget and create a new instance of the widget passing
 * the current html DOM element as an argument to the constructor of the widget.
 * In this template example:
 * All the 'button' element of the page will console.log the html element on click.
 * 
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
(function(){
    'use strict';
    /**
     * Construtor of the Widget
     * SDF Controller will call the widget constructor passing the DOM 
     * element as argument.
     * @param  {object} element DOM Element which is being initializied
     */
    var sdfWidget = function(element){
        this.element = element;
        this.initialize();
    };

    sdfWidget.prototype.clickEvent_ = function(){
        console.log(this.element);
    };

    /**
     * Initializes the widget.
     * In this example: adds click handler to the element (button) and binds
     * this to the current instance
     */
    sdfWidget.prototype.initialize = function(){
        this.clickEvent = this.clickEvent_.bind(this);
        this.element.addEventListener('click', this.clickEvent);

    };

    /**
     * Registers the widget with sdf controller
     * @param  {object} constructor 
     * @param  {string} selector
     */
    sdf.addWidget({
        constructor: sdfWidget,
        selector: 'button'
    });

})();