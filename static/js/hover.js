$(document).ready(function(){
	$('body').delegate('.hoverable','mouseenter',function(){
		$(this).addClass("hover");
	}).delegate('.hoverable','mouseleave',function(){
		$(this).removeClass("hover");
	});
});