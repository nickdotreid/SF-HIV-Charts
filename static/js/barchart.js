$(document).ready(function(event){
	$(".chart").bind("draw",function(event){
		chart = $(this);
		data = chart.data("data");
		for(item in data){
			chart.append('<div class="bar"></div>');
			$(".bar:last",chart).data({
				name:item,
				amount:data[item]['amount']
				});
		}
		$(".bar",chart).each(function(){
			bar = $(this);
			bar.append('<h3>'+bar.data("name")+'</h3>');
			bar.append('<div class="number">'+bar.data("amount")+'</div>');
		});
	});
});