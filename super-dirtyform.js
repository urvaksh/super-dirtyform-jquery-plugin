/*!
 * jQuery Plugin : Super Dirty Form
 * http://projects.codeaspect.com/dirty-form/
 *
 * Copyright 2011, Urvaksh Rogers
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function( $ ){

	$.extend($.expr[':'],{
		defaultSelected : function (element){
			return element.defaultSelected;
		}
	});

	var helpers = {
		isSelectDirty : function(src){
			if($("option",src).is(":defaultSelected")){
				return $("option:selected",src).prop("defaultSelected")?false:true;
			}else{
				return $("option:selected",src)[0]==$("option:first",src)[0]?false:true;
			}
		},
		addNodeToDirtyList : function(container,node){
			var currentFirst = $(container).prop("nextDirty");
			$(node).prop("nextDirty",currentFirst).prop("prevDirty",container);
			return $(container).prop("nextDirty",node);
		},
		removeDirtyNodeFromList : function(node){
			var prevNode = node.prevDirty;
			var nextNode = node.nextDirty;
			prevNode.nextDirty=nextNode;
			$(nextNode).prop("prevDirty")=prevNode;
			$(node).prop("prevDirty",null).prop("nextDirty",null);
		},
		toList : function(){
			var current=container;
			var next=null;
			var dirtyList=[];
			while(current && current.nextDirty){
				next=current.nextDirty;
				dirtyList.push(next);
				current=next;
			}
			dirtyList.push(current);
			return dirtyList;
		},
		empty : function(container){
			var current=container;
			while(current && current.nextDirty){
				next=current.nextDirty;
				$(current).removeProperty("nextDirty").removeProperty("prevDirty");
				current=next;
			}
			$(current).removeProperty("nextDirty").removeProperty("prevDirty");
		},
		isEmpty : function(container){
			return container.nextDirty==null?true:false;
		}
	}

	var methods = {
		init : function( options ) {
		
		var settings = $.extend({"searchExpression":":not(:submit,:button,[type=hidden])","triggerEvents":""},
								options||{}
						);
		
		var pluginSettings = {
			"searchExpression":":input"+settings.searchExpression,
			"triggerEvents":"focusout,dirtyformchange"+(settings.triggerEvents==""?"":","+settings.triggerEvents)
		}
		
		return this.each(function(){
			$(this).not(".dirtyChecked")
				.prop("nextDirty",null)
				.bind("focusout",function(e){
					var $src=$(e.target);
					if($src.is(pluginSettings.searchExpression)){
						var isElementDirty=false;
						if($src.is("select")){
							isElementDirty=helpers.isSelectDirty($src[0]);
						}else if($src.is(":checkbox")){
							isElementDirty=$src.prop("defaultChecked")!=$src.prop("checked");
						}else {
							isElementDirty=$src.prop("defaultValue")!=$src.prop("value");
						}
						
						if(isElementDirty){
							helpers.addNodeToDirtyList(this,$src[0]);
							$src.trigger("dirtyformchange");
						}else{
							helpers.removeDirtyNodeFromList($src[0]);
							$src.trigger("dirtyformclean");						
						}
					}
				})
				.addClass(".dirtyChecked");
			});
		},
		isDirty : function() {
			var isEmpty=true;
			this.each(function(){
				if(!helpers.isEmpty(this)){
					isEmpty = isEmpty && false;
				}
			});
			return isEmpty?false:true;
		},
		dirtyList : function() { 
		},
		cleanForm : function() { 
		}
	};

	$.fn.dirtyform = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dirtyform' );
		}
	};
})( jQuery );
