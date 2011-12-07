$(document).ready(function(event){
	$(".chart").bind("loadr",function(event){
		chart = $(this);
		d3.csv(chart.data("csv"),function(data){
			chart.data("type","ethnicity");
			chart.data("y_data",data);
			y_data = data;
			x_data = rotate_data(data);
			chart.data("x_data",x_data);
			if(chart.data('ticks')){
				chart.prepend('<div class="rule"></div>');
			}
			chart.append('<div class="axis y-axis"></div><div class="axis x-axis"></div>');
			
			y_axis = d3.select(".barchart .y-axis");
			y_axis.selectAll("div.bar").data(y_data).enter().append("div").attr("class","bar").style("width","0px");
			
			x_axis = d3.select(".barchart .x-axis");
			x_axis.selectAll("div.bar").data(x_data).enter().append("div").attr("class","bar").style("height","0px");;
			
			d3.selectAll(".barchart .bar").append("div").attr("class","line");
			d3.selectAll(".barchart .bar").append("a").attr("class","title").text(function(d){ return d.Category; }).attr("data-value",function(d){ return d.Category; });
			chart.trigger("draw");
		});
	}).bind("draw",function(event){
		chart = $(this);
		y_data = chart.data("y_data");
		x_data = chart.data("x_data");
		duration = chart.data("duration");
		var y = d3.scale.linear().domain([0, d3.max(y_data,function(d){ return return_number(d); })]).range(["0px", chart.width()+"px"]);
		var x = d3.scale.linear().domain([0, d3.max(x_data,function(d){ return return_number(d); })]).range(["0px", chart.height()+"px"]);
		d3.selectAll(".y-axis .line").transition().duration(duration).style("width",function(d){ return y(return_number(d)); });
		d3.selectAll(".x-axis .line").transition().duration(duration).style("height",function(d){ return x(return_number(d)); });
	});
});

function return_number(d){
	if(!d[filter_key()]){
		return 0;
	}
	return Number(d[filter_key()]);
}

function filter_key(){
	if(!$.address.parameter("filter") || $.address.parameter("filter")==""){
		return 'Total';
	}
	return unescape($.address.parameter("filter"));
}

$.address.change(function(event){
	chart = $(".chart");
	
	if(chart.data("type")==$.address.parameter("type")){
		chart.trigger("draw");
		return true;
	}
	chart.trigger("loading");
	chart.trigger("loadr");
});
