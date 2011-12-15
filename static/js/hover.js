$(document).ready(function(){
	$('body').delegate('.hoverable','mouseenter',function(){
		$(this).addClass("hover");
		number = $(".number",$(this));
		if($(".percent",number).length < 1){
			number.wrapInner('<div class="percent">');
			d3.select(number[0]).append('div').attr('class','total').text(function(d){ 
				num = d['Total'];
				return "of "+format_number(num);
				});
			number.append('<a href="#" class="more">More</a>');
			number.append('<div class="bottom"></div>');
		}
		$(".total,.more,.bottom",number).show();
		$(".bottom",number).css("top",number.height()+6+'px');
		number.css("top",(0-number.height())+'px');
	}).delegate('.hoverable','mouseleave',function(){
		$(this).removeClass("hover");
		number = $(".number",$(this));
		$(".total,.more,.bottom",number).hide();
		number.css("top",(0-number.height())+'px');
	});
});