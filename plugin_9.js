//https://github.com/vecta-io/plugins/blob/main/plugin_9.js
try{
function fa_icons() {
    var fa_cats = ['brands', 'solid'],
        fa_icons = {},
        octokit,
        $dialog,
        BLACKLIST = [];

    loadOctokit().then(function () {
        var tasks = [];
        
            Vecta.showMessage('Loading...', true);
        
            //populate material icons from github
            octokit = new Octokit();
            octokit.authenticate({ type: 'token', token: '3ef7637f527ed99962c542694631ee3e46945e50' });
            tasks = fa_cats.map(function(cat) {
                return octokit.repos.getContent({owner: 'FortAwesome', repo: 'Font-Awesome', path: 'svgs/' + cat });
            });
            
            Promise.all(tasks).then(function(dirs) {
                dirs.forEach(function(files, index) {
                    fa_icons[fa_cats[index]] = fa_icons[fa_cats[index]] || [];
                    files.data.forEach(function(file) {
                        var split = file.name.split('.'),
                            name = split[0];
                        
                        if(BLACKLIST.indexOf(name) === -1){
                            fa_icons[fa_cats[index]].push(name);
                        }
						
                    });
                });
                
                Vecta.hideMessage();
                
                openDialog();
            });
    });
    
    function openDialog() {
        var $style,
        	delay;
        
        Vecta.dialog({
            title: 'Font Awesome icons',
            content: [ 
                {
                    type:'html', 
                    html: '<div class="Container.cls" style="width: 567px;height: 400px;overflow: auto;overflow-x: hidden;border: 1px solid #e0e0e0;"></div>'}
            ],
            buttons: [{default: true, label: 'Import'},{cancel: true, label: 'Cancel'}],
            open: function (evt) {
                var $dialog = evt.$dialog,
                    $content = $dialog.find('.Container\\.cls'),
                    $input = $dialog.find('#fa_search\\.id'),
                    cat_class = { brands: 'fab', solid: 'fas' };
                
                $style = $('#fa\\.style');
                
                //set style if not exists
                if ($style.length === 0) { setStyle(); }
                
                //add material icons link if not found
                if ($('#fa\\.icons').length === 0) { $('head').append('<link id="fa.icons" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" rel="stylesheet">'); }
                
                if ($input.length === 0) { 
                    $input = $('<input id="fa_search.id" type="text" placeholder="Search..." style="margin-top: 0;min-width: 415px;"/>');
                    $dialog.find('.Button\\.cls').prepend($input);
                }

                //add icons
                if (!$content.children().length) {
                    $.each(fa_icons, function(cat, names) {
                        var $ul = $('<ul style="list-style: none;margin: 0;padding: 0;">');

                        $content.append('<div class="Muted.cls" style="background: #eceff1;padding: 6px;">' + capitalize(cat) + '</div>');
                        $content.append($ul);

                        names.forEach(function(name) {
                            var $i = $('<i class="' + cat_class[cat] + ' fa-' + name + '"></i>'),
                                $span = $('<span>' + name + '</span>');
                                $li = $('<li cat="' + cat + '" title="' + name + '"></li>');

                            $li.append($i);
                            $li.append($span);
                            $ul.append($li);
                        });
                    });
                }
                else {
                    $content.find('li.Active\\.cls').removeClass('Active.cls');
                }
                
                $input.on('keyup paste.plugin_9', function() {
                    clearTimeout(delay);
                    delay = setTimeout(function() {
                        var token = $input.val().trim();
                        console.log(token);
                        if (token) {
                            $content.find('li').each(function(i, node) {
                                var $node = $(node),
                                    title = $node.children('span').text();

                                $node[title.indexOf(token) > -1 ? 'removeClass' : 'addClass']('Hide.cls');
                            });
                            
                            $content.find('ul').each(function(i, node) {
                                var $node = $(node),
									$prev = $node.prev('.Muted\\.cls');
                                
                                if ($node.children('li').not('.Hide\\.cls').length) {
                                    $prev.removeClass('Hide.cls');
                                }
                                else { $prev.addClass('Hide.cls'); }
                            });
                        }
                        else { 
                            $content.find('li.Hide\\.cls, div.Muted\\.cls.Hide\\.cls').removeClass('Hide.cls'); 
                        }
                    }, 300);
                });
                
            },
            click: function(evt) {
                var $li = evt.$target.closest('li');

                //select icons
                if ($li.length) { $li.toggleClass('Active.cls'); }
            },
            close: function (evt) {
                var $dialog = evt.$dialog,
                    $content = $dialog.find('.Container\\.cls'),
                    $target = evt.$target,
                    tasks = [];

                // if user chose to export
                if ($target.hasClass('Default.cls')) {
                    //get selected icons
                    tasks = $content.find('li.Active\\.cls').map(function(index, node) {
                        var $node = $(node),
                            cat = $node.attr('cat'),
                            title = $node.attr('title');

                        return octokit.repos.getContent({
                            owner: 'FortAwesome', 
                            repo: 'Font-Awesome', 
                            path:  'svgs/' +cat + '/' + title + '.svg'
                        });
                    });
                    
                    Promise.all(tasks).then(function(files) {
                        files = files.map(function(file, index) {
                            return b64DecodeUnicode(file.data.content);
                        });
                        
                        $.dropSVG(files, { x: 0, y: 0 });
                    });
                }
                
                $dialog.find('#fa_search\\.id').remove();
                $style.remove();
            }
        });
        
        function setStyle() {
            var font_size = 32;

            //set custom styles
            $style = $('<style id="fa.style"/>');
            style = `

            #user_dialog\\.dialog .Container\\.cls ul li{
                display: inline-block;
                width: ` + font_size + `px;
                padding: 5px;
                margin: 4px;
                cursor: pointer;
                border-radius: 3px;
                text-align: center;
            }

            #user_dialog\\.dialog .Container\\.cls ul li:hover{
                border: 1px solid #e0e0e0;
                margin: 3px;
            }

            #user_dialog\\.dialog .Container\\.cls ul li.Active\\.cls{
                border: 1px solid #ffca28;
                margin: 3px;
            }

            #user_dialog\\.dialog .Container\\.cls ul li i{
                font-size: ` + font_size + `px;
                width: ` + font_size + `px;
            }

            #user_dialog\\.dialog .Container\\.cls ul li span{
                display: block;
                width: ` + font_size + `px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: ` + (font_size / 3) + `px;
            }
            `;
            $style.text(style);
            $('head').append($style); 
        }
    }

    //add octokit, github client
    function loadOctokit () {
        return new Promise(function (resolve) {
            if ($('#octokit\\.id').length === 0) {
                loadScript('octokit\.id', 'https://cdnjs.cloudflare.com/ajax/libs/rest.js/15.2.6/octokit-rest.min.js', function() {
                    resolve();
                });
            }
            else { resolve(); }
        });
        
    }

    function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

	function loadScript(id, url, callback){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Others
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

	function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}

fa_icons();
}catch(e){console.warn("Error found in plugin Font Awesome icons");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");