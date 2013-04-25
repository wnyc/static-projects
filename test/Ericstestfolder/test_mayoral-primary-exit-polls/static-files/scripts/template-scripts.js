var jqueryNoConflict = jQuery;
var proxyPrefix = 'http://projects.scpr.org/static/static-files/templates/';

// begin main function
jqueryNoConflict(document).ready(function() {
    renderStaticTemplates();
});

// render all the templates
function renderStaticTemplates(){
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-header.handlebars', '#kpcc-header');
    renderHandlebarsTemplate(proxyPrefix + 'kpcc-footer.handlebars', '#kpcc-footer');
    renderHandlebarsTemplate('projects.scpr.org/static-files/templates/data-share.handlebars', '#data-share');
    renderHandlebarsTemplate('projects.scpr.org/static-files/templates/data-details.handlebars', '#data-details');
    renderHandlebarsTemplate('projects.scpr.org/static-files/templates/content-explainer.handlebars', '#content-explainer');
    renderHandlebarsTemplate('projects.scpr.org/static-files/templates/data-footer.handlebars', '#data-footer');
};
// end