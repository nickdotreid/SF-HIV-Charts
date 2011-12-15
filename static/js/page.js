$(document).ready(function() {

});


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

function format_number(num,percent){
	if(percent){
		return format_percent(num)+"%";
	}
	return addCommas(num);
}

function format_percent(number){
	percent = Math.round(number*100)/100;
	if(number > 1){
		percent = Math.round(number*10)/10;
	}
	if(number > 10){
		percent = Math.round(number);
	}
	return percent;
}

function rotate_data(data){
	new_data = {};
	for(index in data){
		for(category in data[index]){
			if(!new_data[category]){
				new_data[category] = {"Category":category};
			}
			new_data[category][data[index]['Category']] = data[index][category]
		}
	}
	data = [];
	for(category in new_data){
		if(category!="Category"){
			data.push(new_data[category]);
		}
	}
	return data;
}