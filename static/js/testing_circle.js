
var color = d3.scale.category20();
var oldPieData = [];
var arc = false;

$(document).ready(function(){
	$("body").delegate(".navigation .type input","click",function(event){
		$.address.parameter("type", $(this).val());
	}).delegate(".navigation .filter input","click",function(event){
		$.address.parameter("filter", $(this).val());
	}).delegate(".chart","loadr",function(){
		chart = $(this);
		if(chart.data("data")){
			chart.data("old-data",chart.data("data"));
		}
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
		arc = d3.svg.arc().innerRadius(0).outerRadius(r);
		
		if(chart.data("old-data")){
			oldPieData = chart.data("old-data");
		}
		
		arc_group.data([data]);
		
		tweenTime = 1500;
		
		paths = arc_group.selectAll("path").data(donut);
		paths.enter().append("svg:path")
		    .attr("fill", function(d, i) { return color(i); }).attr("d", arc);
		paths.transition().duration(tweenTime).attrTween("d", pieTween);
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

// Interpolate the arcs in data space.
function pieTween(d, i) {
  var s0;
  var e0;
  if(oldPieData[i]){
    s0 = oldPieData[i].startAngle;
    e0 = oldPieData[i].endAngle;
  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
    s0 = oldPieData[i-1].endAngle;
    e0 = oldPieData[i-1].endAngle;
  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
    s0 = oldPieData[oldPieData.length-1].endAngle;
    e0 = oldPieData[oldPieData.length-1].endAngle;
  } else {
    s0 = 0;
    e0 = 0;
  }
  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}

function removePieTween(d, i) {
  s0 = 2 * Math.PI;
  e0 = 2 * Math.PI;
  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
  return function(t) {
    var b = i(t);
    return arc(b);
  };
}