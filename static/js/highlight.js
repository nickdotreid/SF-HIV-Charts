$(document).ready(function(event){
	$('.chart').bind('draw',function(event){
		setTimeout('$(".chart").trigger("number")',50);
	}).delegate(".hoverable","mouseenter",function(event){
		line = $(this);
		
		line.append($("#templates .highlight").clone());
		
		$(".highlight",line).trigger('pos');
		
	}).delegate(".hoverable","mouseleave",function(event){
		$('.highlight',$(this)).remove();
	}).delegate('.hoverable .highlight','pos',function(){
		highlight = $(this);
		highlight.css("top",(0-highlight.height())+'px');
		left = (highlight.parents('.hoverable:first').width()/2)-(highlight.width()/2);
		if(left < 0){
			left = 0;
		}
		highlight.css("left",left+'px');
	});
	
});