---
path: "/writing/creating-a-storage-sandwich"
date: "2019-11-16"
title: "Creating a storage sandwich"
commentary: false
attract: "How I think about my hard drives."
---
Whenever I create or add a new hard drive to my storage, I'm never sure if I should build ext4 on lvm on cryptsetup on raid or btrfs on cryptsetup on raid or ext4 on raid on cryptsetup.  There doesn't seem to be a good default choice for this apart from trying to reduce the levels of abstraction where possible.

For each level of abstraction, you'll need to backup the relevant headers or superblocks in the event of a problem.  For ext4, superblocks are backed up throughout the partition but you should dump them and back them up separately in the event of a problem.  For LVM, you'll see the backups in /etc/lvm/backup for your physical volumes and /etc/lvm/archive for your volume groups.  For cryptsetup, you'll need to back up header information of the LUKS device ... or if you went the straight dm-crypt route, there won't be anything to backup except your passphrase :).  For RAID (aka mdadm), you'll need to save the /etc/mdadm and /etc/mdadm.d directories in case you forgot how you assembled the array (you did use RAID-1 or RAID-5 right?).

I think there's too many opportunities to fail here and the cost can be a lot of heart ache if the data is lost.

Here's what I've settled upon that falls within my risk tolerance.  This is my abstraction compromise between ease of administration, liklihood of data loss, and possibility of data recovery.  We'll start at the physical layer.

# Physical layer
I primarily use external hard drives just because I like to move my setup around.  So in my case, I have 2 Western Digital hard drives and one spare that I occasionally sync with the first two.  I use drives of around the same size (2TB) and partition them with a single partition and GPT header.  I size the partition around 8% smaller than the full drive size to account for small differences in size between manufacturers and for a bit of breathing room should I want to do some partition changes later.  Connecting the devices via USB-3 is a must so you'll need to use `lsusb` to check which root hub you are plugging in the devices.

# Merged device layer
I'm not sure what the correct term is for this but I consider it to be the merged device layer.  Essentially, how multiple devices get represented as a single whole.  This layer usually takes care of duplicating, striping, reading, and writing data from the physical drives independently of where it's located.

Although mdadm is my go-to on Linux, I have been tempted by btrfs' software RAID.  I think for ease of use, I'll continue to stick with mdadm until another challenger comes along.

# Encryption layer
There's a lot of options here which is a little concerning because to me it seems like a lot of ways to makes mistakes.  What I've never had any serious issues with is LUKS.  You can also use ecryptfs if you want to encrypt on the file level.

# Filesystem layer
Now usually some people add another level before this one with LVM but I don't really think there's that many advantages in having multiple partitions on an already complicated set up.  I'd recommend just using loopback files on a single device and apply permissions appropriately or using separate devices with a different partition table.

At this stage, I just slap on btrfs and call it done.  ext4 would work fine here as well.  They are both solid choices.  I tend to avoid setting up ZFS because of the additional licenses I need to accept.  The copy on write nature of the filesystem is a godsend and can really make using the device feel faster.

# To summarise
I normally run btrfs on top of a LUKS encrypted block device on top of a RAID-1 block device built by mdadm on top of two similarly sized harddrives with similar access/write speeds.