// describes a legislator
App.Models.Legislator = Backbone.Model.extend({
    defaults: {
        title: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        party: null,
        district: null,
        chamber: null,
        state_name: null,
        term_end: null,
        term_start: null,
        birthday: null,
        office: null,
        phone: null,
        fax: null,
        twitter_id: null,
        website: null,
        youtube_id: null,
    }
});