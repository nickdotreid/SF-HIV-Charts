jQuery(document).ready(function(){
	$ = jQuery;
	setTimeout('$(".chart").trigger("load")',600);
	
	$(".controls input").click(function(event){
		$(".chart").trigger("draw");
	});
});

