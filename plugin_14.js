//https://github.com/vecta-io/plugins/blob/main/plugin_14.js
generateBOM();

function generateBOM() {
    var cm,
        headers = {
            name: [],
            text: []
        },
        group = {
            name: {},
            text: {}
        },
        agg = {
            name: {},
            text: {}
        },
        cache_grp = localStorage && localStorage.getItem('generateBOM.grp') || 'name',
        cache_aggs = localStorage && JSON.parse(localStorage.getItem('generateBOM.aggs')) || [];

    Vecta.dialog({
        title: 'Generate Bill of Materials',
        buttons: [{default: true, label: 'Download'},{cancel: true, label: 'Cancel'}],
        enter: false,
        open: function (evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                $buttons = $dialog.find('.Button\\.cls'),
                shapes = Vecta.activePage.shapes();
            
            $content.empty();
            $buttons.find('.Default\\.cls').removeClass('Disable.cls');

            //if drawing is empty
            if (shapes.length === 0) {
                $content.append('<div class="Muted.cls">No shapes selected.</div>');
                $buttons.find('.Default\\.cls').addClass('Disable.cls');
                return;
            }

            shapes.forEach(findHeaders); //get headers
            shapes.forEach(findData); //get data

            //if no data is found
            // if (headers.length === 0) {
            //     $content.append('<div class="Muted.cls">No shapes with name or data found in drawing.<br>Please make sure the shape has name in Shape Properties.</div>');
            //     $buttons.find('.Default\\.cls').addClass('Disable.cls');
            //     return;
            // }

            //put checkboxes for group
            $content.append('<div class="Muted.cls">Group By</div>');
            $content.append('<div class="CheckBox.cls Group.cls" name="name" style="display:inline-block; margin-right:15px;"><input type="checkbox" checked><label>Shape\'s Name</label></div>');
            $content.append('<div class="CheckBox.cls Group.cls" name="text" style="display:inline-block"><input type="checkbox" checked><label>Shape\'s Text</label></div>');
            $content.find('.Group\\.cls').not('[name="' + cache_grp + '"]').children('input').prop('checked', false);

            //put checkboxes based on headers
            $content.append('<div class="Muted.cls Columns.cls">Columns <span><span></div>');
            addColumn($content, headers[cache_grp]);

            //accumulate aggregations
            $.each(group.name, function (name) {
                agg.name[name] = agg.name[name] || [];
                Vecta.activePage.shapes(name).forEach(function (shape) { agg.name[name].push(shape.json()); });
            });

            $.each(group.text, function(text) {
                agg.text[text] = agg.text[text] || [];
                shapes.forEach(function(shape) {
                    if (shape.text() == text) { agg.text[text].push(shape.json()); }
                });
            });

            $content.append('<div class="Muted.cls">Aggregations</div>');
            $content.append('<div id="addAggregate.id">' +
                '<input id="agg_title.id" style="min-width:100px;width: 100px;display: inline-block;margin-right:5px;" type="text" placeholder="Title"></input>' +
                '<textarea id="agg_expression.id" type="text"></textarea>' +
                '<button id="agg_add.id" class="Inform.cls" style="min-width: 72px;">Add</button>' +
                '</div>');

            setTimeout(function() {
                var $title =  $content.find('#agg_title\\.id'),
                	height,
                    top;
                
                cm = CodeMirror.fromTextArea($content.find('#agg_expression\\.id')[0], {
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    placeholder: 'Expression',
                    lineWrapping: true
            	});
                
 				height = $title.innerHeight() + 'px'; 
                top = new Vecta.Length($title.css('padding-top')).px() * 2 + 'px';
                 
                $content.find('.CodeMirror')
            	.css('height', 'auto')
            	.css('min-height', height)
            	.css('width', '316px')
            	.css('border', '1px solid #c0c0c0')
            	.css('color', '#303030')
            	.css('border-radius', '3px')
            	.css('display', 'inline-block')
            	.css('top', top)
            	.css('font-size', 'auto')
            	.find('.CodeMirror-sizer').css('min-height', height);
               
            }), 300;
  
             //add existing aggregates
             addAggregate($content, { title: 'Quantity', exp: 'this.length', disable: true }); //add quantity as default
             cache_aggs.forEach(function(agg) { addAggregate($content, agg); });
           		
        },
        click: function (evt) {
            var $target = evt.$target,
                $aggregate = $target.closest('.Aggregate\\.cls'),
                $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                title = $content.find('#agg_title\\.id').val(),
                exp = cm.getValue();

            //set group by
            if ($target.closest('.Group\\.cls').length > 0) {
                cache_grp = $target.closest('.Group\\.cls').attr('name');
                $content.find('.Group\\.cls').not('[name="' + cache_grp + '"]').children('input').prop('checked', false);
                addColumn($content, headers[cache_grp]);
            }

            //add to aggregate
            if ($target.closest('.Inform\\.cls').length > 0 && (title && exp)) {
                addAggregate($content, { title: title, exp: exp });

                //reset input field
                $content.find('#agg_title\\.id').val("");
                cm.setValue('');
            }

            //remove aggregates
            if ($aggregate.length > 0 && $target.closest('.Warn\\.cls').not('.Disable\\.cls').length > 0) {
                $target.closest('.Aggregate\\.cls').remove();
            }
        },

        close: function (evt) {
            var $dialog = evt.$dialog,
                $content = $dialog.find('.Content\\.cls'),
                str = '',
                aggs = getAggregates(evt.$dialog), //user defined aggregates
                user_aggs = $.extend([], aggs);

            //remove unchecked from headers
            $content.find('.Header\\.cls input').each(function(i, node) {
                var label,
                    index;

                if (!$(node).prop('checked')) {
                    label = $(node).next().text();
                    index = headers[cache_grp].indexOf(label);
                }
                if (index > -1) { headers[cache_grp].splice(index, 1); }
            });

            //store aggregates in localstorage
            user_aggs.shift();
            if (localStorage) {
                if (user_aggs.length) { localStorage.setItem('generateBOM.aggs', JSON.stringify(user_aggs)); }
                else { localStorage.removeItem('generateBOM.aggs'); }
                if (cache_grp !== 'name') { localStorage.setItem('generateBOM.grp', cache_grp);  }
                else { localStorage.removeItem('generateBOM.grp'); }
            }
            if (cm) { cm.toTextArea(); } //destroy codemirror
            if (!evt.$target.hasClass('Default.cls')) { return; }

            //add aggregates into headers
            aggs.forEach(function (agg) { headers[cache_grp].push(agg.title); });

            //evaluate aggregates
            $.each(agg[cache_grp], function (name, json_data) {
                aggs.forEach(function (agg) {
                    group[cache_grp][name][agg.title] = tryEval.call(json_data, agg.exp).val;
                });
            });

            //draw headers
            str += 'Reference';
            headers[cache_grp].forEach(function (header){ str += ('\t' + header); });
            str += '\n';

            //draw data
            $.each(group[cache_grp], function (name, sub_data) {
                str += name;
                headers[cache_grp].forEach(function (header) { str += '\t' + sub_data[header]; });
                str += '\n';
            });

            $.download(Vecta.activeDoc.title() + '.tsv', new Blob([str], {type: 'text/tsv'}));

            function tryEval(exp) {
                var ret = {valid: false, val: ''};

                try {
                    ret.val = eval(exp);
                    ret.valid = ret.val !== null && ret.val !== undefined;
                    if (!ret.valid) {
                        ret.val = '';
                    }
                }
                catch (e) {
                    console.error(e);
                }

                return ret;
            }
        }
    });

    //addition of columns
    function addColumn($content, headers) {
        var $columns;
        $content.find('.Header\\.cls').remove();
        $columns = $content.find('.Columns\\.cls');
        $columns.children('span').text('(' + headers.length + ')');
        $.each(headers, function (index, key) {
            $columns.after('<div class="CheckBox.cls Header.cls" name="' + key + '" ><input type="checkbox" checked><label>' + key + '</label> </div>');
        });
    }

    function getAggregates($dialog) {
        var $aggregates = $dialog.find('.Aggregate\\.cls'),
            ret = [];

        $aggregates.each(function (i, node) {
            var $child = $(node).children('div');

            ret.push({title: $child.eq(0).text(), exp: $child.eq(1).text()});
        });

        return ret;
    }

    function findHeaders(shape) {
        var json = shape.json(),
            name = shape.name(),
            text = shape.text();

        name = name ? name.split('.')[0] : undefined;
        text = text ? text : undefined;

        if (name !== undefined) {
            //find all keys in shape's custom data
            $.each(json, function (key) {
                if (headers.name.indexOf(key) < 0) { headers.name.push(key); }
            });
        }
        if (text !== undefined) {
            //find all keys in shape's custom data
            $.each(json, function (key) {
                if (headers.text.indexOf(key) < 0) { headers.text.push(key); }
            });
        }
    }

    function findData(shape) {
        var json = shape.json(),
            name = shape.name(),
            text = shape.text();

        name = name ? name.split('.')[0] : undefined; //if no name, put empty string. Apparently empty string can also be a key for objects
        text = text ? text : undefined;

        if (name !== undefined) {
            group.name[name] = group.name[name] || {};
            headers.name.forEach(function (header) {
                group.name[name][header] = group.name[name][header] || json[header];
            });
        }
        if (text !== undefined) {
            group.text[text] = group.text[text] || {};
            headers.text.forEach(function (header) {
                group.text[text][header] = group.text[text][header] || json[header];
            });
        }
    }

    function addAggregate($content, opts) {
        var $agg = $('<div class="Aggregate.cls" style="border-bottom: 1px solid #c0c0c0;padding-bottom: 9px;">' +
            '<div style="padding: 0 7px; width: 100px;display: inline-block;margin-right:5px;">' + opts.title + '</div>' +
            '<div style="padding: 0 7px; width: 300px;display: inline-block;margin-right:5px;font-family: monospace, Courier;">'+ opts.exp +'</div>' +
            '<button class="Warn.cls' + (opts.disable ? ' Disable.cls' : '') + '">Remove</button>' +
            '</div>');

        $content.find('#addAggregate\\.id').before($agg);
    }
}