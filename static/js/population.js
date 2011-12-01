jQuery(document).ready(function(){
	$ = jQuery;
	setTimeout('$(".chart").trigger("load")',600);
	
	$("a.control").click(function(event){
		event.preventDefault();
		$.address.value($(this).attr('href'));
	});
	
	$.address.change(function(event) {
		if(event.value=='/'){
			return false;
		}
		$("a.control").removeClass('selected');
		$("a.control[href='"+event.value.replace("/",'')+"']").addClass("selected");
		$(".chart").trigger("draw");
	});
	
	
});

