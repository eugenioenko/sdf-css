function query(selector, limitOne){
	var limitOne = (typeof limitOne === "boolean") ? limitOne : false;
	var emptyNodeList = function(nodeList){
		return nodeList.length == 0;
	};
	var validArguments = function(args){
		if(args.length  != (arguments.length-1)){
			return false;
		}
		for(var i = 0; i < args.length; ++i){
			if(typeof args[i] !== arguments[i+1]) return false;
		}
		return true;
	};
	var emptyArguments = function(args){
		return args.length == 0;
	};
	

	var elements =  [];
	if (typeof selector !== "string"){
		console.error(selector + " is not a string, 'query' requires a string as selector");
		selector = null;
	} else {
		if(limitOne){
			elements.push(document.querySelector(selector));
		} else {
			elements = document.querySelectorAll(selector)
		}
	}

	return {
		selector: selector,
		nodes: elements,
		length: elements.length,
		query: function(selector, limitOne){
			var limitOne = (typeof limitOne === "boolean") ? limitOne : false;
			if (typeof selector !== "string"){
				console.error(selector + " is not a string, 'query' requires a string as selector");
				selector = null;
				this.nodes = [];
				return this;
			}
			this.selector = selector;
			if(limitOne){
				this.nodes = [];
				this.nodes.push(document.querySelector(selector));
			} else {
				this.nodes = document.querySelectorAll(selector)
			}
			this.length = this.nodes.length;
			return this;
		},
		on: function(event, method){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for on method');
				return this;
			} 
			if(!validArguments(arguments, "string", "function")){
				console.error("'on' requires event{string} and method{function}");
				return this;
			}
			// adding event listeners
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].addEventListener(event, method);
			}
			return this;
		},
		each: function(method){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for each');
				return this;
			}
			if(
				!validArguments(arguments, "function") || 
				!emptyArguments(arguments)
			){
				console.error(method + " is not a function, 'each' requires a function as argument");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				method.call(this.nodes[i]);
			}
			return this;
		},
		html: function(string){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for html');
				return this;
			}
			if(emptyArguments(arguments)){
				return this.nodes[0].innerHTML;
			}
			if(!validArguments(arguments, "string")){
				console.error("'html' takes string{string} as argument or no arguments.");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].innerHTML = string;
			}
			return this;
		},
		text: function(string){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for text');
				return this;
			}
			if(emptyArguments(arguments)){
				return this.nodes[0].textContent;
			}
			if(!validArguments(arguments, "string")){
				console.error("'text' takes string{string} as argument or no arguments.");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].textContent = string;
			}
			return this;
		},
		value: function(string){
			if(emptyNodeList(this.nodes)) {
				console.error("No inputs with selector: " + this.selector + ' for value');
				return this;
			}
			if(emptyArguments(arguments)){
				return this.nodes[0].value;
			}
			if(!validArguments(arguments, "string")){
				console.error("'value' takes string{string} as argument or no arguments.");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].value = string;
			}
			return this;
		},
		append: function(string){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for append');
				return this;
			}
			if(
				!validArguments(arguments, "string") && 
				!emptyArguments(arguments)
			){
				console.error("'append' takes string{string} as argument");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].innerHTML += string;
			}
			return this;
		},
		prepend: function(string){
			if(emptyNodeList(this.nodes)) {
				console.error("No elements with selector: " + this.selector + ' for prepend');
				return this;
			}
			if(
				!validArguments(arguments, "string") && 
				!emptyArguments(arguments)
			){
				console.error("'prepend' takes string{string} as argument");
				return this;
			}
			for (var i = 0; i < this.nodes.length; i++) {
				this.nodes[i].innerHTML = string + this.nodes[i].innerHTML;
			}
			return this;
		}
	}
}