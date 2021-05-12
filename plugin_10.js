//https://github.com/vecta-io/plugins/blob/main/plugin_10.js
drawProtractor();

function drawProtractor(){
    Vecta.dialog({
        title: 'Protractor',
        buttons: [{default: true, label: 'Draw'}, {cancel: true, label: 'Cancel'}],
        open: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $buttons = $dialog.find('.Button\\.cls'),
                shapes = Vecta.selection.shapes();

            $content.empty();

            if(shapes.length === 1 && shapes[0].type() === 'ellipse' && shapes[0].widthU() === shapes[0].heightU()){
                $content.append('<div><input id="lineNum" placeholder="Angle: Default = 360" type="text"></div>');
                $buttons.find('.Default\\.cls').removeClass('Disable.cls');
            }

            else {
                $content.append('<div class="Muted.cls">Multiple or no shape selected. Please select a circle.</div>');
                $buttons.find('.Default\\.cls').addClass('Disable.cls');
            }
        },
        valid: function ($input) {
            return !isNaN($input.val()) && ($input.val() % 1 === 0);
        },
        close: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $target = evt.$target;

            if ($target.hasClass('Default.cls')){
                var shapes = Vecta.selection.shapes(),
                    sideLength,
                    sideNum,
                    lines = [],
                    lineAngle = 0,
                    newLine,
                    fixedLines = [],
                    protractor;

                sideLength = (10 * shapes[0].widthU()) / 250;
                sideNum = $content.find('#lineNum').val() || 360;

                //draw lines, set angle
                for(i = 0; i <= sideNum; i++){
                    newLine = Vecta.activePage.drawPath([{type: 'M', x:shapes[0].xU(), y:shapes[0].cyU()}, {type: 'L', x:shapes[0].xU() + shapes[0].widthU(), y:shapes[0].cyU()}]);
                    newLine.angle(lineAngle);
                    lineAngle += 1;
                    lines.push(newLine);
                }

                //cut lines
                lines.forEach(function (line, index){
                    line.strokeWidth(shapes[0].widthU() / 250);
                    if (index % 10 === 0){line.length((sideLength / 2) * 3);}
                    else if (index % 5 === 0){line.length((sideLength / 5) * 6);}
                    else {line.length(sideLength);}
                    fixedLines.push(line);
                });
                protractor = new Vecta.Selection(fixedLines).group();

                Vecta.selection.clear().add(protractor).refresh();
            }
        }

    });
}