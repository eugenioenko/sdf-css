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

    var sdfTab = function(toggle, tabview){
        this.tabview = tabview;
        this.toggle = toggle;

    };
    var sdfTabMenu = function(){
        
    }
    var sdfTabs = function(){
        this.tabmenus = {};
        this.tabs = {};
        this.initialize();
    };


    sdfTabs.prototype.show = function(id){
        var tab = this.tabs[id];
        console.log(tab);
        
        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');

        this.tabs[id].element.setAttribute('aria-hidden', 'false');
        this.tabs[id].toggle.setAttribute('aria-expanded', 'true');
    };

    sdfTabs.prototype.initialize = function(){
        var tabmenus = document.querySelectorAll('[sdf-tab-menu]');
        for (var i = tabmenus.length - 1; i >= 0; i--) {
            var tabmenu = tabmenus[i];
            var tabmenuId = tabmenu.getAttribute('id');
            if(!tabmenuId){
                tabmenuId = "sdf-tab-menu-" + i;
                tabmenu.setAttribute('id', tabmenuId);
            }
            this.tabmenus[tabmenuId] = {};
            this.tabmenus[tabmenuId].elements = [];
            var tabs = tabmenu.querySelectorAll('[sdf-tab-toggle]');
            for (var j = 0;  j < tabs.length; ++j) {
                var tab = tabs[j];
                var tabId = tab.getAttribute('sdf-tab-toggle');
                var tabview = document.getElementById(tabId);
                if(tabview){
                    tab.setAttribute('aria-haspopup', 'true');
                    var expanded = tab.getAttribute('aria-expanded');
                    if(!expanded){
                        expanded = 'false';
                        tab.setAttribute('aria-expanded', 'false');
                    } 
                    if(expanded == 'false'){
                        tabview.setAttribute('aria-hidden', 'true');
                    } else {
                        tabview.setAttribute('aria-hidden', 'false');
                        this.tabmenus[tabmenuId].active = tabview;
                    }
                    this.tabmenus[tabmenuId].elements.push(tabview)
                    this.tabs[tabId] = {
                        element: tabview,
                        toggle: tab,
                        parent: this.tabmenus[tabmenuId]
                    };
                    
                }
            }
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