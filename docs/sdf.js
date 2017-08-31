/**
 * SDF Framework Widged/Gadget strucutre
 */

/**
 * Main controller
 */
var sdf = (function(){

	'use strict';

	var widgets = [];
	var elements = [];
	var gadgetList = [];
	var gadgets = {};


	function addWidget(widget){
		widgets.push(widget);
	}

	function addGadget(gadget){
		gadgetList.push(gadget);
	}

	function checkForAnimationLibrary(){
		/*if(typeof window["TweenLite"] === "undefined"){
			throw new Error("Tweenlite is required.");
		}*/
	}
	function initialize(){
		checkForAnimationLibrary();
		for(var i = 0; i < widgets.length; ++i){
			var elems = document.querySelectorAll(widgets[i].selector);
			for(var j = 0; j < elems.length; ++j){
				elements.push(new widgets[i].constructor(elems[j]));
			}
		}
		for (var i = 0; i < gadgetList.length; i++) {
			gadgets[gadgetList[i].name] = new gadgetList[i].constructor();
		}

	}

	function callGadget(gadget, method){
		gadgets[gadget][method].apply(
			gadgets[gadget],
			Array.prototype.slice.call(arguments, 2)
		);
	}

	function queryElements(selector){
		return document.querySelectorAll(selector);
	}

	function getElementById(id){
		return document.getElementById(id);
	}

	return {
		addWidget: addWidget,
		addGadget: addGadget,
		f: callGadget,
		$: queryElements,
		gebi: getElementById,
		initialize: initialize
	};

})();

window.sdf = sdf;
window["sdf"] = sdf;


window.addEventListener('load', function() {
	sdf.initialize();

});


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
				document.body.append(container);
				this.containers[position] = container;
			}
		}

	};
	sdfToast.prototype.createButton = function(action){
		var config = {
			text: 'OK',
			class: 'sdf-btn sdf-primary sdf-btn-small',
			action: false
		}
		if(typeof action !== "undefined"){
			for(var key in action) config[key] = action[key];
		}
		var button = document.createElement('button');
		button.className = config.class;
		button.append(config.text);
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
			group.append(this.createButton(config.buttons[i]))
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
		toast.className = "sdf-alert sdf-toast sdf-toast-" + config.position + ' ' + config.class;
		toast.setAttribute('data-position', config.position);
		toast.append(this.createBody(message, config.align));
		if(config.buttons.length){
			toast.append(this.createButtonGroup(config));
		}
		if(config.position == "top") {
			toast.style.bottom = "0";
		} else{
			toast.style.top = "0";
		}

		container.append(toast);
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