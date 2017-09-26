/**
 * SDF Tabs
 * Tabs Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfTab = function(id, toggle, tabview, parent){
        this.toggle = toggle;
        this.tabview = tabview;
        this.parent = parent;

        toggle.setAttribute('aria-haspopup', 'true');
        var expanded = toggle.getAttribute('aria-expanded');
        if(!expanded){
            expanded = 'false';
            toggle.setAttribute('aria-expanded', 'false');
        }
        if(expanded == 'false'){
            tabview.setAttribute('aria-hidden', 'true');
        } else {
            tabview.setAttribute('aria-hidden', 'false');
            this.parent.active = id;
        }
       toggle.addEventListener('click', (function(tabMenu, id){
            return function(){
                tabMenu.show(id);
            };
        })(this.parent, id));

    };

    var sdfTabMenu = function(element, index){
        this.element = element;
        this.id = element.getAttribute('id');
        this.tabs = {};
        this.active = {};
        if(!this.id){
            this.id = "sdf-tab-menu-" + index;
            this.element.setAttribute('id', this.id);
        }
        var toggles = this.element.querySelectorAll('[sdf-tab-toggle]');
        for(var i = 0; i < toggles.length; ++i) {
            var toggle = toggles[i];
            var tabId = toggle.getAttribute('sdf-tab-toggle');
            var tabview = document.getElementById(tabId);
            if(tabview){
                this.tabs[tabId] = new sdfTab(tabId, toggle, tabview, this);
            }else{
                this.tabs[this.id] = false;
            }
        }
    };
    sdfTabMenu.prototype.show = function(id){
        this.tabs[this.active].tabview.setAttribute('aria-hidden', 'true');
        this.tabs[this.active].toggle.setAttribute('aria-expanded', 'false');
        this.tabs[id].tabview.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');
        this.active = id;
    };

    var sdfTabs = function(){
        this.tabMenus = {};
        this.initialize();
    };


    sdfTabs.prototype.show = function(id){
        var tab = this.tabs[id];

        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');

        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');
    };

    sdfTabs.prototype.initialize = function(){
        var tabMenus = document.querySelectorAll('[sdf-tab-menu]');
        for (var i = tabMenus.length - 1; i >= 0; i--) {
            var tabMenu = new sdfTabMenu(tabMenus[i], i);
            this.tabMenus[tabMenu.id] = tabMenu;
        }
    };

    //register component
    sdf.addGadget({
        constructor: sdfTabs,
        name: 'tab'
    });

})();

 (function(){
    var sdfTabsToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-dropdown-toggle');
        this.initialize();
    };

    sdfTabsToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.dropdown.show(this.target);
        } else {
            sdf.dropdown.hide(this.target);
        }
    };

    sdfTabsToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfTabsToggle,
        selector: '[sdf-dropdown-toggle]'
    });

})();