---
path: "/writing/bring-on-2020"
date: "2019-12-31"
title: "Here comes 2020!"
commentary: false
attract: "My thoughts for the next decade, 2020."
---

Wow, what a year it has been.  If you're reading this, it means I've
successfully completed my first New Year's Resolution of self-hosting this
website.  It is now live on a VPS at [Hetzner](https://hetzner.com) complete
with a HTTPS certificate signed by [Let's Encrypt](https://letsencrypt.org).

The journey to self-hosting this blog took longer than anticipated because I
spent a lot of time creating a reproducible setup.  This means I can recreate
the plkt.io deployment on my local machine for testing and have that same
configuration be pushed on "production" aka this web server.

To achieve this, I hand-crafted a series of incremental Dockerfiles that build
the container serving this page.  I learned alot about setting up infrastructure
via code and having single application containers work well.  There's still
quite a bit left to do so I consider this Phase I of my new website deployment.

In Phase II, I'll be moving from a simple `docker run` set up to something more
glamorous *ahem* I mean modern.  While I don't get much traffic to this site
today, I do plan to expose more services here, with the next in line being a
self-hosted git repo at [git.plkt.io](git.plkt.io).  This page will serve as the
authoritive clone of the repo serving the site.  Kubernetes will be brought in
incrementally over the course of a few months as I standardise how I roll out
services on plkt.io.

In Phase III, running concurrently with Phase II, I'll be migrating from this
static website built with [GatsbyJS](https://gatsbyjs.org) to one served with
Wordpress.  While some might think this a step backwards because it's not as
modern, I think having a slower moving platform to host my thoughts is
ultimately easier to maintain.  I'll be migrating the entirety of my blog posts
over and likely be breaking some URLs in the process.  That's fine though as
most of my traffic comes from search engines.  If you did bookmark a page and it
no longer works, try the search functionality on Google
[here](https://www.google.com/search?hl=en&q=site%3Aplkt.io%20%24SEARCH_TERM) or
via Wordpress if this site has already been migrated.

Phase IV is where this site really starts to become interesting.  I'll
be publishing a blog roll of my favourite blogs via an RSS feed and also putting
the snippets live on my site.  I think long term we need to move away from
having search engines be arbiters of knowledge discovery and let recommendations
be served directly from the content creators.  More to come in this space!

Phase V is still under wraps.  As my knowledge around moving to the cloud,
containerising applications, and building infrastructure with code improves, I
can see myself start a consulting business for the local space.  Nothing
finalised yet but something on the horizon for 2020.
