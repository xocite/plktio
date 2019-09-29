---
path: "/writing/upgrading-to-debian-stretch"
date: "2019-08-16"
title: "Upgrading to Debian 10 Buster from Debian 9 Stretch"
commentary: false
attract: "A simple step by step."
---
Debian 10: Buster was released on July.  Let's upgrade to the latest version.

Check your current version with: `hostnamectl`.

```
$ hostnamectl
   Static hostname: baytrail
         Icon name: computer-desktop
           Chassis: desktop
        Machine ID: 6535c38e46164760b537c1f1f792c734
           Boot ID: b53c54cceb0b473e8fec1243e0929c68
  Operating System: Debian GNU/Linux 9 (stretch)
            Kernel: Linux 4.9.0-8-amd64
      Architecture: x86-64
```

Next, decide how you're going to back up the system.  I opted for LVM snapshots
but unfortunately I didn't have enough space.  I resized my home logical volume
to create more space.

```
$ lvs
  LV          VG          Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  home        baytrail-vg -wi-ao----  33.56g                                                    
  root        baytrail-vg -wi-ao----  17.71g                                                    
  swap_1      baytrail-vg -wi-ao----   3.89g                                                    
```

```
# lsof /home

# umount /home

# e2fsck -f /dev/mapper/baytrail--vg-home 
e2fsck 1.43.4 (31-Jan-2017)
Pass 1: Checking inodes, blocks, and sizes
Inode 1177663 extent tree (at level 1) could be narrower.  Fix<y>? yes

Pass 1E: Optimizing extent trees
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information

/dev/mapper/baytrail--vg-home: ***** FILE SYSTEM WAS MODIFIED *****
/dev/mapper/baytrail--vg-home: 103209/2199344 files (0.8% non-contiguous), 2709830/8797184 blocks

# lvreduce --resizefs -L 27G /dev/mapper/baytrail--vg-home 
fsck from util-linux 2.29.2
/dev/mapper/baytrail--vg-home: clean, 103209/2199344 files, 2709830/8797184 blocks
resize2fs 1.43.4 (31-Jan-2017)
Resizing the filesystem on /dev/mapper/baytrail--vg-home to 7077888 (4k) blocks.
The filesystem on /dev/mapper/baytrail--vg-home is now 7077888 (4k) blocks long.

  Size of logical volume baytrail-vg/home changed from 33.56 GiB (8591 extents) to 27.00 GiB (6912 extents).
  Logical volume baytrail-vg/home successfully resized.

# mount /home

# lvcreate -L 5G -s -n stretch-backup /dev/mapper/baytrail--vg-root 
  Using default stripesize 64.00 KiB.
  Logical volume "stretch-backup" created.
```
Now we can start installing Debian Buster.
```
# apt update
# apt upgrade
# apt dist-upgrade
```
Check for any errors.

```
# dpkg -C
# apt-mark showhold
```
Update your package repositories by changing all occurences of `stretch` to
`buster` in `/etc/apt/sources.list`.

Finally, run the apt update/upgrade/dist-upgrade commands again and you should
be all set.

Reboot and test the new system.  If there are no errors, you can remove the
snapshot.

```
# lvremove /dev/mapper/baytrail--vg-stretch--backup
```
