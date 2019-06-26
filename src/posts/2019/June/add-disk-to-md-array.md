---
path: "/writing/adding-disk-to-md-array"
date: "2019-06-26"
title: "Adding a new disk to an existing RAID array on Linux"
updated: "2019-06-26"
---
I run a small [Samba](https://www.samba.org/) server at home that I use to store high-fidelity music and photos.  Right now it's based upon a RAID 1 mirrored pair which means I can only withstand a single disk failure before losing my data.

I recently picked up another [Western Digital Elements](https://www.wd.com/products/portable-storage/wd-elements-portable.html) drive and wanted to document how I added it to the array using [`mdadm`](https://raid.wiki.kernel.org/index.php/Linux_Raid), software used to manage Linux software RAID arrays.

First, you'll want to inspect your current configuration carefully  especially if you have an encrypted LUKS setup.  It's easy to forget what in what order you created the array!

After making sure all drives are plugged in, we'll take a look at our current block devices.

```shell
# lsblk
NAME                    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0                     7:0    0 16.2M  1 loop /snap/node/2028
loop1                     7:1    0 88.4M  0 loop /snap/core/6964
sda                       8:0    0 55.9G  0 disk 
├─sda1                    8:1    0  512M  0 part /boot/efi
├─sda2                    8:2    0  244M  0 part /boot
└─sda3                    8:3    0 55.2G  0 part 
  ├─vg-root   254:0    0 17.7G  0 lvm  /
  ├─vg-swap   254:1    0  3.9G  0 lvm  [SWAP]
  └─vg-home   254:2    0 33.6G  0 lvm  /home
sdb                       8:16   0  1.8T  0 disk 
├─sdb1                    8:17   0  200M  0 part 
├─sdb2                    8:18   0  1.8T  0 part 
└─sdb3                    8:19   0  128M  0 part 
sdc                       8:32   0  1.8T  0 disk 
├─sdc1                    8:33   0  200M  0 part 
├─sdc2                    8:34   0  1.8T  0 part 
└─sdc3                    8:35   0  128M  0 part 
sdd                       8:48   0  1.8T  0 disk 
└─sdd1                    8:49   0  1.8T  0 part 
```

Here you can see my internal hard drive (sda) and my external hard drives (sdb, sdc, and sdd).  `sdd` is the new drive we'll be adding.

I have a unique setup on my RAID array: I have used the entire disk instead of individual partitions.  It makes it easier to add and remove drives without worrying about matching the partition table.  If you used a specific partition, then recreate that partition table exactly upon the new drive before continuing.

```
# mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/disk/by-id/usb-WD_Elements_EXISTING_DISK_1-0:0 /dev/disk/by-id/usb-WD_Elements_EXISTING_DISK_2-0:0
[... warnings about being part of an existing array ... ]
mdadm: array /dev/md0 started.
```

Next, add the new drive to your RAID array and check /proc/mdstat about the progress.
```
# mdadm /dev/md0 --add /dev/disk/by-id/usb-WD_Elements_NEW_DISK_1-0:0
mdadm: added /dev/disk/by-id/usb-WD_Elements_NEW_DISK_1-0:0

# cat /proc/mdstat
Personalities : [linear] [multipath] [raid0] [raid1] [raid6] [raid5] [raid4] [raid10] 
md0 : active raid1 sdd[2](S) sdc[1] sdb[0]
      1953350656 blocks super 1.2 [2/2] [UU]
      [>....................]  resync =  0.8% (16522496/1953350656) finish=1121.6min speed=28778K/sec
      bitmap: 15/15 pages [60KB], 65536KB chunk

unused devices: <none>
```
From the output, we can see that the resync is beginning to the new disk.  It will take a while -- especially these drives being connected over USB 3.  The advantage of building your LUKS or LVM devices upon the base MD array is that you're now done!