var color = d3.scale.category20c();
$(document).ready(function(){
	$("body").delegate(".navigation .type input","click",function(event){
		$.address.parameter("type", $(this).val());
	}).delegate(".navigation .filter input","click",function(event){
		$.address.parameter("filter", $(this).val());
	}).delegate(".chart","draw",function(){		
		chart = $(this);
		div = chart.data("div");
		treemap = chart.data("treemap");
		
		div.selectAll(".cell")
			.data(treemap.value(cell_size))
			.transition().duration(1500)
			.call(cell);
		div.selectAll(".number").text(cell_text);
		chart.trigger("update");
	}).delegate(".chart","loadr",function(){
		chart = $(this);
		type=chart.data("type");
		
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
				$(".map div",chart).remove();
				chart.data("data",json);
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
				div.selectAll('.cell').append("div").attr("class","number").text(cell_text);
				chart.data({'div':div,'treemap':treemap})
					.trigger("update");
			}
		});
	}).delegate(".chart","update",function(){
		chart = $(this);
		chart.trigger("update_total");
		$(".total .number",chart).html(addCommas(chart.data("total")));
		filter = $(".navigation a.selected.filter:first").data("value");
		if(!filter || filter=='size'){
			$(".total .filter",chart).html("");
		}else{
			$(".total .filter",chart).html(" "+filter);
		}
		
	}).delegate(".chart","update_total",function(){
		chart.data("total",get_total(this));
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
	
	if(!$.address.parameter("type") || $.address.parameter("type")==""){
		$(".navigation a.type:first").click();
	}
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

function cell_text(d){
	if(d['children']){
		return "";
	}
	number = d[unescape($.address.parameter("filter"))];
	total = get_total($(this).parents('.chart')[0]);
	return format_percent((number/total)*100)+'%';
}

function cell_size(d){
	filter = unescape($.address.parameter("filter"));
	if(!filter){
		filter = 'size';
	}
	val = d[filter];
	if(!val){
		val = 0;
	}
	
	return val;
}

function get_total(chart){
	chart = $(chart);
	data = chart.data("data");
	total = 0;
	filter = unescape($.address.parameter("filter"));
	if(!filter){
		filter = 'size';
	}
	for(node in data['children']){
		val = data['children'][node][filter];
		if(!val){
			val = 0;
		}
		total += val;
	}
	return total;
}

function cell() {
	this
		.style("left", function(d) { return d.x + "px"; })
		.style("top", function(d) { return d.y + "px"; })
		.style("width", function(d) { return d.dx - 1 + "px"; })
		.style("height", function(d) { return d.dy - 1 + "px"; });
}