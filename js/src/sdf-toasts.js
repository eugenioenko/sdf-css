/**
 * Toasts
 */
(function(){
    'use strict';
    var sdfToast = function(){
        this.id = 0;
        this.toasts = [];
        this.containers = {};
        this.createContainers();
    };
    sdfToast.prototype.createContainers = function() {
        var positions = ["top", "bottom"];
        for(var i = 0; i < positions.length; ++i){
            var position = positions[i];
            if(!document.querySelector('.sdf-toast-container-' + position)){
                var container = document.createElement('div');
                container.className = 'sdf-toast-container-' + position;
                document.body.appendChild(container);
                this.containers[position] = container;
            }
        }

    };
    sdfToast.prototype.createButton = function(action){
        var config = {
            text: 'OK',
            class: 'sdf-btn sdf-primary',
            action: false
        }
        if(typeof action !== "undefined"){
            for(var key in action) config[key] = action[key];
        }
        var button = document.createElement('button');
        button.className = config.class;
        button.innerHTML = config.text;
        if(config.action){

        }
        button.addEventListener('click', (function(method, that, toast_id){
            return function(){
                if(method){
                    method.bind(that)();
                }
                that.hide(toast_id);
            }
        })(config.action, this, this.id));
        return button;

    };

    sdfToast.prototype.createButtonGroup = function(config){
        var group = document.createElement('div');
        group.className = "sdf-alert-footer sdf-btn-group " + config.group;
        for(var i = 0; i < config.buttons.length; ++i){
            group.appendChild(this.createButton(config.buttons[i]))
        }
        return group;
    };

    sdfToast.prototype.createBody = function(message, align){
        var body = document.createElement('div');
        body.className = "sdf-alert-body " + align + ' ';
        body.innerHTML += message;
        return body;
    };

    sdfToast.prototype.hide = function(id){
        if(this.toasts[id]){
            var position = this.toasts[id].getAttribute('data-position');
            if(position == "top") {
                this.toasts[id].style.bottom = "0";
            } else{
                this.toasts[id].style.top = "0";
            }
            setTimeout(
                (function(toasts, id){
                    return function(){
                        toasts[id].remove();
                        toasts[id] = false;
                    }
                })(this.toasts, id), 1000
            );
        }
    };

    sdfToast.prototype.show = function (message, settings){
        var config = {
            class: "sdf-primary",
            align: "sdf-text-center",
            position: "bottom",
            group: "sdf-horizontal-right",
            duration: 4000,
            buttons: []
        };
        if(typeof settings !== "undefined"){
            for(var key in settings) config[key] = settings[key];
        }
        var container = this.containers[config.position];
        var dom_id = 'sdf-toast-' + this.id;
        var toast = document.createElement('div');
        toast.setAttribute('id', dom_id);
        toast.className = "sdf-alert sdf-toast sdf-toast-" +
            config.position + ' ' + config.class;
        toast.setAttribute('data-position', config.position);
        toast.appendChild(this.createBody(message, config.align));
        if(config.buttons.length){
            toast.appendChild(this.createButtonGroup(config));
        }
        if(config.position == "top") {
            toast.style.bottom = "0";
        } else{
            toast.style.top = "0";
        }

        container.appendChild(toast);
        this.toasts.push(toast);

        //animation
        if(config.position == "top") {
            toast.style.bottom = '-' + toast.clientHeight + "px";
        } else{
            toast.style.top = '-' + toast.clientHeight + "px";
        }

        //destruct afte duration timeout
        setTimeout(
            (function(that, toast_id){
                return function(){
                    that.hide(toast_id);
                }
            })(this, this.id), config.duration
        );

        return (this.id++);
    };

    //register component

    sdf.addGadget({
        constructor: sdfToast,
        name: 'toast'
    });

})();

/*
 *
 * This content is released under the MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */