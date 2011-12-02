jQuery(document).ready(function(){
	$ = jQuery;
	$('.chart').bind("list",function(event){
		chart = $(this);
		data = chart.data("data");
		if(!data || data.length < 1){
			return false;
		}
		population = data['Population'];
		for(demographic in population){
			$(chart).append('<div class="bar" data-demographic="'+demographic+'"><h3>'+demographic+'</h3><div class="total"><div class="percent number"></div> of <div class="number"></div><span class="qualify"></span> <span class="people"></span> <span class="are"></span> '+demographic+'</div><div class="container"><div class="line"><div class="percent"><div class="number"></div>%</div></div></div></div>');
		}
		chart.trigger("draw");
	}).bind("draw",function(event){
		chart = $(this);
		data = chart.data("data");
		if(!data){
			return false;
		}
		max_percent = false;
		$('.bar',chart).each(function(){
			bar = $(this);
			local_total = 1;
			if($("#demographic").attr("checked")){
				local_total = data[$(".controls .denominator input:checked").val()][bar.data("demographic")];
			}else{
				local_total = data[$(".controls .denominator input:checked").val()]['Total'];
			}
			percent = data[$(".controls .numerator input:checked").val()][bar.data("demographic")]/local_total;
			$(".total .number",bar).html(addCommas(local_total));
			bar.data("percent",percent);
			bar.data("total",local_total);
			
			$(".line .number",bar).html(formatPercent(bar.data("percent")));
			$(".line .percent",bar).css("right","-"+$(".population",bar).width()+"px");
			
			if(!max_percent || bar.data("percent")>max_percent){
				max_percent = bar.data("percent");
			}
			$(".total .percent",bar).html(formatPercent(bar.data("percent"))+"%");
			if($("#demographic").attr("checked") && bar.data("demographic")!="Total"){
				$(".total .qualify",bar).html(" "+bar.data("demographic"));
			}else{
				$(".total .qualify",bar).html("");
			}
			if($(".denominator input:checked").val()=='Census'){
				$(".total .people",bar).html("people in SF");
			}else{
				$(".total .people",bar).html("HIV+ people in SF");
			}
			if($(".numerator input:checked").val()=='Incidence'){
				$(".total .are",bar).html("became HIV+ in 2010");
			}else{
				$(".total .are",bar).html("are HIV+");
			}
		});
		if(!$("#scale").attr("checked")){
			max_percent = 1;
		}
		$('.bar',chart).each(function(){
			bar = $(this);
			container_width = $(".container",bar).width();
			$(".line",bar).animate({
					width:container_width*(bar.data("percent")/max_percent)
				},{
					duration:500
				});
		});
	});
});

function formatPercent(number){
	percent = Math.round(number*100);
	if(String(percent).length>1){
		return percent;
	}
	percent = Math.round(number*1000)/10;
	if(String(percent).length>1){
		return percent;
	}
	percent = Math.round(number*10000)/100;
	return percent;
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}