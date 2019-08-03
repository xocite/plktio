---
path: "/writing/my-development-environment"
date: "2019-07-23"
title: "(WIP) My development environment"
commentary: false
attract: "How do I get my work done?"
---
**This post is a work in progress.**

My development environment has changed over the years in terms of hardware but I
constantly find myself returning to the same tools over and over again.

Some of my staples:
* Vim
* Screen

I think now is the best time to write about this as any - virtualisation is
mainstream and hardware is a commodity.  I've managed to become completely
hardware independent and can easily work from a low-end Lenovo laptop to
high-end Apple hardware with little compromise.

I'll walk you through my set up and how I quickly replicate it across platforms.
I'll also cover how I back up my configuration across the cloud and local
storage.

This will be an evolving post as I add more details.

# Basics
All my work is inherently dependent on virtual machines running upon a trusted
operating system.  For local virtual machines I use VMWare Workstation or Fusion
and for remote virtual machines, I typically use AWS for heavy work loads and
Hertzner for lighter ones.

## Local virtualisation
OpenBSD 6.5 serves as the foundation for all outgoing connections.  It runs on a
single CPU virtual machine.


