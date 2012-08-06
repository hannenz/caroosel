 ;(function($){
	jQuery.fn.caroosel = function(arg){

		if (typeof(arg) == 'string' && arg == 'destroy'){
			return this.each(function(){
				$(this).prev('.caroosel').remove();
				$(this).show();
			});
		}
		
		var options = $.extend({}, $.fn.caroosel.defaults, arg);
		options['horizontal'] = (options['tabs'] == 'left' || options['tabs'] == 'right');
		
		return this.each(function(){
			
			var caroosel = $('<div class="caroosel" />');
			var tabs = $('<ul class="caroosel-tabs" />');
			var viewport = $('<div class="caroosel-viewport"></div>');
			var content = $('<ul class="caroosel-content" />');
			var slides = $(this).find('dt').length;
			var slideWidth;
			var slideHeight;
			var timeOut;	// Reference to timeout handle
			
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
			
			$(this).children('dt').each(function(i, el){
				tabs.append($('<li>' + $(el).html() + '</li>'));
			});
			$(this).children('dd').each(function(i, el){
				content.append($('<li>' + $(el).html() + '</li>'));
			});
			
			caroosel.addClass('tabs-'+options['tabs'])
			
			$(this).hide();
			caroosel.insertBefore($(this));

			slideWidth = viewport.width();
			if (options['horizontal']){
				slideWidth -= options['tabWidth'];
			}
			
			content.css('width', slides * (slideWidth + options['tabWidth']));
			content.children('li').css('width', slideWidth);
			
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
						
			tabs.children('li').bind('click', onTabClicked).first().addClass('caroosel-active');
			//viewport.bind('click', goToNext);
			
			if (parseInt(options['slideshow']) > 0){
				timeOut = window.setTimeout(slideshow, options['slideshow']);
			}

			slideHeight = maxY();
			var sh = slideHeight;
			if (!options['horizontal']){
				sh += options['tabHeight'];
			}
			caroosel.height(sh);
			content.children('li').height(slideHeight);
			return;

			function maxY(){
				var max_y = 0;
				$('ul.caroosel-content > li').each(function(i, el){
					var h = $(el).outerHeight();
					if (h > max_y){
						max_y = h;
					}
				});
				if (options['tabs'] == 'top' || options['tabs'] == 'bottom'){
					//~ max_y += options['tabHeight'];
				}
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
				var caption = getActiveSlide().find('.caroosel-caption');
				//~ if (caption.length > 0){
					//~ caption.fadeOut(doGoTo);
				//~ }
				//~ else {
					doGoTo();
				//~ }
				
				function doGoTo(){
					var listItems = tabs.children('li');
					listItems.removeClass('caroosel-active');
					$(listItems.get(n)).addClass('caroosel-active'); //.addClass('caroosel-active');
					
					var w = getActiveSlide().outerWidth(true);
					
					var newLeft = n * w * -1;
					switch (options['animate']){
						case 'slide':
							content.animate({
								'left' : newLeft
							}, options['animationSpeed']);
							break;
						case 'fade':
							content.fadeOut(options['animationSpeed'], function(){
								content.css('left', newLeft);
								content.fadeIn();
							});
							break;
						case 'slideDown':
							var curSlide = getActiveSlide();
							curSlide.clone().prependTo(content).css('z-index', 20);
							break;
							
						default:
							break;
					}
				}
			}
			
			function goToNext(){
				var current = tabs.find('li.caroosel-active').index();
				if (++current == slides){
					current = 0;
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
			
			function findLargestY(){
				var max = 0;
				content.children().each(function(i, el){
					h = $(el).outerHeight();
					max = (h > max) ? h : max;
				});
				return max;
			}
			
			function findSmallestY(){
				var min = 99999;
				content.children().each(function(i, el){
					h = $(el).outerHeight();
					min = (h < min) ? h : min;
				});
				return min ;
			}
				
		});
	}
	
	/*
	 *  Default options
	 *================================
	 */
	$.fn.caroosel.defaults = {
		'tabs' : 'left',
		'tabWidth' : 160,
		'tabHeight' : 40,
		'animate' : 'slide',
		'animationSpeed' : 400,
		'slideshow' : false
	};
	
})(jQuery);
