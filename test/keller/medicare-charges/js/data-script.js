var jqueryNoConflict = jQuery;
var fn = fn || {};

// begin main function
jqueryNoConflict(document).ready(function() {
    fn.retrieveDataFromFile();
});

// begin data configuration object
var fn = {

    // pull the data from the flat file
    retrieveDataFromFile: function() {
        jqueryNoConflict.getJSON(dataSource, fn.configureCategorySelectMenu);
    },

    // holding container for values that we compare
    objectOfComparisonData: {},

    // holding container of our filtered hospitals
    objectOfFilteredHospitals: {
        objects: []
    },

    // holding container to build select menus
    objectOfSelectMenuArrays: {
        categorySelectMenu: [],
        procedureSelectMenu: [],
        hospitalSelectMenu: []
    },

    configureCategorySelectMenu: function(data) {

        fn.objectOfSelectMenuArrays.categorySelectMenu.length = 0;

        for (var i=0; i<data.objects.length; i++) {
            fn.objectOfSelectMenuArrays.categorySelectMenu.push(data.objects[i].majordiagnosticcategory);
        }

        fn.displayCategorySelectMenu(data);
    },

    // display category select menu
    displayCategorySelectMenu: function(data) {

        // create category select menu
        configureSelectMenuFromData('Choose a major category', fn.objectOfSelectMenuArrays.categorySelectMenu, '#category-comparison');

        // get value of category grouping select menu
        jqueryNoConflict('#category-comparison').change(function () {
            fn.objectOfComparisonData.category = jqueryNoConflict('#category-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('Choose a new hospital to compare');
            jqueryNoConflict('#hospital-right').html('Choose a new hospital to compare');
            fn.compareCategorySelectValueAgainstProcedures(data);
        });
    },

    // function to run comparisons
    compareCategorySelectValueAgainstProcedures: function(data) {

        fn.objectOfSelectMenuArrays.procedureSelectMenu.length = 0;

        for (var i=0; i<data.objects.length; i++) {

            // find procedures that match the select category
            if (data.objects[i].majordiagnosticcategory === fn.objectOfComparisonData.category) {
                fn.objectOfSelectMenuArrays.procedureSelectMenu.push(data.objects[i].drgdefinition);
            }
        }
        fn.displayProcedureSelectMenu(data);
    },

    // display procedures select menu
    displayProcedureSelectMenu: function(data) {

        // empty the procedure select menu
        emptyUxElement('#procedure-comparison');

        // create procedure select menu
        configureSelectMenuFromData('Choose a procedure', fn.objectOfSelectMenuArrays.procedureSelectMenu, '#procedure-comparison');

        // display the procedure select menu
        jqueryNoConflict('#procedure-list-middle').removeClass('hidden');

        // get value of procedure select menu
        jqueryNoConflict('#procedure-comparison').change(function () {
            fn.objectOfComparisonData.procedure = jqueryNoConflict('#procedure-comparison :selected').val();
            jqueryNoConflict('#hospital-left').html('No data for this procedure at this hospital.<br />Choose a new hospital');
            jqueryNoConflict('#hospital-right').html('No data for this procedure at this hospital.<br />Choose a new hospital');
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-left').change(function () {
            fn.objectOfComparisonData.hospitalLeft = jqueryNoConflict('#hospital-comparison-left :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

        jqueryNoConflict('#hospital-comparison-right').change(function () {
            fn.objectOfComparisonData.hospitalRight = jqueryNoConflict('#hospital-comparison-right :selected').val();
            fn.compareProcedureSelectValueAgainstHospitals(data);
        });

    },

    // function to run comparisons
    compareProcedureSelectValueAgainstHospitals: function(data) {

        fn.objectOfSelectMenuArrays.hospitalSelectMenu.length = 0;
        fn.objectOfFilteredHospitals.objects.length = 0;

        for (var i=0; i<data.objects.length; i++) {

            // find procedures that match the select category
            if (data.objects[i].drgdefinition === fn.objectOfComparisonData.procedure) {

                fn.objectOfSelectMenuArrays.hospitalSelectMenu.push(data.objects[i].providername);

                // for each of the hospital that has the procedure create a new object
                var instanceOfFilteredHospital = {
                    averagecoveredcharges: convertCurrencyToInt(data.objects[i].averagecoveredcharges),
                    averagetotalpayments: convertCurrencyToInt(data.objects[i].averagetotalpayments),
                    drgdefinition: data.objects[i].drgdefinition,
                    hospitalreferralregiondescription: data.objects[i].hospitalreferralregiondescription,
                    majordiagnosticcategory: data.objects[i].majordiagnosticcategory,
                    providercity: data.objects[i].providercity,
                    providerid: data.objects[i].providerid,
                    providername: data.objects[i].providername,
                    providerstate: data.objects[i].providerstate,
                    providerstreetaddress: data.objects[i].providerstreetaddress,
                    providerzipcode: data.objects[i].providerzipcode,
                    totaldischarges: data.objects[i].totaldischarges
                };

                fn.objectOfFilteredHospitals.objects.push(instanceOfFilteredHospital);
            }

        }

        // function to calculate statewide averages
        fn.performCalculationsOnStatewideData(data);

        // display the hospital select menu
        fn.displayHospitalSelectMenu(data);

        // display individual hospital data
        fn.compareHospitalSelectValueAgainstData(data);

    },

    // find relevant hospital data and display it for user
    compareHospitalSelectValueAgainstData: function(data) {

        var hospitalLeftValueForDifference;
        var hospitalRightValueForDifference;

        for (var x=0; x<fn.objectOfFilteredHospitals.objects.length; x++) {

            var displayOutput = '<h4>' + fn.objectOfFilteredHospitals.objects[x].providername + compareHospitalToAverage(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges, fn.objectOfComparisonData.averageCost) +
                '</h4>' +

                '<p>' + fn.objectOfFilteredHospitals.objects[x].providerstreetaddress +
                '<br />' + fn.objectOfFilteredHospitals.objects[x].providercity +
                ', ' + fn.objectOfFilteredHospitals.objects[x].providerstate +
                ' ' + fn.objectOfFilteredHospitals.objects[x].providerzipcode +
                '</p>' +
                '<p>Procedure: ' + fn.objectOfFilteredHospitals.objects[x].drgdefinition + '</p>' +

                '<p>The average cost for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges) +
                '</strong>, which is <strong>' + convertIntToCurrency(calcaulateDifferenceInAverage(fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges, fn.objectOfComparisonData.averageCost)) + '</strong> than the state average.</p>' +

                '<p>The average reimbursment for this procedure is <strong>' +
                convertIntToCurrency(fn.objectOfFilteredHospitals.objects[x].averagetotalpayments) + '</strong>, which is <strong>' + convertIntToCurrency(calcaulateDifferenceInAverage(fn.objectOfFilteredHospitals.objects[x].averagetotalpayments, fn.objectOfComparisonData.averageReimbursement)) + '</strong> than the state average.</p>';


            if (fn.objectOfComparisonData.hospitalLeft === undefined || fn.objectOfComparisonData.hospitalLeft === null) {
                jqueryNoConflict('#hospital-left').html('Choose a California hospital to compare');
            };

            if (fn.objectOfComparisonData.hospitalRight === undefined || fn.objectOfComparisonData.hospitalRight === null) {
                jqueryNoConflict('#hospital-right').html('Choose a California hospital to compare');
            };

            // display the data
            if (fn.objectOfComparisonData.hospitalLeft === fn.objectOfFilteredHospitals.objects[x].providername) {
                hospitalLeftValueForDifference = fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges;
                jqueryNoConflict('#hospital-left').html(displayOutput);

            }

            // display the data
            if (fn.objectOfComparisonData.hospitalRight === fn.objectOfFilteredHospitals.objects[x].providername) {
                hospitalRightValueForDifference = fn.objectOfFilteredHospitals.objects[x].averagecoveredcharges;

                jqueryNoConflict('#hospital-right').html(displayOutput);
            }

            jqueryNoConflict('#hospital-calculation').html(calcaulateDifferenceBetweenHospitals(hospitalLeftValueForDifference, hospitalRightValueForDifference));

        }

    },

    performCalculationsOnStatewideData: function(data) {

        // pull lowest average cost
        var lowestAverageCostToDisplay = _.min(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagecoveredcharges;
        });

        // pull lowest average reimbursement
        var lowestAverageReimbursmentToDisplay = _.min(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagetotalpayments;
        });

        // pull average of all costs
        var averageCostToDisplay = _.reduce(_.pluck(fn.objectOfFilteredHospitals.objects, 'averagecoveredcharges'), function(memo, num) {
            return memo + num / fn.objectOfFilteredHospitals.objects.length;
        }, 0);

        // pull average of all reimbursements
        var averageReimbursmentsToDisplay = _.reduce(_.pluck(fn.objectOfFilteredHospitals.objects, 'averagetotalpayments'), function(memo, num) {
            return memo + num / fn.objectOfFilteredHospitals.objects.length;
        }, 0);

        // pull highest average cost
        var highestAverageCostToDisplay = _.max(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagecoveredcharges;
        });

        // pull highest average reimbursement
        var highestAverageReimbursmentToDisplay = _.max(fn.objectOfFilteredHospitals.objects, function(item) {
            return item.averagetotalpayments;
        });

        // calculate the difference between highest and lowest cost
        var differenceInCost = calcaulateDifferenceInAverage(highestAverageCostToDisplay.averagecoveredcharges, lowestAverageCostToDisplay.averagecoveredcharges);

        // calculate the difference between highest and lowest reimbursement
        var differenceInReimbursment = calcaulateDifferenceInAverage(highestAverageReimbursmentToDisplay.averagetotalpayments, lowestAverageReimbursmentToDisplay.averagetotalpayments);

        // add key/value for average cost to comparison object
        fn.objectOfComparisonData.averageCost = averageCostToDisplay;

        // add key/value for average reimbursement to comparison object
        fn.objectOfComparisonData.averageReimbursement = averageReimbursmentsToDisplay;

        jqueryNoConflict('.procedure-cost').removeClass('hidden');

        // average costs
        jqueryNoConflict('#procedure-cost-average').html(
            '<h4 class="centered red">Average cost in California</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(averageCostToDisplay) +
            '</strong></p>');

        jqueryNoConflict('#procedure-cost-left').html(
            '<h4 class="centered red">Lowest average cost<br />at a California hospital</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(lowestAverageCostToDisplay.averagecoveredcharges) +
            '</strong><br />' + lowestAverageCostToDisplay.providername +
            '<br />' + lowestAverageCostToDisplay.providercity + '<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            lowestAverageCostToDisplay.totaldischarges + '</p>');

        jqueryNoConflict('#procedure-cost-middle').html(
            '<h4 class="centered red">Difference in average cost</h4>' +
            '<p class="centered"><strong>' + convertIntToCurrency(differenceInCost) + '</strong></p>');

        jqueryNoConflict('#procedure-cost-right').html(
            '<h4 class="centered red">Highest average cost<br />at a California hospital</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(highestAverageCostToDisplay.averagecoveredcharges) +
            '</strong><br />' + highestAverageCostToDisplay.providername +
            '<br />' + highestAverageCostToDisplay.providercity + '<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            highestAverageCostToDisplay.totaldischarges + '</p>');

        // average reimbursements
        jqueryNoConflict('.procedure-reimbursement').removeClass('hidden');

        jqueryNoConflict('#procedure-reimbursement-average').html(
            '<h4 class="centered red">Average reimbursment in California</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(averageReimbursmentsToDisplay) +
            '</strong></p>');

        jqueryNoConflict('#procedure-reimbursement-left').html(
            '<h4 class="centered red">Lowest average reimbursment<br />at a California hospital</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(lowestAverageReimbursmentToDisplay.averagetotalpayments) +
            '</strong><br />' + lowestAverageReimbursmentToDisplay.providername +
            '<br />' + lowestAverageReimbursmentToDisplay.providercity + '<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            lowestAverageReimbursmentToDisplay.totaldischarges + '</p>');

        jqueryNoConflict('#procedure-reimbursement-middle').html(
            '<h4 class="centered red">Difference in average reimbursment</h4>' +
            '<p class="centered"><strong>' + convertIntToCurrency(differenceInReimbursment) + '</strong></p>');

        jqueryNoConflict('#procedure-reimbursement-right').html(
            '<h4 class="centered red">Highest average reimbursment<br />at a California hospital</h4>' +
            '<p class="centered"><strong>' +
            convertIntToCurrency(highestAverageReimbursmentToDisplay.averagetotalpayments) +
            '</strong><br />' + highestAverageReimbursmentToDisplay.providername +
            '<br />' + highestAverageReimbursmentToDisplay.providercity + '<br/>' +
            '<strong>No. of discharged patients</strong>: ' +
            highestAverageReimbursmentToDisplay.totaldischarges + '</p>');

    },

    // display calculated averages for the whole data set
    displayHospitalSelectMenu: function(data) {

        // show the hospitals select menu
        jqueryNoConflict('#hospital-div-left').removeClass('hidden');
        jqueryNoConflict('#hospital-div-middle').removeClass('hidden');
        jqueryNoConflict('#hospital-div-right').removeClass('hidden');

        // empty the hospitals select menu
        emptyUxElement('#hospital-comparison-left');
        emptyUxElement('#hospital-comparison-right');

        // create the new select menu based on options
        configureSelectMenuFromData('Find your local hospital', fn.objectOfSelectMenuArrays.hospitalSelectMenu, '#hospital-comparison-right');
        configureSelectMenuFromData('Find your local hospital', fn.objectOfSelectMenuArrays.hospitalSelectMenu, '#hospital-comparison-left');

    }

};
// end data configuration object

// function to create a select menu from an array
function configureSelectMenuFromData(optionMessage, arrayToCreateSelect, idTargetForSelect) {
    var filteredArrayForSelect = _.uniq(arrayToCreateSelect).sort()
    var selectList;
    selectList += "<option>" + optionMessage + "</option>";
    for (var i=0; i<filteredArrayForSelect.length;i++) {
        selectList += "<option value='" + filteredArrayForSelect[i] + "'>" +
            filteredArrayForSelect[i] + "</option>";
    }
    jqueryNoConflict(idTargetForSelect).append(selectList);
}

// empty a display element
function emptyUxElement(elementId) {
    jqueryNoConflict(elementId).empty();
}

// add commas to data
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';

    var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
    return x1 + x2;
}

// calculate average, add commas, round off
function calculateAverageCost(arrayOfTotals) {
    var total = 0;
    for (var z=0; z<arrayOfTotals.length; z++) {
        total = total + arrayOfTotals[z];
    }
    total = total/arrayOfTotals.length;
    return total;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceInAverage(highestAverage, lowestAverage) {
    var total = highestAverage - lowestAverage;
    return total;
}

// take string of dollar amount and convert to int
function convertCurrencyToInt(currency) {
    var value = currency.replace('$', '').replace(',', '');
    value = parseInt(value);
    return value;
}

// take int of dollar amount and convert to currency
function convertIntToCurrency(integer) {
    var value = '$' + addCommas(integer.toFixed(0));
    return value;
}

// calculate lowest instance, add commas, round off
function calcaulateDifferenceBetweenHospitals(hospitalLeft, hospitalRight) {
    var value;
    if (hospitalLeft > hospitalRight) {
        value = hospitalLeft - hospitalRight;
        value = '<h4 class="centered">Cheaper Bill By About ---><br />' +
        '<strong>' + convertIntToCurrency(value) + '</strong></h4>';

    } else if (hospitalLeft < hospitalRight) {
        value = hospitalRight - hospitalLeft;
        value = '<h4 class="centered"><--- Cheaper Bill By About<br />' +
        '<strong>' + convertIntToCurrency(value) + '</strong></h4>';
    }
    return value;
}

// compare a hospital's average to the datasets average
function compareHospitalToAverage(hospitalCost, averageCost) {
    if (hospitalCost < averageCost) {
        value = ' &#8595; ';
    } else {
        value = ' &#8593; ';
    }
    return value;
}