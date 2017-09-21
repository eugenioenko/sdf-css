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
        this.elements = {};
        this.selector = '.sdf-wrapper';
        this.activated = false;
        this.open = false;
        this.init();
    };

    sdfMenu.prototype.hide = function(id){
        this.elements.navbar.setAttribute('sdf-state', 'content');
        this.elements.content.setAttribute('sdf-state', 'content');  
        this.open = false;
    };

    sdfMenu.prototype.show = function (id){
        this.elements.navbar.setAttribute('sdf-state', 'menu');
        this.elements.content.setAttribute('sdf-state', 'menu');
        this.open = true;
    };

    sdfMenu.prototype.init = function(){
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
        this.initialize();
    };

    sdfMenuToggle.prototype.clickEvent_ = function(){
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.menu.show();
            this.element.setAttribute('aria-expanded', 'true');
        } else {
            sdf.menu.hide();
            this.element.setAttribute('aria-expanded', 'false');
        }
    };

    sdfMenuToggle.prototype.initialize = function(){
        this.element.setAttribute('aria-haspopup', 'true');
        this.element.setAttribute('aria-expanded', 'false');
        this.clickEvent = this.clickEvent_.bind(this);
        this.element.addEventListener('click', this.clickEvent);
    };

    sdf.addWidget({
        constructor: sdfMenuToggle,
        selector: '.sdf-menu-toggle'
    });

})();