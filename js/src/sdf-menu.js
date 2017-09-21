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
        this.menus[id].setAttribute('aria-hidden', 'true');
        setTimeout(
            (function(element){
                return function(){
                    element.style.visibility = 'hidden';

                };
            })(this.menus[id]),1000);
    };
    sdfMenu.prototype.hideAll = function(){
        for(var key in this.menus){
            if(!this.menus.hasOwnProperty(key)) continue;
            if(this.menus[key].getAttribute('aria-hidden') == 'false'){
                this.hide(key);
            }
        }
    }

    sdfMenu.prototype.show = function (id){
        this.menus[id].style.visibility = 'visible';
        this.menus[id].setAttribute('aria-hidden', 'false');
    };

    sdfMenu.prototype.initialize = function(){
        var menus = document.querySelectorAll(this.selector);
        for (var i = menus.length - 1; i >= 0; i--) {
            var menu = menus[i];
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
            }
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