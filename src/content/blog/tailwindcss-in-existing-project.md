---
site: "d2t"
publishing_date: "2022-07-07"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/vtq9rm/tutorial_how_to_add_tailwind_css_to_an_existing/?"
category: "Tutorial"
description: "Learn how to use Tailwind CSS in an existing project and avoid conflicts with your pre-existing styles."
dev.to: "https://dev.to/vivgui/how-to-add-tailwind-css-to-an-existing-project-3cm1"
permalink: "/blog/tailwindcss-in-existing-project/"
hashnode: "https://vivgui.hashnode.dev/how-to-add-tailwind-css-to-an-existing-project"
url: "https://redpixelthemes.com/blog/tailwindcss-in-existing-project/"
keyword: "tailwindcss-in-existing-project"
medium: "https://medium.com/@vivgui/how-to-add-tailwind-css-to-an-existing-project-a73f982199"
title: "How to add Tailwind CSS to an existing project"
author: Vivian
---
As a freelance developer, I usually like starting my projects from scratch, that way I have more control over every aspect of the project and can adapt it to my technical preferences.


But sometimes I get projects that are already built and the client just wants a few improvements. When a project like that comes along, it’s usually already using a combination of a CSS framework plus some custom styles.


The thing is, I love Tailwind CSS so much that I want to use it on all my projects, even existing ones, but sometimes Tailwind styles and classes can conflict with a project’s existing CSS styles.


Here’s what I do to get around that issue.


## Here’s how to make Tailwind CSS work with pre-existing styles


### First thing you should do


Add this to the top level of your Tailwind config:


```javascript
module.exports = {
 corePlugins: {
     preflight: false,
 },
}
```


That configuration removes all the [base styles Tailwind uses](https://github.com/tailwindlabs/tailwindcss/blob/master/src/css/preflight.css) to “reset” all elements so its easier to style them with utility classes. While this works great for new projects, these base styles will probably conflict with you’re project styles and you almost definitely want to turn them off.


One caveat of this is that, whenever you add a border using Tailwind classes, you’ll want to reset the borders to 0 and add the border style class as well.


So if you have this:


```html
<div class="border-b border-gray-300"></div>
```


You’ll want to make it like this:


```html
<div class="border-0 border-b border-gray-300 border-solid"></div>
```


This is because Tailwind’s base styles add **`border-style: solid`** and **`border-width: 0`** to [all elements](https://github.com/tailwindlabs/tailwindcss/blob/master/src/css/preflight.css#L10-L11), so you rarely have to add your own **`border-style`** classes unless you want to change the default (which is **`solid`**) and if you want to add a border in a specific side you need to first reset the border-width (with **`border-0`**) and then add your border side class (**`border-b`** in this case).


Next is making sure Tailwind classes don’t conflict with your existing CSS, by:


### Using the prefix feature


The creators of Tailwind CSS already thought of this scenario and they enabled a prefix feature, with this you can define a string that will prefix ALL Tailwind’s classes.


So if you add the common prefix to your config:


```javascript
module.exports = {
  prefix: 'tw-',
}
```


Then the code from our example above would be:


```html
<div class="tw-border tw-border-gray-300 tw-border-solid"></div>
```


### Adding a parent class


Usually, the prefix feature is enough but sometimes you want tailwind classes to only work inside a specific “scope”, like a specific page or a specific section of your site.


For that, you can also add a prefix selector or “parent class” to all your Tailwind CSS classes.


We can use a PostCSS plugin called **`postcss-prefix-selector`** to achieve this (kudos to [jovisjoseph](https://github.com/tailwindlabs/tailwindcss/discussions/2446#discussioncomment-2364670) for the idea!).


You first have to install it


```bash
npm install postcss-prefix-selector
// or
yarn add postcss-prefix-selector
```


Then in your **`postcss.config.js`**, you define your preferred parent class like this:


```javascript
module.exports = {
 plugins: [
  require('tailwindcss/nesting'),
  require('tailwindcss'),
  require("postcss-prefix-selector")({
   prefix: '.parent-class', // you can change this whatever you want
  }),
}
```


Now our example will work like this:


```html
<div class="parent-class">
 <div class="tw-border tw-border-gray-300 tw-border-solid"></div>
</div>
```


---


That’s it for this one! I hope you learned how to use Tailwind CSS in an existing project and avoid conflicts with your pre-existing styles.

