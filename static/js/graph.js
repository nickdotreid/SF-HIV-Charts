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
			$(chart).append('<div class="bar" data-demographic="'+demographic+'"><h3>'+demographic+'</h3><div class="total"><div class="percent number"></div> of <div class="number"></div> People</div><div class="container"><div class="line population"><div class="percent"><div class="number"></div>%</div></div><div class="line incidence"><div class="percent"><div class="number"></div>%</div></div></div></div>');
		}
		chart.trigger("draw");
	}).bind("draw",function(event){
		chart = $(this);
		data = chart.data("data");
		if(!data){
			return false;
		}
		comp_total = $(".control.selected").data("value");
		total = false;
		switch(comp_total){
			case 'incidence':
				total = 'total_pos';
				$(".description .numerator").html("New HIV Cases");
				$(".description .demonator").html("HIV+ Population by Demographic");
				break;
			case 'incidence-total':
				total = data['Population']['Total'];
				$(".description .numerator").html("New HIV Cases");
				$(".description .demonator").html("HIV+ Population Total");
				break;
			case 'demographic':
				total = 'own';
				$(".description .numerator").html("HIV+ Population");
				$(".description .demonator").html("SF Population by Demographic");
				break;
			case 'city':
				total = data['Census']['Total'];
				$(".description .numerator").html("HIV+ Population");
				$(".description .demonator").html("SF Population Total");
				break;
		}
		if(!total){
			alert("no draw type");
			return false;
		}
		max_percent = false;
		$('.bar',chart).each(function(){
			bar = $(this);
			local_total = total
			if(total == 'own'){
				local_total = data['Census'][bar.data("demographic")];
			}
			if(total == 'total_pos'){
				local_total = data['Population'][bar.data("demographic")];
			}
			$(".total .number",bar).html(addCommas(local_total));
			bar.data("population-percent",data['Population'][bar.data("demographic")]/local_total);
			bar.data("incidence-percent",data['Incidence'][bar.data("demographic")]/local_total);
			bar.data("total",local_total);
			
			$(".population .number",bar).html(formatPercent(bar.data("population-percent")));
			$(".population",bar).css("right","-"+$(".population",bar).width()+"px");
			$(".incidence .number",bar).html(formatPercent(bar.data("incidence-percent")));
			$(".incidence",bar).css("right","-"+$(".incidence",bar).width()+"px");
			
			if(comp_total.indexOf('incidence')!=-1){
				if(!max_percent || bar.data("incidence-percent")>max_percent){
					max_percent = bar.data("incidence-percent");
				}
				$(".total .percent",bar).html(formatPercent(bar.data("incidence-percent"))+"%");			
			}else{
				if(!max_percent || bar.data("population-percent")>max_percent){
					max_percent = bar.data("population-percent");
				}
				$(".total .percent",bar).html(formatPercent(bar.data("population-percent"))+"%");
			}
		});
		if(comp_total.indexOf('incidence')!=-1){
			$(".line.population:visible").hide();
		}else{
			$(".line.population:hidden").show();
		}
		$('.bar',chart).each(function(){
			bar = $(this);
			container_width = $(".container",bar).width();
			if(comp_total.indexOf('incidence')!=-1){
				$(".line.incidence",bar).animate({
						width:container_width*(bar.data("incidence-percent")/max_percent)
					},{
						duration:500
					});
					$(".line.population",bar).animate({
							width:0
						},{
							duration:500
						});
			}else{
				$(".line.population",bar).animate({
						width:container_width*(bar.data("population-percent")/max_percent)
					},{
						duration:500
					});
					$(".line.incidence",bar).animate({
							width:0
						},{
							duration:500
						});				
			}
			if($(".population:visible",bar).length>0 && $(".incidence .percent",bar).width()>(container_width*(bar.data("population-percent")/max_percent))){
				$(".incidence .percent",bar).hide();
			}else{
				$(".incidence .percent",bar).show();
			}
			$(".line .percent",bar).hide();
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