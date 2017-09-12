/*
(function(){
    var sdfButton = function(element){
        this.element = element;
        this.initialize();
    };

    sdfButton.prototype.clickEvent_ = function(){
    };

    sdfButton.prototype.initialize = function(){
        this.clickEvent = this.clickEvent_.bind(this);
        this.element.addEventListener('click', this.clickEvent);

    };

    sdf.addWidget({
        constructor: sdfButton,
        selector: 'button'
    });

})();
*/