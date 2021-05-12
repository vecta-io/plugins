//https://github.com/vecta-io/plugins/blob/main/plugin_2.js
Vecta.on('fileDropped.Vecta', function(e, evt) {
    var type;
    
    //get file type
    type = evt.file.type || (evt.file.name || '').split('.').pop();

    switch (type) {
        case 'json':
        case 'application/json': drawJSON(evt.point, JSON.parse(evt.result)); break;
    }
});

function drawJSON(point, json) {
    var x = point.x,
        y = point.y,
		w = 80,
        h = 20;
    
    writeObj(json, {x: 0, y: 0});
    
    function writeObj(json, offset) {
        $.each(json, function (key, val) {
            var shape = $.page().drawRect(x + offset.x, y + offset.y, w, h),
                sub;
            
			shape.text(key).size(shape.textWidth() + 13);
            
            if ($.isPlainObject(val)) {
                writeObj(val, {x: 20, y: h});
			} else {
                sub = $.page().drawRect(shape.moveU().x + shape.sizeU().width, y + offset.y, w, h);
				if (typeof val === 'number' || typeof val === 'string' && val.length < 100) {
                    sub.text(val);
					sub.size(sub.textWidth() + 13);
                }
                else {
                    sub.text('...');
                }
			}
            
            y += h;
        });
	}
}