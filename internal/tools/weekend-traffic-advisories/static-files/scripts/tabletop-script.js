    var jqueryNoConflict = jQuery;
    var dataConfig = dataConfig || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        dataConfig.initializeDataSource();
    });

    // begin data configuration object
    var dataConfig = {

        dataSpreadsheetKey: '0Aq8qwSArzKP9dC1pZ19wdU9Vc0gtd202NGZ2YUdVZ2c',

        initializeDataSource: function(){
            Tabletop.init({
                key: dataConfig.dataSpreadsheetKey,
                callback: dataConfig.processDataSource,
                parseNumbers: true,
                simpleSheet: true,
                debug: false
            });
        },

        // first pass at pulling out data and displaying it
        processDataSource: function(data, tabletop){

            console.log(data);

            // get unique categories and place them as key to frequency
            var trafficCategoriesObject = dataConfig.separateKeysFromValues(data);

            // separate the keys from the values and place into array
            var keys = Object.keys(trafficCategoriesObject);

            // begin outer loop
            for (var x=0; x<keys.length; x++){

                var incidentArrayHoldingContainer = [];

                // begin inner loop
                for (var i=0; i<data.length; i++){
                    if (data[i].category === keys[x]){
                        incidentArrayHoldingContainer.push({
                            location: data[i].location,
                            details: data[i].details,
                            read_more: data[i].url
                        });
                    }
                }
                // end inner loop

                    dataConfig.buildTrafficObject(keys[x], incidentArrayHoldingContainer);
            }
            // end outer loop

        },

        // count instances of values and set to keys
        separateKeysFromValues: function(dataSource){
            var categories = {};
            var categoryCount;
            for (var i=0; i<dataSource.length; i++){
                categoryCount = dataSource[i];
                categories[categoryCount.category] = (categories[categoryCount.category] || 0) + 1;
            }
            return categories;
        },

        // builds & processes an object for display
        buildTrafficObject: function(categoryTraffic, incidentsTrafficArray){
            var trafficCategoryObject = {
                category: categoryTraffic,
                incidents: incidentsTrafficArray
            };

            var holdingArrayForDisplayStrings = [];

            jqueryNoConflict.each(trafficCategoryObject.incidents, function(i, record) {
                var locationElement = '<li><strong>' + record.location + '</strong>:';
                var detailsElement = record.details + ' ';
                var readMoreElement = '<a href="' + record.read_more + '">Read More</a></li>';
                holdingArrayForDisplayStrings.push(locationElement, detailsElement, readMoreElement);
            });

            var targetOutput = holdingArrayForDisplayStrings.join(' ');
            dataConfig.displayTrafficObject(trafficCategoryObject.category, targetOutput);
        },

        // renders the display
        displayTrafficObject: function(categoryParam, outputParam){
            var combinedOutputString = '<h6>' + categoryParam + '</h6><ul>' + outputParam + '</ul><!-- weekend-traffic-impacts-post -->';
            jqueryNoConflict('#formatted-output').append(combinedOutputString);
            //jqueryNoConflict('#html-output').text(combinedOutputString);
            document.getElementById('html-output').value += combinedOutputString;
        },

        /// what an incident array looks like for reference
        incidentsTrafficArray: [{
            location: "405 S",
            details: "Starting May 1, construction starts to aid wall 1921 construction at the southbound Skirball on-ramp. There will be intermittent full-ramp closures from X am to Z pm.", "url": "http://sv08data.dot.ca.gov/memos/files/comalert/042913_0.pdf?utm_source=dlvr.it&utm_medium=twitter"},{
            location: "405 S",
            details: "Starting May 1, construction starts to aid wall 1921 construction at the southbound Skirball on-ramp. There will be intermittent full-ramp closures from X am to Z pm.", "url": "http://sv08data.dot.ca.gov/memos/files/comalert/042913_0.pdf?utm_source=dlvr.it&utm_medium=twitter"}],
    }
    // end data configuration object