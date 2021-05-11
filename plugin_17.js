//https://github.com/vecta-io/plugins/blob/main/plugin_17.js
try{
var $file_input = $('<input type="file" accept=".tsv,.csv">');

Vecta.dialog({
    title: 'Data Table',
    content: [
        {
            type : 'radio' , label: 'Separator', group: 'Seperator', right_input: true, label_style: 'min-width: 60px;',
            radios: [
                {label : 'Comma seperator', value : 'csv', checked: true},
                {label : 'Tab seperator', value : 'tsv'}
            ]
        },
        {type: 'input', id: 'cell_width.id', label: 'Cell width', right_input: true, value: '50px', label_style: 'min-width: 60px;'},
        {type: 'input', id: 'cell_height.id', label: 'Cell height', right_input: true, value: '20px', label_style: 'min-width: 60px;'},
        {type: 'textarea', label: 'Data:', value: '', style: 'min-width: 600px;min-height: 200px;'}
    ],
    buttons: [
        {label: 'Import', id: 'import_table.id', style: 'float: left;'},
        {default: true, label: 'OK'},
        {cancel: true, label: 'Cancel'}
    ],
    open: function (evt) {
        var $dialog = evt.$dialog;
        
        $file_input.change(function () {
            var reader;
            
            if ($file_input.val()) {
            	reader = new FileReader();
                
                // handle file upload
                reader.onload = function (file_evt) {
					var content = file_evt.target.result.trim(),
                        ext = file_evt.target.filename.split('.').pop().toLowerCase(),
                        $radio = $dialog.find('input[value="' + ext + '"]');
                    
                    if ($radio.length !== 0) {
                        $radio[0].checked = true;
                        evt.$dialog.find('textarea').val(content);
                    }
                    else {
                        $.notify('Invalid file format', 'Warn');
                    }
                
                };

                // read file
                reader.filename = $file_input.prop('files')[0].name;
                reader.readAsText($file_input.prop('files')[0]);
            }
            
        });
    },
    click: function (evt) {
        if (evt.$target[0].id === 'import_table.id') { $file_input.click(); }
    },
    valid: function ($input) {         
        if ($input[0].id === 'cell_width.id' || $input[0].id === 'cell_height.id') {   
            return new Vecta.Length($input.val()).value !== null;
        }
        else {
            return true;
        }
    },
    close: function (evt) {
        var size;
        
        if (evt.$target.hasClass('Default.cls')) { 
            size = { 
                width: new Vecta.Length(evt.$dialog.find('#cell_width\\.id').val()).px(), 
                height: new Vecta.Length(evt.$dialog.find('#cell_height\\.id').val()).px()
            };
            table(evt.$dialog.find('textarea').val(), evt.$dialog.find('input[type="radio"]:checked').val(), size);
        }
    }
});

function table(data, sep_name, size) {
    var sep = sep_name === 'csv' ? ',' : '\t',
        rows = [],
        max_col = 1;
    
    Vecta.showMessage('Creating table...', true);
    setTimeout(function () {
        
        data.split('\n').forEach(function (line) {
            var columns = line.split(sep);

            if (columns[columns.length - 1] === '') { columns.pop(); }

            if (max_col < columns.length) { max_col = columns.length; }

            rows.push(columns); // push the columns for each row
        });

        rows.forEach(function (columns, row_i) {
            var col_i,
                txt;

            for (col_i = 0; col_i < max_col; col_i++) {
                txt = columns[col_i] || '';

                Vecta.activePage.drawRect(col_i * size.width, row_i * size.height, size.width, size.height).text(txt);
            }
        });
        		
        Vecta.hideMessage();
    });
}

}catch(e){console.warn("Error found in plugin Tables");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");