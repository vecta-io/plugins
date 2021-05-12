//https://github.com/vecta-io/plugins/blob/main/plugin_16.js
Vecta.on('fileDropped.Vecta', function(e, evt) {
    var type;
    
    //get file type
    type = evt.file.type || (evt.file.name || '').split('.').pop();

    switch (type) {
        case 'json':
        case 'application/json': drawJSON(evt.point, JSON.parse(evt.result)); break;
    }
   
});


function drawJSON(point, obj) {
    var shape,
        json,
        // need to change based on svg structure
        countries = Vecta.activePage.shapes();
    console.log(countries);
    countries.forEach(function(country) {
        json = obj.find(function (ob) { 
            return ob.country && country.$.find('[title="' +ob.country+ '"]').closest('g[id]').length !== 0;
        });
        if (json) { country.fill(getColor(json.count)); }
        else { country.fill('#FFEDA0'); }
        
          console.log(obj);

    });
  
}

function createDownloadJSONButton() {
    var data = [
            {"country":"United Arab Emirates","count":3},
            {"country":"Armenia","count":1},
            {"country":"Argentina","count":18},
            {"country":"Austria","count":4},
            {"country":"Australia","count":46},
            {"country":"Bosnia and Herzegovina","count":1},
            {"country":"Belgium","count":21},
            {"country":"Bulgaria","count":11},
            {"country":"Benin","count":1},
            {"country":"Brunei Darussalam","count":1},
            {"country":"Bolivia","count":2},
            {"country":"Brazil","count":69},
            {"country":"Belarus","count":8},
            {"country":"Canada","count":62},
            {"country":"Switzerland","count":23},
            {"country":"Cote D'Ivoire","count":2},
            {"country":"Chile","count":4},
            {"country":"China","count":9},
            {"country":"Colombia","count":18},
            {"country":"Costa Rica","count":1},
            {"country":"Cyprus","count":1},
            {"country":"Czech Republic","count":13},
            {"country":"Germany","count":69},
            {"country":"Denmark","count":7},
            {"country":"Dominican Republic","count":1},
            {"country":"Algeria","count":3},
            {"country":"Ecuador","count":3},
            {"country":"Estonia","count":5},
            {"country":"Egypt","count":3},
            {"country":"Spain","count":51},
            {"country":"Finland","count":16},
            {"country":"France","count":347},
            {"country":"United Kingdom","count":89},
            {"country":"French Guiana","count":2},
            {"country":"Greece","count":7},
            {"country":"Hong Kong","count":14},
            {"country":"Honduras","count":1},
            {"country":"Croatia","count":7},
            {"country":"Hungary","count":8},
            {"country":"Indonesia","count":14},
            {"country":"Ireland","count":7},
            {"country":"Israel","count":11},
            {"country":"India","count":64},
            {"country":"Iraq","count":2},
            {"country":"Iran, Islamic Republic Of","count":3},
            {"country":"Iceland","count":2},
            {"country":"Italy","count":25},
            {"country":"Jordan","count":1},
            {"country":"Japan","count":72},
            {"country":"Kenya","count":2},
            {"country":"Korea, Republic of","count":11},
            {"country":"Kazakhstan","count":2},
            {"country":"Lebanon","count":2},
            {"country":"Sri Lanka","count":1},
            {"country":"Lithuania","count":5},
            {"country":"Latvia","count":4},
            {"country":"Morocco","count":5},
            {"country":"Moldova, Republic of","count":2},
            {"country":"Madagascar","count":1},
            {"country":"Myanmar","count":2},
            {"country":"Macao","count":1},
            {"country":"Martinique","count":1},
            {"country":"Mexico","count":36},
            {"country":"Malaysia","count":401},
            {"country":"Nigeria","count":3},
            {"country":"Netherlands","count":20},
            {"country":"Norway","count":11},
            {"country":"New Zealand","count":7},
            {"country":"Peru","count":3},
            {"country":"French Polynesia","count":1},
            {"country":"Philippines","count":66},
            {"country":"Poland","count":20},
            {"country":"Portugal","count":13},
            {"country":"Reunion","count":4},
            {"country":"Romania","count":17},
            {"country":"Serbia","count":5},
            {"country":"Russia","count":48},
            {"country":"Saudi Arabia","count":5},
            {"country":"Sweden","count":6},
            {"country":"Singapore","count":24},
            {"country":"Slovenia","count":4},
            {"country":"Slovakia","count":5},
            {"country":"Thailand","count":5},
            {"country":"Tunisia","count":3},
            {"country":"Turkey","count":12},
            {"country":"Trinidad and Tobago","count":1},
            {"country":"Taiwan","count":10},
            {"country":"Ukraine","count":22},
            {"country":"Uganda","count":1},
            {"country":"United States","count":364},
            {"country":"Uruguay","count":3},
            {"country":"Uzbekistan","count":2},
            {"country":"Venezuela","count":2},
            {"country":"Viet Nam","count":9},
            {"country":"Mayotte","count":1},
            {"country":"South Africa","count":12}
		],
        $div = $('#choropleth_map_plugin\\.id'),
        $download;
    
    if ($div.length === 0) {
        $div = $('<div id="choropleth_map_plugin.id" class="Notify.cls Inform.cls" style="right: 15px; bottom: 40px; div:hover { cursor: pointer; }"><a id="map_plugin_download.id" class="Button.cls">Click</a> here to download sample JSON data.</div>');
        $download = $div.find('#map_plugin_download\\.id');
        data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
		$('body').append($div);
        
        $download.attr('href', data);
        $download.attr('download', 'sample.json');
        
        $download.on('click.Map', function() {
                $div.remove();
            	$download.off('click.Map');
        });
    }
    
}

function getColor(d) {

    return d > 400 ? '#800026':
    	   d > 300 ? '#BD0026':
     	   d > 200 ? '#E31A1C':
       	   d > 100 ? '#FC4E2A':
           d > 50 ? '#FD8D3C':
           d > 20 ? '#FEB24C':
           d > 0 ? '#FED976':
    '#FFEDA0';
    
}


createDownloadJSONButton();