---
site: "d2t"
publishing_date: "2022-05-24"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/uwz8ob/tutorial_how_to_work_with_background_images_in/"
category: "Tutorial"
description: "There are multiple ways to work with background images using Tailwind but I’ll show you the 3 most common (and recommended) ways to do it on your project."
dev.to: "https://dev.to/vivgui/how-to-work-with-background-images-in-tailwind-css-23fi"
permalink: "/blog/tailwindcss-background-image/"
hashnode: "https://vivgui.hashnode.dev/how-to-work-with-background-images-in-tailwind-css"
url: "https://redpixelthemes.com/blog/tailwindcss-background-image/"
keyword: "tailwindcss background image"
medium: "https://medium.com/@vivgui/how-to-work-with-background-images-in-tailwind-css-b961ea826667"
title: "How to work with background images in Tailwind CSS"
author: Vivian
---
There are multiple ways to work with background images using Tailwind but I’ll show you the 3 most common (and recommended) ways to do it on your project.


## Via the tailwind config:


Let’s start the old-fashioned way, by adding it to the tailwind config. This is great if you want to reuse the image in multiple places in your project.


I recommend you add it in the **`extend`** object of your config, like this:


```javascript
  extend: {
      backgroundImage: {
        'hero': "url('../public/images/hero.jpg')",
      },
  }
```


Then in your HTML you use it like this:


```html
<div class="bg-hero"></div>
```


## Via the `style` attribute:


If you prefer to skip the config then you can just add it using the **`style`** attribute, like this:


```html
<div style="background-image: url('../public/images/hero.jpg');"></div>
```


This is good if you plan to add more inline styles to your element or even perform some conditional logic with the image.


## Via using an arbitrary value:


Now in V3, you can do this fancy syntax too. If you prefer not to use inline styles and have a single-use image then this is the best approach.


```html
<div class="bg-[url('../public/images/hero.jpg')]"></div>
```


## But you’ll also need these properties


Following our example of a hero background image, once you have your image showing on your page then you’ll also want to:

- Make it not repeatable by using **`bg-no-repeat`**
- Have it use all the available space by adding **`bg-cover`**
- Positioning it in the center by using **`bg-center`**
- Possibly make it parallax with **`bg-fixed`**

Here’s the finished markup for you:


```html
<div class="bg-hero bg-no-repeat bg-cover bg-center bg-fixed"></div>
```


Here’s also a [Tailwind Play](https://play.tailwindcss.com/oT80ySVJ6f) example you can play around with.


## Disable/change the image in specific breakpoints


This is a pro tip for you, for example let’s say that you want to disable the background image in tablets and use a different image for desktop, this is where the arbitrary value approach really shines:


```html
<div
	class="
		bg-no-repeat bg-cover bg-center
		bg-[url('../public/images/hero-mobile.jpg')]
		md:bg-none
		xl:bg-[url('../public/images/hero-desktop.jpg')]
"></div>
```


---


That’s it for this one! I hope you learned the multiple ways to use background images with Tailwind CSS and how to use them on your project.

