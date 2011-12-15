$(document).ready(function(){
	$('body').delegate('.hoverable','mouseenter',function(){
		$(this).addClass("hover");
		number = $(".number",$(this));
		if($(".percent",number).length < 1){
			number.wrapInner('<div class="percent">');
			d3.select(number[0]).append('div').attr('class','total').text(function(d){ 
				num = d['Total'];
				if(d['size']){
					num = d['size']
				}
				return "of "+format_number(num);
				});
			number.append('<a href="#" class="more">More</a>');
			number.append('<div class="bottom"></div>');
		}
		$(".total,.more,.bottom",number).show();
		bottom = $(".bottom",number);
		borderbottom = Number(number.css('border-bottom-width').replace('px',''));
		bottom.css("top",number.height()+(bottom.height()/2)-(borderbottom/2)+'px');
		bottom.css("left",'0px');
		
		//number.css("top",(0-number.height())+'px');
		number.css("top",'-70px');
		number.css("left",'-30px');
	}).delegate('.hoverable','mouseleave',function(){
		$(this).removeClass("hover");
		number = $(".number",$(this));
		$(".total,.more,.bottom",number).hide();
		number.css("top",(0-number.height())+'px');
		number.css("left",'-20px');
	}).delegate(".number a","click",function(event){
		event.preventDefault();
	});
});