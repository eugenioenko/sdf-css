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
		if(typeof window["TweenLite"] === "undefined"){
			throw new Error("Tweenlite is required.");
		}
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
	return {
		addWidget: addWidget,
		addGadget: addGadget,
		elements: elements,
		gadgets: gadgets,
		$: callGadget,
		initialize: initialize
	};

})();

window.sdf = sdf;
window["sdf"] = sdf;

window.addEventListener('load', function() {
	console.log('log');
	sdf.initialize();

});



(function(){
	var sdfButton = function(element){
		this.element = element;
		this.initialize();
	};

	sdfButton.prototype.clickEvent_ = function(){
		console.log('click');
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

/*
var buttons = [
	{
		text: 'apply',
		class: 'sdf-btn sdf-primary sdf-btn-small',
		action: function(){console.log(this)}
	},
	{
		text: 'delete',
		class: 'sdf-btn sdf-success sdf-btn-small',
	}
];
sdf.$('toast', 'show', "<p>The messages have been updated succesfully</p>", {type: "bottom", duration: 10000000, buttons: buttons});
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
				that.remove(toast_id);
			}
		})(config.action, this, this.id));
		return button;
	};

	sdfToast.prototype.createButtonGroup = function(actions){
		var group = document.createElement('div');
		group.className = "sdf-toast-footer sdf-btn-group";
		for(var i = 0; i < actions.length; ++i){
			group.append(this.createButton(actions[i]))
		}
		return group;
	};

	sdfToast.prototype.createBody = function(message){
		var body = document.createElement('div');
		body.className = "sdf-toast-body";
		body.innerHTML += message;
		return body;
	};

	sdfToast.prototype.remove = function(id){
		this.toasts[id].remove();
		this.toasts[id] = {};
	};

	sdfToast.prototype.show = function (message, settings){
		var config = {
			class: "sdf-primary",
			type: "bottom",
			duration: 4000,
			buttons: []
		};
		if(typeof settings !== "undefined"){
			for(var key in settings) config[key] = settings[key];
		}
		var container = this.containers[config.type];
		var dom_id = 'sdf-toast-' + this.id;
		var toast = document.createElement('div');
		toast.setAttribute('id', dom_id);
		toast.className = "sdf-toast " + config.class;
		toast.append(this.createBody(message));
		if(config.buttons.length){
			toast.append(this.createButtonGroup(config.buttons));
		}
		container.append(toast);
		this.toasts.push(toast);
		setTimeout(
			(function(that, toast_id){
				return function(){
					that.remove(toast_id);
				}
			})(this, this.id), config.duration
		);

		//animate here
		toast.style.top = "-150px";
		return (this.id++);
	};

	sdf.addGadget({
		constructor: sdfToast,
		name: 'toast'
	});

})();