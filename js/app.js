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
				'onInit' : function(){ console.log('Plugin has been initialized') }
			};
			$('.slider').caroosel('destroy');
			$('.slider').caroosel(options);
			return false;
		});
	
		$('.slider').caroosel({
			'tabs' : 'top',
			'navlinks' : true
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
	});
  
})(jQuery);
