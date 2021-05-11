//https://github.com/vecta-io/plugins/blob/main/plugin_5.js
try{
function sharpener() {
    var page = Vecta.activePage,
        shapes = page.shapes(),
        scale = page.scale(),
        unit = page.unit();

    shapes.forEach(fitToGrid);

    function fitToGrid(shape) {
        var type = shape.type(),
            move,
            size,
            stroke,
            offset = 0,
            pathList,
            pt;
        
    	move = shape.moveU();
        size = shape.sizeU();
        stroke = shape.strokeWidth();
        //if stroke is even, need to offset by 0.5
        if (stroke % 2 === 0) { 
            offset = 0.5; 
            if (move.x % 1 === offset) { move.x -= offset; }
            if (move.y % 1 === offset) { move.y -= offset; }
        }
        pt = nearestGrid(move.x, move.y, unit, scale);
        shape.move(pt.x + offset, pt.y + offset);
        pt = nearestGrid(size.width, size.height, unit, scale);
        shape.size(pt.x, pt.y);
       
        //handle path/connector
        if (type === 'path' && shape.isConnector()) {
            pathList = shape.pathList();
            pathList = pathList.map(function(command) {
                pt = nearestGrid(command.x, command.y, unit, scale);
                command.x = pt.x;
                command.y = pt.y;

                return command;
            });
            shape.pathList(pathList);
        }
        
         //handle subshapes
        shape.shapes().forEach(fitToGrid);
    }

    function nearestGrid(x, y, unit, scale) {
        var SUB = { px: 1, in: 6, mm: 3.7795276641845703, cm: 3.7795276641845703 },
            sub_div = SUB[unit];

        sub_div = sub_div * scale;

        return {
            x: Math.round(x / sub_div) * sub_div,
            y: Math.round(y / sub_div) * sub_div
        };
    }
}


sharpener();
}catch(e){console.warn("Error found in plugin Sharpener");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");