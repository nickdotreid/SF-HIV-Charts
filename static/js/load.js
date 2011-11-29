$(document).ready(function(){
	$('.chart').bind("load",function(event){
		chart = $(this);
		$.ajax({
			url:chart.data("src"),
			success:function(data){
				chart.trigger({
					type:'parse',
					raw:data
				});
			}
		});
	}).bind("parse",function(event){
		$(this).data("data",event['raw']).trigger("draw");
	});
});