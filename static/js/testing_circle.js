
var color = d3.scale.category20();

$(document).ready(function(){
	$("body").delegate(".navigation .type input","click",function(event){
		$.address.parameter("type", $(this).val());
	}).delegate(".navigation .filter input","click",function(event){
		$.address.parameter("filter", $(this).val());
	}).delegate(".chart","loadr",function(){
		chart = $(this);
		type=unescape($.address.parameter("type"));
		$.ajax({
			url:"/data/treemap.json",
			data:{axis:type},
			dataType:"json",
			type:"post",
			success:function(json){
				chart.data("type",unescape($.address.parameter("type")));
				chart.data("data",filter_data(json)).trigger("draw");
			}
		});
	}).delegate(".chart","draw",function(event){
		chart = $(this);
		data = chart.data("data");
		
		$("path",chart).remove();
		
		r = Math.min(chart.width(),chart.height())/2;
		
		if($(".map",chart).length<1){
			vis = d3.select(".chart").append("svg:svg").attr("class","map")
				.style("position", "relative")
				.style("width", chart.width() + "px")
				.style("height", chart.height() + "px");
			arc_group = vis.append("svg:g").attr("class", "arc").attr("transform", "translate(" + r + "," + r + ")");
		}
		
		var donut = d3.layout.pie().value(function(d){
			param = $.address.parameter("filter");
			if(!param){
				param = 'size';
			}
			num = d[unescape(param)];
			if(!num){
				return 0;
			}
			return num;
		});
		var arc = d3.svg.arc().innerRadius(0).outerRadius(r);
		
		arc_group.data([data]);
		
		paths = arc_group.selectAll("path").data(donut);
		paths.enter().append("svg:path")
		    .attr("fill", function(d, i) { return color(i); })
		    .attr("d", arc);
		paths.exit().remove();
		
	});
});

$.address.change(function(event){
	chart = $(".chart");
	if(chart.data("type")==unescape($.address.parameter("type"))){
		chart.trigger("draw");
		return false;
	}
	chart.trigger("loadr");
});

function filter_data(data){
	return data['children'];
}