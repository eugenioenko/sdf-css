/**
 * SDF Component Template
 * Components are plugins which can be registered with the SDF.
 * The component construtor should return an instance of an object. 
 * Components work almost the same as SDF Gadgets, the difference is it provide
 * facilities for creating private variables and creating new instances of objects
 * on each execution.
 * 
 * In this template example:
 * Registers a component sdfComponent with the name componentName. 
 * On each call of
 * @example
 * sdf.sdfComponent('input[type="text"]', 1, 2);
 *
 * Will return an object which contains the first element of the dom with the 
 * selector, and also the sum of arg1 and arg2.
 * 
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */

(function(){
    'use strict';

    function sdfComponent(selector, arg1, arg2){

        var element = document.querySelector(selector);       

        return {
            first: element,
            result: arg1 + arg2,
            add: function(c){
                return arg1 + argb + c;
            }
        };
    }

    /**
     * Registers the component
     * @param  {function} constructor Has to return an object
     * @param  {string} name The instance name which will be asociated with the 
     * sdf framework. In this case it will be sdf.componentName
     */
    
    sdf.addComponent({
        constructor: sdfComponent,
        name: 'componentName'
    });

})();