---
path: "/writing/working-without-internet"
date: "2019-11-24"
updated: "2019-11-26"
title: "Working without Internet"
commentary: false
attract: "9/10 WiFi access points suck."
---
**This is a work in progress article.  You can contribute to its completion via GitHub (see commit ID in the footer.)**

I've been travelling around the UK over the past week without Internet and I had (a lot) of time to reflect upon this working style: GTD with no Internet access.  If you have a computer with a reasonable amount of space or some sort of mini computer like the Raspberry Pi connected to a large external hard drive, you can follow this guide to set up a travel optimised working environment.

TLDR;
* Download what you need ahead of time without prejudice.
* Build a portable and reproducible development environment.  Even better if pushing a Git repository once you have Internet access is all you need to do to push to production.
* Empower yourself to do offline analysis of logs and data with Jupyter and local databases.

# Prerequisites
## Computer
To get started, you'll need a computer that can either run multiple virtualised environments or containers in parallel.  Any modern CPU that can run at around 1.8 to 2.2 GHz under sustained load, has at least four cores, and supports virtualised extensions such as VT-x should be more than capable.  In addition, you'll need about 12 to 16GBs of RAM.  Having more might be helpful but we'll focus on keeping that battery running cool and for a long time.

Another alternative is a Raspberry Pi Zero [in this sweet case](https://thepihut.com/products/official-raspberry-pi-zero-case).  Make sure you use a well-endowed power supply and an SD card with built-in wear levelling like the [Sandisk Extreme](https://www.sandisk.co.uk/home/memory-cards/sd-cards/extremeplus-sd-uhs-i).

## Storage
You should have around 512GB or more of storage you can take with you.  For most people this will be an external hard drive but some laptops are now shipping with multi-terabyte configurations.  These storage destinations will house your data dumps, virtual machines, and repository mirrors.

## Operating System
You can use Windows with WSL2 + Docker/LXC; Mac OS with a Raspberry Pi or Docker (shudders); or Linux with Linux containers or Docker.  On Mac OS, I'd recommend you shell out for a decent virtualisation UX like VMWare Fusion.  I don't have much experience with VirtualBox on Mac.

# Downloads
You'll be downloading a lot of things so spend some time to think about your data management.  You can set up a separate partition or volume to store this data and use a different filesystem the optimises for fast reads.

# Reading
After all that work, you may want to curl up with a book.  Whether you're using an e-book reader or printed copies, you can find a lot of items to read on [Project Gutenberg](https://www.gutenberg.org).

# Server
Most of these services are served over HTTP so you'll need to have a web server handy.  Anything basic will do - be it Apache, Nginx, or even node.js.  For more advanced installations like MediaWiki, you'll need PHP support so for convenience and ease of maintenance it'll be best to use Apache + PHP.

## Maps
Offline maps are useful for trip planning and routing.  For most cases, it'll be enough to just download some form of Open Street Maps on your phone.  In this case, we're going to set up OSM for trip planning on your device.

## Wikipedia
### Quick setup
To quickly get set up without worrying about database dumps, just grab the latest [Kiwix distribution](https://en.wikipedia.org/wiki/Kiwix) for your operating system.  You get the added benefit of enabling different Wikimedia projects such as Wikitionary.

### Database dumps
Begin by downloading Wikipedia.  It's easier than you might think.  You can grab a multistream archive [from here](https://en.wikipedia.org/wiki/Wikipedia:Database_download).  Pick the language that you think has the articles you'll read most frequently.  Multistream enables you to access specific articles without having to decompress the entire archive.  If space isn't an issue, then grab the normal archive; I imagine the multistream archive requires more CPU to process.

If you work a rapidly emerging field like IT, then I'd recommend you download a recent database dump.  If you prefer well-written and vetted articles, then you can get the download released by the [WikiMedia Foundation every six months](https://archive.org/details/enwiki-20180320).

[This page](https://meta.wikimedia.org/wiki/Data_dump_torrents#English_Wikipedia) contains BitTorrent links for English Wikipedia.  If you can't or prefer not to use torrents, then you can look at the list of mirrors [here](https://dumps.wikimedia.org/mirrors.html) and grab a compressed XML dump.

For multistream, make sure you download the xml.bz2 and index files.  Also grab the SHA1 checksums so you can check for errors.  Finally, to avoid getting banned, only download one file using one connection at a time **at any time**; otherwise you may be forced to use an out-of-date mirror.

#### Media database dump
In addition to the database dump, you'll need the 

### MediaWiki front-end
To view the articles you'll need a front-end - MediaWiki is the natural choice and you'll need a LAMP stack to serve it.  We'll set that up later.

## Debian mirror 
If you use Linux, you'll probably need a package mirror available offline should you decide to install some software.  Download the entire Debian amd64 architecture package mirror is about 402GB compiled and 91GB for the source.  You'll get more than a 4x speed up using pre-compiled packages so it's worth downloading the entire repository over the course of a few days.  To augment your installation, it likely makes sense to grab the Debian wiki as well -- something we'll address in the Searx section.  

## Searx
If you know you're going to be gone for a while, it makes sense to set up some background tasks to search for relevant keywords and fetch the pages such as StackOverflow for later perusal.

## Jupyter notebooks
Think about your web habits.  How often do you turn to the web to complete a quick calculation?  Maybe you type your query directly in Google or maybe you head over to Wolfram Alpha to solve some equations.  Jupyter can help here.  It is an open source web application that lets you create a realtime workbook of equations.  Think about lab reports, but interactive.

I've found it invaluable to generate charts, write perfect looking equations, and just get work done.

In this section, we'll set up a base Jupyter instance.  If you search the web you'll [find many others](https://github.com/cantaro86/Financial-Models-Numerical-Methods).

https://jupyter.org/

## Git
I'm sure you've went on GitHub and clicked "download raw file".  While this is completely find for one-off never-use-again repositories, if you find yourself going repeatedly visiting a repository, go ahead and ween yourself off the web interface and clone the repository locally.

## Notes
How do you take notes?  I personally have used a mixture of OneNote, TiddlyWiki, and other solutions in the past.  I'm spoiled by syncing and have found it a boon to my productivity.  However, modern versions of some of these tools, like OneNote, work best with a constant web connection.  A good alternative is to set up an offline MediaWiki instance.