---
path: "/writing/redhat-csa-rhcsa-prep-p1"
date: "2019-08-17"
title: "Red Hat Certified System Administrator Exam Prep: Part 1"
commentary: false
attract: "Part 1 of the RHCSA prep series."
---
**Keywords: rhsca, preparation, exam, linux, system administrator**

If you're here then you must be preparing for the [Red Hat Certified System Administrator](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) exam.  These are the notes I took prior to taking the exam.  It consists of many parts and once complete I'll include links to every page.

Please note that I haven't sat the exam yet so this document is a work in progress.

# Exam overview
From the [official documentation](https://www.redhat.com/en/services/certification/rhcsa) you should be able to perform the following:
* Understand and use essential tools for handling files, directories, commandline environments, and documentation. *Essential tools*
* Operate running systems including booting into different run levels, identifying processes, starting and stopping virtual machines, and controlling services. *Operating running systems*
* Configure local storage using partitions and logical volumes. *Configure local storage*
* Create and configure file systems and file system attributes, such as permissions, encryption, access control lists, and network file systems. *Create and configure file systems*
* Deploy, configure, and maintain systems, including software installation, update and core services. *Deploy, configure, and maintain systems*
* Understand and use basic networking concepts. *Manage basic networking*
* Manage users and groups, including use of centralised directory for authentication. *Manage users and groups*
* Manage security, including basic firewall and SELinux configuration. *Manage security*

I've given a code name to each one.  But first, let's set up a development environment.

# In the wild
I didn't only want to take the exam to prove my Linux and system administrator chops; I also wanted to switch my career path from Product Management to System Adminstration, specifically in FinTech deployments.  So let's look at a few real job descriptions to see what we should add to the Task Requirements above.

For a job in Amsterdam
* Your technical knowledge and hands-on activities include solutions 
  * installation, implementation, and configuration of Linux environments
  * configuration and layout of virtualisation solutions
  * linking Linux environments to storage networks

For a job in the UK
* knowledge of Layer 2 and Layer 3 switches, including firewalls
* knowledge of RedHat administration
* knowledge of DHCP, DNS, TCP/IP, and other networking concepts
* experience of working with technologies such as Docker and Kubernetes within a containerised environment

From this we can see that network fundamentals are very important outside of what's already listed in the RHCSA exam requirements.

# Development environment
My preferred virtualisation solution in VMWare.  I'm sure these instructions also run on VirtualBox and Parallels, if on a Mac, and KVM in Linux.

We'll get started by registering for a [Red Hat Developer](https://developers.redhat.com) account.  This gives us a free evaluation license to download the latest Red Hat version.

Once you have signed up, you will also have an account at [Red Hat Access](https://access.redhat.com/).  Navigate there and go to Products & Servies > Red Hat Enterprise Linux.  Click on "Download version 8" and download the Boot ISO: Red Hat Enterprise Linux 8.0 Boot ISO.  You will also need to download the DVD "Red Hat Enterprise Linux 8.0 Binary DVD " and make it accessible somewhere.

Once you have the boot ISO downloaded, load it in your virtualisation product of choice and we can begin.

# Installing Red Hat
Set up a virtual machine and boot the installer.  I created a simple VM with 2 cores, 2568MB of RAM, and 20GB root drive.


Use the default settings.

# Essential tools
I imagine this is the easiest thing to learn but the part that trips up most people.  From the exam guidelines, we'll cover:
* Access a shell prompt and issue commands with correct syntax
* Use input-output redirection (>, >>, |, 2> , etc.)
* Use grep and regular expressions to analyse text
* Access remote systems using SSH
* Log in and switch users in multiuser targets
* Archive, compress, unpack, and uncompress files using tar, star, gzip, and bzip2
* Create and edit text files
* Create, delete, copy, and move files and directories
* Create hard and soft links
* List, set, and change standard ugo/rwx permissions
* Locate, read, and use system documentation including man, info, and files in /usr/share/doc

# Before you enter the testing site
Watch this video: https://www.youtube.com/watch?v=tok9qimRw6k 