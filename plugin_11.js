//https://github.com/vecta-io/plugins/blob/main/plugin_11.js
try{
transposeShapes();

function transposeShapes(){
    
    var shapes = Vecta.selection.shapes(),
        offset;
     
    if(shapes.length <= 1){
        Vecta.trigger('_showModal.Vecta', {
            title: 'Transpose',
            content: 'Please select multiple shapes',
            class: 'Error.cls',
            open: function (evt) {
                evt.$dialog.find('.Default\\.cls').html('OK');
            }
        });
    }
	
    else {
        offset = getOffset(shapes);
        
        shapes.forEach(function (shape){
            var move = shape.moveU();
            
            shape.move(move.y - offset.y + offset.x, move.x - offset.x + offset.y);
        });
        
        Vecta.selection.clear().add(shapes).refresh();
    }
    
    function getOffset(shapes) {
    	var offset = {};
        
        shapes.forEach(function(shape) {
            var move = shape.moveU();
            
            if (offset.x === undefined) { offset.x = move.x; }
            if (offset.y === undefined) { offset.y = move.y; }
            if (move.x < offset.x) { offset.x = move.x; }
            if (move.y < offset.y) { offset.y = move.y; }
        });
        
        return offset;
    }
}
}catch(e){console.warn("Error found in plugin Transpose");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");