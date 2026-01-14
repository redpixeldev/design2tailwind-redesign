---
site: "d2t"
publishing_date: "2022-08-05"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/wguqdw/tutorial_how_to_hide_the_scrollbar_with_tailwind/"
category: "Tutorial"
description: "Learn how to hide scrollbars using Tailwind CSS and how arbitrary variants can help you create a more robust solution depending on your use case."
dev.to: "https://dev.to/vivgui/how-to-hide-the-scrollbar-with-tailwind-css-7lo"
permalink: "/blog/tailwindcss-hide-scrollbar/"
hashnode: "https://vivgui.hashnode.dev/how-to-hide-the-scrollbar-with-tailwind-css"
url: "https://redpixelthemes.com/blog/tailwindcss-hide-scrollbar/"
keyword: "tailwind css hide scrollbar"
medium: "https://medium.com/@vivgui/how-to-hide-the-scrollbar-with-tailwind-css-47a0974ab01"
title: "How to hide the scrollbar with Tailwind CSS"
author: Vivian
---
Scrollbars are visual indicators we’re all used to when browsing the web but for us developers, sometimes we just don’t want to show them.


Browser compatibility for hiding them has evolved a lot over the years but right now you need at least 2 CSS declarations to do it ([thanks StackOverflow](https://stackoverflow.com/questions/66416614/how-to-create-scrollable-element-in-tailwind-without-a-scrollbar)):


```css
/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
```


With this, you can now use the `.scrollbar-hide` class on an overflowing container to hide the scrollbar, here’s an example using Tailwind’s utility classes:


```html
<div class="flex whitespace-nowrap overflow-auto scrollbar-hide">
	<!-- overflowing content -->
</div>
```


But if you’re a tailwind lover, like me, instead of creating a custom CSS declaration you probably want a more tailwind-centric approach. Here’s where it gets interesting.


## There’s a plugin for that


Well, there are actually 2, but both do the same thing:

1. [https://github.com/reslear/tailwind-scrollbar-hide](https://github.com/reslear/tailwind-scrollbar-hide)
2. [https://github.com/redwebcreation/tailwindcss-no-scrollbar](https://github.com/redwebcreation/tailwindcss-no-scrollbar)

I like the first one better because it has better docs and examples but you can pick whichever you prefer.


Using our previous example and plugin #1, here's how it would work:


### Install the plugin


On your terminal


```bash
npm install tailwind-scrollbar-hide
# or
yarn add tailwind-scrollbar-hide
```


Then on your `tailwind.config.js`, you add the package on your `plugins` array:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwind-scrollbar-hide')
    // ...
  ]
}
```


Now you can use the `scrollbar-hide` class, without writing any custom CSS 😄.


Sounds easy enough, right?


## There’s one catch


This CSS solution is optimal but there’s actually one big issue, in WebKit-based browsers (Chrome, Safari, and Opera) _you cannot override the class, you can only remove it_. Let me explain:


Using our original example, let’s say you want to _show_ the scrollbar, on bigger breakpoints, like this:


```html
<div class="flex whitespace-nowrap overflow-auto scrollbar-hide md:scrollbar-default">
	<!-- overflowing content -->
</div>
```


⭐ Remember that the `scrollbar-hide` and `scrollbar-default` classes come from the plugin, these classes don’t exist on Tailwind itself.


This doesn’t work in Chrome and Safari, and it's not the plugin’s fault, it’s how the scrollbar works in WebKit browsers, mainly this:


```text
::-webkit-scrollbar cannot be simply overridden to get the default style, the only way to do it is to remove all ::-webkit-scrollbar rules from the code.
```


This is an issue [documented](https://github.com/reslear/tailwind-scrollbar-hide/issues/19#issuecomment-1086949110) by the plugin’s author and his recommendation is to change the breakpoint to be desktop-first instead of mobile-first or remove the class with Javascript.


Here’s how to do the first recommendation, in the tailwind config:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      md: { max: '767px' },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
```


Now, I know this does the job but I find it a bit excessive since you’re changing the behavior of a very common breakpoint and you’re probably only using that class in a handful of places.


After doing some research I found we can also use the new arbitrary variant feature for this!


⭐ Keep in mind you have to be using Tailwind CSS’ 3.1 version or higher for this to work.


Going back again to our original example, we can modify it by using an arbitrary variant like this:


```html
<div class="flex whitespace-nowrap overflow-auto
	[@media(max-width:767px)]:scrollbar-hide"> <!-- I put it on its own line to make it clearer -->
	<!-- overflowing content -->
</div>
```


Check this [Tailwind Play link](https://play.tailwindcss.com/69WLrubBDn?size=640x720) for a demo. And check [this](https://tailwindcss.com/blog/tailwindcss-v3-1#arbitrary-values-but-for-variants) to learn more about arbitrary variants.


---


That’s it for this one! I hope you learned how to hide scrollbars using Tailwind CSS and how arbitrary variants can help you create a more robust solution depending on your use case.

