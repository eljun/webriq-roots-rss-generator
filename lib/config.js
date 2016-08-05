// Here we can configure all settings for the app
// This in order to clean up some text in the main app
module.exports = {
		"folder": "posts",
		"output": "./public/feed.xml",
		"json"	: "./public/content.json",
		"limitter": 15,
		"rssHeader"	: {
			"title": "WebriQ Pte Ltd",
			"feed_url": "http://www.webriq.com/feed.xml",
			"site_url": "https://www.webriq.com",
			"description": "A diverse group of people coming from four continents with backgrounds in sales management, web design, open source web development, cloud based content management platforms and digital marketing.",
			"generators": "WebriQ RSS Generator for roots-cms"
		}
};
