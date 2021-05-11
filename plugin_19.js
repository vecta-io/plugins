//https://github.com/vecta-io/plugins/blob/main/plugin_19.js
try{
function glowGenerator() {
    Vecta.dialog({
        title: 'Ellipse Glow Generator',
        content: [
            { type: 'input', right_input: true, label: 'Color', placeholder: '#fff, default: yellow' }
        ],
        buttons: [{default: true, label: 'Generate'},{cancel: true, label: 'Cancel'}],
        open: function(evt) {
            evt.$dialog.find('.Button\\.cls').find('.Default\\.cls').removeClass('Disable.cls');
        },
        close: function(evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $target = evt.$target,
                widthU = Vecta.activePage.widthU(),
                heightU = Vecta.activePage.heightU(),
                sun,
                width,
                height,
                color = 'yellow',
                i = 0,
                j = 1;


            if ($target.hasClass('Default.cls')) {

                sun = Vecta.activePage.drawEllipse(0, 0, 30, 30);
                width = sun.sizeU().width;
                height = sun.sizeU().height;

                $input = $content.find('input');
                if ($input.length && $input.val() !== '') {
                    color = $input.val();
                }

                sun.fill(color).strokeWidth(0);
                sun.move((widthU - width)/2, (heightU - height)/2);

                width += 12;
                height += 12;

                for(i = 0; i < 10; i++){
                    var clone = Vecta.activePage.clone(sun)[0];
                    clone.size(width, height);
                    clone.move((widthU - width)/2, (heightU - height)/2);
                    clone.fillOpacity(j);
                    j -= 0.1;
                    width += 12 * ((i>0)? i : 1);
                    height += 12 * ((i>0)? i : 1);
                }

            }

        }

    });
}

glowGenerator();

}catch(e){console.warn("Error found in plugin Glow Effect");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");