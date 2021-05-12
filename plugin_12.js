//https://github.com/vecta-io/plugins/blob/main/plugin_12.js
shapeSpacer();

function shapeSpacer(){
    var dropMaster = '<svg viewBox="0 0 8 17" class="DropMaster.cls"><use xlink:href="#drop_master.sym"></use></svg>';

    Vecta.dialog({
        title: 'Spacer',
        buttons: [{default: true, label: 'Run'}, {cancel: true, label: 'Cancel'}],
        open: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $buttons = $dialog.find('.Button\\.cls'),
                shapes = Vecta.selection.shapes(),
                $orient;

            $content.empty();

            if (shapes.length > 1){
                $content.append('<div class="RightInput.cls"><label style="width:64px;">Orientation:</label><div class="Select.cls" style="width:62px;"><span>opt</span>' + dropMaster + '</div><select id="orient.id" style="display: none;"></select></div>');
                $orient = $content.find('#orient\\.id');
                $.each({ 'horizontal': true, 'vertical': false}, function(opt, selected) {
                    var $opt = $('<option value="' + opt + '">' + (opt[0].toUpperCase() + opt.substr(1)) + '</option>');

                    $orient.append($opt);
                    if (selected) { $orient.val(opt); }
                });
                $content.append('<div class="RightInput.cls"><label style="width:64px;">Spacing</label><input id="length" placeholder = "Default = 0px" type = "text"></div>');
                $buttons.find('.Default\\.cls').removeClass('Disable.cls');
            }

            else {
                $content.append('<div class="Muted.cls">Please select more than 1 shape.</div>');
                $buttons.find('.Default\\.cls').addClass('Disable.cls');
            }

        },
        valid: function ($input) {
            var val = $input.val();

            return val === '' || new Vecta.Length(val).value !== null;
        },
        close: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $target = evt.$target,
                $orient = $content.find('#orient\\.id');

            if($target.hasClass('Default.cls')){
                var shapes = Vecta.selection.shapes(),
                    distance = new Vecta.Length($content.find('#length').val() || 0).px();

                if ($orient.val() === 'horizontal') {
                    shapes.sort(function (a, b) {
                        return (a.xU() - b.xU());
                    });
                }
                else {
                    shapes.sort(function (a, b) {
                        return (a.yU() - b.yU());
                    });
                }

                shapes.reduce(function(prev, shape) {
                    var size,
                        move;

                    if (prev) {
                        move = prev.moveU(); //get previous move
                        size = prev.sizeU(); //get previous size
                        if ($orient.val() === 'horizontal') { shape.move(move.x + size.width + distance); }
                        else { shape.move(undefined, move.y + size.height + distance); }
                    }

                    return shape;
                }, null);

                Vecta.selection.clear().add(shapes).refresh();
            }
        }
    });

}