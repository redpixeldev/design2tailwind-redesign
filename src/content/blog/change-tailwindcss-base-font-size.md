---
site: "d2t"
publishing_date: "2022-08-23"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/wv6o61/how_to_change_the_tailwind_css_base_font_size/?"
category: "Tutorial"
description: "Learn how to customize the base font size in Tailwind CSS"
dev.to: "https://dev.to/vivgui/how-to-change-tailwind-css-base-font-size-o33"
permalink: "/blog/change-tailwindcss-base-font-size/"
hashnode: "https://vivgui.hashnode.dev/how-to-change-tailwind-css-base-font-size"
url: "https://redpixelthemes.com/blog/change-tailwindcss-base-font-size/"
keyword: "change tailwindcss base font size"
medium: "https://medium.com/@vivgui/how-to-change-tailwind-css-base-font-size-71fa43834ee5"
title: "How to change Tailwind CSS base font size?"
author: Vivian
---
If you have been using Tailwind CSS for a while, you probably know that it uses a lot of best practices and recommendations for modern HTML/CSS development. Things like having great reset styles, using CSS custom properties, etc.


But there’s one particular feature, that, depending on your workflow, you may want to change, and that’s the base font size.


## Tailwind CSS’ default base font size


The current Tailwind CSS base font size is 16px. Why 16px? Because this is the default font size of most popular browsers like Chrome.


Since a lot of Tailwind defaults use REM values, all these values will be multiplied by the base font size and that will get you the pixel values.


Based on this, if the `text-lg` class is `1.125rem`, in pixels, this turns out to be `16 * 1.125 = 18px`. This is exactly what you see in the class preview if you use the official VSCode extension.


![](/blog/images/b750b2a7-fc83-45a5-a3e2-67d9c935422e.webp)


## Here’s how to change it


If you want to change the Tailwind default font size, you can do in 2 ways:


### 1. Do it with custom CSS


By adding this rule to your CSS file:


```css
html {
  font-size: 10px;
}
```


### 2. Do it via a plugin


By adding this to your config file:


```javascript
const plugin = require('tailwindcss/plugin');

module.exports = {
  // other settings
  plugins: [
    plugin(function({ addBase }) {
     addBase({
        'html': { fontSize: "10px" },
      })
    }),
  ],
}
```


Now all the default REM values in Tailwind will be recalculated, using 10px as a base.


So now the `text-lg` class, will be `10 * 1.125 = 11.25px`.


That’s pretty much it! Now all your REM values will use a base of 10.


Here’s [a Tailwind Play link](https://play.tailwindcss.com/E0GNNrFUaJ?file=config) using the plugin approach, if you want to play around with it.


## One extra step if you use the VSCode extension


If you use the official extension for VSCode you may notice that the class preview shows the pixel values still using 16px as a base. To change this you need to add this to your VSCode config:


```json
// other vscode settings
"tailwindCSS.rootFontSize": 10 // <- your root font size here
```


Now the class preview will have the correct values:


![](/blog/images/1ee9fe14-558f-4677-bb26-ec3e822934d9.webp)


---


That’s it for this one! I hope you learned how to change the Tailwind CSS default base font size and how to make the VSCode extension reflect that change in its class preview.

