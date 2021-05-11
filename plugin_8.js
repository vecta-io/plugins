//https://github.com/vecta-io/plugins/blob/main/plugin_8.js
try{
function material_icons() {
    var material_cats = ["action", "av", "communication", "content", "device", "editor", "file", "hardware", "image", "maps", "navigation", "notification", "places","social", "toggle"],
        material_icons = {},
        octokit;
    // BLACKLIST = ["ic_battery_20_48px","ic_battery_30_48px","ic_battery_50_48px","ic_battery_60_48px","ic_battery_80_48px","ic_battery_90_48px","ic_battery_charging_20_48px","ic_battery_charging_30_48px","ic_battery_charging_50_48px","ic_battery_charging_60_48px","ic_battery_charging_80_48px","ic_battery_charging_90_48px","ic_signal_cellular_0_bar_48px","ic_signal_cellular_1_bar_48px","ic_signal_cellular_2_bar_48px","ic_signal_cellular_3_bar_48px","ic_signal_cellular_connected_no_internet_0_bar_48px","ic_signal_cellular_connected_no_internet_1_bar_48px","ic_signal_cellular_connected_no_internet_2_bar_48px","ic_signal_cellular_connected_no_internet_3_bar_48px","ic_signal_wifi_0_bar_48px","ic_signal_wifi_1_bar_48px","ic_signal_wifi_1_bar_lock_48px","ic_signal_wifi_2_bar_48px","ic_signal_wifi_2_bar_lock_48px","ic_signal_wifi_3_bar_48px","ic_signal_wifi_3_bar_lock_48px","ic_signal_wifi_4_bar_48px","ic_signal_wifi_4_bar_lock_48px","ic_signal_wifi_off_48px","ic_storage_48px","ic_widgets_48px"];

    loadOctokit().then(function () {

        Vecta.showMessage('Loading...', true);

        //populate material icons from github
        octokit = new Octokit();
        octokit.authenticate({type: 'token', token: '3ef7637f527ed99962c542694631ee3e46945e50'});

        //get all icon files
        getFile().then(function() {
            openDialog();
        });
        
    });

    function getFile() {
        var tasks = [];
        //Get src content to get sha for all folders
        return octokit.repos.getContent({owner: 'google', repo: 'material-design-icons', path: 'src'}).then(function(folder) {
            folder.data.forEach(function (file) {
                if (material_cats.indexOf(file.name) > -1) {
                    material_icons[file.name] = material_icons[file.name] || [];
                    //Get tree from each folder once to get svg file in one call at a time
                    tasks.push(getSVG(file));
                }
            });

            return Promise.all(tasks);
        });
    }
   	function getSVG(file) {
		return octokit.gitdata.getTree({ owner: 'google', repo: 'material-design-icons', sha: file.sha, recursive: true }).then(function (items) {
            items.data.tree.forEach(function(sub) {
                if (sub.type === 'blob') {
                    material_icons[file.name].push(sub.path);
                }
            });
        })
	}

    function openDialog() {
        var $style,
            delay;

        Vecta.hideMessage();

        Vecta.dialog({
            title: 'Material icons',
            content: [{
                type:'html',
                html: '<div class="Container.cls" style="width: 567px;height: 400px;overflow: auto;overflow-x: hidden;border: 1px solid #e0e0e0;"></div>'}],
            buttons: [{default: true, label: 'Import'},{cancel: true, label: 'Cancel'}],
            open: function (evt) {
                var $dialog = evt.$dialog,
                    $content = $dialog.find('.Container\\.cls'),
                    $input = $dialog.find('#material_search\\.id');

                $style = $('#material\\.style');

                //add material icons link if not found
                if ($('#material\\.icons').length === 0 ) { $('head').append('<link id="material.icons" href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'); }
                //set style if not exists
                if ($style.length === 0) { setStyle(); }


                if ($input.length === 0) {
                    $input = $('<input id="material.id" type="text" placeholder="Search..." style="margin-top: 0;min-width: 415px;"/>');
                    $dialog.find('.Button\\.cls').prepend($input);
                }

            	//add icons
                if (!$content.children().length) {

                    $.each(material_icons, function(cat, paths) {
                        var $ul = $('<ul style="list-style: none;margin: 0;padding: 0;">');

                        $content.append('<div class="Muted.cls" style="background: #eceff1;padding: 6px;">' + capitalize(cat) + '</div>');
                        $content.append($ul);

                        paths.forEach(function(path){
                            var clean_name = path.replace(/\//ig, '_').replace('_materialicons','').split('.')[0],
                                $i = $('<i class="material-icons">' + clean_name + '</i>'),
                                $span = $('<span>' + clean_name + '</span>');

                            $li = $('<li cat="' + cat + '" title="' + clean_name + '" url="' + path + '"></li>');

                            $li.append($i);
                            $li.append($span);
                            $ul.append($li);

                        });
                    });
                }
                else {
                    $content.find('li.Hide\\.cls, div.Muted\\.cls.Hide\\.cls').removeClass('Hide.cls');
                    $content.find('li.Active\\.cls').removeClass('Active.cls');
                }
               
                $input.on('keyup paste.plugin_8', function() {
                    var token = $input.val().trim();

                    clearTimeout(delay);
                    delay = setTimeout(function() {
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
                    }, 200);
                });
            },
            click: function(evt) {
                var $li = evt.$target.closest('li');

                //select icons
                if ($li.length) { $li.toggleClass('Active.cls'); }
            },
            close: function(evt) {
                var $dialog = evt.$dialog,
                    $content = $dialog.find('.Content\\.cls'),
                    $input = $dialog.find('.Button\\.cls input'),
                    $target = evt.$target,
                    tasks = [];

                $input.off('keyup paste').val('');

                // if user chose to export
                if ($target.hasClass('Default.cls')) {
                    //get selected icons
                    tasks = $content.find('li.Active\\.cls').map(function(i, node) {
                        var $node = $(node),
                            url = $node.attr('url'),
                            cat = $node.attr('cat');

                        return octokit.repos.getContent({
                            owner: 'google',
                            repo: 'material-design-icons',
                            path: 'src/' + cat + '/' + url
                        });
                    });

                    Promise.all(tasks).then(function(files) {
                        files = files.map(function(file, index) {
                            return b64DecodeUnicode(file.data.content);
                        });

                        $.dropSVG(files, { x: 0, y: 0 });
                    });
                }

                $dialog.find('#material_search\\.id').remove();
                $style.remove();
            }
        });
        
        function setStyle() {
            var font_size = 32;

            //set custom styles
            $style = $('<style id="material.style"/>');
            style = `

            #user_dialog\\.dialog .Container\\.cls ul li{
                display: inline-block;
                width: ` + font_size + `px;
                padding: 5px;
                margin: 4px;
                cursor: pointer;
                border-radius: 3px;
                overflow: hidden;
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

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

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

material_icons();
}catch(e){console.warn("Error found in plugin Material Design icons");console.error(e); }
Vecta.trigger("pluginStopped.Vecta.Plugin");