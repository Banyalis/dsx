exports.posts = [
    {
        "id": "5b6ac8506a8ae2a7e198229c",
        "title": "Koenig Demo Post",
        "slug": "v2-demo-post",
        "html": "<p>Hey there! Welcome to the new Ghost editor - affectionately known as <strong>Koenig</strong>.</p><p>Koenig is a brand new writing experience within Ghost, and follows more of a rich writing experience which you've come to expect from the best publishing platforms. Don't worry though! You can still use Markdown too, if that's what you prefer.</p><p>Because there are some changes to how Ghost outputs content using its new editor, we dropped this draft post into your latest update to tell you a bit about it – and simultaneously give you a chance to preview how well your theme handles these changes. So after reading this post you should both understand how everything works, and also be able to see if there are any changes you need to make to your theme in order to upgrade to Ghost 2.0.</p><hr><h1 id=\"what-s-new\">What's new</h1><p>The new editor is designed to allow you have a more rich editing experience, so it's no longer limited to just text and formatting options – but it can also handle rich media objects, called cards. You can insert a card either by clicking on the <code>+</code> button on a new line, or typing <code>/</code> on a new line to search for a particular card. </p><p>Here's one now:</p><figure class=\"kg-embed-card\"><blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">Fun announcement coming this afternoon ? what could it be?</p>&mdash; Ghost (@TryGhost) <a href=\"https://twitter.com/TryGhost/status/761119175192420352?ref_src=twsrc%5Etfw\">August 4, 2016</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n</figure><p>Cards are rich objects which contain content which is more than just text. To start with there are cards for things like images, markdown, html and embeds — but over time we'll introduce more cards and integrations, as well as allowing you to create your own!</p><h2 id=\"some-examples-of-possible-future-cards\">Some examples of possible future cards</h2><ul><li>A chart card to display dynamic data visualisations</li><li>A recipe card to show a pre-formatted list of ingredients and instructions</li><li>A Mailchimp card to capture new subscribers with a web form</li><li>A recommended reading card to display a dynamic suggested story based on the current user's reading history</li></ul><p>For now, though, we're just getting started with the basics.</p><h1 id=\"new-ways-to-work-with-images\">New ways to work with images</h1><p>Perhaps the most notable change to how you're used to interacting with Ghost is in the images. In Koenig, they're both more powerful and easier to work with in the editor itself - and in the theme, they're output slightly differently with different size options.</p><p>For instance, here's your plain ol' regular image:</p><figure class=\"kg-image-card\"><img src=\"https://casper.ghost.org/v1.25.0/images/koenig-demo-1.jpg\" class=\"kg-image\"><figcaption>A regular size image</figcaption></figure><p>But perhaps you've got a striking panorama that you really want to stand out as your readers scroll down the page. In that case, you could use the new full-bleed image size which stretches right out to the edges of the screen:</p><figure class=\"kg-image-card kg-width-full\"><img src=\"https://casper.ghost.org/v1.25.0/images/koenig-demo-2.jpg\" class=\"kg-image\"><figcaption>It's wide</figcaption></figure><p>Or maybe you're looking for something in between, which will give you just a little more size to break up the vertical rhythm of the post without dominating the entire screen. If that's the case, you might like the breakout size:</p><figure class=\"kg-image-card kg-width-wide\"><img src=\"https://casper.ghost.org/v1.25.0/images/koenig-demo-3.jpg\" class=\"kg-image\"><figcaption>It's wider, but not widest</figcaption></figure><p>Each of these sizes can be selected from within the editor, and each will output a number of HTML classes for the theme to do styling with. </p><p>Chances are your theme will need a few small updates to take advantage of the new editor functionality. Some people might also find they need to tweak their theme layout, as the editor canvas previously output a wrapper div around its content – but no longer does. If you rely on that div for styling, you can always add it back again in your theme.</p><p>Oh, we have some nice new image captions, too :)</p><h1 id=\"what-else\">What else?</h1><p>Well, you can still write Markdown, as mentioned. In fact you'll find the entire previous Ghost editor <em>inside</em> this editor. If you want to use it then just go ahead and add a Markdown card and start writing like nothing changed at all:</p><p>Markdown content works just the way it always did, <strong>simply</strong> and <em>beautifully</em>.</p>\n<p>of course you can embed code blocks</p><pre><code>.new-editor {\n\tdisplay: bock;\n}</code></pre><p>or embed things from external services like YouTube...</p><figure class=\"kg-embed-card\"><iframe width=\"480\" height=\"270\" src=\"https://www.youtube.com/embed/CfeQTuGyiqU?feature=oembed\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe></figure><p>and yeah you can do full HTML if you need to, as well!</p><div style=\"background:#fafafa;margin-bottom:1.5em;padding:20px 50px;\">\n    <blink>hello world</blink>\n</div><p>So everything works, hopefully, just about how you would expect. It's like the old editor, but faster, cleaner, prettier, and a whole lot more powerful.</p><h1 id=\"what-do-i-do-with-this-information\">What do I do with this information?</h1><p>Preview this post on your site to see if it causes any issues with your theme. Click on the settings cog in the top right ?? corner of the editor, then click on '<strong>Preview</strong>' next to the 'Post URL' input.</p><p>If everything looks good to you then there's nothing you need to do, you're all set! If you spot any issues with your design, or there are some funky display issues, then you might need to make some updates to your theme based on the new editor classes being output.</p><p>Head over to the <a href=\"https://forum.ghost.org/t/ghost-2-0-theme-compatibility-help-support/2103\">Ghost 2.0 Theme Compatibility</a> forum topic to discuss any changes and get help if needed.</p><p>That's it!</p><p>We're looking forward to sharing more about the new editor soon</p>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/design.jpg",
        "published_at": "2018-08-08T07:39:12.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8506a8ae2a7e198229e",
        "title": "Setting up your own Ghost theme",
        "slug": "themes",
        "html": "<div class=\"kg-card-markdown\"><p>Creating a totally custom design for your publication</p>\n<p>Ghost comes with a beautiful default theme called Casper, which is designed to be a clean, readable publication layout and can be easily adapted for most purposes. However, Ghost can also be completely themed to suit your needs. Rather than just giving you a few basic settings which act as a poor proxy for code, we just let you write code.</p>\n<p>There are a huge range of both free and premium pre-built themes which you can get from the <a href=\"http://marketplace.ghost.org\">Ghost Theme Marketplace</a>, or you can simply create your own from scratch.</p>\n<p><a href=\"http://marketplace.ghost.org\"><img src=\"https://casper.ghost.org/v1.0.0/images/marketplace.jpg\" alt=\"marketplace\"></a></p>\n<blockquote>\n<p>Anyone can write a completely custom Ghost theme, with just some solid knowledge of HTML and CSS</p>\n</blockquote>\n<p>Ghost themes are written with a templating language called handlebars, which has a bunch of dynamic helpers to insert your data into template files. Like <code>{{author.name}}</code>, for example, outputs the name of the current author.</p>\n<p>The best way to learn how to write your own Ghost theme is to have a look at <a href=\"https://github.com/TryGhost/Casper\">the source code for Casper</a>, which is heavily commented and should give you a sense of how everything fits together.</p>\n<ul>\n<li><code>default.hbs</code> is the main template file, all contexts will load inside this file unless specifically told to use a different template.</li>\n<li><code>post.hbs</code> is the file used in the context of viewing a post.</li>\n<li><code>index.hbs</code> is the file used in the context of viewing the home page.</li>\n<li>and so on</li>\n</ul>\n<p>We've got <a href=\"http://themes.ghost.org/v1.23.0/docs/about\">full and extensive theme documentation</a> which outlines every template file, context and helper that you can use.</p>\n<p>If you want to chat with other people making Ghost themes to get any advice or help, there's also a <strong>themes</strong> section on our <a href=\"https://forum.ghost.org/c/themes\">public Ghost forum</a>.</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/design.jpg",
        "published_at": "2018-08-08T07:39:13.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8506a8ae2a7e19822a0",
        "title": "Advanced Markdown tips",
        "slug": "advanced-markdown",
        "html": "<div class=\"kg-card-markdown\"><p>There are lots of powerful things you can do with the Ghost editor</p>\n<p>If you've gotten pretty comfortable with <a href=\"/the-editor/\">all the basics</a> of writing in Ghost, then you may enjoy some more advanced tips about the types of things you can do with Markdown!</p>\n<p>As with the last post about the editor, you'll want to be actually editing this post as you read it so that you can see all the Markdown code we're using.</p>\n<h2 id=\"specialformatting\">Special formatting</h2>\n<p>As well as bold and italics, you can also use some other special formatting in Markdown when the need arises, for example:</p>\n<ul>\n<li><s>strike through</s></li>\n<li><mark>highlight</mark></li>\n<li>*escaped characters*</li>\n</ul>\n<h2 id=\"writingcodeblocks\">Writing code blocks</h2>\n<p>There are two types of code elements which can be inserted in Markdown, the first is inline, and the other is block. Inline code is formatted by wrapping any word or words in back-ticks, <code>like this</code>. Larger snippets of code can be displayed across multiple lines using triple back ticks:</p>\n<pre><code>.my-link {\n    text-decoration: underline;\n}\n</code></pre>\n<p>If you want to get really fancy, you can even add syntax highlighting using <a href=\"http://prismjs.com/\">Prism.js</a>.</p>\n<h2 id=\"fullbleedimages\">Full bleed images</h2>\n<p>One neat trick which you can use in Markdown to distinguish between different types of images is to add a <code>#hash</code> value to the end of the source URL, and then target images containing the hash with special styling. For example:</p>\n<p><img src=\"https://casper.ghost.org/v1.0.0/images/walking.jpg#full\" alt=\"walking\"></p>\n<p>which is styled with...</p>\n<pre><code>img[src$=&quot;#full&quot;] {\n    max-width: 100vw;\n}\n</code></pre>\n<p>This creates full-bleed images in the Casper theme, which stretch beyond their usual boundaries right up to the edge of the window. Every theme handles these types of things slightly differently, but it's a great trick to play with if you want to have a variety of image sizes and styles.</p>\n<h2 id=\"referencelists\">Reference lists</h2>\n<p><strong>The quick brown <a href=\"https://en.wikipedia.org/wiki/Fox\" title=\"Wikipedia: Fox\">fox</a>, jumped over the lazy <a href=\"https://en.wikipedia.org/wiki/Dog\" title=\"Wikipedia: Dog\">dog</a>.</strong></p>\n<p>Another way to insert links in markdown is using reference lists. You might want to use this style of linking to cite reference material in a Wikipedia-style. All of the links are listed at the end of the document, so you can maintain full separation between content and its source or reference.</p>\n<h2 id=\"creatingfootnotes\">Creating footnotes</h2>\n<p>The quick brown fox<sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup> jumped over the lazy dog<sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2\">[2]</a></sup>.</p>\n<p>Footnotes are a great way to add additional contextual details when appropriate. Ghost will automatically add footnote content to the very end of your post.</p>\n<h2 id=\"fullhtml\">Full HTML</h2>\n<p>Perhaps the best part of Markdown is that you're never limited to just Markdown. You can write HTML directly in the Ghost editor and it will just work as HTML usually does. No limits! Here's a standard YouTube embed code as an example:</p>\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/Cniqsc9QfDo?rel=0&amp;showinfo=0\" frameborder=\"0\" allowfullscreen></iframe>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\">\n<ol class=\"footnotes-list\">\n<li id=\"fn1\" class=\"footnote-item\"><p>Foxes are red <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n<li id=\"fn2\" class=\"footnote-item\"><p>Dogs are usually not red <a href=\"#fnref2\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n</ol>\n</section>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/advanced.jpg",
        "published_at": "2018-08-08T07:39:14.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8506a8ae2a7e19822a2",
        "title": "Making your site private",
        "slug": "private-sites",
        "html": "<div class=\"kg-card-markdown\"><p>Sometimes you might want to put your site behind closed doors</p>\n<p>If you've got a publication that you don't want the world to see yet because it's not ready to launch, you can hide your Ghost site behind a simple shared pass-phrase.</p>\n<p>You can toggle this preference on at the bottom of Ghost's General Settings</p>\n<p><img src=\"https://casper.ghost.org/v1.0.0/images/private.png\" alt=\"private\"></p>\n<p>Ghost will give you a short, randomly generated pass-phrase which you can share with anyone who needs access to the site while you're working on it. While this setting is enabled, all search engine optimisation features will be switched off to help keep the site off the radar.</p>\n<p>Do remember though, this is <em>not</em> secure authentication. You shouldn't rely on this feature for protecting important private data. It's just a simple, shared pass-phrase for very basic privacy.</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/locked.jpg",
        "published_at": "2018-08-08T07:39:15.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8516a8ae2a7e19822a4",
        "title": "Managing Ghost users",
        "slug": "managing-users",
        "html": "<div class=\"kg-card-markdown\"><p>Ghost has a number of different user roles for your team</p>\n<h3 id=\"authors\">Authors</h3>\n<p>The base user level in Ghost is an author. Authors can write posts, edit their own posts, and publish their own posts. Authors are <strong>trusted</strong> users. If you don't trust users to be allowed to publish their own posts, you shouldn't invite them to Ghost admin.</p>\n<h3 id=\"editors\">Editors</h3>\n<p>Editors are the 2nd user level in Ghost. Editors can do everything that an Author can do, but they can also edit and publish the posts of others - as well as their own. Editors can also invite new authors to the site.</p>\n<h3 id=\"administrators\">Administrators</h3>\n<p>The top user level in Ghost is Administrator. Again, administrators can do everything that Authors and Editors can do, but they can also edit all site settings and data, not just content. Additionally, administrators have full access to invite, manage or remove any other user of the site.</p>\n<h3 id=\"theowner\">The Owner</h3>\n<p>There is only ever one owner of a Ghost site. The owner is a special user which has all the same permissions as an Administrator, but with two exceptions: The Owner can never be deleted. And in some circumstances the owner will have access to additional special settings if applicable — for example, billing details, if using Ghost(Pro).</p>\n<hr>\n<p>It's a good idea to ask all of your users to fill out their user profiles, including bio and social links. These will populate rich structured data for posts and generally create more opportunities for themes to fully populate their design.</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/team.jpg",
        "published_at": "2018-08-08T07:39:16.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8516a8ae2a7e19822a6",
        "title": "Organising your content with tags",
        "slug": "using-tags",
        "html": "<div class=\"kg-card-markdown\"><p>Ghost has a single, powerful organisational taxonomy, called tags.</p>\n<p>It doesn't matter whether you want to call them categories, tags, boxes, or anything else. You can think of Ghost tags a lot like Gmail labels. By tagging posts with one or more keyword, you can organise articles into buckets of related content.</p>\n<h2 id=\"basictagging\">Basic tagging</h2>\n<p>When you write a post, you can assign tags to help differentiate between categories of content. For example, you might tag some posts with <code>News</code> and other posts with <code>Cycling</code>, which would create two distinct categories of content listed on <code>/tag/news/</code> and <code>/tag/cycling/</code>, respectively.</p>\n<p>If you tag a post with both <code>News</code> <em>and</em> <code>Cycling</code> - then it appears in both sections.</p>\n<p>Tag archives are like dedicated home-pages for each category of content that you have. They have their own pages, their own RSS feeds, and can support their own cover images and meta data.</p>\n<h2 id=\"theprimarytag\">The primary tag</h2>\n<p>Inside the Ghost editor, you can drag and drop tags into a specific order. The first tag in the list is always given the most importance, and some themes will only display the primary tag (the first tag in the list) by default. So you can add the most important tag which you want to show up in your theme, but also add a bunch of related tags which are less important.</p>\n<p><mark><strong>News</strong>, Cycling, Bart Stevens, Extreme Sports</mark></p>\n<p>In this example, <strong>News</strong> is the primary tag which will be displayed by the theme, but the post will also still receive all the other tags, and show up in their respective archives.</p>\n<h2 id=\"privatetags\">Private tags</h2>\n<p>Sometimes you may want to assign a post a specific tag, but you don't necessarily want that tag appearing in the theme or creating an archive page. In Ghost, hashtags are private and can be used for special styling.</p>\n<p>For example, if you sometimes publish posts with video content - you might want your theme to adapt and get rid of the sidebar for these posts, to give more space for an embedded video to fill the screen. In this case, you could use private tags to tell your theme what to do.</p>\n<p><mark><strong>News</strong>, Cycling, #video</mark></p>\n<p>Here, the theme would assign the post publicly displayed tags of <code>News</code>, and <code>Cycling</code> - but it would also keep a private record of the post being tagged with <code>#video</code>.</p>\n<p>In your theme, you could then look for private tags conditionally and give them special formatting:</p>\n<pre><code>{{#post}}\n    {{#has tag=&quot;#video&quot;}}\n        ...markup for a nice big video post layout...\n    {{else}}\n        ...regular markup for a post...\n    {{/has}}\n{{/post}}\n</code></pre>\n<p>You can find documentation for theme development techniques like this and many more over on Ghost's extensive <a href=\"https://themes.ghost.org/v1.23.0/\">theme documentation</a>.</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/tags.jpg",
        "published_at": "2018-08-08T07:39:17.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8516a8ae2a7e19822a8",
        "title": "Using the Ghost editor",
        "slug": "the-editor",
        "html": "<div class=\"kg-card-markdown\"><p>Ghost uses a language called <strong>Markdown</strong> to format text.</p>\n<p>When you go to edit a post and see special characters and colours intertwined between the words, those are Markdown shortcuts which tell Ghost what to do with the words in your document. The biggest benefit of Markdown is that you can quickly apply formatting as you type, without needing to pause.</p>\n<p>At the bottom of the editor, you'll find a toolbar with basic formatting options to help you get started as easily as possible. You'll also notice that there's a <strong>?</strong> icon, which contains more advanced shortcuts.</p>\n<p>For now, though, let's run you through some of the basics. You'll want to make sure you're editing this post in order to see all the Markdown we've used.</p>\n<h2 id=\"formattingtext\">Formatting text</h2>\n<p>The most common shortcuts are of course, <strong>bold</strong> text, <em>italic</em> text, and <a href=\"https://example.com\">hyperlinks</a>. These generally make up the bulk of any document. You can type the characters out, but you can also use keyboard shortcuts.</p>\n<ul>\n<li><code>CMD/Ctrl + B</code> for Bold</li>\n<li><code>CMD/Ctrl + I</code> for Italic</li>\n<li><code>CMD/Ctrl + K</code> for a Link</li>\n<li><code>CMD/Ctrl + H</code> for a Heading (Press multiple times for h2/h3/h4/etc)</li>\n</ul>\n<p>With just a couple of extra characters here and there, you're well on your way to creating a beautifully formatted story.</p>\n<h2 id=\"insertingimages\">Inserting images</h2>\n<p>Images in Markdown look just the same as links, except they're prefixed with an exclamation mark, like this:</p>\n<p><code>![Image description](/path/to/image.jpg)</code></p>\n<p><img src=\"https://casper.ghost.org/v1.0.0/images/computer.jpg\" alt=\"Computer\"></p>\n<p>Most Markdown editors don't make you type this out, though. In Ghost you can click on the image icon in the toolbar at the bottom of the editor, or you can just click and drag an image from your desktop directly into the editor. Both will upload the image for you and generate the appropriate Markdown.</p>\n<p><em><strong>Important Note:</strong> Ghost does not currently have automatic image resizing, so it's always a good idea to make sure your images aren't gigantic files <strong>before</strong> uploading them to Ghost.</em></p>\n<h2 id=\"makinglists\">Making lists</h2>\n<p>Lists in HTML are a formatting nightmare, but in Markdown they become an absolute breeze with just a couple of characters and a bit of smart automation. For numbered lists, just write out the numbers. For bullet lists, just use <code>*</code> or <code>-</code> or <code>+</code>. Like this:</p>\n<ol>\n<li>Crack the eggs over a bowl</li>\n<li>Whisk them together</li>\n<li>Make an omelette</li>\n</ol>\n<p>or</p>\n<ul>\n<li>Remember to buy milk</li>\n<li>Feed the cat</li>\n<li>Come up with idea for next story</li>\n</ul>\n<h2 id=\"addingquotes\">Adding quotes</h2>\n<p>When you want to pull out a particularly good excerpt in the middle of a piece, you can use <code>&gt;</code> at the beginning of a paragraph to turn it into a Blockquote. You might've seen this formatting before in email clients.</p>\n<blockquote>\n<p>A well placed quote guides a reader through a story, helping them to understand the most important points being made</p>\n</blockquote>\n<p>All themes handles blockquotes slightly differently. Sometimes they'll look better kept shorter, while other times you can quote fairly hefty amounts of text and get away with it. Generally, the safest option is to use blockquotes sparingly.</p>\n<h2 id=\"dividingthingsup\">Dividing things up</h2>\n<p>If you're writing a piece in parts and you just feel like you need to divide a couple of sections distinctly from each other, a horizontal rule might be just what you need. Dropping <code>---</code> on a new line will create a sleek divider, anywhere you want it.</p>\n<hr>\n<p>This should get you going with the vast majority of what you need to do in the editor, but if you're still curious about more advanced tips then check out the <a href=\"/advanced-markdown/\">Advanced Markdown Guide</a> - or if you'd rather learn about how Ghost taxononomies work, we've got a overview of <a href=\"/using-tags/\">how to use Ghost tags</a>.</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/writing.jpg",
        "published_at": "2018-08-08T07:39:18.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    },
    {
        "id": "5b6ac8516a8ae2a7e19822aa",
        "title": "Welcome to Ghost",
        "slug": "welcome",
        "html": "<div class=\"kg-card-markdown\"><p>Hey! Welcome to Ghost, it's great to have you :)</p>\n<p>We know that first impressions are important, so we've populated your new site with some initial <strong>Getting Started</strong> posts that will help you get familiar with everything in no time. This is the first one!</p>\n<h3 id=\"thereareafewthingsthatyoushouldknowupfront\">There are a few things that you should know up-front:</h3>\n<ol>\n<li>\n<p>Ghost is designed for ambitious, professional publishers who want to actively build a business around their content. That's who it works best for. If you're using Ghost for some other purpose, that's fine too - but it might not be the best choice for you.</p>\n</li>\n<li>\n<p>The entire platform can be modified and customized to suit your needs, which is very powerful, but doing so <strong>does</strong> require some knowledge of code. Ghost is not necessarily a good platform for beginners or people who just want a simple personal blog.</p>\n</li>\n<li>\n<p>For the best experience we recommend downloading the <a href=\"https://ghost.org/downloads/\">Ghost Desktop App</a> for your computer, which is the best way to access your Ghost site on a desktop device.</p>\n</li>\n</ol>\n<p>Ghost is made by an independent non-profit organisation called the Ghost Foundation. We are 100% self funded by revenue from our <a href=\"https://ghost.org/pricing\">Ghost(Pro)</a> service, and every penny we make is re-invested into funding further development of free, open source technology for modern journalism.</p>\n<p>The main thing you'll want to read about next is probably: <a href=\"/the-editor/\">the Ghost editor</a>.</p>\n<p>Once you're done reading, you can simply delete the default <strong>Ghost</strong> user from your team to remove all of these introductory posts!</p>\n</div>",
        "feature_image": "https://casper.ghost.org/v1.0.0/images/welcome.jpg",
        "published_at": "2018-08-08T07:39:19.000Z",
        "author": "Ghost",
        "tags": "Getting Started"
    }
];
