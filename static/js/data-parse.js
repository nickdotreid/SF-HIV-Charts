jQuery(document).ready(function(){
	$ = jQuery;
	$(".chart").bind("load",function(event){
		chart = $(this);
		$.get(chart.data("source"),function(data){
			chart.data("raw",data);
			csv = jQuery.csv()(data);
			setTimeout('$(".chart").trigger("parse")',50);
		},"text");
	}).bind("parse",function(event){
		chart = $(this);
		data = [];
		categories = [];
		csv = jQuery.csv()(chart.data("raw"));
		type = false;
		for(row in csv){
			for(col in csv[row]){
				if(col==0){
					type = csv[row][col]
				}else{
					if(!data[col-1]){
						data[col-1] = {};
					}
					if(row == 0){
						categories[col-1]=csv[row][col];
					}else{
						data[col-1][type] = Number(csv[row][col]);
					}
				
				}
			}
		}
		new_data = {};
		for(index in categories){
			new_data[categories[index]] = data[index];
		}
		chart.data("data",new_data).trigger("list");			
	});
});