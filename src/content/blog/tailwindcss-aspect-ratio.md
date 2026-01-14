---
site: "d2t"
publishing_date: "2021-11-05"
draft: "false"
reddit: "null"
category: "Tutorial"
description: "Learn what aspect ratio is and how you can use the official @tailwindcss/aspect-ratio plugin in your code"
dev.to: "https://dev.to/vivgui/how-to-use-the-tailwindcss-aspect-ratio-plugin-5gd8"
permalink: "/blog/use-aspect-ratio-plugin-tailwindcss/"
hashnode: "https://vivgui.hashnode.dev/how-to-use-the-tailwindcss-aspect-ratio-plugin"
url: "https://redpixelthemes.com/use-aspect-ratio-plugin-tailwindcss/"
keyword: "tailwindcss aspect ratio"
medium: "https://medium.com/@vivgui/how-to-use-the-tailwindcss-aspect-ratio-plugin-6391cec1aad7"
title: "How to use the Tailwind CSS Aspect Ratio plugin"
author: Vivian
---
## What is aspect ratio


You probably heard these 2 words a lot when working with images or videos but probably don't know the definition, if that's the case then I'll fix that for you right now:


> "The **aspect ratio** of an image is the ratio of its width to its height. It is commonly expressed as two numbers separated by a colon, as in 16:9."


Thanks, [Wikipedia](https://en.wikipedia.org/wiki/Aspect_ratio_(image))!


Now, why is this important?


When you work with images, you have the ability to change its width and height with CSS and even with its native attributes (**`width="" height=""`**) but making those images responsive for _all_ screen sizes would take a lot of CSS or classes, in the case Tailwind CSS.


You can fix that problem by using aspect ratio. Why? Because when you use aspect ratio, you essentially make the image have the same proportions _no matter the screen size,_ the image will automatically scale based on available space.


## Most common aspect ratios for the web


Ok, now you know what aspect ratio is, so let's talk about the most common ones:

- [16:9](https://en.wikipedia.org/wiki/16:9_aspect_ratio) is the most common one, also called "widescreen" and it's used by computer monitors, TV's, etc. This is also the most common format for videos in general.
- There's 16:10 which is used by Macbook Pros.
- Older TV's and video games have an aspect ratio of 4:3, that's why if you play a video game on a newer screen you'll see black bars on the sides, this is because the video game and your screen have different aspect ratios.
- Ultrawide monitors use aspect ratios like 21:9 and 32:9 which are variations of the 16:9, just making the screen width longer.
- For images, you generally have varying aspect ratios, it all depends on how you want the image to look, but for an image that's supposed to take the whole width of the screen then 16:9 would work.

## How to use TailwindCSS' Aspect Ratio plugin


Let's see how we can use aspect ratio in our code.


Luckily for us, the Tailwind Labs team created [a plugin](https://github.com/tailwindlabs/tailwindcss-aspect-ratio) specifically for using aspect ratios. You can install by:

- Running this command on your terminal

```bash
npm install @tailwindcss/aspect-ratio
```

- Then add it to your tailwind config:

```javascript
plugins: [
	require('@tailwindcss/aspect-ratio'),
],
```


The plugin comes with some default values so we can use it out of the box.


Now, let's say we want to add a video embed to our site and we want it to be 16:9, here's the code for that:


```html
<div class="aspect-w-16 aspect-h-9">
	<iframe ...>
</div>
```


Now, you may ask, why did I put the aspect ratio code on the parent element instead of the element I want to target? That's because of how the plugin works.


You see, [until recently](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio), we didn't have a native way of using aspect ratio in CSS so we had to use a hack that involved padding in % values and position absolute. Pretty weird hack I know, but the good thing about its that it works on all browsers. If you want to dig deep into it you can see the plugin's CSS output [here](https://github.com/tailwindlabs/tailwindcss-aspect-ratio/blob/master/src/index.js#L3-L16).


Let me give you more examples.


Here's the code for a square image:


```html
<div class="aspect-w-1 aspect-h-1">
	<img ...>
</div>
```


And here's one for the older TV's:


```html
<div class="aspect-w-4 aspect-h-3">
	<img ...>
</div>
```


Pretty straightforward, you basically take the first digit and add it to **`aspect-w`** and your second digit and add it to **`aspect-h`**.


## How to add your own aspect ratios to TailwindCSS' config


Now know how to use the plugin but what if we want to _customize it_, the plugin only has values from 1 to 16 and if we want to use, lets say, an ultrawide aspect ratio, we would need to add it the tailwind config, it would be something like this:


```javascript
module.exports = {
  theme: {
		extend: {
			aspectRatio: {
				21: '21',
				32: '32'
			}
		}
	}
}
```


Now you can do:


```javascript
<div class="aspect-w-32 aspect-h-9">
	<img ...>
</div>
```


That's it for this post, now you know what aspect ratio is, what are the most common ones, how you can use it in your code with the Aspect Ratio plugin, and how you can add values to the plugin.


Stay tuned for more articles like this coming soon!

