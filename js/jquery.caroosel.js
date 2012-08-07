/**
 * jquery.caroosel.js
 * 
 * jauery carousel plugin (with tabs);
 * 
 * @author: <j.braun@agentur-halma.de>
 * 
 * Plugin based upon: "A jQuery plugin boilerplate." by Jonathan Nicol @f6design
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
		var caroosel, tabs, viewport, content, prev, next, slides, slideWidth, slideHeight, timeOut;
 
		options = $.extend({}, $.fn[pluginName].defaults, options);
 
		function init() {
			caroosel = $('<div class="caroosel" />');
			tabs = $('<ul class="caroosel-tabs" />');
			viewport = $('<div class="caroosel-viewport"></div>');
			content = $('<ul class="caroosel-content" />');
			prev = $('<a href="#" class="caroosel-navlink" id="caroosel-prev" />');
			next = $('<a href="#" class="caroosel-navlink" id="caroosel-next" />');
			slides = $el.find('dd').length;
			var domId = $el.attr('id');
			if (domId){
				caroosel.attr('id', 'caroosel-'+domId);
			}
				
			
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
			content.children('li').css('padding', options['slidePadding']).first().addClass('caroosel-active');
			
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
			
			hook('onInit');
			return;
		}

		function maxY(){
			var max_y = 0;
			content.children('li').each(function(i, el){
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
				hook('beforeSlide', n);
				
				var listItems = tabs.children('li');
				var w = getActiveSlide().outerWidth(true);
				var newLeft = n * w * -1;
				
				if (typeof(options['animate']) == 'function'){
					options['animate'].call(el, n, content, newLeft, options['animationSpeed']);
					setActive();
				}
				else {
	
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
				}

				function setActive(){
					listItems.removeClass('caroosel-active');
					$(listItems.get(n)).addClass('caroosel-active');
					content.children('li').removeClass('caroosel-active');
					$(content.children('li').get(n)).addClass('caroosel-active');

					hook('afterSlide', n);
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
		
		function getActiveSlide(){
			return content.children('li.caroosel-active');
		}
		
		function getActiveN(){
			return content.children('li.caroosel-active').index();
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
		
		function hook(hookName, arg) {
			if (options[hookName] !== undefined) {
				options[hookName].call(el, arg);
			}
		}
	 
		init();
	 
		return {
			'option' : option,
			'destroy' : destroy,
			'goTo' : goTo,
			'goToPrev' : goToPrev,
			'goToNext' : goToNext,
			'getActiveSlide' : getActiveSlide,
			'getActiveN' : getActiveN
		};
	}
 
	$.fn[pluginName] = function(options) {
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function() {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				}
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
 
	$.fn[pluginName].defaults = {
		'tabs' : 'left',
		'tabWidth' : 160,
		'tabHeight' : 40,
		'animate' : 'slide',
		'animationSpeed' : 400,
		'slideshow' : false,
		'navlinks' : true,
		'prev' : '&laquo;',
		'next' : '&raquo;',
		'slidePadding' : '10px 10px 10px 10px',
		onInit: function() {},
		onDestroy: function() {},
		beforeSlide : function() {},
		afterSlide : function() {}
	};
})(jQuery);
