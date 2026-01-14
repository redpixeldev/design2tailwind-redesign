---
site: "d2t"
publishing_date: "2021-07-23"
draft: "false"
reddit: "null"
category: "Tutorial"
description: "Using custom fonts with tailwind is very straightforward, here’s how
you can do it."
dev.to: "https://dev.to/vivgui/how-to-use-custom-fonts-with-tailwindcss-3g77"
permalink: "/blog/use-custom-fonts-tailwindcss/"
hashnode: "https://vivgui.hashnode.dev/how-to-use-custom-fonts-with-tailwindcss"
url: "https://redpixelthemes.com/use-custom-fonts-tailwindcss/"
keyword: "tailwindcss fonts"
medium: "https://medium.com/@vivgui/how-to-use-custom-fonts-with-tailwindcss-25cf0f35631a"
title: "How to use custom fonts with Tailwind CSS"
author: Vivian
---
I see a lot of people with confusion on how to use custom fonts with Tailwind CSS since tailwind has a bit different approach to CSS in general, instead of multiple stylesheets you tend to have a Javascript file with all the config and very little custom css.


But trust me, using custom fonts with tailwind is very straightforward, here’s how you can do it:


## Using Google Fonts


Let’s say you want to use the [**`Open Sans`**](https://fonts.google.com/specimen/Open+Sans?query=open+sans)[ font](https://fonts.google.com/specimen/Open+Sans?query=open+sans) from Google Fonts as part of your project. For this example I’ll just use 2 styles, regular (400) and bold (700). I always use the **`<link>`** version which would give me the following snippet:


```html
<link rel="preconnect" href="<https://fonts.googleapis.com>">
<link rel="preconnect" href="<https://fonts.gstatic.com>" crossorigin>
<link href="<https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap>" rel="stylesheet">
```


I paste that into the **`<head>`** of my project and grab the css for the name of the font from Google fonts, in this case is **`font-family: 'Open Sans', sans-serif;`**


Then I switch to my tailwind config.


Now, the default tailwind config has some fonts already configured and I usually overwrite then but for this example I’ll put my code on the **`extend`** section of the config.


Here’s how you do it:


```javascript
module.exports = {
	theme: {
		extend: {
			fontFamily: {
          body: ['Open Sans', 'sans-serif'],
      },
		}
	}
}
```


Here you break down the CSS Google fonts gives you and convert it into an array of strings, so **`font-family: 'Open Sans', sans-serif;`** turns into **`['Open Sans', 'sans-serif']`**. Then you name that whatever you want in the config, I always use the nomenclature **`body`** for the body font and **`header`** for the header font but you can use whatever you want.


With this setup now you go into your HTML and whenever you want to use your font you just do **`font-{name you used in your tailwind config}`**, in the case it would be **`font-body`**.


There’s also a trick I use if I’m using a single font or a default font.


I go into my main CSS file and write this:


```css
html {
	@apply font-body;
}
```


This way you don’t have to keep repeating the font class over and over. Each element will inherit it from the HTML element.


You can use this same steps for fonts from typekit too, just grab the CDN, convert their font naming to an array and add it to your tailwind config. That’s it.


## Using your own font files


But what if you have font files instead of a CDN? The process changes a bit but its still pretty similar.


For our template [Elyssi](https://redpixelthemes.com/templates/elyssi/) we had this issue, here’s what we did: we created a **`fonts`** folder in our **`assets`** folder and put our files there. Then we switched to our CSS file and used the **`@font-face`** property, like this:


```css
@font-face {
  font-family: "hk_grotesk";
  src: url("/assets/fonts/hk-grotesk/hkgrotesk-bold-webfont.woff2") format("woff2"),
    url("/assets/fonts/hk-grotesk/hkgrotesk-bold-webfont.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "hk_grotesk";
  src: url("/assets/fonts/hk-grotesk/hkgrotesk-light-webfont.woff2") format("woff2"),
    url("/assets/fonts/hk-grotesk/hkgrotesk-light-webfont.woff") format("woff");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
```


Here we did a couple of things:

1. Defined a name in the **`font-family`** property, this is important and its the name we’ll use in our tailwind config later.
2. Added the path to the fonts in the **`src`** property. This will vary depending on your setup.
3. Clarified what font weight and font style works for what font files.
4. Added **`font-display: swap;`** for better font loading.

After we have this in our css file we switch to our tailwind config and add this:


```javascript
module.exports = {
	theme: {
		extend: {
			fontFamily: {
          hk: [ "hk_grotesk", "sans-serif" ],
      },
		}
	}
}
```


Now we use our font like **`font-hk`** and if we want to use the bold variant we just add **`font-hk font-bold`**. Here’s an example:


```html
<h1 class="font-hk font-bold">Hello world</h1>
```


An important note is the CDNs the font sites give you are basically giving you a CSS file with the **`@font-face`** already defined and also load the font files, for custom fonts we just have to do that bit manually, that’s the only difference.


I hope you found this post useful!

