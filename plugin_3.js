//https://github.com/vecta-io/plugins/blob/main/plugin_3.js
var width = Vecta.activePage.widthU(),
    height = Vecta.activePage.heightU(),
    branch_length = height / 21;

drawFractalTree(width / 2, height * 0.65, width / 2, height * 0.55);

function drawFractalTree(x1, y1, x2, y2) {
    var list = [{type: 'M', x: x1, y: y1}, {type: 'L', x: x2, y: y2}],
        shp = Vecta.activePage.drawPath(list),
        len = shp.length(),
        color = '#994f00',
        pt,
        tgt;
    
    shp.strokeWidth(len * 0.1).stroke(color).strokeOpacity(0.75);
    
    if (len > branch_length) {
        pt = pointOnSegment(list, 1.9);
        tgt = rotatePoint(pt.x, pt.y, x2, y2, 20);
        drawFractalTree(x2, y2, tgt.x, tgt.y);
        tgt = rotatePoint(pt.x, pt.y, x2, y2, -20);
        drawFractalTree(x2, y2, tgt.x, tgt.y);
    }
}

function pointOnSegment(list, t) {
    return {x: (1 - t) * list[0].x + t * list[1].x, y: (1 - t) * list[0].y + t * list[1].y};
}

function rotatePoint(x, y, cx, cy, angle) {
    var dx,
        dy,
        rad,
        cos,
        sin,
        res = {x: x, y: y};

    if (angle !== 0) {
        dx = x - cx;
        dy = y - cy;
        rad = radius(angle);
        cos = Math.cos(rad);
        sin = Math.sin(rad);

        res = { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
    }
    
    return res;
}

function radius (angle) {
    return angle * Math.PI / 180;
}