# caroosel

A jQquery plugin

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
:	string 'left', 'right', 'top', 'bottom': Where to place the tabs (default: left)

animate
:	string	The type of animation to use: 'slide', 'fade', 'none' (default: slide)

animationSpeed
:	number The animation's speed (low number = fast, default: 400)

slideshow
:	boolean	Autoplay on/off (default: false)


