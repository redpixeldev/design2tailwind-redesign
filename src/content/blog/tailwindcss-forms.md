---
site: "d2t"
publishing_date: "2022-04-25"
draft: "false"
reddit: "null"
category: "Tutorial"
description: "Here's the 3 most important tips you need to know for working with the Tailwind CSS forms plugin"
dev.to: "https://dev.to/vivgui/3-tips-for-working-with-the-tailwind-forms-plugin-23n1"
permalink: "/blog/tailwindcss-forms-tips/"
hashnode: "https://vivgui.hashnode.dev/3-tips-for-working-with-the-tailwind-forms-plugin"
url: "https://redpixelthemes.com/blog/tailwindcss-forms-tips/"
keyword: "tailwindcss forms"
medium: "https://medium.com/@vivgui/3-tips-for-working-with-the-tailwind-forms-plugin-18e8d7f6b865"
title: "3 Tips for working with the Tailwind Forms plugin"
author: Vivian
---
## Tip #1: Change the default icons’ color to your brand


One of the first things I usually do when working with the forms plugins is to change the color of the icons for certain inputs to use my brand colors. Unfortunately, these icons are hardcoded into the plugin’s code so we can’t use utility classes to style them.


What we can do, however, is _overwrite them._


Let’ say for example you want to change the color of the SVG icon used in the select input, if you open up the inspector and check the select’s CSS you’ll see this:


![](/blog/images/f4eac6b8-0c1e-4ea1-ad91-f4eff1738714.webp)


Do you see that string that starts with **`data:image/svg`**? That’s the SVG code but _encoded_ to be used in the CSS.


You see, you technically cannot use SVG code inside the **`background-image`** CSS property, because that property expects an URL or path to a file, not the _contents_ of the file. But if we encode it like an URL then we can use the encoded code there.


But what if you want to decode the SVG code, edit the color and then encode it again?


This is where this tool comes in. “[URL-encoder for SVG](https://yoksel.github.io/url-encoder/)”, it’s a pretty generic name, I know, but it does exactly what we need. Now you just have to grab the **`data:image/svg`** string from the inspector and paste it onto the “Take encoded” text box on the tool. Be sure to remove the “**`url(`**" bit from the string or it won't work.


The tool will automatically update and you’ll see that the other 2 textboxes ("Insert SVG” and “Ready for CSS”) will have code in them.


![](/blog/images/99528c5c-1868-4b0c-855f-534cf70fbef4.webp)


Let’s break down those two.


On the “Insert SVG” the encoded SVG code you pasted will be decoded into proper SVG code. Now here is where you’ll make the edits you want. In the code you’ll see this snippet **`stroke='#6b7280'`**, this is where you can change the color to another HEX color value.


Once you change it, that’s where the other text box comes in. In the “Ready for CSS” section you’ll see the newly edited SVG code encoded to be used in your CSS.


For example if you want to change the color to black, you’ll end up with this code:


```css
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
```


Now you can create a custom class for that in your styles and use it for your selects.


```css
.form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}
```


That’s it! Now you’ll have a select element with a custom colored SVG icon. And that’s not all, you can do this exact same process with checkboxes and radio inputs so you can have your form inputs entirely on brand 😃


## Tip #2: Don’t forget to style your placeholders


In the past, styling placeholders was kind of finicky and involved a lot of custom CSS and vendor prefixes so not a lot of devs did more than just the usual which is just changing the color to a lighter shade than the form’s value color.


That’s nice and good but I think we can make it look even better.


We can turn this:


![](/blog/images/a42131f7-148b-4ab1-a31b-8bd6289b8a1e.webp)


Into this:


![](/blog/images/35580eb6-80b1-4a4d-be8f-0aec2e63e7fa.webp)


Very subtle, I know, but I think it makes the placeholder a lot more differentiated from the actual input value.


Here we made the placeholder italic, decreased the font weight, and added a little bit of padding to the left side, all without a single line of custom CSS code.


Here’s the snippet:


```html
<input type="email" class="placeholder:italic placeholder:font-light placeholder:pl-1 mt-1 block w-full " placeholder="john@example.com" />
```


## Tip #3: Overwrite default styles at the global level


Sometimes you work with big or third-party forms and don’t want to have to style every single element.


The usual way to solve this would be to just write a custom class with all your changes and use it on your element.


Something like this:


```css
.form-input {
    @apply placeholder:italic placeholder:font-light placeholder:pl-1 border-0 border-b border-blue-500;
}
```


But what happens if you don’t want to deal with classes and just want to add your own default styles.


This is completely possible but it’s a bit involved and needs custom CSS.


Similar to what we did with tip #1 where we overwrite the plugin’s default CSS with our own. We can do the same if we want to add global styles.


Something like this:


```css
[type='text'],
[type='email'],
[type='url'],
[type='password'],
[type='number'],
[type='date'],
[type='datetime-local'],
[type='month'],
[type='search'],
[type='tel'],
[type='time'],
[type='week'],
[multiple],
textarea,
select {
  @apply placeholder:pl-1 placeholder:font-light placeholder:italic;
}
```


Not the prettiest, I admit, but it's very powerful if you, for example, have a design with very custom styles that deviate a lot from the plugin’s defaults.


---


That’s it for this one, I hope you learned a few things about working with the forms plugin and taking it to the next level with your own styles.

