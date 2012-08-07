# caroosel

A jQquery carousel plugin, either with tabs or standard slider with navigation links (or even both ;))

## Quick usage

### Include jquery, plugin and the plugin's stylesheet:

~~~
<link rel="stylesheet" type="text/css" href="/path/to/jquery.caroosel.js">
<script src="/path/to/jquery.min.js"></script>
<script src="/path/to/jquery.caroosel.js"></script>
~~~

### Markup

~~~
<dl class="thisone">
	<dt>First tab (No block level HTML, sorry...)</dt>
	<dd>
		Content of first tab, can contain any HTML
		<div class="caroosel-caption">An optional caption</div>
	</dd>
</dl>
~~~

### Call caroosel

~~~
<script>
$(document).ready(function(){
	var options = {  ...  }
	$('#thisone').caroosel(options);
});
</script>
~~~

### Options

tabs
:	string 'left', 'right', 'top', 'bottom' or 'none': Where to place the tabs (default: left)

tabWidth
:	numeric	width of the tabs if tabs are left or right

tabHeight
:	numeric height of the tabs if tabs are top or bottom

navlinks
:	boolean whether to have navigation links ("previous", "next") or not

prev
:	HTML content of the "previous" nav link

next
:	HTML content of the "next" nav link

animate
:	mixed	The type of animation to use: 'slide', 'fade', 'none' (default: slide) or a function that will handle the animation: It's prototype is animationFunction(n, el, speed, newLeft, speed); where `n` is the number of the new slide, `el` is the element that is going to be animated, `newLeft` is the css left-property's target value that the element shall have when the animation is complete and speed is the speed of the animation (the time in miliseconds that of the animation's overall duration)

animationSpeed
:	mixed The animation's speed (low number = fast, default: 400) or one of the strings 'slow' and 'fast'

slideshow
:	boolean	Autoplay on/off (default: false)

onInit
:	function	callback function being called after the plugin instance has initialized (after the carousel has been built)

onDestroy
:	function	callback function being called after the plugin instance has been destroyed

beforeSlide
:	function	callback function being called before advancing to another slide

afterSlide
:	function	callback function being called after advancing to another slide



### Plugin methods

~~~
// Set an option at runtime
$('selector').caroosel('option', 'key', value);

// Get an option at runtime
var v = $('selector').caroosel('option', 'key');

// Destroy plugin instance
$('selector').caroosel('destroy')

