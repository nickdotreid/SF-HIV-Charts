$(document).ready(function(event){
	$(".chart").bind("loadr",function(event){
		chart = $(this);
		if(!chart.parent().hasClass("container")){
			chart.wrap("<div class='container'></div>")
		}
		d3.csv(chart.data("csv"),function(data){
			if(chart.data("rotate")){
				data = rotate_data(data);
			}
			chart.data("type","ethnicity");
			chart.data("data",data);
			data = filter_data(data);
			if(chart.data('ticks') && $(".rule",chart).length < 1){
				chart.prepend('<div class="rule"></div>');
			}
			barchart = d3.select(".barchart");
			barchart.selectAll("div.bar")
				.data(data)
				.enter().append("div")
					.attr("class","bar hoverable")
					.append("div").attr("class","title").text(function(d){ return better_label(d.Category); });
			if(chart.hasClass("horizontal")){
				d3.selectAll(".barchart .bar").append("div").attr("class","line").style("height",0);
			}else{
				d3.selectAll(".barchart .bar").append("div").attr("class","line").style("width",0);
			}
			d3.selectAll(".barchart .line").append("div").attr("class","number");
			chart.trigger("draw");
		});
	}).bind("draw",function(event){
		chart = $(this);
		data = chart.data("data");
		duration = chart.data("duration");
		
		horizontal = chart.hasClass("horizontal");
		width = chart.width();
		if(horizontal){
			width = chart.height();
		}
		
		var x = d3.scale.linear().domain([0, d3.max(data,function(d){ return return_number(d); })]).range(["0px", width+"px"]);
		if(chart.hasClass("percent") && $("#scale").length>0 && (!$.address.parameter("scale") || $.address.parameter("scale")=="")){
			var x = d3.scale.linear().domain([0, 100]).range(["0px", width+"px"]);
		}
		if(horizontal){
			d3.selectAll(".barchart .line").transition().duration(duration).style("height",function(d){ return x(return_number(d));});
		}else{
			d3.selectAll(".barchart .line").transition().duration(duration).style("width",function(d){ return x(return_number(d));});
		}
		d3.selectAll(".barchart .line .number").text(function(d){ return format_number(return_number(d)); }).style("top",function(d){
			topr = 0 - $(this).height();
			return topr+'px';
		});
		
		ticks = x.ticks(chart.data("ticks"));
		for(index in ticks){
			if($(".rule .tick[data-value='"+ticks[index]+"']").length < 1){
				$(".rule").append('<div class="tick '+ticks[index]+'" data-value="'+ticks[index]+'"></div>');
			}
		}
		$(".rule .tick",chart).each(function(i){
			tick = $(this);
			tick.stop();
			if(horizontal){
				tick.width(chart.width());
				opacity = 0;
				if(ticks.indexOf(tick.data("value"))!=-1){
					opacity = 1;
				}
				tick.html(format_number(tick.data("value")));
				tick.animate({
					"top":(chart.height()-Number(x(Number(tick.data("value"))).replace('px','')))+'px',
					"opacity":opacity
				},{
					"duration":duration
				});
			}else{
				tick.height(chart.height());
				opacity = 0;
				if(ticks.indexOf(tick.data("value"))!=-1){
					opacity = 1;
				}
				tick.html(format_number(tick.data("value")));
				tick.animate({
					"left":x(Number(tick.data("value"))),
					"opacity":opacity
				},{
					"duration":duration
				});
			}
		});
	});
});

function filter_data(data){
	return data;
}

function return_number(d){
	return Number(d[filter_key()]);
}

function filter_key(){
	if(!$.address.parameter("filter") || $.address.parameter("filter")==""){
		return 'Population';
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

function better_label(label){
	return label;
}
