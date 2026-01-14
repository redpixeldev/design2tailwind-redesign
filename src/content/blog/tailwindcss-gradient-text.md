---
site: "d2t"
publishing_date: "2022-08-29"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/x1lae8/tutorial_how_to_do_gradient_text_with_tailwind_css/"
category: "Tutorial"
description: "In Tailwind CSS v3, gradient text has become a lot easier, here’s how
to do it."
dev.to: "https://dev.to/vivgui/how-to-do-gradient-text-with-tailwind-css-ck1"
permalink: "/blog/tailwindcss-gradient-text/"
hashnode: "https://vivgui.hashnode.dev/how-to-do-gradient-text-with-tailwind-css"
url: "https://redpixelthemes.com/blog/tailwindcss-gradient-text/"
keyword: "tailwindcss gradient text"
medium: "https://medium.com/@vivgui/how-to-do-gradient-text-with-tailwind-css-c281c019202d"
title: "How to do gradient text with Tailwind CSS"
author: Vivian
---
In Tailwind CSS v3, gradient text has become a lot easier, here’s how to do it.


## Step 1: Add your gradient styles


```html
<h1 class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400">
	hello world
</h1>
```


Here are [the official docs](https://tailwindcss.com/docs/gradient-color-stops) on how to work with gradients in Tailwind but to break it down:

- `bg-gradient-to-r` creates the gradient and makes it from left to right
- `from-blue-600` sets our starting color, which will go on the left
- `via-green-500` sets our middle color, which is optional
- `to-indigo-400` sets our ending color, which will go on the right and can be optional if you want the end to be transparent

You can change these values to whatever suit your use case but this is the most common structure for working with gradients in Tailwind CSS


![](/blog/images/881d674e-1cb5-41e9-85b2-a418894f5cdd.webp)


### Optional but recommended


At this point, you may have noticed an issue with your code: if your text is short enough and you resize your window to a lower width, the text will move over the gradient colors.


![](/blog/images/eb2d141e-e03d-4a40-87ec-21f2198e9768.webp)


This will cause an issue when you have the finished gradient text code. When you resize your window, the gradient colors in your text will change.


This is because the gradient we created takes up the full width of the element instead of the width of the text.


![](/blog/images/27354ce5-3944-4141-855f-0ebf04d2fc18.webp)


To fix this, all we need to do is add the `inline-block` class to our element.


```html
<h1 class="... inline-block">
	hello world
</h1>
```


Now, the gradient takes up _only_ the width of the text, instead of the width of the parent element.


![](/blog/images/5b26d0e0-1b06-498a-bb55-c9d34f24b923.webp)


Problem solved! Now, let’s move on to the next step.


## Step 2: Make your text transparent


Make your text transparent using the `text-transparent` class.


```html
<h1 class="... text-transparent">
	hello world
</h1>
```


The text will disappear but don’t worry, we’ll fix that in the next step.


## Step 3: Clip the text to the background


This is the most important thing for making gradient text, it uses the [background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip) CSS property, which has multiple values and one of them is `text`, to use that specific property and value in Tailwind CSS we just need to add the `bg-clip-text` class.


```html
<h1 class="... bg-clip-text">
	hello world
</h1>
```


![](/blog/images/7bca0c11-620e-4ba1-a16a-65535dcbc7b2.webp)


That’s it! We now have our gradient text 🥳


Putting it all together you get this snippet:


```html
<h1 class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">hello world</h1>
```


Here’s the [Tailwind Play link](https://play.tailwindcss.com/IYwLw0SZSa) if you want to play around with it.


---


That’s it for this one! I hope you learned how to make gradient text with Tailwind CSS and how to take into account how the width of the text changes the gradient colors and how to fix it.

