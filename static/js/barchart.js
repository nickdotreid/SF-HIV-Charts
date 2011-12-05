$(document).ready(function(event){
	$(".chart").bind("loadr",function(event){
		chart = $(this);
		d3.csv(chart.data("csv"),function(data){
			chart.data("type","ethnicity");
			chart.data("data",data);
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
		data = $(this).data("data");
		var x = d3.scale.linear().domain([0, d3.max(data,function(d){ return Number(d[filter_key()]); })]).range(["0px", chart.width()+"px"]);
		
		d3.selectAll(".barchart .line").transition().duration(500).style("width",function(d){
			return x(Number(d[filter_key()]));
		});
	});
	
	$("form.navigation input").click(function(event){
		$.address.parameter("filter",this.value);
	});
});

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
