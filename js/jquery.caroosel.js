/**
 * jquery.caroosel.js
 * 
 * jauery carousel plugin (with tabs);
 * 
 * @author: <j.braun@agentur-halma.de>
 * 
 * based upon: "A jQuery plugin boilerplate." by Jonathan Nicol @f6design
 * 
 * Todo:
 * - alternative to definition list markup (?)
 * - option: thumbnails as tabs
 * 
 */

;(function($) {
	var pluginName = 'caroosel';
 	/**
	 * Plugin object constructor.
	 * Implements the Revealing Module Pattern.
	 */
	function Plugin(element, options) {
		var el = element;
		var $el = $(element);
		var timeOut;	// Reference to timeout handle
 
		options = $.extend({}, $.fn[pluginName].defaults, options);
 
		function init() {
			_caroosel();
			hook('onInit');
		}
		
		function _caroosel(){

			var caroosel = $('<div class="caroosel" />');
			var tabs = $('<ul class="caroosel-tabs" />');
			var viewport = $('<div class="caroosel-viewport"></div>');
			var content = $('<ul class="caroosel-content" />');
			var prev = $('<a href="#" class="caroosel-navlink" id="caroosel-prev" />');
			var next = $('<a href="#" class="caroosel-navlink" id="caroosel-next" />');
			var slides = $el.find('dd').length;
			var slideWidth;
			var slideHeight;
			
			
			options['horizontal'] = (options['tabs'] == 'left' || options['tabs'] == 'right');

			if (options['slideshow'] !== false){
				switch (options['slideshow']){
					case 'fast':
						options['slideshow'] = 2000;
						break;
					case 'slow':
						options['slideshow'] = 4000;
						break;
					default:
						if (typeof(options['slideshow']) != 'number'){
							options['slideshow'] = (options['slideshow'] == 0) ? false : 4000;
						}
						break;
				}
			}
			
			content.appendTo(viewport);
			caroosel.append(tabs).append(viewport);
			
			$el.children('dt').each(function(i, element){
				tabs.append($('<li>' + $(element).html() + '</li>'));
			});
			$el.children('dd').each(function(i, element){
				content.append($('<li>' + $(element).html() + '</li>'));
			});

			caroosel.addClass('tabs-'+options['tabs'])
			
			$el.hide();
			caroosel.insertBefore($el);

			slideWidth = viewport.width();
			if (options['horizontal']){
				slideWidth -= options['tabWidth'];
			}

			content.css('width', slides * (slideWidth + options['tabWidth']));
			content.children('li').css('width', slideWidth);
	
			if (options['tabs'] !== 'none'){
				if (options['horizontal']){
					tabs.css({ 'height' : '100%' });
					tabs.children('li').css({
						'height' : (100 / slides) + '%',
						'width' : options['tabWidth']
					});
					if (options['tabs'] == 'left'){
						content.children('li').css({
							'margin-left' : options['tabWidth']
						});
					}
					else {
						content.children('li').css({
							'margin-right' : options['tabWidth']
						});
					}
				}
				else {
					tabs.children('li').css({
						'width' : (100 / slides) + '%',
						'height' : options['tabHeight']
					});
					if (options['tabs'] == 'top'){
						content.children('li').css({
							'margin-top' : options['tabHeight'],
						});
					}
					else {
						content.children('li').css({
							'margin-bottom' : options['tabHeight']
						});
					}
				}
			}
			tabs.children('li').bind('click', onTabClicked).first().addClass('caroosel-active');
			content.children('li').first().addClass('caroosel-active');
			
			if (parseInt(options['slideshow']) > 0){
				timeOut = window.setTimeout(slideshow, options['slideshow']);
			}

			slideHeight = maxY();
			var sh = slideHeight;
			if (!options['horizontal']){
				if (options['tabs'] !== 'none'){
					sh += options['tabHeight'];
				}
			}
			caroosel.height(sh);
			content.children('li').height(slideHeight);

			if (options['navlinks'] === true){
				prev.html(options['prev']);
				next.html(options['next']);
				viewport.append(prev).append(next);
				
				prev.css({
					'top' : (content.outerHeight(true) - prev.outerHeight(true)) / 2
				});
				next.css({
					'top' : (content.outerHeight(true) - next.outerHeight(true)) / 2
				});
				
				prev.bind('click', function(e){
					e.preventDefault();
					goToPrev();
				});
				next.bind('click', function(e){
					e.preventDefault();
					goToNext();
				});
				if (options['tabs'] == 'left'){
					prev.css('left', options['tabWidth']);
				}
				if (options['tabs'] == 'right'){
					next.css('right', options['tabWidth']);
				}
				
			}


			return;

			function maxY(){
				var max_y = 0;
				$('ul.caroosel-content > li').each(function(i, el){
					var h = $(el).outerHeight();
					if (h > max_y){
						max_y = h;
					}
				});
				return max_y;
			}

			function slideshow(){
				goToNext();
				timeOut = window.setTimeout(slideshow, options['slideshow']);
			}
				
			function onTabClicked(e){
				var n = $(this).index();

				// Reset the slideshow timeout
				window.clearTimeout(timeOut);
				if (parseInt(options['slideshow']) > 0){
					timeOut = window.setTimeout(slideshow, options['slideshow']);
				}
				goTo(n);
			}

			function goTo(n){
				doGoTo();
				
				function doGoTo(){
					hook('beforeSlide');
					
					var listItems = tabs.children('li');
					var w = getActiveSlide().outerWidth(true);
					var newLeft = n * w * -1;

					switch (options['animate']){
						case 'slide':
							content.animate({'left' : newLeft },
								options['animationSpeed'],
								setActive
							);
							break;
						case 'fade':
							var speed = options['animationSpeed'] / 2;
							content.fadeOut(speed, function(){
								content.css('left', newLeft);
								content.fadeIn(speed, setActive);
							});
							break;
						default:
							break;
					}

					function setActive(){
						listItems.removeClass('caroosel-active');
						$(listItems.get(n)).addClass('caroosel-active');
						content.children('li').removeClass('caroosel-active');
						$(content.children('li').get(n)).addClass('caroosel-active');
						hook('afterSlide');
					}
				}
			}
			
			function goToNext(){
				var current = content.find('li.caroosel-active').index();
				if (++current == slides){
					current = 0;
				}
				goTo(current);
			}
			function goToPrev(){
				var current = content.find('li.caroosel-active').index();
				if (current-- == 0){
					current = slides - 1;
				}
				goTo(current);
			}
			
			function getActive(){
				return tabs.find('li.caroosel-active').index();
			}
			
			function getActiveTab(){
				var n = getActive();
				return $(tabs.children('li')[n]);
			}
			
			function getActiveSlide(){
				var n = getActive();
				return $(content.children('li')[n]);
			}
		}
	 
		function option (key, val) {
			if (val) {
				options[key] = val;
			}
			else {
				return options[key];
			}
		}
 
		function destroy() {
			$el.each(function() {
				var el = this;
				var $el = $(this);
		 
				window.clearTimeout(timeOut);
				$el.prev('.caroosel').remove();
				$el.show();
				hook('onDestroy');
				// Remove Plugin instance from the element.
				$el.removeData('plugin_' + pluginName);
			});
		}
	 
		function hook(hookName) {
			if (options[hookName] !== undefined) {
				options[hookName].call(el);
			}
		}
	 
		init();
	 
		return {
			'option' : option,
			'destroy' : destroy
		};
	}
 
	/**
	 * Plugin definition.
	 */
	$.fn[pluginName] = function(options) {
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function() {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				}
				//~ else {
					//~ throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
				//~ }
			});
			
			return (returnVal !== undefined) ? returnVal : this;
		}
		else if (typeof options === "object" || !options) {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		}
	};
 
	// Default plugin options.
	$.fn[pluginName].defaults = {
		'tabs' : 'left',
		'tabWidth' : 160,
		'tabHeight' : 40,
		'animate' : 'slide',
		'animationSpeed' : 400,
		'slideshow' : false,
		'navlinks' : true,
		'prev' : '<<',
		'next' : '>>',
		
		onInit: function() {},
		onDestroy: function() {},
		beforeSlide : function(n) {},
		afterSlide : function(n) {}
	};
})(jQuery);
