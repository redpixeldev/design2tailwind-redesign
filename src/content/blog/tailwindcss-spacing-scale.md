---
site: "d2t"
publishing_date: "2022-05-12"
draft: "false"
reddit: "null"
category: "Tutorial"
description: "Learn how the Tailwind CSS spacing scale works and how to reuse it in other properties"
dev.to: "https://dev.to/vivgui/how-to-reuse-the-spacing-values-in-tailwindcss-pnk"
permalink: "/blog/tailwindcss-spacing-reuse/"
hashnode: "https://vivgui.hashnode.dev/how-to-reuse-the-spacing-values-in-tailwindcss"
url: "https://redpixelthemes.com/blog/tailwindcss-spacing-reuse/"
keyword: "tailwindcss spacing scale"
medium: "https://medium.com/@vivgui/how-to-reuse-the-spacing-values-in-tailwindcss-34352f65ba59"
title: "How to reuse the spacing values in Tailwind CSS"
author: Vivian
---
## How the Tailwind CSS space scale works


The tailwind scale uses a factor of 4. This means that it changes in increments of 4. To get the correct math for each new value you want to add you can use the following formulas:


**For pixel values:**


```bash
(valueInPixels / 16) * 4
```


**For rem values:**


```bash
(valueInRems * 16) / 4
```


To give you an example, if you have the pixel value of **`82`** and you want to convert that to the appropriate “Tailwind” value then you do **`80 / 16 * 4,`** and that gives you **`20`**. For rems values, let’s say you have **`32rem`** you do <strong>`32 * 16 / 4`</strong> which gives you **`128`**.


⭐  I use the pixel calculation formula so much that I created an [alfred workflow](https://www.alfredapp.com/workflows/) to do it for me and I decided to share it, you can download it [here](https://github.com/vivgui/alfred-tailwindcss-values). For those who don’t know, [Alfred](https://www.alfredapp.com/) is a Spotlight alternative and it’s Mac only. It’s free but if you want to use workflow you need to pay for the Powerpack.


## How to reuse it on other properties


For some properties, you might want to reuse your spacing scale instead of adding values manually, to do this you have to change that property to use a function that will allow you to use the **`theme()`** function inside your config, here’s an example:


```javascript
extended: {
	minHeight: ({ theme }) => ({ // get the theme func from the 1st arg
	    ...theme('spacing'), // adds all values of spacing to min-height
	      25: '6.25rem',
	}),
}
```


And you can do this for other properties like:


```javascript
extended: {
	// Max width
	maxWidth: ({ theme }) => ({
	    ...theme('spacing'),
	}),
	// Min width
	minWidth: ({ theme }) => ({
	    ...theme('spacing'),
	}),
}
```


## Here’s my bigger spacing scale


Now that you know how the spacing scale works and how to reuse it I also want to share my extended version of it, which I use on all my projects. This adds a lot of the missing values from the current official scale and also extends the values up to **`200`**.


```javascript
extend: {
	spacing: {
    "13": '3.25rem',
    "15": '3.75rem',
    "17": '4.25rem',
    "18": '4.5rem',
    "19": '4.75rem',
    "76": "19rem",
    "84": "21rem",
    "88": "22rem",
    "92": "23rem",
    "100": "25rem",
    "104": "26rem",
    "108": "27rem",
    "112": "28rem",
    "116": "29rem",
    "120": "30rem",
    "124": "31rem",
    "128": "32rem",
    "132": "33rem",
    "136": "34rem",
    "140": "35rem",
    "144": "36rem",
    "148": "37rem",
    "152": "38rem",
    "156": "39rem",
    "160": "40rem",
    "164": "41rem",
    "168": "42rem",
    "172": "43rem",
    "176": "44rem",
    "180": "45rem",
    "184": "46rem",
    "188": "47rem",
    "192": "48rem",
    "196": "49rem",
    "200": "50rem",
  },
}
```


---


That’s it for this one, I know it was short and sweet but I hope it helped you learn how the Tailwind scale works, how to add new values to it, and how to reuse it. Until the next one!

