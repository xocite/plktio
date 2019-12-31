---
path: "/writing/bring-on-2020"
date: "2019-12-31"
title: "Looking forward to the next 10 years!"
commentary: false
attract: "My thoughts for the next decade, 2020."
---
**Keywords: new year; 2020; new decade; self-host; apache; ansible**

**Note: Let's Encrypt has a rather small rate limit that I transgessed when
testing the deployment of my plkt.io w/ GatsbyJS container.  This means I won't
be able to get a free HTTPS certificate from them until next week.  So for the
first week of the New Year, this blog will continue to be hosted on GitHub
Pages.  I'll remove this note once the migration is complete!**

Wow, what a year it has been.  If you're reading this, it means I've
successfully completed my first New Year's Resolution of hosting this website on
my own web server.  It is now live on a VPS at [Hetzner](https://hetzner.com)
complete with a HTTPS certificate signed by [Let's
Encrypt](https://letsencrypt.org).  While this isn't a huge achievement in
itself, I've done much more than simply copy the static files to
*/var/www/html*.

# Short term plans

The journey to self-hosting this blog took longer than anticipated because I
spent a lot of time creating a reproducible setup.  This means I can recreate
the plkt.io deployment on my local machine for testing with Vagrant and have
that same configuration be pushed on "production" aka this web server.

To achieve this, I hand-crafted a series of incremental Dockerfiles that build
the container serving this page.  Starting from Debian, adding in Apache, and
then configuring certbot and building the website from JS.  I learned alot about
setting up infrastructure via code and having single application containers work
well.  There's still quite a bit left to do but for now I consider the *first
phase* of my 2020 plan complete!

In *Phase II*, I'll be moving from a simple `docker run` setup to something more
glamorous /ahem/ I mean modern.  While the site by itself is rather simple, I do
plan to expose more services here, with the next in line being a self-hosted git
repo at [git.plkt.io](git.plkt.io).  This page will serve as the authoritive git
repo behind the site with a mirror of course available on GitHub.  Kubernetes to
replace my manual invocations (and incantations :)) will will be brought in
incrementally and as needed over the course of a few months as I standardise how
I roll out services on plkt.io.  At the moment, I don't plan to have multiple
VMs running so will likely run each Kubernetes node using Linux containers
(LXD).

# Longer term plans

In *Phase III*, running concurrently with Phase II, I'll be migrating from this
static website built with [GatsbyJS](https://gatsbyjs.org) to one served with
Wordpress.  While some might think this an irrational move, I have a lot of
trust in Wordpress and believe it's the less maintenance heavy option.  I'll be
migrating the entirety of my blog posts over and likely be breaking some URLs in
the process.  While it is considered faux paus to break links, I consider it a
necessary evil as I ship this blog upon a platform that I'm sure will be for the
next ten years. 

If you did bookmark a page and it no longer works, try the search
functionality on Google
[here](https://www.google.com/search?hl=en&q=site%3Aplkt.io%20%24SEARCH_TERM) or
via Wordpress if this site has already been migrated.

*Phase IV* is where this site really starts to become notable and useful.  I'll be
adding two major updates that add a bit of interactivity to the site.

First, I'll be publishing a blog roll of my favourite blogs via an RSS feed and
also putting the snippets live on my site.  This doesn't necessarily mean I
approve of everything written, rather, I find it as a directory of like-minded
thinkers so people browsing this site can continue to find good content.

Second, I'm going to spin up some data funnels where I can start recording
events that happen and present them on the site.  Examples include: (a) Git
activity by people I follow; (b) self-signed tarballs of things that I'm using
in production so people have multiple sources of trust for packages; (c) and
perhaps even some stock market analysis and trends.

Overall, I think the additions will do well to improve the usefulness of my
website as a hub reflecting what I'm working on and what I'm capable of.  In
addition, it's one small step closer to making content discovery easier in lieu
of search engine dominance and apathy.  More to come in this space!

*Phase V* is still under wraps.  As my knowledge around moving workloads to the
cloud, containerising applications, and building infrastructure with code
improves, I can envision myself start a cloud consulting business for my local
region.  Nothing finalised yet but something to shoot for in 2020.
