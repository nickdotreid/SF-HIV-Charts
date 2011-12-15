$(document).ready(function(event){
	$(".chart").bind("loadr",function(event){
		chart = $(this);
		if(!chart.parent().hasClass("container")){
			chart.wrap("<div class='container'></div>")
		}
		if(chart.data("type") != $.address.parameter("type")){
			chart.data("type",$.address.parameter("type"));
		}
		$.ajax({
			url:"/data/treemap.json",
			data:{axis:chart.data("type")},
			dataType:"json",
			type:"post",
			success:function(json){
				$(".bar",chart).remove();
				
				data = filter_data(json);
				chart.data("data",data);
				chart.data("total",json['total']);
				if(chart.data('ticks') && $(".rule",chart).length < 1){
					chart.prepend('<div class="rule"></div>');
				}
				barchart = d3.select(".barchart");
				barchart.selectAll("div.bar")
					.data(data)
					.enter().append("div")
						.attr("class","bar hoverable")
						.append("div").attr("class","title").text(function(d){ return better_label(d.name); });
				d3.selectAll(".barchart .bar").append("div").attr("class","line").style("height",0);
				d3.selectAll(".barchart .line").append("div").attr("class","number");
				chart.trigger("draw");				
			}});
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

		d3.selectAll(".barchart .line").transition().duration(duration).style("height",function(d){ return x(return_number(d));});
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
					"top":(400-Number(x(Number(tick.data("value"))).replace('px','')))+'px',
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
	return data['children'];
}

function return_number(d){
	num = Number(d[filter_key()]);
	if(!num){
		return 0;
	}
	if(!$.address.parameter("percent") || $.address.parameter("percent")==""){
	$(".chart").removeClass("percent");
	return num;
	}
	$(".chart").addClass("percent");
	if(!$(".chart:first").data("total")){
		return (num/d.size)*100;
	}
	return (num/$(".chart:first").data("total"))*100;
}

function filter_key(){
	if(!$.address.parameter("filter") || $.address.parameter("filter")==""){
		return 'size';
	}
	return unescape($.address.parameter("filter"));
}

$.address.change(function(event){
	chart = $(".chart");
	
	if(chart.data("type")==$.address.parameter("type") && chart.data("data")){
		chart.trigger("draw");
		return true;
	}
	chart.trigger("loading");
	chart.trigger("loadr");
});

function better_label(label){
	return label;
}
