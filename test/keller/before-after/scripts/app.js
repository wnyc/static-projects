var jqueryNoConflict = jQuery;
var initializeTemplates = initializeTemplates || {};
var fn = fn || {};
var embed_url_root = '#';

// begin main function
jqueryNoConflict(document).ready(function() {
    initializeTemplates.renderStaticTemplates();
    fn.checkForDataVisuals();
});

// begin data configuration object
var fn = {

    divWidth: jqueryNoConflict('.data-visuals').width(),

    checkForDataVisuals: function(){
        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.data-visuals').length) {
                clearInterval(checkExist);
                fn.renderImages(imageData.objects[0].beforeimageurl, imageData.objects[0].afterimageurl, fn.divWidth);
                fn.processData(imageData);
                jqueryNoConflict('#container').beforeAfter();
            }
        }, 1000);
    },

    // add initial pair of images and add controls
    renderImages: function(beforeImage, afterImage, baseWidth){
    	jqueryNoConflict('#slider').alterImg({
    		beforePhoto: beforeImage,
    		afterPhoto: afterImage,
    		baWidth: 620,
    		baHeight: 413
    	});
    },

    processData: function(data){
        for(var i=0; i<data.objects.length; i++){
            jqueryNoConflict("#controls-stage-indicator").append("<li id='" + i + "' class='indicator'><a href='javascript:void(0);'>" + i + "</a></li>");
        }

        jqueryNoConflict('#controls-stage-indicator li:first').addClass('active');
        jqueryNoConflict('li.indicator').click(function(){
            var targetValue = jqueryNoConflict(this).attr('id');
            jqueryNoConflict('li').removeClass('active');
            jqueryNoConflict('li#' + targetValue).addClass('active');

            // original version
            jqueryNoConflict('#slider').empty();
            fn.renderImages(imageData.objects[targetValue].beforeimageurl, imageData.objects[targetValue].afterimageurl, fn.divWidth);

            // newer version
            jqueryNoConflict('#container #before img').attr('src', imageData.objects[targetValue].beforeimageurl);
            jqueryNoConflict('#container #after img').attr('src', imageData.objects[targetValue].afterimageurl);

        });
    },
}
// end data configuration object

// begin template rendering object
var initializeTemplates = {
    renderStaticTemplates: function(){
        var proxyPrefix = 'http://projects.scpr.org/static/static-files/v3-dependencies/templates/';
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '.kpcc-header');
        renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '.kpcc-footer');
        renderHandlebarsTemplate('templates/data-share.handlebars', '.data-share');
        renderHandlebarsTemplate('templates/data-details.handlebars', '.data-details');
        renderHandlebarsTemplate('templates/data-visuals.handlebars', '.data-visuals');

        var checkExist = setInterval(function() {
            if (jqueryNoConflict('.buttons').length) {
                clearInterval(checkExist);
                initializeTemplates.toggleDisplayIcon();
            }
        }, 1000);

    },

    renderEmbedBox: function(){
        var embed_url = embed_url_root + '/iframe.html';
        jAlert('<h4>Embed this on your site or blog</h4>' + '<span>Copy this code and paste to source of your page: <br /><br /> &lt;iframe src=\"'+ embed_url +'\" width=\"100%\" height=\"850px\" style=\"margin: 0 auto;\" frameborder=\"no\"&gt;&lt;/iframe>', 'Share or Embed');
    },

    toggleDisplayIcon: function(){
        jqueryNoConflict('.text').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.text').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.text').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.text').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('shown.bs.collapse', function(){
            jqueryNoConflict('span.about').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        });
        jqueryNoConflict('.about').on('hidden.bs.collapse', function(){
            jqueryNoConflict('span.about').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        });
    }
}
// end template rendering object