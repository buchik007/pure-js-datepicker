var calendar_anchor;		
var dt;						
var weekendDay = 7;			
var today = new Date();
var start_limit = new Date(today.getFullYear()-3, today.getMonth(), today.getDate()).valueOf();
var end_limit = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1).valueOf();
var workDate;				
var cal_obj;				
var showToday = true;		
var no_limit = false;		

var c_header;				
var months = new Array();	
var todayName;				


function setDaysLang(days) {
	var h="";
	var d = days.split(",");
	for(i=0; i<d.length; i++)
		h = h+"<th>"+d[i]+"</th>";
	c_header = "<tr>"+h+"</tr>";
}

function setMonthsLang(months_list) {
	months = months_list.split(",");
}


function setTodayLang(name) {
	todayName = name;
}

function setWeekendDay(day) {
	weekendDay = day;
}

function daysInMonth(dateObj) {
	return new Date(dateObj.getFullYear(), dateObj.getMonth()+1, 0).getDate();
}

function setStartLimit(dateString) {
	st = dateString.split('/');
	start_limit = new Date(parseInt(st[2]), parseInt(st[1])-1, parseInt(st[0])).valueOf();
}

function setStartLimit(day, month, year) {
	start_limit = new Date(day, month-1, year).valueOf();
}

function setEndLimit(dateString) {
	st = dateString.split('/');
	end_limit = new Date(parseInt(st[2]), parseInt(st[1])-1, parseInt(st[0])).valueOf();
}

function setEndLimit(day, month, year) {
	end_limit = new Date(day, month-1, year).valueOf();
}

function setTodayOption(option) {
	showToday = option;
}

function enableLimit(option) {
	no_limit = (option == 1 || option == true) ? false : true;
}


function setDate(d, m, y, cell) {
	date = (d < 10) ? '0'+d+'/' : d+'/';
	date = date + ((m < 10) ? '0'+m+'/' : m+'/');
	date = date + y;
	dt = new Date(y, m, d);

	if (typeof cell !== 'undefined') {
		var cls = document.getElementById('calendar_table').querySelectorAll(".selected")[0];
		if (typeof cls !== 'undefined') // just checking...
			cls.className = cls.className.replace("selected ", "");
		cell.className = "selected "+cell.className;
	}
	calendar_anchor.value=date;
}

function removeCalendar() {
	cal_obj = cal_obj.parentNode.removeChild(cal_obj);
	calendar_anchor = null;
}

function run_calendar(id) {

	if (cal_obj && calendar_anchor == id) {
		removeCalendar();
		return;
	}
	calendar_anchor = id;
	if (calendar_anchor.value) {
		st = calendar_anchor.value.split('/');
		dt = new Date(parseInt(st[2]), parseInt(st[1])-1, parseInt(st[0]));
		if (dt.valueOf() < start_limit.valueOf())
			dt = new Date(start_limit.valueOf());
		if (dt.valueOf() > end_limit.valueOf())
			dt = new Date(end_limit.valueOf());
	}
	else
		dt = new Date();
	
	workDate = new Date(dt.valueOf());
	drawCalendar();
	calendar_anchor.parentNode.appendChild(cal_obj);
	cal_obj.style.position='absolute';
}

function drawCalendar() {
	var calStr = c_header;
	var totalCounter = 0;
	workDate.setDate(1);
	firstDay=workDate.getDay();
	
	if (!cal_obj) {
		cal_obj = document.createElement('div');
		cal_obj.setAttribute('id', 'calendar_element');
	}
	
	
	calData="<tr>";
	for (i=0;i<firstDay;i++) {
		calData=calData+"<td>&nbsp;</td>";
		totalCounter++;
	}
	
	days = daysInMonth(workDate);
	for (j=1;j<=days;j++) {
		var strCell;
		totalCounter++;
		
		workDate.setDate(j);

		if((totalCounter+6)%7==0)
			calData=calData+"<tr>";
			
		if (totalCounter%weekendDay==0)
			dayClass = 'weekend';
		else
			dayClass = 'normal';
			
		if (workDate.valueOf() == dt.valueOf())
			dayClass = 'selected '+dayClass;
			
		if (outOfRange(workDate.valueOf())) {
			dayClass = 'dimmed '+dayClass;
			clickAction = "";
		}
		else
			clickAction = "onclick='javascript:setDate("+j+","+(workDate.getMonth()+1)+","+workDate.getFullYear()+", this);'";
			
		calData=calData+"<td class='"+dayClass+"' "+clickAction+">"+j+"</td>";

		if((totalCounter%7==0)) {
			calData=calData+"</tr>\n";
		}
	}
	if(totalCounter%7!=0)
		calData=calData+"</tr>";
	
	navTable = "<table id='calendar_navigation'><tr><td class='nav' onclick='javascript:prevMonth();'>&lt;</td><td id='nav_text' style='min-width: 60px;'>"+
	months[workDate.getMonth()]+
	"</td><td class='nav' onclick='javascript:nextMonth();'>&gt;</td><td class='nav' onclick='javascript:prevYear();'>&lt;</td><td id='nav_text'>"+workDate.getFullYear()+"</td><td class='nav' onclick='javascript:nextYear();'>&gt;</td></tr></table>";
	
	var jumpToToday = "";
	if (showToday)
		jumpToToday = "<tr><td colspan='7' class='normal' onclick='javascript:setToToday();'>"+todayName+"</td></tr>";
	cal_obj.innerHTML = navTable+"<table id='calendar_table'>"+calStr+calData+jumpToToday+"</table>";
}

function setToToday() {
	dt = new Date();
	workDate = new Date();
	drawCalendar();
	setDate(dt.getDate(), dt.getMonth()+1, dt.getFullYear());
	
}
function prevMonth() {
	var m = workDate.getMonth()-1;
	var y = workDate.getFullYear();
	if (m < 0) {
		m = 11;
		y--;
	}
	workDate = new Date(y, m, 1);
	drawCalendar();
}

function nextMonth() {
	var m = workDate.getMonth()+1;
	var y = workDate.getFullYear();
	if (m > 11) {
		m = 0;
		y++;
	}
	workDate = new Date(y, m, 1);
	drawCalendar();
}

function prevYear() {
	var m = workDate.getMonth();
	var y = workDate.getFullYear()-1;
	workDate = new Date(y, m, 1);
	drawCalendar();
}

function nextYear() {
	var m = workDate.getMonth();
	var y = workDate.getFullYear()+1;
	workDate = new Date(y, m, 1);
	drawCalendar();
}

function outOfRange(date) {
	if (no_limit)
		return false;
	return (date > end_limit || date < start_limit);
}
