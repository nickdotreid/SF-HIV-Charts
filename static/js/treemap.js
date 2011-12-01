var w = 650,
	h = 500,
	color = d3.scale.category20c();

$("body").delegate(".nav.axis a","click",function(event){
	event.preventDefault();
	data_axis = $(this).data("value");
	
	$(".chart").hide();
	if($(".chart."+data_axis).length>0){
		$(".chart."+data_axis).show();
		return false;
	}
	chart = $("#templates .chart.treemap").clone().addClass(data_axis).appendTo($("#maparea")).show();
	$(".nav ."+data_axis,chart).hide();
	div = d3.select(".chart."+data_axis+" .map")
		.style("position", "relative")
		.style("width", w + "px")
		.style("height", h + "px");
	
	$.ajax({
		url:"/data/treemap.json",
		data:{axis:data_axis},
		dataType:"json",
		type:"post",
		success:function(json){
			var treemap = d3.layout.treemap()
				.size([w, h])
				.sticky(true)
				.value(function(d) { return d.size; });
			div.data([json]).selectAll("div")
				.data(treemap.nodes)
			.enter().append("div")
				.attr("class","cell")
				.style("background",function(d){ return color(d.name);})
				.call(cell)
				.text(function(d){ return d.children ? null :d.name; });
			chart.data({'treemap':treemap,'div':div});
			$(".nav a:first",chart).click();
		}
	});
}).delegate(".nav.section a","click",function(event){
	event.preventDefault();
	item = $(this);
	chart = item.parents(".chart:first");
	$(".nav a").removeClass("selected");
	$('a.control',chart).removeClass("selected");
	item.addClass("selected");
	
	div = chart.data("div");
	treemap = chart.data("treemap");
	
	var total = 0;
	div.selectAll("div")
		.data(treemap.value(function(d){
			val = d[item.data("value")];
			if(!val){
				val = 0;
			}
			total += val;
			return val;
			}))
		.transition().duration(1500)
		.call(cell);
	$(".total .number",chart).html(addCommas(total));
	
});

$(document).ready(function(){
	$(".nav a:first").click();
});

function cell() {
	this
		.style("left", function(d) { return d.x + "px"; })
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return d.dx - 1 + "px"; })
		.style("height", function(d) { return d.dy - 1 + "px"; });
}