$(document).ready(function() {

    updateOptions();

});
var g_db;
var g_metric;
var g_mod;

function updateOptions() {
    var e = document.getElementById("dataset");
    var db = e.options[e.selectedIndex].text;
    g_db = db;
    console.log(db)

    var m = document.getElementById("mod");
    var mod = m.options[m.selectedIndex].text;
    g_mod = (mod == 'Split X Temp' ? 'splitXTemp-' : mod == 'Common' ? "" : "Accum-");
    console.log(mod)

    var t = document.getElementById("metric");
    var metric = t.options[t.selectedIndex].text;
    g_metric = metric;
    console.log(metric)

    var n = 5
        // var urlDB = 'https://raw.githubusercontent.com/luizmlpascoal/doc-csv-files/master/lcs-2-new-CiaoDVD-Accum-noMod.csv'

    var domain = 'https://raw.githubusercontent.com/luizmlpascoal/doc-csv-files/master/'

    var urlDB = domain + 'files/' + db + '/' + db + '-n-' + n + '-' + g_mod + metric.toLowerCase() + '.csv';

    console.log(urlDB)

    var data = d3.csv(urlDB) // read in data
    data.then(initParasol) // pass data into visualize() function
}



function initParasol(data) {

    // create Parasol object, add grid, link, and perform clustering
    var ps = Parasol(data)('.parcoords')
        .attachGrid({
            container: '#grid',
            enableCellNavigation: true,
            enableColumnReorder: true,
            multiColumnSort: false,
            editable: true,
            asyncEditorLoading: false,
            autoEdit: false
        })
        .linked()
        .alpha(0.4) // update transparency
        .reorderable() // make axes dynamically reorderable
        .render()
        // .hideAxes(['Temporal-5-1-2', 'Temporal-5-2-3', 'Temporal-5-3-4', 'Temporal-5-4-5'])


    // bundling strength slider
    d3.select('#bundling').on('input', function() {
        ps.bundlingStrength(this.value)
            .bundleDimension('accum')
            .render(); // divide by a hundred to get decimals

    });

    // smoothness
    d3.select("#smoothness").on('input', function() {
        ps.smoothness(this.value / 100).render(); // divide by a hundred to get decimals
    });


    d3.select('#reset_brushes').on('click', function() {
        ps.brushReset()
    });

    // export selected data
    d3.select('#export_selected').on('click', function() {
        // NOTE: create GUI so user can choose between brushed, selected, both


        var selection = document.querySelector('input[name="export_selection"]:checked').value

        if (selection === "brushed") {
            ps.exportData({
                selection: 'brushed',
                filename: g_db + '_' + g_metric + '_' + g_mod + '.csv',
                // exportAll: true
            })
        } else if (selection === "marked") {
            ps.exportData({
                selection: 'brushed',
                filename: g_db + '_' + g_metric + '_' + g_mod + '.csv',
                // exportAll: true
            })
        } else {
            ps.exportData({
                selection: 'both',
                filename: g_db + '_' + g_metric + '_' + g_mod + '.csv',
                exportAll: true
            })
        }

        ps.exportData({
            selection: 'brushed',
            filename: g_db + '_' + g_metric + '_' + g_mod + '.csv',
            // exportAll: true
        })

    });

    d3.select('#grid_update').on('click', function() {

        var value = document.getElementById("searchTxt").value;
        ps.gridUpdate({ data: data.slice(1, value) })
    });
}

async function reload() {

    var el = $('.dots');
    el.detach();
    el = $('.foreground');
    el.detach();
    el = $('.brushed');
    el.detach();
    el = $('.marked');
    el.detach();
    el = $('.highlight');
    el.detach();
    el = $("#p0 svg")
    el.detach();

    await updateOptions();

    //this line is to watch the result in console , you can remove it later	
    console.log("Refreshed");
}