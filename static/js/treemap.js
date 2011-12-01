var color = d3.scale.category20c();
$(document).ready(function(){
	$("body").delegate(".navigation a.type","click",function(event){
		event.preventDefault();
		$(".navigation a.type.selected").removeClass("selected");
		$(this).addClass("selected");
		$.address.parameter("type", $(this).data("value"));
	}).delegate(".navigation a.filter","click",function(event){
		event.preventDefault();
		$(".navigation a.filter.selected").removeClass("selected");
		$(this).addClass("selected");
		$.address.parameter("filter", $(this).data("value"));
	}).delegate(".chart","draw",function(){		
		chart = $(this);
		div = chart.data("div");
		treemap = chart.data("treemap");
		
		div.selectAll("div")
			.data(treemap.value(cell_size))
			.transition().duration(1500)
			.call(cell);
	}).delegate(".chart","loadr",function(){
		type=$(this).data("type");
		
		div = d3.select(".chart .map")
			.style("position", "relative")
			.style("width", chart.width() + "px")
			.style("height", chart.height() + "px");
	
		$.ajax({
			url:"/data/treemap.json",
			data:{axis:type},
			dataType:"json",
			type:"post",
			success:function(json){
				$(".map div").remove();
				var treemap = d3.layout.treemap()
					.size([chart.width(), chart.height()])
					.sticky(true)
					.value(cell_size);
				div.data([json]).selectAll("div")
					.data(treemap.nodes)
					.enter().append("div")
						.attr("class","cell")
						.style("background",function(d){ return color(d.name);})
						.call(cell)
						.text(function(d){ return d.children ? null :d.name; });
				chart.data({'div':div,'treemap':treemap});
			}
		});
	}).delegate(".chart","loading",function(){
		chart = $(this);
		$(".map div").animate({
			opacity:0,
		},{
			duration:300,
			complete:function(){
				$(this).remove();
			}
		});
	});
	$(".navigation a.type:first").click();
});

$.address.change(function(event){
	chart = $(".chart");
	
	if(chart.data("type")==$.address.parameter("type")){
		chart.trigger("draw");
		return true;
	}
	chart.data({
		type:$.address.parameter("type"),
		filter:$.address.parameter("filter")
	});
	chart.trigger("loading");
	//load delay?
	if(chart.data("load_delay")){
		clearTimeout(chart.data("load_delay"));
	}
	chart.data("load_delay",setTimeout('chart.trigger("loadr");',200))
});

function cell_size(d){
	filter = $(".navigation a.selected.filter:first").data("value");
	if(!filter){
		filter = 'size';
	}
	val = d[filter];
	if(!val){
		val = 0;
	}
	return val;
}

function cell() {
	this
		.style("left", function(d) { return d.x + "px"; })
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return d.dx - 1 + "px"; })
		.style("height", function(d) { return d.dy - 1 + "px"; });
}