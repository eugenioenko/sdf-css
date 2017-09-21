 (function(){
    var sdfDropdownToggle = function(element){
        this.element = element;
        this.target = element.getAttribute('sdf-dropdown-toggle');
        this.initialize();
    };

    sdfDropdownToggle.prototype.clickEvent_ = function(e){
        e.stopPropagation();
        if(this.element.getAttribute('aria-expanded') == 'false'){
            sdf.dropdown.show(this.target);
        } else {
            sdf.dropdown.hide(this.target);
        }
    };

    sdfDropdownToggle.prototype.initialize = function(){
        var target = document.getElementById(this.target);
        if(target){
            this.element.setAttribute('aria-haspopup', 'true');
            this.clickEvent = this.clickEvent_.bind(this);
            this.element.addEventListener('click', this.clickEvent);
        }
    };


    sdf.addWidget({
        constructor: sdfDropdownToggle,
        selector: '[sdf-dropdown-toggle]'
    });

})();