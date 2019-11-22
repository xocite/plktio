---
path: "/writing/freshening-your-debian-install"
date: "2019-11-17"
title: "Refreshing your Debian install with debootstrap and LVM"
commentary: false
attract: "Reaching feature parity with Windows."
---
I must admit I'm quite jealous of Windows' ability to "refresh" meaning return it to a near vanilla state with a click of a button.  I've always had a brief moment of horror when thinking about how to refresh my Debian install and have it work the first time, especially with the various configurations you can have with LUKS on LVM and a separate /boot partition.

That being said, I have too much cruft on my home server's install with old docker binaries laying around, various extra bridges brought in by libvirt and even minikube and k3s managing to become deeply intertwined with systemd somehow.

So I wanted to start with a fresh Debian 10.2 install that would replace my existing install and work the first time upon rebooting (a large ask!).

# Background
My setup on the home server is pretty simple.  A 60GB root drive that runs ext4 on LVM.  No LUKS here because it's a headless server that doesn't have a keyboard attached.  /home partition could be encrypted but that's an exercise for another day?  Asking me why I don't encrypt this drive is like saying why don't you encrypt your Raspberry Pi's SD card?  It just seems like something that's going to cause pain for little reason.

```
Disk /dev/sda: 55.9 GiB, 60022480896 bytes, 117231408 sectors

Device       Start       End   Sectors  Size Type
/dev/sda1     2048   1050623   1048576  512M EFI System
/dev/sda2  1050624   1550335    499712  244M Linux filesystem
/dev/sda3  1550336 117229567 115679232 55.2G Linux LVM
```

The plan is to create a new Debian partition with LVM, run debootstrap into it, chroot, set up SSH remote access by copying the config over from the old install.

# Preparing LVM
As with any major operation, we should snapshot our current state so we can restore if things don't go well.  However, because the change is taking place in a new logical volume we can simply leave the old LV untouched.

First we'll backup the LVM headers for physical volumes, volume groups, and logical volumes.
```
tar cf /somewhere/away/from/lvm/lvm.tar /etc/lvm
```

Next we'll backup the boot partition
```
umount /boot
mount -o ro /boot
tar cf /somewhere/away/from/lvm/boot.tar /boot
```

Finally, we create the new logical volume to house the new installation.

```
lvcreate -L 4G -n newroot volumegroup
```

# Creating the new Debian partition
This part was made easy thanks to Debian's really useful tools.  More information available in their [Developer Documentation](https://www.debian.org/releases/stretch/amd64/apds03.html.en).  Install debootstrap if you don't already have it and walk through the following commands on the target machine.

```
mkfs.ext4 /dev/mapper/volumegroup-newroot 
mkdir /mnt/debian
mount /dev/mapper/volumegroup-newroot /mnt/debian
/usr/sbin/debootstrap --arch amd64 buster /mnt/debian http://ftp.us.debian.org/debian
mount --rbind /dev /mnt/debian/dev
mount --make-rslave /mnt/debian/dev
mount -t proc /proc /mnt/debian/proc
mount --rbind /sys /mnt/debian/sys
mount --make-rslave /mnt/debian/sys
mount --rbind /tmp /mnt/debian/tmp 
cp /etc/fstab /mnt/debian/etc/fstab
vim /mnt/debian/etc/fstab # change root to point to newroot
cp /etc/adjtime /mnt/debian/etc/adjtime
cp /etc/hosts /mnt/debian/etc/hosts
cp /etc/hostname /mnt/debian/etc/hostname
cp /etc/network/interfaces /mnt/debian/etc/network/
cp /etc/resolv.conf /mnt/debian/etc/resolv.conf
cat /etc/apt/sources.list >> /mnt/debian/etc/apt/sources.list
vim /mnt/debian/etc/apt/sources.list # fix any errors
LANG=C.UTF-8 chroot /mnt/debian /bin/bash
(inside chroot) apt update
(inside chroot) dpkg-reconfigure tzdata
(inside chroot) mount /boot
(inside chroot) apt install linux-image-4.19.0-6-amd64
(inside chroot) apt install grub2 # don't select to install to any partition
(inside chroot) apt install lvm2
(inside chroot) apt install ssh
(inside chroot) systemctl enable ssh
(inside chroot) editor /etc/ssh/sshd_config # set PermitRootLogin yes
(inside chroot) adduser local
(inside chroot) passwd local
(inside chroot) passwd # set root passwd
```

Now the system is completely configured for booting.  You'll need to check /boot/grub/grub.cfg and make sure that the newroot LVM ID is referenced (use lvdisplay).

Reboot the system.  If it doesn't work, you'll likely need to get out your external monitor and external keyboard.  Luckily, I survived unharmed :).

# Finishing touches
SSH into the new system as root and finish installing the standard system files.

```
tasksel install standard
```

Don't forget to delete the old entry in your local machine's sshd config as new keys were generated for the new install.

You can remove the old LVM logical volume or use it to bring over any missing configuration from the new install.

And with that, consider your Debian install refreshed!

