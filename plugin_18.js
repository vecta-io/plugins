//https://github.com/vecta-io/plugins/blob/main/plugin_18.js
try{
Vecta.dialog({
    title: 'Polygon',
    content: [
        { type: 'input', right_input: true, label: 'Number of sides', placeholder: 'default: 5' }
    ],
    buttons: [{default: true, label: 'Draw'},{cancel: true, label: 'Cancel'}],
    open: function(evt) {
        var $dialog = evt.$dialog,
            $content = $dialog.find('.Content\\.cls'),
            $buttons = $dialog.find('.Button\\.cls .Default\\.cls'),
            shapes = Vecta.selection.shapes();

        if(shapes.length === 1 && shapes[0].type() === 'rect' && shapes[0].widthU() === shapes[0].heightU()) {
            $buttons.removeClass('Disable.cls');
        }
        else {
            $content.html('<div class="Muted.cls">Please select a square (Equal width and height. Eg: 20x20).</div>');
            $buttons.addClass('Disable.cls');
        }
    },
    valid: function ($input) {
        return !isNaN($input.val()) && ($input.val() % 1 === 0);
    },
    close: function(evt) {
        var shape = Vecta.selection.shapes()[0],
            sides = evt.$dialog.find('.Content\\.cls').find('input').val() || 5,
            in_angle = ((sides - 2) * 180) / sides,
            offset = {},
            list = [],
            styles,
            length,
            i,
            pos,
            f_begin,
            f_end,
            l_begin,
            l_end,
            cen,
            polygon,
            text;

        if (evt.$target.hasClass('Default.cls')){
            length = shape.sizeU();
            pos = shape.moveU();
            styles = {
                stroke: shape.stroke(),
                'stroke-opacity': shape.strokeOpacity(),
                'stroke-width': shape.strokeWidth(),
                fill: shape.fill(),
                'fill-opacity': shape.fillOpacity()
            };
            text = shape.text();

            // first line
            f_begin = { x: pos.x, y: pos.y + length.height };
            f_end = { x: pos.x + length.width, y: pos.y + length.height };
            list = [{type: 'M', x: f_begin.x, y: f_end.y}, {type: 'L', x: f_end.x, y: f_end.y}];
            cen = { x: (f_end.x + f_begin.x) / 2, y: (f_end.y + f_begin.y) / 2 };

            // don't need to calculate last line because we will close the polygon after we done
            for(i = 1; i < sides - 1; i++){
                // rotate the first line
                l_begin = rotatePoint(f_begin.x, f_begin.y, cen.x, cen.y, in_angle * i);
                l_end = rotatePoint(f_end.x, f_end.y, cen.x, cen.y, in_angle * i);
                // for 'even' line, we will adjust the begin pt to be the same as previous pt in the list and insert the end pt to the list
                if(i % 2 === 0){
                    offset = {x: (list[i].x - l_begin.x), y: (list[i].y - l_begin.y)};
                    list.push({type: 'L', x: l_end.x + offset.x, y: l_end.y + offset.y});
                }
                // for 'odd' line, we will adjust the end pt to be the same as previous pt in the list and insert the begin pt to the list
                else{
                    offset = {x: (list[i].x - l_end.x), y: (list[i].y - l_end.y)};
                    list.push({type: 'L', x: l_begin.x + offset.x, y: l_begin.y + offset.y});
                }
            }

            list.push({type: 'Z'}); // close the polygon

            // delete the rect
            shape.delete();
            // draw the polygon, reposition and resize it, copy over the text and styling
            polygon = Vecta.activePage.drawPath(list).move(pos.x, pos.y).size(length.width, length.height).text(text).style(styles);
            // select the polygon
            Vecta.selection.clear().add(polygon).refresh();
        }
    }

});

function rotatePoint (x, y, cx, cy, angle) {
    var dx,
        dy,
        rad,
        cos,
        sin;

    angle = angle % 360;

    if (angle !== 0) {
        dx = x - cx;
        dy = y - cy;
        rad = angle * Math.PI / 180;
        cos = Math.cos(rad);
        sin = Math.sin(rad);

        return {
            x: cx + dx * cos - dy * sin, //x * cos A - y * sin A
            y: cy + dx * sin + dy * cos //x * sin A + y * cos A
        };
    }
    else {
        return {x: x, y: y};
    }
}

}catch(e){console.warn("Error found in plugin Polygon");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");