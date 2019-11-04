---
path: "/writing/creating-a-storage-sandwich"
date: "2019-11-04
"
title: "Creating a storage sandwich"
commentary: false
attract: "How I think about my hard drives."
---
Whenever I create or add a new hard drive to my storage, I'm never sure if I should build ext4 on lvm on cryptsetup on raid or btrfs on cryptsetup on raid or ext4 on raid on cryptsetup.  There doesn't seem to be a good default choice for this apart from trying to reduce the levels of abstraction where possible.

For each level of abstraction, you'll need to backup the relevant headers or superblocks in the event of a problem.  For ext4, superblocks are backed up throughout the partition but you should dump them and back them up separately in the event of a problem.  For LVM, you'll see the backups in /etc/lvm/backup for your physical volumes and /etc/lvm/archive for your volume groups.  For cryptsetup, you'll need to back up header information of the LUKS device ... or if you went the straight dm-crypt route, there won't be anything to backup except your passphrase :).  For RAID (aka mdadm), you'll need to save the /etc/mdadm and /etc/mdadm.d directories in case you forgot how you assembled the array (you did use RAID-1 or RAID-5 right?).

I think there's too many opportunities to fail here and the cost can be a lot of heart ache if the data is lost.

Here's what I've settled upon that falls within my risk tolerance.  This is my abstraction compromise between ease of administration, liklihood of data loss, and possibility of data recovery.  We'll start at the physical layer.

Ability to sync at the block level.
Ability to sync at the data level.

* 3 hard drives of around the same size.
* * 