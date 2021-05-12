//https://github.com/vecta-io/plugins/blob/main/plugin_6.js
var rows = {},
	shape;

Vecta.dialog({
    title: 'Using the line chart plugin',
    buttons: [{default: true, label: 'OK'}, {cancel: true, label: 'Cancel'}],
    open: function(evt) {
        var shapes = Vecta.selection.shapes(),
            $content = evt.$dialog.find('.Content\\.cls'),
            $cancel = evt.$dialog.find('.Cancel\\.cls');

        $cancel.addClass('Hide.cls');
        $content.empty();

        if (shapes.length != 1) { showUsageDialog($content); }
        else {
            shape = shapes[0];

            //We need a group of rectangles in 2 rows
            if (shape.isGroup()) {

                shape.shapes().forEach(function (sub) {
                    var move = sub.moveU(),
                        key = 'y' + Math.round(move.y);

                    //scan all cells and arrange by rows
                    rows[key] = rows[key] || [];
                    rows[key].push({sub: sub, x: move.x});
                });

                //only do if have 2 rows
                if (Object.keys(rows).length >= 2) {
                    //Get each rows and ensure their ordering correct
                    Object.keys(rows).forEach(function (key, index) {
                        rows[index] = rows[key].sort(function (a, b) {
                            return a.x - b.x;
                        }).map(function (a) {
                            return a.sub.text();
                        });
                    });

                    //Show cancel button
                    $cancel.removeClass('Hide.cls');

                    //before generate line graph,
                    $content.append('<div class="RightInput.cls">' +
                        '<label style="width: 90px; text-align: right;">Chart width (px)</label>' +
                        '<input type="number" id="line_chart_width.id" min="100" value="400" max="1000" />' +
                        '</div>' +
                        '<div class="RightInput.cls" style="margin-top: 5px;">' +
                        '<label style="width: 90px; text-align: right;">Chart height (px)</label>' +
                        '<input type="number" id="line_chart_height.id" min="100" value="200" max="1000" />' +
                        '</div>' +
                        '<div class="CheckBox.cls" style="position: relative; left: 97px;, margin-top: 5px;">' +
                        '<input type=checkbox id="line_chart_curve.id">' +
                        '<label>Curve line</label>' +
                        '</div>');
                    $content.css({width: 'auto', height: 'auto'});
                }
                else { showUsageDialog($content); }
            }
            else { showUsageDialog($content); }

        }
    },
    close: function(evt) {
        var $dialog = evt.$dialog,
            $target = evt.$target,
            $input = $dialog.find('input'),
            position,
            width,
            height,
            curve;

        if ($target.hasClass('Default.cls') && $input.length > 0) {
            position = shape.moveU();
            width = parseFloat($dialog.find('#line_chart_width\\.id').val());
            height = parseFloat($dialog.find('#line_chart_height\\.id').val());
            curve = $dialog.find('#line_chart_curve\\.id').is(':checked') ? true : false;

            drawLineChart(rows[0], rows[1], position.x, position.y, width, height, curve);
        }
    }
});

function drawLineChart(row1, row2, x, y, width, height, curve) {
    var list = [],
        axis = [],
        obj = {},
        horiz = row1.shift(),
        verti = row2.shift(),
        biggest = row2.reduce(function (a, b) { return Math.max(a, b); }),
        ratio_w = width / (row1.length - 1),
        ratio_h = height / biggest;

    //draw axis line
    for (var i = 0; i <= 2; i++ ) {
        if (i === 0) {
            obj.type = 'M';
            obj.y = y - (height + 50);
        }
        else {
            obj.type = 'L';
            obj.y = y - 50;
        }

        if (i === 2) { obj.x = x + width; }
        else { obj.x = x; }
        axis.push(obj);
        obj = {};
    }

    Vecta.activePage.drawPath(axis).beginArrow('thin').endArrow('thin');
    Vecta.activePage.drawText(axis[0].x - 50, axis[0].y - 30, 100, 30, verti); //write title of y-axis
    Vecta.activePage.drawText(axis[2].x - 50, axis[2].y, 100, 30, horiz); //write title of x-axis

    row1.forEach(function (cell, indx) {
        var last = list[list.length - 1];

        if (indx === 0) { obj.type = 'M'; }
        else { obj.type = curve ? 'C' : 'L'; }

        obj.x = x + (ratio_w * indx);
        obj.y = (y - 50 - height) + (height - (ratio_h * row2[indx]));

        if (curve && obj.type === 'C') {
            obj.x1 = last.x + ((obj.x - last.x) / 2);
            obj.x2 = obj.x - ((obj.x - last.x) / 2);
            obj.y1 = last.y;
            obj.y2 = obj.y;
        }

        list.push(obj);
        obj = {};
    });

    Vecta.activePage.drawPath(list);
}

function showUsageDialog($content){
    $content.append('<img src="/app/images/using-the-line-chart-plugin.svg">').css({width: 540, height: 170});
}
