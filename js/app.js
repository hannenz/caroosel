(function($){  
	$(function(){

		$(document).foundationAlerts();
		$(document).foundationAccordion();
		$(document).tooltips();
		$('input, textarea').placeholder();
		$(document).foundationButtons();
		$(document).foundationNavigation();
		$(document).foundationCustomForms();
		$(document).foundationTabs({callback:$.foundation.customForms.appendCustomMarkup});
		// UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
		// $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'left'});
		// $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'left'});
		// $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'left'});
		// $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'left'});
		
		$('form input[type=submit]').bind('click', function(e){
			e.preventDefault();
			
			options  = {
				'tabs' : $('#tabs').val(),
				'animate' : $('#animate').val(),
				'animationSpeed' : parseInt($('#animation-speed').val()),
				'tabWidth' : parseInt($('#tab-width').val()),
				'tabHeight' : parseInt($('#tab-height').val()),
				'slideshow' : parseInt($('#slideshow').val()),
				'navlinks' : ($('#navlinks').attr('checked') == 'checked'),
				'onInit' : function(){ console.log('Plugin has been initialized') }
			};
			$('.slider').caroosel('destroy');
			$('.slider').caroosel(options);
			return false;
		});
	
		$('.slider').caroosel({
			'tabs' : 'top',
			'navlinks' : true,
			'beforeSlide' : function(n){
				console.log('Going to move to slide #'+n);
			},
			'afterSlide' : function(n){
				console.log('Arrived at slide #'+n);
			},
			'animate' : function(n, content, newLeft, speed){
				var paddingTop = content.css('padding-top');
				var newPadding = '600px';
				
				$(content).animate({'padding-top' : newPadding}, speed/2, function(){
					$(content).css('left', newLeft);
					$(content).animate({'padding-top' : paddingTop}, speed/2);
				});
			}
		});
		
		$('#destroyer').bind('click', function(e){
			e.preventDefault();
			$('.slider').caroosel('destroy');
		});
		
		$('#slider').bind('click', function(e){
			e.preventDefault();
			$('.slider').caroosel('option', 'animate', 'slide');
			return false;
		});
		$('#fader').bind('click', function(e){
			e.preventDefault();
			$('.slider').caroosel('option', 'animate', 'fade');
			return false;
		});
		$('#getter').bind('click', function(e){
			e.preventDefault();
			alert ('Option "animate" is currently set to "' +  $('.slider').caroosel('option', 'animate') + '"');
		});
		
		$('#extlinks a').bind('click', function(e){
			e.preventDefault();
			var h = $(this).html();
			switch (h){
				case 'prev':
					$('.slider').caroosel('goToPrev');
					break;
				case 'next':
					$('.slider').caroosel('goToNext');
					break;
				default:
					$('.slider').caroosel('goTo', parseInt(h) - 1);
					break;
			}
			return false;
		});
		
		$('#gallery').caroosel({
			'tabs' : 'none',
			'navlinks' : true,
			'slideshow' : 3000,
			'slidePadding' : 0,
			'afterSlide' : function(n){
				$('#gallery-thumbs a').css('width', '80px');
				$($('#gallery-thumbs a').get(n)).css('width', '100px');
				
			}
		});
		$('#gallery-thumbs a').bind('click', function(e){
			e.preventDefault();
			var n = $(this).index();
			$('#gallery').caroosel('goTo', n);
		});
		
		$.get('README.md', function(responseText){
			var converter = new Markdown.Converter().makeHtml;
			var html = converter(responseText);
			$('#doc').html($(html));
		});
	});
  
})(jQuery);
