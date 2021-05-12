//https://github.com/vecta-io/plugins/blob/main/plugin_1.js
Vecta.on('fileDropped.Vecta', function(e, evt) {
    var type = evt.file.type || (evt.file.name || '').split('.').pop(); //get file type

    switch (type) {
        case 'tsv': drawTSV(evt.point, evt.result); break;
    }
});

function drawTSV(point, str) {
	var x = point.x,
		y = point.y,
    	width = 80,
        height = 40,
        rows = str.split(/\n/);
    
    rows.forEach(function(row) {
        var columns = row.split(/  |    |\t/); //cater to tab, 4 whitespace and 2 whitespace
        
        columns.forEach(function(column) {
            if (column) {
            	$.page().drawRect(x, y, width, height).text(column);
				x += width;
            }
        });
        
		x = point.x;
		y += height;
    });
}