/**
 * SDF Collapse
 * Collapse Gadget for SDF
 * @package SDF
 * @author  eugenioenko
 * @license http://opensource.org/licenses/MIT  MIT License
 * @link    https://github.com/eugenioenko/sdf-css
 * @since   Version 1.0.0
 */
 (function(){
    'use strict';

    var sdfCollapse = function(){
        this.collapses = {};
        this.selector = '.sdf-collapse';
        this.initialize();
    };

    sdfCollapse.prototype.hide = function(id){
        var collapse = this.collapses[id];
        if(collapse && collapse.element.getAttribute('sdf-transitioning') == 'false'){
            collapse.open = false;
            collapse.element.setAttribute('sdf-transitioning', 'true');
            var height = collapse.element.offsetHeight;
            collapse.element.style.height = height;
            TweenLite.to(collapse.element.style, 0.5, {
                height: 0,
                onCompleteScope: collapse.element,
                onComplete: function(){
                    this.setAttribute('sdf-transitioning', 'false');
                    collapse.element.setAttribute('aria-hidden', 'true');
                    this.style.display = '';
                    this.style.height = '';
                }
            });

            if(collapse.toggle){
                collapse.toggle.setAttribute('aria-expanded', 'false');
            }
        }
    };

    sdfCollapse.prototype.show = function (id){
        var collapse = this.collapses[id];
        if(collapse && collapse.element.getAttribute('sdf-transitioning') == 'false'){
            collapse.open = true;
            collapse.element.setAttribute('sdf-transitioning', 'true');
            collapse.element.style.visibility = 'hidden';
            collapse.element.style.display = 'block';
            var height = collapse.element.offsetHeight;
            collapse.element.style.height = 0;
            TweenLite.to(collapse.element.style, 0.5, {
                visibility: 'visible',
                height: height,
                onCompleteScope: collapse.element,
                onComplete: function(){
                    this.setAttribute('sdf-transitioning', 'false');
                    collapse.element.setAttribute('aria-hidden', 'false');
                    this.style.visibility = '';
                    this.style.display = '';
                    this.style.height = '';
                }
            });
            if(collapse.toggle){
                collapse.toggle.setAttribute('aria-expanded', 'true');
            }
        }

    };
    var clickEventGenerator = function(that, id){
        return function(){
            that.hide(id);
        };
    };
    sdfCollapse.prototype.checkTweenLite = function(){
        if(typeof TweenLite == "undefined"){
            console.warn("sdfCollapse requies TweenLite.js, please add it to your source. otherwise collapse functionality will stay disabled");
            return false;
        }
        return true;
    };
    sdfCollapse.prototype.initialize = function(){
        if(!this.checkTweenLite()){
            return;
        }
        var elements = document.querySelectorAll(this.selector);
        for (var i = elements.length - 1; i >= 0; i--) {
            var element = elements[i];
            // gets or creates an id for the collapse
            var id = element.getAttribute('id');
            if(!id){
                id = "sdf-collapse-" + i;
                element.setAttribute('id', id);
            }
            // gets or sets initial state for collapse: closed or opened
            element.setAttribute('aria-hidden', 'true');
            element.setAttribute('sdf-transitioning', 'false');
            element.style.display = 'none';
            var toggle = document.querySelector('[sdf-collapse-toggle="' + id + '"]');
            if(toggle){
                var toggleId = toggle.getAttribute('id');
                if(!toggleId){
                    toggleId = "sdf-collapse-toggle-" + i;
                    toggle.setAttribute('id', toggleId);
                }
                element.setAttribute('aria-labelledby', toggleId);
                toggle.setAttribute('aria-expanded', 'false');
            }
            // puts the current collapse into the list
            this.collapses[id] = {
                element: element,
                toggle: toggle,
                open: false
            };
            element.addEventListener('click', clickEventGenerator(this, id));
        }
    };

    //register component
    sdf.addGadget({
        constructor: sdfCollapse,
        name: 'collapse'
    });

})();

 (function(){
    var sdfCollapseToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-collapse-toggle');
        this.initialize();
    };

    sdfCollapseToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.collapse.show(this.target);
        } else {
            sdf.collapse.hide(this.target);
        }
    };

    sdfCollapseToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfCollapseToggle,
        selector: '[sdf-collapse-toggle]'
    });

})();