---
site: "d2t"
publishing_date: "2022-06-22"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/vi361b/tutorial_how_to_add_custom_breakpoints_to/?"
category: "Tutorial"
description: "Learn how to add custom breakpoints to your project at any position."
dev.to: "https://dev.to/vivgui/how-to-add-custom-breakpoints-to-tailwindcss-4jfi"
permalink: "/blog/tailwindcss-breakpoints-custom/"
hashnode: "https://vivgui.hashnode.dev/how-to-add-custom-breakpoints-to-tailwindcss"
url: "https://redpixelthemes.com/blog/tailwindcss-breakpoints-custom/"
keyword: "tailwindcss breakpoints custom"
medium: "https://medium.com/@vivgui/how-to-add-custom-breakpoints-to-tailwindcss-8fe92b55ba01"
title: "How to add custom breakpoints to Tailwind CSS"
author: Vivian
---
Ok, so today we’re gonna talk about breakpoints.


Adam, the creator of Tailwind CSS, gave a [lot of thought](https://twitter.com/adamwathan/status/1461713742769672196) to the default breakpoint values of the framework. And we even had [a new one](https://twitter.com/adamwathan/status/1311001678246744068) added a while ago.


These breakpoints target the most common screen sizes, ranging from mobile to bigger desktop screens so people usually stick to the defaults.


What happens if you want to modify those defaults? That’s our topic today!


⭐ One thing to keep in mind is that the _order_ of the breakpoints _matters a lot_. The framework reads the order of the breakpoints and creates the necessary media queries and due to the nature of CSS (it's read from top to bottom like you probably know), the last breakpoint has more specificity than the first breakpoint.


That’s why in the defaults you see **`640px`** (sm) before **`1280px`** (xl).


With that said, here’s how to add your own breakpoints:


## Adding a lower breakpoint


```javascript
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    screens: {
      xs: "375px",
      ...defaultTheme.screens
    },
 }
}
```


Here we’re importing Tailwind’s default values to get the screen values and _spread_ them after our custom breakpoint **`xs`**.


Remember that the Tailwind config file is just a Javascript file so you can use your JS skills there too!


## Adding a bigger breakpoint


If you want to add a bigger breakpoint you have two ways.


### In the **`extended`** section


```javascript
module.exports = {
  theme: {
    extended: {
      screens: {
        '3xl': "1800px",
      },
    }
  }
}
```


Since we’re adding a bigger one we can just add it to the **`screens`** key in the **`extended`** section of the config.


### By overwriting the defaults


```javascript
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    screens: {
      ...defaultTheme.screens,
      '3xl': "1800px",
    },
  }
}
```


We can use the same method as adding a lower breakpoint but adding our bigger one as the last one.


## Adding a breakpoint somewhere in the middle


Ok, this one is tricky because remember, the _order_ of the breakpoints _matters a lot._ You can't just add one breakpoint at random, depending on the value you want to add you need to add it in a specific position, and since the **`screens`** property is an object, it's not as easy as adding it at a specific array index.


Now there are multiple ways to solve this. Remember when I said the tailwind config is a JS file so you can add logic to it? Well, that's what we’re going to do now.


Below is the code to add a breakpoint called **`foo`** with a value of **`960px`** before the **`lg`** breakpoint (which has a value of **`1024px`**):


```javascript
const defaultTheme = require("tailwindcss/defaultTheme");

const newScreens = Object.entries(defaultTheme.screens).reduce(
  (breakpoints, [label, value]) => {
    if (label == "lg") {
      breakpoints["foo"] = "960px";
    }
    breakpoints[label] = value;
    return breakpoints;
  },
  {}
);

module.exports = {
  theme: {
    screens: newScreens,
  },
};
```


We’re creating a new variable called **`newScreens`**, turning the screens object into an array and assigning it to the new variable, and then using the [reduce method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) to create a new screens object with our new breakpoint at the position we want (before the **`lg`** value).


Then, in the tailwind config, we just assign the **`screens`** property to use our new **`newScreens`** variable.


In the end, our **`screens`** property will be compiled to this:


```javascript
screens: {
  sm: '640px',
  md: '768px',
  foo: '960px', // our new breakpoint
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```


Feel free to reuse this snippet for your needs. Here’s a [Tailwind Play link](https://play.tailwindcss.com/K3i6m9ShXu?file=config) where you can see it in action and play around with it.


---


That’s it for this one! I hope you learned how to add custom breakpoints to your project at any position in your Tailwind config.

