var fs = require('fs');
var path = require('path');
var url = require('url');
var sm = require('sitemap');

var urls = {'lang_all': []};

module.exports = {
    hooks: {
        // Index page
        "page": function(page) {
            if (this.output.name != 'website') return page;

            var lang = this.isLanguageBook()? this.config.values.language : '';
            var lang_index = lang || 'lang_all';
            if (!urls[lang_index]) urls[lang_index] = [];
            if (lang) lang = lang + '/';

            urls[lang_index].push({
                url: this.output.toURL(lang + page.path)
            });

            urls['lang_all'].push({
                url: this.output.toURL(lang + page.path)
            });

            return page;
        },

        // Write sitemap.xml
        "finish": function() {
            var lang = this.isLanguageBook()? this.config.values.language : '';
            var lang_index = lang || 'lang_all';
            var sitemap = sm.createSitemap({
                cacheTime: 600000,
                hostname: url.resolve(this.config.get('pluginsConfig.sitemap.hostname'), '/'),
                urls: urls[lang_index]
            });

            var xml = sitemap.toString();

            return this.output.writeFile('sitemap.xml', xml);
        }
    }
};
