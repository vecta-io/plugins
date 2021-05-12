//https://github.com/vecta-io/plugins/blob/main/plugin_13.js
(function(){
    Vecta.dialog({
        title: 'Box Splitter',
        buttons: [{default: true, label: 'Split'}, {cancel: true, label: 'Cancel'}],
        open: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $buttons = $dialog.find('.Button\\.cls'),
                shapes = Vecta.selection.shapes();

            $content.empty();

            if (shapes.length === 1 && shapes[0].type() === 'rect') {

                $content.append('<div class="RightInput.cls"><label style="width: 84px;">Row</label><input id="row" placeholder="0" type="text"></div>');
                $content.append('<div class="RightInput.cls"><label style="width: 84px;">Row Gutter</label><input id="row_gutt" placeholder="0" type="text"></div>');
                $content.append('<div class="RightInput.cls"><label style="width: 84px;">Column</label><input id="col" placeholder="0" type="text"></div>');
                $content.append('<div class="RightInput.cls"><label style="width: 84px;">Column Gutter</label><input id="col_gutt" placeholder="0" type="text"></div>');

                $buttons.find('.Default\\.cls').removeClass('Disable.cls');
            }
            else {
                $content.append('<div class="Muted.cls">Invalid shape or ' + (shapes.length ? 'multiple' : 'no') + ' shapes selected.</div>');
                $buttons.find('.Default\\.cls').addClass('Disable.cls');
            }
        },
        valid: function($input) {
            return !isNaN($input.val());
        },
        close: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $target = evt.$target,
                shape,
                height,
                width,
                angle,
                clones = [],
                group,
                select,
                col_num,
                row_num,
                col_gutt_num,
                row_gutt_num;

            if ($target.hasClass('Default.cls')) {

                var col,
                    row,
                    col_gutt,
                    row_gutt,
                    total_col_gutt,
                    total_row_gutt,
                    init_x,
                    init_y,
                    box,
                    i,
                    j;

                col_num = $content.find('#col').val() || 0;
                row_num = $content.find('#row').val() || 0;
                col_gutt_num = $content.find('#col_gutt').val() || 0;
                row_gutt_num = $content.find('#row_gutt').val() || 0;

                shape = Vecta.selection.shapes()[0];
                angle = shape.angle() || 0; // store the rect angle, need to rotate back after splitting

                // reset the angle rect b4 splitting
                shape.angle(0);

                // calculate total column/row gutter
                total_row_gutt = row_gutt_num * (row_num - 1);
                total_col_gutt = col_gutt_num * (col_num - 1);

                // calculate true total height/width of all boxes
                height = shape.heightU() - total_row_gutt;
                width = shape.widthU() - total_col_gutt;

                // calculate height/width of each box
                row = (row_num > 0)? height / row_num : height;
                col = (col_num > 0)? width / col_num : width;

                // calculate spacing for each boxes
                row_gutt = total_row_gutt/(row_num - 1);
                col_gutt = total_col_gutt/(col_num - 1);


                // Initially, the 1st box will place at the left top corner
                box = Vecta.activePage.clone(shape)[0];
                box.size(col, row);
                clones.push(box);

                // Then, we set the x,y for the next box
                init_x = box.xU() + col + col_gutt;
                init_y = box.yU() + row + row_gutt;

                // We fill up the column for 1st row
                for(j = 0; j < (col_num - 1); j++){
                    var box2 = Vecta.activePage.clone(box)[0];
                    box2.move(init_x, box.yU());
                    init_x = box2.xU() + col + col_gutt;
                    clones.push(box2);
                }

                // From there, we fill up from 2nd row to the entire thing
                for(i = 0; i < (row_num - 1); i++){
                    var box3 = Vecta.activePage.clone(box)[0];
                    box3.move(box.xU(), init_y);

                    init_x = box.xU() + col + col_gutt;

                    for(j = 0; j < (col_num - 1); j++){
                        var box4 = Vecta.activePage.clone(box3)[0];
                        box4.move(init_x, box3.yU());
                        init_x = box4.xU() + col + col_gutt;
                        clones.push(box4);
                    }
                    init_y = box3.yU() + row + row_gutt;
                    clones.push(box3);
                }

                shape.delete();

                // re-angle rect and select final outputs
                select = new Vecta.Selection();
                group = select.add(clones).group();
                if (group && group.length > 1) {
                    group.angle(angle);
                    select.ungroup();
                }
                else {
                    clones[0].angle(angle);
                }
                Vecta.selection.clear().add(clones).refresh();

            }

        }

    });

})();