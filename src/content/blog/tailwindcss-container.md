---
site: "d2t"
publishing_date: "2022-04-03"
draft: "false"
reddit: "null"
category: "Tutorial"
description: "Learn how to customize the container component in Tailwind CSS"
dev.to: "https://dev.to/vivgui/how-to-customize-the-container-component-in-tailwind-css-5fdl"
permalink: "/blog/tailwindcss-container-component/"
hashnode: "https://vivgui.hashnode.dev/how-to-customize-the-container-component-in-tailwind-css"
url: "https://redpixelthemes.com/blog/tailwindcss-container-component/"
keyword: "tailwindcss container"
medium: "https://medium.com/@vivgui/how-to-customize-the-container-component-in-tailwind-css-17dd152a0032"
title: "How to customize the container component in Tailwind CSS "
author: Vivian
---
Containers are one of the most important layout tools that you’ll use when doing developing websites, they restrict your content to certain widths and usually vary by breakpoint, and every CSS framework worth its’s salt will have a container component. Thankfully for us, [Tailwind CSS is no exception](https://tailwindcss.com/docs/container).


## Basic customization


Tailwind gives us a couple of basic options for customization.


### Centering


You can make the container always centered horizontally by setting the **`center`** propriety to **`true`**, like this:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      center: true,
    },
  },
};
```


### Horizontal padding


You usually want some padding for your container, if not the content will hit the screen on certain screen sizes. Tailwind allows us to define universal padding like this:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      padding: "2rem",
    },
  },
};
```


You can also customize by screen size/breakpoint, like this:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
};
```


One note is that the **`sm`**, **`lg`**, etc you see in the code should be the same as what you have defined in your **`screens`** property.


So, for example, if you change the default **`screens`** to something like:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      mobile: "640px",
      tablet: "960px",
      desktop: "1280px",
    },
  },
};
```


Then the padding for your container should be like this:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        mobile: "2rem",
        tablet: "4rem",
        desktop: "5rem",
      },
    },
  },
};
```


## Using different values from `screens`


There are some cases where you might want to decouple the **`container`** breakpoints from the **`screens`** values, there are different ways to do this:


**Non-documented** **`container.screens`** **property**


The container’s code in Tailwind CSS actually calls a **`container.screens`**property before default back to the global **`screens`**, you can see the code [here](https://github.com/tailwindlabs/tailwindcss/blob/master/src/corePlugins.js#L307).


Based on this, and taking the Tailwind config example above, we could do something like:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      mobile: "640px",
      tablet: "960px",
      desktop: "1280px",
    },
    container: {
      screens: {
        mobile: "600px",
        tablet: "900px",
        desktop: "1200px",
      },
    },
  },
};
```


**Custom CSS**


You could also create your own custom **`container`** class if you need more flexibility:


```css
// your CSS file
@layer components {
  .container {
    @apply mobile:max-w-[600px] tablet:max-w-[900px] desktop:max-w-[1200px];
  }
}
```


## Disable the container on a specific breakpoint


Sometimes you want your content to break out of the container’s layout and become “liquid” or full width, for specific breakpoints. This is definitely possible with some handy classes.


Let’s say, for example, that you want your container on **`md`** to be fluid and go back to static on **`lg`** and above, you can do it the following way:


```html
<div class="container w-full md:max-w-none lg:container">
  <!-- content -->
</div>
```


We’re basically resetting the container’s **`max-width`** on **`md`** so it becomes full width and activating the container again on **`lg`**.


## Disable the container in older Tailwind CSS versions


In previous versions of Tailwind CSS, if you didn’t plan to use the container component you could just do:


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    container: false,
  },
};
```


And it would remove all the CSS related to the container.


But starting on v3 you don’t need to do this, since the container’s CSS will only be added if you use the **`container`** class in your markup.


---


That’s it for this one folks! I hope you feel more comfortable working with the **`container`** component in Tailwind CSS.

