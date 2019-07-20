# Auto-MASH

* Yall know the game of MASH? Well I didn't until like a few days ago. But that didn't stop me from making a webapp for it. Generally, you create categories, each with options that can be selected from. Then you start drawing a spiral and ask someone to tell you to stop. When you do, draw a line from where you left off, and through the center of the circle. The amount of intersections on the line will be your MASH number. Then iterating through the options in increments of that number, you check off options until there's only one left per section.

> [This website tells you how to play IRL](https://mashplus.com/how-to-play-mash/)

* But we don't actually want to do this on paper! We need an overly complicated webapp that can do it for us, and that's exactly what I have created.


## How to Use
* At the top you'll see a bunch of buttons
> `🡼` - downloads a JSON of your current configuartion
> `䷥` - allows you top upload a JSON
> `❰` - makes the page smaller
> `❱` - makes the page bigger
> `▶` - starts the MASH spiral
> `☀` - changes color theme
> `+` - adds a section

* Sections will have a `+` in the top right corner to add an option for that section.
* In the left corner will be a `-` that deletes the section.
* Options will have a `-` that deletes them.
* Click on a section or option to name it.

## Running
* Make sure that you have at least one section, and at least two options for each section. Also that each section and option are named.

## V1.0.5
> `bugfixes`
* Page didn't extend down far enough
* Loading the same JSON twice would do nothing
* Some color theme values were not being applied
* You could save a blank MASH
* Short strings weren't being decorated correctly
> `features`
* New animated squiggles

## V1.0.8
> `bugfixes`
* Squiggles weren't getting reset
> `changes`
* Spiral stays up for longer
* Added icon and html title to this project

## Proposed Features
* SVG icons
* Mobile mode
* Exit out of spiral
* Make it safari compatible
* custom color theme json load/save
* Page title as part of the MASH
* Spiral counts points to you