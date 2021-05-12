//https://github.com/vecta-io/plugins/blob/main/plugin_4.js
Vecta.dialog({
    title: 'Scatter shapes',
    buttons: [{ default: true, label: 'Draw'}, { cancel: true, label: 'Cancel'}],
    open: function(evt) {
        var shapes = Vecta.selection.shapes(),
            $dialog = evt.$dialog,
            $content = $dialog.find('.Content\\.cls');

        $content.empty();
        if (shapes.length) {
            $content.append('<div><input type="text" placeholder="Frequency. Default: 10."></div>' +
                                 '<div><input type="text" placeholder="Scale factor. Default: 5."></div>');
            $dialog.find('.Default\\.cls').removeClass('Disable.cls');
        }
        else {
            $content.append('<div class="Muted.cls">No shapes selected.</div>');
            $dialog.find('.Default\\.cls').addClass('Disable.cls');
        }
    },
    close: function(evt) {
        var $content = evt.$dialog.find('.Content\\.cls'),
            $target = evt.$target,
            max = {
                x: Vecta.activePage.widthU(),
                y: Vecta.activePage.heightU()
            },
            shapes = Vecta.selection.shapes(),
            selections = shapes,
            $input,
            num,
            scale,
            i = 0;

        // if user chose to draw
        if ($target.hasClass('Default.cls')) {
            $input = $content.find('input');
            if ($input.length) {
                num = $input.eq(0).val() || 10;
                num = parseInt(num);

                scale = $input.eq(1).val() || 2;
                scale = parseInt(scale);

                if (typeof num === 'number') {
                    for (; i < num ; i++) { selections.push(scatter(i)); }
                    Vecta.selection.clear().add(selections);
                }
            }
        }

        function scatter(index) {
            var shape = shapes[Math.floor(random(0, shapes.length))], //randomize shapes
                clone = Vecta.activePage.clone(shape)[0],
                clone_size = clone.sizeU(),
                clone_scale = 1;

            if (scale > 1) { clone_scale = Math.floor(random(1, scale * 2)) / scale; }
            //randomize width & height
            clone_size.width *= clone_scale;
            clone_size.height *= clone_scale;
            clone.size(clone_size.width, clone_size.height);

            clone.move(random(0, max.x - clone_size.width), random(0, max.y - clone_size.height)); //randomize x & y

            clone.angle(random(0, 360)); //randomize angle

            return clone;
        }
    }
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}
