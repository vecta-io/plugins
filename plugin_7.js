//https://github.com/vecta-io/plugins/blob/main/plugin_7.js
try{
var shape, rows = {};

Vecta.dialog({
    title: 'Using the pie chart plugin',
    buttons: [{default: true, label: 'OK'}, {cancel: true, label: 'Cancel'}],
    open: function(evt) {
        var shapes = Vecta.selection.shapes(),
            $content = evt.$dialog.find('.Content\\.cls'),
            $cancel = evt.$dialog.find('.Cancel\\.cls');

        $cancel.addClass('Hide.cls');
        $content.empty();

        if (shapes.length !== 1) { showUsageDialog($content); }
        else {
            shape = shapes[0];

            //We need a group of rectangles in 2 rows, anything else is problematic
            if (shape.isGroup()) {
                shape.shapes().forEach(function (sub) {
                    var move = sub.moveU(),
                        key = 'y' + Math.round(move.y);

                    //Scan all cells and arrange by rows
                    rows[key] = rows[key] || [];
                    rows[key].push({sub: sub, x: move.x});
                });

                //Only do if we have at least 2 rows, where more rows will be ignored
                if (Object.keys(rows).length >= 2) {
                    //Get each rows and ensure their x ordering is correct
                    Object.keys(rows).forEach(function (key, index) {
                        rows[index] = rows[key].sort(function (a, b) {
                            return a.x - b.x;
                        }).map(function (a) {
                            return a.sub.text();
                        });
                    });

                    //Enable cancel button if got table of data
                    $cancel.removeClass('Hide.cls');

                    //Before generating, we ask if need angle offset
                    $content.append('<div class="RightInput.cls">' +
                        '<label style="width: 100px; text-align: right;">Chart size (px) </label>' +
                        '<input type="number" id="pie_chart_size.id" min="100" value="200" max="1000" />' +
                        '</div>' +
                        '<div class="RightInput.cls" style="margin-top: 5px;">' +
                        '<label style="width: 100px; text-align: right;">Offset angle (deg) </label>' +
                        '<input type="number" id="pie_chart_offset.id" min="0" value="0" max="360" />' +
                        '</div>' +
                        '<div class="CheckBox.cls" style="position: relative; left: 107px; margin-top: 5px;">' +
                        '<input type=checkbox id="pie_chart_percent.id">' +
                        '<label>Convert to percentage</label>' +
                        '</div>');
                    $content.css({width: '250px', height: 'auto'});
                }
                //if we have 1 or less row, we show usage message
                else {
                    showUsageDialog();
                }
            }
        }
    },
    close: function(evt) {
        var $dialog = evt.$dialog,
            $content = $dialog.find('.Content\\.cls'),
            $input = $dialog.find('input'),
            $target = evt.$target,
            size;

        if ($target.hasClass('Default.cls') && $input.length > 0) {
            size = parseFloat($content.find('#pie_chart_size\\.id').val());

            drawPieChart(rows[0], rows[1], shape.centerU().x - size * 0.5, shape.yU() - 50 - size,
                parseFloat($content.find('#pie_chart_offset\\.id').val()),
                size,
                $content.find('#pie_chart_percent\\.id').is(':checked'));
        }

    }
});

function drawPieChart(legend, series, x, y, offset, size, percent) {
    var ser = [],
        i = 0,
        val,
        total,
        cen,
        pts = {},
        SEGS = [
            [
                {type: 'M', x: x + size * 0.5, y: y},
                {type: 'C', x1: x + size - size * 0.223, y1: y, x2: x + size, y2: y + size * 0.223, x: x + size, y: y +size * 0.5}
            ],
            [
                {type: 'M', x: x + size, y: y + size * 0.5},
                {type: 'C', x1: x + size, y1: y + size - size * 0.223, x2: x + size - size * 0.223, y2: y + size, x: x + size * 0.5, y: y + size}
            ],
            [
                {type: 'M', x: x + size * 0.5, y: y + size},
                {type: 'C', x1: x + size * 0.223, y1: y + size, x2: x, y2: y + size - size * 0.223, x: x, y: y + size * 0.5}
            ],
            [
                {type: 'M', x: x, y: y + size * 0.5},
                {type: 'C', x1: x, y1: y + size * 0.223, x2: x + size * 0.223, y2: y, x: x + size * 0.5, y: y}
            ]
        ],
        COLORS = ['#ff6666', '#ffb466', '#fff266', '#d9ff66', '#66ff80', '#66ffe6', '#66d9ff', '#66b2ff', '#b266ff', '#ff66ff'],
        fingers = [];

    //Filter series to remove percentages and also blank or non numeric values
    for (; i < series.length; i++) {
        val = series[i].replace('%', '');

        if ($.isNumeric(val)) { ser.push(parseFloat(val)); }
        //Once we encounter a non numeric we stop
        else { break; }
    }

    //Get the total
    total = ser.reduce(function (a, b) { return a + b; }, 0);

    //Center
    cen = {x: x + size * 0.5, y: y + size * 0.5};

    //Initialize points
    pts.angle = normalizeAngle(offset || 0);

    ser.forEach(function (num, index) {
        var angle = num * 360 / total,
            end_angle = normalizeAngle(pts.angle + angle),
            start_quad = quadrant(pts.angle),
            end_quad = quadrant(end_angle),
            start_t = pts.angle === 0 ? 0 : (pts.angle - start_quad * 90) / 90,
            end_t = end_angle === 0 ? 0 : (end_angle - end_quad * 90) / 90,
            src,
            tgt,
            segs,
            text;

        //If same quadrant and t is from small to big
        if (start_quad === end_quad && start_t <= end_t) {
            segs = Vecta.math.splitSegment(Vecta.math.splitSegment(SEGS[start_quad], start_t)[1], (end_t - start_t) / (1 - start_t))[0];
        }
        else {

            segs = Vecta.math.splitSegment(SEGS[start_quad], start_t)[1];

            do {
                start_quad++;

                if (start_quad > 3) { start_quad = 0; }

                if (start_quad !== end_quad) { segs.push(SEGS[start_quad][1]); }
            } while (start_quad !== end_quad);

            segs.push(Vecta.math.splitSegment(SEGS[end_quad], end_t)[0][1]);
        }

        segs.push({type: 'L', x: cen.x, y: cen.y});
        segs.push({type: 'Z'});

        //Format the pie
        Vecta.activePage.drawPath(segs).stroke('#fff').fill(COLORS[index % COLORS.length]);

        src = rotatePoint(cen.x, cen.y - size * 0.5, cen.x, cen.y, pts.angle + angle * 0.5);
        tgt = rotatePoint(cen.x, cen.y - size * 0.5 - 20, cen.x, cen.y, pts.angle + angle * 0.5);

        fingers.push(
            Vecta.activePage.drawPath([
                {type: 'M', x: src.x, y: src.y},
                {type: 'L', x: tgt.x, y: tgt.y}
            ]).beginArrow('dot')
        );

        text = Vecta.activePage.drawText(tgt.x, tgt.y - 10, 20, 20, legend[index] + ' ' + (percent ? (Math.round(num * 1000 / total) / 10) + '%' : num));
        text.size(text.textWidth() + 10);
        if (tgt.x < cen.x) { text.move(text.xU() - text.widthU()); }

        pts.angle = end_angle;
    });

    //Make sure the fingers are in front
    fingers.forEach(function (shape) { shape.front(); });
}

function quadrant (angle) {
    var quadrant;

    if (angle >= 0 && angle <= 90) { quadrant = 0; }
    else if (angle > 90 && angle <= 180) { quadrant = 1; }
    else if (angle > 180 && angle <= 270) { quadrant = 2; }
    else { quadrant = 3; }

    return quadrant;
}

function normalizeAngle (angle) {
    var ret = angle;

    if (angle < 0) { ret = (angle % 360) + 360; }
    else if (angle >= 360) { ret = angle % 360; }

    if (ret === 360) { ret = 0; }

    return ret;
}

function rotatePoint(x, y, cx, cy, angle) {
    var dx,
        dy,
        rad,
        cos,
        sin;

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

function showUsageDialog($content) {
    $content.append('<img src="/app/images/using-the-pie-chart-plugin.svg">').css({width: 540, height: 160});
}
}catch(e){console.warn("Error found in plugin Pie Chart");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");