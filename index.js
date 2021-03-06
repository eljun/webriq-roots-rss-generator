/*
  - This parser is design to run under roots-cms instance.
  - The plugin has not been tested to run properly on multiple devices.
  - Please refer to this site for more info: https://www.npmjs.com/package/rss
  - Please send issue request if bug is found at: http://github.com/eljun
*/

var _, RSS, fs, path, yfm, sortBy, config, marked;

fs     = require('fs');
path   = require('path');
_      = require('lodash');
yfm    = require('yaml-front-matter');
RSS    = require('rss');
config = require('./lib/config');
marked = require('marked');
S      = require('underscore.string');

module.exports = function(opts) {
    var RSSGenerator, folder, helperName, output, json, settings, counter, limitter, setDefault;
    opts || (opts = {});
    folder     = opts.folder || config.folder;
    output     = opts.output || config.output;
    json       = opts.output || config.json;
    limitter   = config.limitter;
    setDefault = config.rssHeader;
    maxcount = function() {
        if (opts.maxcount > limitter) {
            return counter;
        } else if (opts.maxcount < counter) {
            return opts.maxcount;
        } else if (limitter < counter) {
            return limitter;
        } else {
            return counter;
        }
    };
    settings = opts.settings || (setDefault = {
        title: setDefault.title,
        feed_url: setDefault.feed_url,
        site_url: setDefault.site_url,
        description: setDefault.description,
        generators: setDefault.generators
    });

    helperName = opts.name || folder;

    if (settings.title == undefined) {
        settings.title = setDefault.title;
    }
    if (settings.description == undefined) {
        settings.description = setDefault.description;
    }
    if (settings.site_url == undefined) {
        settings.site_url = setDefault.site_url;
    }
    if (settings.feed_url == undefined) {
        settings.feed_url = setDefault.feed_url;
    }

    return RSSGenerator = (function() {
        function RSSGenerator() {

            // Adding global scope
            var extension;
            extension = this;

            var arr = [];
            var feedEntries = {};

            // Initialize our RSS mockup here
            // This is our XML headers
            feed = new RSS( settings );

            // When data is ready initialized the items
            this.compiler = function(error, files) {

                counter = files.length;

                if (error) {
                    extension.callError(error);
                } else {
                    var i = 0;
                    do {
                        //  First load our files
                        //  Then use yaml front matter
                        //  Re-structure our files
                        entry     = yfm.loadFront(path.join(folder, files[i]));

                        function customBanner() {
                            if( "banner" in entry ) {
                                return entry.banner;
                            }else {
                                return entry.thumbnail;
                            }
                        }
                        function contentImage(){
                            if(entry.banner == "undefined" || entry.banner == null){
                                return marked(entry.__content)
                            }else {
                                return "<img src='"+ settings.site_url + customBanner() +"' class='img-responsive'>" +  marked(entry.__content)
                            }
                        }
                        var json = {
                            "title": entry.title,
                            "date": entry.date,
                            "category": extension.emptyCategory(entry),
                            "banner": customBanner(),
                            "shortdesc": entry.shortdesc,
                            "slug": path.basename(files[i], '.md'),
                            "contentWithImage": contentImage()
                        }
                        arr.push(json)
                        i++;
                    }
                    while (i < files.length );
                }

                var obj = arr.sort(function(a,b){
                    var c = new Date(a.date);
                    var d = new Date(b.date);
                    return d-c;
                });

                var c = 0;

                do {
                    feed.item({
                        title: obj[c].title,
                        date: obj[c].date,
                        categories: [obj[c].category],
                        description: obj[c].contentWithImage,
                        url: settings.site_url + "/" + folder + "/" + obj[c].slug,
                        enclosure: {
                            url: settings.site_url + obj[c].banner
                        }
                    });
                    //  Cache our files structure here
                    xml = feed.xml();

                    //  After re-structuring our files
                    //  Write them to xml file
                    //  Store the outfile to desire location
                    extension.writeFile(output, xml, extension.compiler);

                    c++;
                }
                while (c < maxcount() );
            };

            // This triggers all chain events
            return this.searchPath();
        }

        // Search directory for markdown files
        RSSGenerator.prototype.searchPath = function() {
            var entry, title, date, banner, shortdesc, content, slug, xml, enclosure, contentWithImage;
            return fs.readdir(folder, this.compiler);
        };

        // Default error generator
        RSSGenerator.prototype.callError = function(element) {
            return console.log('Error has been found', element);
        };

        // Text formatter or we can use slugify
        RSSGenerator.prototype.formatter = function(Text) {
            return Text.toLowerCase().replace(/[^\w] +/g, '').replace(/[{()}]/g, '').replace(/ +/g, '-');
        };

        // Write our file to feed xml
        RSSGenerator.prototype.writeFile = function(source, data, type, callback_) {
            fs.writeFile(source, data, 'utf8', callback_);
        };

        // Extended functionality write to JSON
        RSSGenerator.prototype.writeJSON = function(source, data, callback_) {
            fs.writeFile(source, data, 'utf8', callback_);
        };
        RSSGenerator.prototype.emptySlug = function( element ) {
            if(typeof element.cmsUserSlug == "undefined" || element.cmsUserSlug.length === 0 ) {
                return S.slugify(element.title);
            }
            return element.cmsUserSlug;
        }
        RSSGenerator.prototype.emptyCategory = function( element ){
            if( "categories" in element ){
                 if( element.categories == null ) {
                    return folder;
                 }
                 return element.categories.split(" ");
            }
            return folder;
        }
        return RSSGenerator;
    })();
};