$(document).ready(function(event){
	$(".chart").bind("loadr",function(event){
		chart = $(this);
		d3.csv(chart.data("csv"),function(data){
			chart.data("type","ethnicity");
			chart.data("data",data);
			if(chart.data('ticks')){
				chart.prepend('<div class="rule"></div>');
				for(var i=0;i<chart.data("ticks");i++){
					$('.rule',chart).append('<div class="tick"></chart>');
				}
			}
			barchart = d3.select(".barchart");
			barchart.selectAll("div.bar")
				.data(data)
				.enter().append("div")
					.attr("class","bar")
					.append("div").attr("class","title").text(function(d){ return d.Category; });
			d3.selectAll(".barchart .bar").append("div").attr("class","line").style("width",0);
			chart.trigger("draw");
		});
	}).bind("draw",function(event){
		chart = $(this);
		data = chart.data("data");
		duration = chart.data("duration");
		var x = d3.scale.linear().domain([0, d3.max(data,function(d){ return return_number(d); })]).range(["0px", chart.width()+"px"]);
		if(!$.address.parameter("scale") || $.address.parameter("scale")==""){
			var x = d3.scale.linear().domain([0, 100]).range(["0px", chart.width()+"px"]);
		}
		d3.selectAll(".barchart .line").transition().duration(duration).style("width",function(d){
			return x(return_number(d));
		}).text(function(d){ return addCommas(d[filter_key()]); });
		ticks = x.ticks(chart.data("ticks"));
		$(".rule .tick",chart).each(function(i){
			tick = $(this);
			tick.height(chart.height());
			tick.stop();
			if(ticks[i] == undefined){
				tick.animate({
					"left":chart.width()+tick.width()+'px',
					"opacity":0
				},{
					"duration":duration
				});
				return false;
			}
			tick.html(addCommas(ticks[i]));
			tick.animate({
				"left":x(Number(ticks[i])),
				"opacity":1
			},{
				"duration":duration
			});
		});
	});
});

function return_number(d){
	return Number(d[filter_key()]);
}

function filter_key(){
	if(!$.address.parameter("filter") || $.address.parameter("filter")==""){
		return 'Population';
	}
	return $.address.parameter("filter");
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
