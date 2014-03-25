	// fix old IE bug with console
	if(!window.console){ window.console = {log: function(){} }; }
	
	// Load the Visualization API and the piechart package.
	google.load('visualization', '1', {'packages':['corechart']});
	
	function refreshChart(index) {
		if(index >= charts.length) return;
		
		charts[index].jsondata = $.ajax({
			url: charts[index].url,
			dataType:"json",
			async: false,
			cache: false
		}).responseText;
		
		if(!charts[index].jsondata || charts[index].jsondata.length == 0) return;
		
		// Create our data table out of JSON data loaded from server.
		charts[index].datatable = new google.visualization.DataTable(charts[index].jsondata);
		
		// Instantiate and draw our chart, passing in some options.
		if(!charts[index].chart) {
			console.log('Creating new chart for ' + charts[index].url);
			charts[index].chart = new google.visualization.AreaChart(document.getElementById(charts[index].div));
		}
		
		var width = charts[index].width;
		if(width == 0) width = (window.innerWidth - 40) / 2;
		if(width <= 10) width = (window.innerWidth - 40) / width;
		if(width < 200) width = 200;
		
		var height = charts[index].height;
		if(height == 0) height = (window.innerHeight - 20) / 2;
		if(height <= 10) height = (window.innerHeight - 20) / height;
		if(height < 100) height = 100;
		
		var hAxisTitle = null;
		var vAxisTitle = null;
		if(height >= 200) hAxisTitle = "Time of Day";
		if(width >= 400) vAxisTitle = charts[index].vtitle;
		
		var options = {
			width: width,
			height: height,
			title: charts[index].title,
			hAxis: {title: hAxisTitle},
			vAxis: {title: vAxisTitle, minValue: 10},
			// animation: {duration: 1000, easing: 'inAndOut'},
		};

		if(charts[index].chart) charts[index].chart.draw(charts[index].datatable, options);
		else console.log('Cannot create chart for ' + charts[index].url);
	}
	
	var charts = new Array();
	function drawChart(name, div, width, height, jsonurl, title, vtitle) {
		var i;
		
		for(i = 0; i < charts.length; i++)
			if(charts[i].name == name) break;
		
		if(i >= charts.length) {
			console.log('Creating new objects for chart ' + name);
			charts[i] = [];
			charts[i].chart = null;
			charts[i].jsondata = null;
			charts[i].datatable = null;
			charts[i].name = name;
			charts[i].div = div;
			charts[i].width = width;
			charts[i].height = height;
			charts[i].url = jsonurl;
			charts[i].title = title;
			charts[i].vtitle = vtitle;
		}
		
		try {
			refreshChart(i);
		}
		catch(err) {
			console.log('Cannot create chart for ' + jsonurl);
		}
	}
	
	var charts_last_drawn = 999999999;
	function refreshCharts(howmany) {
		
		if(charts.length == 0) return;
		
		var h = howmany;
		if(h == 0) h = 1;
		if(h > charts.length) h = charts.length;
		//console.log('Will run for ' + h + ' charts');
		
		var i;
		for(i = 0; i < h; i++) {
			charts_last_drawn++;
			if(charts_last_drawn >= charts.length) charts_last_drawn = 0;
			
			try {
				console.log('Refreshing chart ' + charts[charts_last_drawn].name);
				refreshChart(charts_last_drawn);
			}
			catch(err) {
				console.log('Cannot refresh chart for ' + charts[charts_last_drawn].url);
			}
		}
		return 0;
	}