---
path: "/writing/systemd-qreference"
date: "2019-08-09"
title: "(WIP) SystemD quick reference"
commentary: false
attract: "A walkthrough of the commands I use most frequently with SystemD."
---
*Keywords: systemd, reference, linux, terminal*

*This is a work in progress document.*

I have embraced systemd on all my Linux systems, including Gentoo, which offers
OpenRC as an alternative.  Here are the commands I use most frequently to manage
my boxes.

# systemctl
Systemctl is used to control systemd and the service manager.  I most frequently
use it to enable services for newly installed packages, set services to start on
boot, and configure local services to run in the user space.

To view the current state of the service manage, you can just type `systemctl`
as root.  The results are often given in a pager.

You'll see a variety of unit types in a variety of states.
* Unit types: service, socket, target, device, mount, automount, timer, swap,
  path, slice, and scope 
* States: load, sub, and active

# Journalctl
Journalctl is used to query the contents of the systemd journal.  I frequently
use it to monitor local processes I scheduled as a user -- for example,
offlineimap.

To view recent messages you can run: `journalctl --user --since "1 hour ago"`
