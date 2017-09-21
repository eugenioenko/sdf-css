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
        this.elements.navbar.setAttribute('sdf-state', 'content');
        this.elements.content.setAttribute('sdf-state', 'content');  
        this.elements.menu.setAttribute('aria-hidden', 'true');
        this.open = false;
    };

    sdfLayoutMenu.prototype.show = function (){
        this.elements.navbar.setAttribute('sdf-state', 'menu');
        this.elements.content.setAttribute('sdf-state', 'menu');
        this.elements.menu.setAttribute('aria-hidden', 'false');
        this.open = true;
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
            }
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