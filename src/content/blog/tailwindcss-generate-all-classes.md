---
site: "d2t"
publishing_date: "2022-07-21"
draft: "false"
reddit: "https://www.reddit.com/r/tailwindcss/comments/w4p3ef/tutorial_how_to_generate_all_classes_in_tailwind/"
category: "Tutorial"
description: "How to generate all classes in Tailwind CSS"
dev.to: "https://dev.to/vivgui/how-to-generate-all-classes-in-tailwind-css-3a2b"
permalink: "/blog/tailwindcss-generate-all-classes/"
hashnode: "https://vivgui.hashnode.dev/how-to-generate-all-classes-in-tailwind-css"
url: "https://redpixelthemes.com/blog/tailwindcss-generate-all-classes/"
keyword: "tailwindcss generate all classes"
medium: "https://medium.com/@vivgui/how-to-generate-all-classes-in-tailwind-css-f42b7e5fde1f"
title: "How to generate all classes in Tailwind CSS"
author: Vivian
---
Back when we didn’t have the JIT engine in Tailwind, the framework had to generate all the classes on development and only eliminated the unused CSS on production. This is what we used to call _purging_.


These days we don’t need this anymore since the JIT engine outputs _exactly_ the CSS you need and nothing more.


But for some use cases, like not wanting to use a build process, you may want to generate ALL the classes in a single CSS file.


## Using `safelist`


To achieve that we have to look at the [**`safelist`**](https://tailwindcss.com/docs/content-configuration#safelisting-classes)[ option](https://tailwindcss.com/docs/content-configuration#safelisting-classes) in the docs, which takes in an array of classes you always want to always generate, even if they don’t exist in your markup.


Now, this wouldn't work out of the box for what we want, but the cool thing about **`safelist`** is that it also takes in a [Regular Expression](https://tailwindcss.com/docs/content-configuration#using-regular-expressions) (or Regex).


With that, we can use the following config and use a Regex that outputs ALL classes:


```javascript
// Tailwind Config
module.exports = {
  safelist: [
    {
      pattern: /./, // the "." means "everything"
    },
  ],
  theme: {}
}
```


I’m using a 14” Macbook Pro with the M1 Pro processor and when I tested this locally, it took \~2 minutes to compile and the resulting file was almost 7MB, pretty beefy if you ask me.


One thing to keep in mind is that this method doesn’t generate classes with variants (think **`lg:text-blue-500`** or **`hover:hidden`**). For that, you need to use the **`variants`** property, inside the **`safelist`** object.


The end result would be something like this:


```javascript
// Tailwind Config
module.exports = {
  safelist: [
    {
      pattern: /./,
      variants: ['md', 'lg', 'xl'], // you can add your variants here
    },
  ],
  theme: {}
}
```


The code above took a whopping 18 minutes to compile and the resulting file was almost 29MB so use it at your own risk 😅.


## Here’s an alternative


As you can see, using the CSS file with all the Tailwind classes might not be practical depending on what you want to do.


For the use case I mentioned at the beginning (not wanting to use a build process) a possible alternative would be to use the [Tailwind CDN](https://tailwindcss.com/docs/installation/play-cdn). You just drop in a **`script`** tag in your markup and start coding!  You can even configure settings for it via the **`tailwind.config`** object and also can add the official plugins like the **`typography`** and **`forms`** plugins.


---


That’s it for this one! I wanted to thank [StevenGFX](https://github.com/tailwindlabs/tailwindcss/discussions/6557) for the finished solution for this post and I hope you learned how to use the **`safelist`** property to generate all the Tailwind CSS classes you want. Also do take a look at the [CDN](https://tailwindcss.com/docs/installation/play-cdn) option if you just want to avoid using a build process and want to start coding right away.

