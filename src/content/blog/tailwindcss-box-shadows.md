---
site: "d2t"
publishing_date: "2022-09-12"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/xfrrpx/how_to_use_box_shadows_with_tailwind_css/?"
category: "Tutorial"
description: "Learn how to use box shadows to add some flair to your designs."
dev.to: "https://dev.to/vivgui/how-to-use-box-shadows-with-tailwind-css-including-custom-and-arbitrary-values-41a1"
permalink: "/blog/tailwindcss-box-shadows-how-to/"
hashnode: "https://vivgui.hashnode.dev/how-to-use-box-shadows-with-tailwind-css-including-custom-and-arbitrary-values"
url: "https://redpixelthemes.com/blog/tailwindcss-box-shadows-how-to/"
keyword: "tailwindcss box shadows"
medium: "https://medium.com/@vivgui/how-to-use-box-shadows-with-tailwind-css-including-custom-and-arbitrary-values-6f2bfa26873b"
title: "How to use box shadows with Tailwind CSS, including custom and arbitrary values"
author: Vivian
---
## Intro


[Since they were introduced in 2009](https://www.w3.org/TR/2009/CR-css3-background-20091217/), shadows have been a great way to add some flair to any design. Shadows have evolved over the years and now they are incredibly flexible, even allowing for multiple shadows on a single element, similar to how the `background-image` property works.


### Prerequisites


The only prerequisite for this article is that you need to know how box shadows work in CSS. [Check out the MDN page for a refresher](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow).


As a quick recap, you apply shadows using the `box-shadow` CSS property and the property allows up to 5 values per shadow: x offset, y offset, blur-radius, spread-radius, and color. If you want to add multiple shadows just separate them with a comma.


## Using the default Tailwind CSS shadows


Tailwind CSS has a list of default shadows that we can use out of the box, ranging from small (`sm`) to really large shadows (`2xl`), here’s the list straight from the [framework](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L208-L217):


```javascript
boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
},
```


You use them using the following syntax: `shadow-[value]`.


For example:


```html
<div class="shadow"></div> // Default shadow, uses the "DEFAULT" value
<div class="shadow-2xl"></div> // Uses the "2xl" value
```


## Adding your custom values


If you want to add your own shadows to Tailwind CSS just add the `boxShadow` object to the `extend` property in the Tailwind CSS config and add your values there.


For example, if we wanted to add a shadow called `custom`, here’s how we would do it:


```javascript
// Tailwind CSS config
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        "custom": '0 50px 25px -24px rgb(0 0 0 / 0.3)'
      }
    },
  },
}
```


## Using arbitrary values in your markup


But what if you have a shadow that you only want to use in a single place in your project? That’s a good opportunity to use an arbitrary value.


Let’s say we want to use the custom shadow we create but as an arbitrary value, here’s how that would work:


```html
<div class="shadow-[0_50px_25px_-24px_rgb(0,0,0,0.3)]"></div>
```


Looks different, right? Let’s break this snippet down:

- Shadows need spaces between the values for them to work, but in the arbitrary value syntax, we can’t use spaces. Luckily there’s an alternative, we just need to replace the spaces with underscores (`_`).
- Next, for the shadow color: in the original shadow, we used the modern RGB syntax, which has no commas. But that syntax doesn’t work yet on arbitrary values, we need to switch back to the old syntax that uses commas and remove any spaces between the numbers.

### Using multiple shadows in arbitrary values


What if you want to use multiple shadows? Taking into account the points above, here’s how that would work:


```html
<div class="shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)]"></div>
```


It works the same way, we just need to add a comma (`,`) between the shadows.


---


That’s it for this one! I hope you learned how to use shadows with Tailwind CSS, how to add your own shadows as custom values, and how to use shadows as arbitrary values. Until the next one!


If you liked this article you might like these too:

- [How to work with background images in Tailwind CSS](https://redpixelthemes.com/blog/tailwindcss-background-image/)
- [3 Tips for working with the Tailwind Forms plugin](https://redpixelthemes.com/blog/tailwindcss-forms-tips/)
- [How to do gradient text with Tailwind CSS](https://redpixelthemes.com/blog/tailwindcss-gradient-text/)
