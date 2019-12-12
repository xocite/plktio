---
path: "/writing/gatsby-to-wordpress"
date: "2019-11-23"
updated: "2019-11-30"
title: "Returning to Wordpress"
commentary: false
attract: "The wheel goes round (v2)."
---
I've been using Gatsby for the better part of this year to host my blog.  I get a nice static blog that can become interactive relatively easily.  Unfortunately, I think the JS ecosystem is moving a bit too quickly for me to maintain with all my other commitments.  So I'm going to swap that maintenance headache for another :) and move to Wordpress.

Over the coming months, I'm going to be moving my blog to Wordpress.  As time permits, I'll be detailing my progress here.  My initial conception is a simple stack with a cheap CDN in front of my Wordpress instance in a reproducible setup so I can work offline when needed.

I expect to learn a lot about the broader container ecosystem and will be paying close attention to CNCF publications and videos.  Expect the page size to go down and the performance to stay around the same.  I'll also be working on my PHP knowledge to add back in interactivity to this site.

On the bright side, I'll be able to start monitoring blog post performance again without javascript calls each time the page loads which is a boon for privacy and performance.

# Goals
Two main goals: (1) create a setup I can quickly replicate locally and on different cloud providers; and (2) learn more than I can handle about the Kubernetes "revolution."

Initially, this will only host my Wordpress blog (the future of this blog).

A late goal is some time of notification system when new builds are pushed. 

# Orchestration software
I've landed on the following stack:

* Kubernetes, to control spinning up and down of virtual machines.  We'll force k8s to use a single machine.
* Vagrant, to build and manage the virtual machine environment.  It also abstracts the available hypervisors on different operating systems.
* Ansible, to prep the container which will head into the container registry.
* minikube for testing locally
* VMWare Fusion for running virtual machines.