 ;(function($){
	jQuery.fn.caroosel = function(arg){
		
		var options = $.extend({}, $.fn.caroosel.defaults, arg);
		
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
			
			var max_y = 0;
			$(this).children('dd').each(function(i, el){
				var h = $(el).outerHeight();
				if (h > max_y){
					max_y = h;
				}
			});
			
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
			slideHeight = 0;

			content.css('width', slides * slideWidth);
			content.children('li').css('width', slideWidth);
			//~ content.children('li').each(function(i, el){
				//~ var h = $(el).outerHeight();
				//~ if (h > slideHeight){
					//~ slideHeight = h;
				//~ }
			//~ });
			
			caroosel.height(slideHeight);
			
			if (options['tabs'] == 'top' || options['tabs'] == 'bottom'){
				max_y += 40;
			}
			caroosel.height(max_y);
			
			if (options['tabs'] == 'left' || options['tabs'] == 'right'){
				tabs.children('li').css('height', (100 / slides) + '%');
			}
			else {
				tabs.children('li').css('width', (100 / slides) + '%');
			}
						
			tabs.children('li').bind('click', onTabClicked).first().addClass('caroosel-active');
			//viewport.bind('click', goToNext);
			
			if (parseInt(options['slideshow']) > 0){
				timeOut = window.setTimeout(slideshow, options['slideshow']);
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
	
					
					var newLeft = n * slideWidth * -1;
					switch (options['animate']){
						case 'slide':
							content.animate({
								'left' : newLeft
							}, options['animationSpeed']);
							break;
						case 'fade':
							content.fadeOut(function(){
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
		'animate' : 'slide',
		'animationSpeed' : 400,
		'slideshow' : false
	};
	
})(jQuery);
