var w = $(".chart").width(),
	h = 500,
	color = d3.scale.category20c();

var treemap = d3.layout.treemap()
	.size([w, h])
	.sticky(true)
	.value(function(d) { return d.size; });

var div = d3.select(".chart").append("div")
	.style("position", "relative")
	.style("width", w + "px")
	.style("height", h + "px");
	
d3.json("/data/treemap.json",function(json){
	div.data([json]).selectAll("div")
		.data(treemap.nodes)
	.enter().append("div")
		.attr("class","cell")
		.style("background",function(d){ return color(d.name);})
		.call(cell)
		.text(function(d){ return d.children ? null :d.name; });
	
	$(".nav a").click(function(){
		$(".nav a").removeClass("selected");
		item = $(this);
		item.addClass("selected");
		var total = 0;
		div.selectAll("div")
			.data(treemap.value(function(d){
				total += d[item.data("value")];
				return d[item.data("value")];
				}))
			.transition().duration(1500)
			.call(cell);
		$("#total .number").html(total);
	});
});

function cell() {
	this
		.style("left", function(d) { return d.x + "px"; })
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return d.dx - 1 + "px"; })
		.style("height", function(d) { return d.dy - 1 + "px"; });
}