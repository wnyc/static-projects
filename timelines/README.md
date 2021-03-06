# Creating timelines for scpr.org web stories
----

**Created 11/19/2012 by [Chris Keller](ckeller@scpr.org)**

**Updated 2/20/2014 by [Chris Keller](ckeller@scpr.org)**

----

## Table of contents

#### [Overview](#overview)
#### [Quickstart checklist](#quickstart)
#### [Storing the data](#storing-data)
#### [Configuring & deploying to the web](#configuring-and-deploying)
#### [Publishing in a story](#publishing)
#### [Technical Requirements](#technical-requirements)
#### [Resources](#resources)

----

<a name="overview"></a>
#### Overview

With a little practice, you can create and deploy a [topical timeline ](http://projects.scpr.org/static/timelines/life-of-nelson-mandela/) for [scpr.org](http://www.scpr.org/) using a Google Spreadsheet, a HTML index file and a JavaScript configuration file.

Roughly 95 percent of the work takes place in the Google spreadsheet, and we have a handy [template](https://docs.google.com/spreadsheet/ccc?key=0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE&usp=drive_web#gid=0) to get you started.

Follow the steps below to build, deploy and publish your very own timeline. And you'll want to check out the [tool we made](https://github.com/SCPR/timeline-data-generator) to query KPCC's [content API](https://github.com/SCPR/api-docs) and create a csv file that can be used to kickstart a timeline.

<a name="quickstart"></a>
#### Quickstart checklist

* [ ] Make a copy of the file titled [Template: KPCC Timeline Template](https://docs.google.com/spreadsheet/ccc?key=0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE&usp=drive_web#gid=0) that is stored in the KPCC Data Desk Google Drive account.
* [ ] In the spreadsheet you will find two sheets. Add data for the timeline on the sheet labeled **'Posts'.**
* [ ] Move on to the sheet labeled **'MetaData'.**
* [ ] Publish the spreadsheet and get the spreadsheet key.
* [ ] Complete the timeline-config.js file and add metadata to the index.html file.
* [ ] Deploy a timeline so users can see it on the web.

<a name="storing-data"></a>
#### Storing the data

This assumes you've already got a topic in mind and a data source, and you're familiar with using Google spreadsheets.

1. Begin by making a copy of the file titled [Template: KPCC Timeline Template](https://docs.google.com/spreadsheet/ccc?key=0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE&usp=drive_web#gid=0) that is stored in the KPCC Data Desk Google Drive account. You may be prompted to request access. Don't worry, if you're on staff we'll approve you.

2. In the spreadsheet you will find two sheets. One is labeled **'Posts'** and one is labeled **'MetaData'**. I begin by entering the data for the timeline, which means I start in the sheet labeled **Posts.** Here's an explanation of the data that should appear in each column:

    * **title**
        * **Type**: text
        * **Description**: This is the headline that will appear above the item on the timeline. Keep it pithy and to the point.
    * **date**
        * **Type**: date
        * **Description**: This is the date the item took place and is required for sorting purposes. The end user will not see this value. Please note that the date column should contain data in a **Month Day, Year** format. -- **April 25, 2012** so the JavaScript can parse it correctly. If you don't know the date something occurred, we can fudge it for sorting purposes by just entering the first or second day of a month.
    * **display date**
        * **Type**: text
        * **Description**: This is the date the user will see on the timeline. You can format this however it makes sense given the item's context. Sometime we use March 2003, sometimes 2003. It's really a free form text field to explain to the user when something happened.
    * **media type**
        * **Type**: image or embed
        * **Description**: This field accepts two values: image or embed. It is used to tell the presentation template how to adjust to a photo or an iframe/video embed.
    * **media url**
        * **Type**: url
        * **Description**: This field is a link to an image -- if the media type is image -- or an iframe embed code. In most cases we should only be linking to images we have stored in assethost. Put another way: Do not hotlink to images on other sites. We have no reason to believe those images will always exist or won't be switched out for some meme.
    * **caption**
        * **Type**: text
        * **Description**: This field is the caption for the image.
    * **body**
        * **Type**: text
        * **Description**: This field contains body text for the item. Should your item not warrant body text, this field isn't necessary.
    * **read more source**
        * **Type**: text
        * **Description**: This field is the source of an item.
    * **read more url**
        * **Type**: url
        * **Description**: This field is a link to that source.

3. Now lets move on to the sheet labeled **MetaData.** Here's an explanation of the data that should appear in each column:
    * **projecturl**
        * **Type**: url
        * **Description**: This is the URL where the timeline will be visible on the web. If you don't know this, Chris K., Eric Z. or Brian F. can help you.
        * **Example**: ```http://projects.scpr.org/static/timelines/life-of-nelson-mandela/```
    * **kicker**
        * **Type**: text
        * **Description**: Projects have a "kicker" headline element that describes the topic of the project. This will usually be something like "Politics," "Crime," "Education".
        * **Example**: ```Politics```
    * **headline**
        * **Type**: text
        * **Description**: This is the headline of the project that will appear as a H1 heading on the page.
        * **Example**: ```Timeline: The Life of Nelson Mandela```
    * **credits**
        * **Type**: text + HTML
        * **Description**: This is the byline of the project with a link to the producer's bio if applicable.
        * **Example**: ```Produced by <a href="http://www.scpr.org/about/people/staff/brian-frank" target="blank">Brian Frank</a> and <a href="http://www.scpr.org/about/people/staff/chris-keller" target="blank">Chris Keller</a>```
    * **published**
        * **Type**: text
        * **Description**: This is the date a project was published or updated.
        * **Example**: ```Published Dec. 5, 2013```
    * **text**
        * **Type**: html
        * **Description**: This is a paragraph or two to describe the timeline for the user.
        * **Example**: ```<p>Nelson Mandela, who became one of the world's most beloved statesmen and a colossus of the 20th century when he emerged from 27 years in prison to negotiate an end to white minority rule in South Africa, has died. He was 95. South African President Jacob Zuma made the announcement at a news conference late Thursday, saying "we've lost our greatest son."</p>```
    * **readmoreurl**
        * **Type**: url
        * **Description**: This is a link that serves to direct the user to a post, segment or landing page.
        * **Example**: ```http://www.scpr.org/news/2013/12/05/40776/nelson-mandela-has-died-according-to-south-africa/```
    * **sources**
        * **Type**: text
        * **Description**: This is an umbrella listing for sources used to compile the timeline.
        * **Example**: ```Associated Press```
4. Once the **Posts** and **MetaData** sheets are completed you have to publish the spreadsheet. To do this go to *File* --> *Publish to the web* and choose *Start publishing*. A URL will appear, and we're interested in the part between 'key=' and the '&' symbol.
    * Here's an example URL:
        * ```https://docs.google.com/spreadsheet/pub?key=0Aq8qwSArzKP9dEo4Wl9VMTJXNllVaG5nWU5GMkhJclE&output=html```
    * We want this portion:
        * ```0An8W63YKWOsxdFFSZjB5VV9aVmZGblQxSFhpZ1NFd3c```
5. Congratulations. You have now created a timeline. Want to update your timeline with new information...? Here's the beautiful part: Just add more information to the Google Spreadsheet and it will be updated. Now that your timeline is ready to deploy, you'll need some help.

<a name="configuring-and-deploying"></a>
#### Configuring & deploying to the web

What do we mean when we say configuring & deploying? Configuring means we fill out a pre-compiled script with information about our timeline project that will push our spreadsheet data to a template. Deploying means we push these templates to a server and make the timeline viewable by our digital audience.

Right now, Chris K. and Eric Z. can handle this part of the processs. Brian F. has been trained. We're happy to train others, but there are some [technical requirements](#technical-requirements) before this can happen.

Here's an overview of the [configuration](#configuration) and [deployment](#deployment) process. [Flat file data configuration](#flat-file-data) coming soon.

<a name="configuration"></a>
**Configuration**

1. Clone the [SCPR/static-projects repository](https://github.com/SCPR/static-projects) from [GitHub](https://github.com/about) to your local machine.
2. In the main directory there is a timelines subdirectory that contains the **timeline-template** folder. Duplicate this **timeline-template** folder (option-drag on a Mac) and rename it to match the timeline topic. I wouldn't use more than three or four words, which are separated by hyphens.
    * **Example**: ```life-of-nelson-mandela```
3. Inside the new directory you created you will find four files and a directory titled respond-proxy. For now, we're only really interested in **timeline-config.js** and **index.html**. Both need to be filled out.
    * **timeline-config.js** contains the configuration variables that allow the data on your spreadsheet to be displayed on a template for the user. Here's what is looks like and what each of the keys refer to:

            var kpccTimelineConfig = {
                // choose spreadsheet or flat-file
                dataSource: 'spreadsheet',

                // example spreadsheet key
                key: '0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE',

                // example path to data file
                sourceFile: 'timeline-data.json',

                // example path to meta file
                metaFile: 'timeline-meta.json',

                // name of sheet containing timeline entries
                sheetName: 'Posts',

                // name of sheet containing timeline meta
                sheetMeta: 'MetaData',

                // make the timeline embeddable
                embedThis: true,

                // url of the timeline
                projectDirectory: 'http://projects.scpr.org/static/timelines/timeline-template/',

                // newest or oldest
                defaultDirection: 'newest',

                // collapsed or expanded
                defaultExpansion: 'expanded',

                // display social sharing links
                sharing: true,

                // groupSegmentByYear or groupSegmentByDecade
                groupFunction: 'groupSegmentByYear',

                // adjust timeline width
                width: '90%'
            };

        * **dataSource:**
            * **Description**: Tells the timeline whether the data is coming from a spreadsheet or a JSON file.
            * **Default value**: ```'spreadsheet'```
            * **Options**: ```'spreadsheet'``` or ```'flat-file'```

        * **key:**
            * **Description**: This is the key to the spreadsheet where the data lives.
            * **Default value**: ```'0An8W63YKWOsxdEVHUDliRmZFMC1ZOWZhVUZFMEp6TUE'```
            * **Options**: n/a

        * **sourceFile:**
            * **Description**: If your dataSource is flat-file, this is the path to that json file that contains the items posted on the spreadsheets **Posts** sheet. It should be included in the repository in the timeline's directory.
            * **Default value**: ```'timeline-data.json'```
            * **Options**: n/a

        * **metaFile:**
            * **Description**: If your dataSource is flat-file, this is the path to that json file that contains the items posted on the spreadsheets **MetaData** sheet. It should be included in the repository in the timeline's directory.
            * **Default value**: ```'timeline-data.json'```
            * **Options**: n/a

        * **sheetName:**
            * **Description**: Should you change the name of the sheet that stores your item data from **Posts**, this needs to be reflected here.
            * **Default value**: ```'Posts'```
            * **Options**: n/a

        * **sheetMeta:**
            * **Description**: Should you change the name of the sheet that stores your metadata from **MetaData**, this needs to be reflected here.
            * **Default value**: ```'MetaData'```
            * **Options**: n/a

        * **embedThis:**
            * **Description**: Do you want to allow others to embed this timeline?
            * **Default value**: ```true```
            * **Options**: ```true``` or ```false```

        * **projectDirectory:**
            * **Description**: url of the timeline
            * **Default value**: ```'http://projects.scpr.org/static/timelines/timeline-template/'```
            * **Options**: n/a

        * **projectDirectory:**
            * **Description**: Direction the timeline's items will be displayed when the user loads the page.
            * **Default value**: ```'newest'```
            * **Options**: ```'newest'``` or ```'oldest'```

        * **defaultDirection:**
            * **Description**: Direction the timeline's items will be displayed when the user loads the page.
            * **Default value**: ```'newest'```
            * **Options**: ```'newest'``` or ```'oldest'```

        * **defaultExpansion:**
            * **Description**: Determines if the timeline's items will be open or closed when the user loads the page.
            * **Default value**: ```'expanded'```
            * **Options**: ```'expanded'``` or ```'collapsed'```

        * **sharing:**
            * **Description**: Determines if links and social links to an individual timeline item should be displayed to the user.
            * **Default value**: ```true```
            * **Options**: ```true``` or ```false```

        * **groupFunction:**
            * **Description**: Determines if the items should be grouped by year or by decade.
            * **Default value**: ```'groupSegmentByYear'```
            * **Options**: ```'groupSegmentByYear'``` or ```'groupSegmentByDecade'```

        * **width:**
            * **Description**: Sets the width of the timeline in the template container.
            * **Default value**: ```'90%'```
            * **Options**: n/a

    * **index.html** contains the markup that will be served to the user on the web. We have to enter four pieces of information in this file.
        * Add the project's title to the following:

                <title>Timeline: Title | scpr.org</title>
                <meta property="og:title" content="#" />
                <meta name="twitter:title" content="#">

        * Add the project's url to the following:

                <meta property="og:url" content="#" />
                <meta name="twitter:url" content="#">

        * Complete the projects's description:

                <meta name="description" content="#" />

        * Complete the projects's keywords:

                <meta name="keywords" content="#" />

<a name="flat-file-data"></a>
**Flat file data configuration**

**COMING SOON**

<a name="deployment"></a>
**Deployment**

1. To deploy a timeline so users can see it on the web, we add the project to the GitHub repository.

        ```git add <project name>```

2. We add a commit message saying what we just did

        ```git commit 'adds <project name> to the repository'```

3. We deploy it to the server

        ```cap deploy```

On the web team, only Chris K. and Eric Z. can do this. Bryan Ricker can do so in a pinch.

This isn't ideal we realize, but [technical requirements](#technical-requirements) will be required to allow others to do so.

<a name="publishing">
#### Publishing

When it comes time to add the timeline to a news story or blog post, and provided you made it embeddable, just visit the timeline and click the "Embed This" button in the top right corner. An alert will pop up and give you the iframe code.

        <iframe src="http://projects.scpr.org/static/timelines/life-of-nelson-mandela" width="100%" height="850px" style="margin: 0 auto;" frameborder="no"></iframe>

Or if you know the timeline URL, just add it to iframe html.

        <iframe src="http://projects.scpr.org/static/timelines/life-of-nelson-mandela" width="100%" height="850px" style="margin: 0 auto;" frameborder="no"></iframe>

<a name="technical-requirements"></a>
#### Technical Requirements

To be in a position to configure and deploy timelines, some foundational elements need to be in place.

**Install on your laptop (assuming you're on a Mac)**

* Git
* Ruby
* Capistrano 2.14.1
* Development environment (MAMP or Python simple server)

**Misc**

* GitHub account added to SCPR data team
* ssh key added to the media server by Bryan Ricker

Having a GitHub account and a development environment will get you started in at least configuring a timeline, though Chris K. or Eric Z. will need to deploy.

The process is similar to the one outline in the [deployment](#deployment) section.

1. Fork the [SCPR/static-projects repository](https://github.com/SCPR/static-projects) from [GitHub](https://github.com/about).
2. Clone your fork to your local machine.
3. Add a project, configure it and push it back to your forked repo.
4. Open a [pull request](https://github.com/SCPR/static-projects/pulls) to have your additions or changes reviewed by Chris K. or Eric Z.

<a name="resources"></a>
####Resources

[scpr GitHub repo](https://github.com/SCPR/static-projects/tree/master/timelines) that contains the timelines we have published

[tabletop-timeline-v3-init.js](https://github.com/SCPR/static-projects/blob/master/static-files/v3-dependencies/scripts/tabletop-timeline-v3-init.js)

[tabletop-timeline-v3-main.js](https://github.com/SCPR/static-projects/blob/master/static-files/v3-dependencies/scripts/tabletop-timeline-v3-main.js)

[tabletop-timeline-v3-plugins.js](https://github.com/SCPR/static-projects/blob/master/static-files/v3-dependencies/scripts/tabletop-timeline-v3-plugins.js)

[MinnPost's jquery-vertical-timeline](https://github.com/MinnPost/jquery-vertical-timeline)

[Tabletop.js](https://github.com/jsoma/tabletop)

[Modernizr](http://modernizr.com/)

[Handlebars.js](http://handlebarsjs.com/)

[Isotope](http://isotope.metafizzy.co/)

[License for Isotope](http://projects.scpr.org/static/static-files/scripts/isotope_commercial_license/isotope-commercial-license.txt) purchased by [Chris Keller](ckeller@scpr.org)