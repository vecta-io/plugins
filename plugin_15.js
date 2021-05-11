//https://github.com/vecta-io/plugins/blob/main/plugin_15.js
try{
(function(){

    var shapes = Vecta.selection.shapes();

    Vecta.dialog({
        title: 'Create Bullet List',
        content : [{ type: 'radio', group: 'bullet_type', vertical: true,
            radios:
                [{label: 'Dotted List', value: 'dot', checked: true},
                    {label: 'Boxed List', value: 'box'},
                    {label: 'Numbered List', value: 'number'}]
        }],
        buttons: [{default: true, label: 'Create'},{cancel: true, label: 'Cancel'}],
        open: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $buttons = $dialog.find('.Button\\.cls');

            if (shapes.length === 1) {
                $dialog.find('.Title\\.cls').text('Create Bullet List');
                $buttons.find('.Default\\.cls').removeClass('Disable.cls');
                $content.css({padding: '1px 10px'});
            }
            else {
                $dialog.find('.Title\\.cls').text('Failed to create bullet list');
                $content.empty();
                $content.append('<div class="Muted.cls">Invalid shape or ' + (shapes.length ? 'multiple' : 'no') + ' shapes selected.</div>');
                $buttons.find('.Default\\.cls').addClass('Disable.cls');
                $content.css({padding: '6px 10px 0'});
            }
        },
        close: function(evt) {

            var $target = evt.$target,
                bullet_type = evt.$dialog.find('input[name=\'bullet_type\']:checked').val();

            if ($target.hasClass('Default.cls')) {
                BulletList.create(shapes, bullet_type);
            }

        }
    });

    var BulletList = new function() {

        var shape,
            lists,
            new_line,
            bullet_size,
            font_size,
            num_space,
            bullet,
            num,
            x,
            y;

        this.create = function(shapes, bullet_type) {
            if(shapes.length === 1){
                shape = shapes[0];
                lists = [];

                shape.textAnchor('start');

                new_line = true;

                lists.push(shape);

                font_size = parseInt(shape.fontSize()); // need parse to remove 'px' from value
                bullet_size = font_size / 3;

                x = shape.box().x + shape.txtXU();
                y = shape.box().y + shape.txtYU();


                shape.$.find('text').children().each( function(index, tspan){
                    tspan = $(tspan);

                    // only create bullet on new line
                    if (new_line && tspan.text() !== '') {
                        curr_y = Number(tspan.attr('y')) + y - (font_size / 2);

                        if (bullet_type === 'box') {
                            bullet = Vecta.activePage.drawRect(x - bullet_size * 2 , curr_y, bullet_size, bullet_size).fill('black').stroke('none');
                        }

                        if (bullet_type === 'dot') {
                            bullet = Vecta.activePage.drawEllipse(x - bullet_size * 2 , curr_y, bullet_size, bullet_size).fill('black').stroke('none');
                        }

                        if (bullet_type === 'number') {
                            num = num || 1;
                            num_space = num.toString().length + 1;
                            bullet = Vecta.activePage.drawText(x - font_size * num_space, curr_y, font_size * num_space, bullet_size, num +' )')
                                .textAnchor('end').style('font-size', (font_size * 5) / 6 );
                            num++;
                        }

                        lists.push(bullet);
                        new_line = false;
                    }
                    if (tspan.attr('v:enter')) { new_line = true; }
                });

                // we cannot group the bullets and text shape because it'll reset the setting we set for the text
                // so we just select all the generated/modified shapes
                Vecta.selection.clear().add(lists).refresh();

            }
        };
    };

})();






}catch(e){console.warn("Error found in plugin Bullet List");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");