# Webriq roots rss generator

A WebriQ extension for static cms page that generate rss feed.

## Installation

Open a separate terminal window and run:

```bash
$ npm i webriq-roots-rss-generator --save
```

## Features

- Create customize `rss` feed for your `markdown` files.
- Create `json` out from your post files (soon)
- Fast & easy to customize
- Auto compile for every post change


## Options

These are the available options you can set.

- `folder` - sets the directory to scan for `.md` files eg: `/posts`
- `output` - path to save compile rss feed.
- `maxcount` - number of post to be compiled (default is 15).
- `json` - path to save compile json file (soon).
- `settings` - configures rss header, it has (5) five editable elements namely:
	- `title` - sets the header title
	- `feed_url` - the path for your feed url
	- `site_url` - your website domain
	- `description` - sets your rss description
	- `generators` - (this is optional)

## Configurations

Go to `app.coffee` from your roots project directory and add the module.

```bash
var roots_rss_generator = require('webriq-roots-rss-generator')

```

Add in the extension instance.
```bash
extensions: [   
    roots_rss_generator(
      folder: "posts"
      output: "./public/feed.xml"
      maxcount: 5
      settings:
        title: "New title"
        feed_url: "http://mysite.com/feed.xml"
        description: "This is new description"
      )
    ]
```
## Other notes

- This module is only applicable when your are using http://roots.cx/
- This module uses https://www.npmjs.com/package/rss. (NOTE: Not all options were added thought).


##Contributing 

This module is still at its early version so there could be some bug. Feel free to add suggestion's and fixes to help improve the module. I will do my best to improve the plugin so everyone will be happy. Thanks

 
