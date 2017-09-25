/**
 * SDF Gadget Template
 * Gadgets are plugins which can be registered with the SDF.
 * On initialization, SDF Controller will create an instance of the Gadget and
 * let its public methods to be called through itself.
 * 
 * In this template example:
 * Registers a gadget with the name 'gadgetName' and a public method.
 * Once the sdf is initialized, the methods could be accesed as follow:
 * 
 * @example
 * sdf.gadgetName.publicMethod(arg1, arg2, arg3);
 * 
 * Gadgets don't have an html dom element asociated with them. In the case of SDF
 * gadgets are used in the case of alerts, toasts, modals and similar components
 * which require creating new elements after each call.
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */

(function(){
    'use strict';

    var sdfGadget = function(){
        this.member = 'member';
    };
    
    sdfGadget.prototype.publicMethod = function (arg1, arg2, arg3){
        console.log(this.member);
        console.log(arg1);
    };

     /**
     * Registers the gadget with sdf controller
     * @param  {object} constructor 
     * @param  {string} name The instance name which will be asociated with the 
     * sdf framework. In this case it will be sdf.gadgetName
     */
    sdf.addGadget({
        constructor: sdfGadget,
        name: 'gadgetName'
    });

})();