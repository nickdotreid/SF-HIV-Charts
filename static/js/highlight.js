jQuery(document).ready(function(event){
	$ = jQuery;
	$('.chart').bind('draw',function(event){
		setTimeout('$(".chart").trigger("number")',50);
	}).bind("number",function(event){
		$(".line",$(this)).each(function(index){
			this.id='line'+index;
		});
	}).delegate(".line","mouseenter",function(event){
		line = $(this);
		bar = line.parents(".bar:first");
		
		line.append($("#templates .highlight").clone());
		$(".highlight .percent .number").html(formatPercent(bar.data('population-percent')));
		$(".highlight .total .number").html(formatPercent(bar.data('total')));
		
		$(".highlight",line).trigger('pos');
		
	}).delegate(".line","mouseleave",function(event){
		$('.highlight',$(this)).remove();
	}).delegate('.line .highlight','pos',function(){
		highlight = $(this);
		highlight.css("top",(0-highlight.height())+'px');
		highlight.css("left",(highlight.parents('.line:first').width()/2)+'px');
	});
	
});