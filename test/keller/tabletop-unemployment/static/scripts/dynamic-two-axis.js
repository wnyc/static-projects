/* TO DO
 - Number for month; revison to previous months; quarterly basis average.
*/

    var jqueryNoConflict = jQuery;

    // make sure the spreadsheet is published to the web
    var dataSpreadsheet = '0An8W63YKWOsxdHRxR2oyZXNDTnZOaWtMclZUdVM5amc';

    // the sheet being queried
    var dataSheet = 'LIVE_Jobs_Added_Per_Month_2012';

    // container arrays
    var allJobsData = [];
    var arraysOfJobsData = [];

    var filters = [];

    // chart options
    var chart;
    var chartType = 'column';

    var chartCategories = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        Tabletop.init({
            key: dataSpreadsheet,
            callback: showInfo,
            simpleSheet: false,
            debug: true
        });

        drawHighchart();

    });

    // function to add commas to string
    function addCommas(nStr){
    	nStr += '';
    	x = nStr.split('.');
    	x1 = x[0];
    	x2 = x.length > 1 ? '.' + x[1] : '';
    	var rgx = /(\d+)(\d{3})/;
    	while (rgx.test(x1)) {
    		x1 = x1.replace(rgx, '$1' + ',' + '$2');
    	}
    	return x1 + x2;
    };

    // display data from tabletop
    function showInfo(data, tabletop){


        // handlebars variables
        var source   = $('#cat-template').html();
        var template = Handlebars.compile(source);


        // pulls data from the spreadsheet
        jqueryNoConflict.each(tabletop.sheets(dataSheet).all(), function(i, record) {

            // render to handlebars templates
            var html = template(record);
            var commaAddedHtml = addCommas(html)
            $("#content").append(commaAddedHtml);


            // set variables and convert to integers if needed
            var jan = parseInt(record.jan);
            var feb = parseInt(record.feb);
            var mar = parseInt(record.mar);
            var apr = parseInt(record.apr);
            var may = parseInt(record.may);
            var jun = parseInt(record.jun);
            var jul = parseInt(record.jul);
            var aug = parseInt(record.aug);
            var sep = parseInt(record.sep);
            var oct = parseInt(record.oct);
            var nov = parseInt(record.nov);
            var dec = parseInt(record.dec);
            var annual = parseInt(record.annual);

            // build array from each row of spreadsheet
            allJobsData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

            // push each array to an array
            arraysOfJobsData.push(allJobsData);

        });

            // objects for highcharts data series
            var initialMonthlyJobs = {
                name: 'Initial',
                color: '#4DAF4A',
                type: 'spline',
                data: arraysOfJobsData[0]
            };

            var revisedMonthlyJobs = {
                name: 'Revised',
                color: '#377EB8',
                type: 'spline',
                data: arraysOfJobsData[1]
            };

            var secondMonthlyJobs = {
                name: 'Final',
                color: '#E41A1C',
                type: 'column',
                //threshold: 2,
                data: arraysOfJobsData[2]
            };

            // add respective objects to highcharts series
            chart.addSeries(initialMonthlyJobs);
            chart.addSeries(revisedMonthlyJobs);
            chart.addSeries(secondMonthlyJobs);

    };

    // draw the chart
    function drawHighchart(){

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'highcharts-ouput',
                zoomType: 'xy'
            },

            title: {
                text: 'Jobs Added To The U.S. Economy (2012)'
            },

            subtitle: {
                text: 'Data Source: Bureau of Labor Statistics'
            },

            xAxis: [{
                categories: chartCategories,

            }],

            yAxis: [{

                // primary axis
                labels: {
                   formatter: function() {
                        return this.value / 1000 +'k';
                    },
                    style: {
                        color: '#2B2B2B'
                    }
                },
                title: {
                    text: 'Jobs Added',
                    style: {
                        color: '#2B2B2B'
                    }
                }
            }],

            tooltip: {
                formatter: function() {
                    return ''+ this.series.name +': '+ Highcharts.numberFormat(this.y, 0, ',');
                }
            },

            plotOptions: {
                events: {



                    // http://stackoverflow.com/questions/11548396/toggling-datatable-rows-based-on-highchart-legend
                    legendItemClick: function () {

                        tmp = [];

                        // Series was Visible, Now Hidden
                        if(this.visible){
                            // Add Action Here
                        }

                        // Series was Hidden, Now Visible
                        else{
                            // Add Action Here
                        }
                    }
                },

                series: {
                    //stacking: 'normal',
                    //pointWidth: 10
                }

            },

            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                //x: 0,
                y: 0,
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },

            credits: {
                enabled: false
            },

            series: []
        });

    };
    //end function