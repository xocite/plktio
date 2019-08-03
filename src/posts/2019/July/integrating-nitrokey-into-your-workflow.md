---
path: "/writing/integrating-nitrokey"
date: "2019-07-30"
title: "(WIP) Integrating Nitrokey into your workflow"
commentary: false
attract: "Using Nitrokey to manage your SSH keys."
---
*Keywords: ssh-agent, ssh-forwarding, yubikey, nitrokey*

* This is a work in progress document. *

I recently collected a new Nitrokey Pro and wanted to see how to integrate it
into my authentication flow.  

My host OS is OpenBSD.

Let's walk through a traditional authentication flow.
1. Generate an SSH key-pair on the local machine and apply a password.
1. Copy your public key to the target host.
1. Test the connection.
1. Set the target host to only authenticate with SSH keys.
1. Connect to the remote host with your private key, adding it to the local
   ssh-agent.
1. Connect as usual throughout the day, sometimes re-entering the password and
   saving it with the ssh-agent.

One drawback of this method is that the private key is stored on the local
machine.  If you don't use a passphrase to secure the key, then your machine is
a liability.

Smart cards let you store the private key material inside the smart card so your
private key can't be read or stolen.  Using the key will require you to
authenticate with the smart card absolving yourself of being bound to a
particular machine.

# Getting started
I use OpenBSD but it's likely these instructions can be used in Linux as well
once you find the correct packages.  If you're using a virtual machine, make
sure you have a USB controller connected.

Now connect the Nitrokey to the computer.

# Seeing what OpenBSD recognises out of the box
From the immediate plug in we see,
```
uhidev2 at uhub2 port 1 configuration 1 interface 0 "Nitrokey Nitrokey Pro" rev
1.10/1.01 addr 4
uhidev2: iclass 3/0
uhid0 at uhidev2: input=64, output=64, feature=64
ugen0 at uhub2 port 1 configuration 1 "Nitrokey Nitrokey Pro" rev 1.10/1.01 addr 4
```

Next we'll install the required packages.  ccid is the protocol for accessing
the smart card through USB.  opensc is a set of libraries to work with smart
card readers and pcsc-lite and pcsc-tools contain the cross-platform API for accessing
smart cards.

```
# pkg_add ccid opensc pcsc-lite pcsc-tools
quirks-3.124 signed on 2019-04-15T12:10:16Z
ccid-1.4.27p0: ok
opensc-0.19.0p1: ok
pcsc-lite-1.8.22p2: ok
pcsc-tools-1.4.27: ok
Running tags: ok
```

Now we'll follow this level of abstraction: gnupg -> pcsc-lite -> opensc -> ccid
-> nitrokey.

# Exploring the capabilities of the smart card
Let's see what information is available from simple queries with PC/SC.  I'm
sure that using these cards directly is not a common task because I couldn't
find many definitive steps.  I'm also not a security expert so don't rely on
this to protect mission-critical data.

We'll start with pcscd, the PC/SC daemon, running in foreground with debug
output enabled.

```
# pcscd -f -i
00000000 debuglog.c:285:DebugLogSetLevel() debug level=info
00001424 pcscdaemon.c:658:main() pcsc-lite 1.8.22 daemon ready.
00004494 hotplug_libusb.c:536:HPAddHotPluggable() Adding USB device: 1:4:0
01296024 hotplug_libusb.c:590:HPAddHotPluggable() libusb_get_string_descriptor_ascii failed: -1
00000265 readerfactory.c:1074:RFInitializeReader() Attempting startup of Nitrokey Nitrokey Pro 00 00 using /usr/local/lib/pcsc/drivers/ifd-ccid.bundle/Contents/OpenBSD/libccid.so
00000508 readerfactory.c:949:RFBindFunctions() Loading IFD Handler 3.0
00000040 ifdhandler.c:1965:init_driver() Driver version: 1.4.27
00001949 ifdhandler.c:1982:init_driver() LogLevel: 0x0003
00000174 ifdhandler.c:1993:init_driver() DriverOptions: 0x0000
00001324 ifdhandler.c:111:CreateChannelByNameOrChannel() Lun: 0, device: usb:20a0/4108:libhal:/org/freedesktop/Hal/devices/usb_device_20a0_4108_serialnotneeded_if0
00000269 ccid_usb.c:302:OpenUSBByName() Using: /usr/local/lib/pcsc/drivers/ifd-ccid.bundle/Contents/Info.plist
00001107 ccid_usb.c:320:OpenUSBByName() ifdManufacturerString: Ludovic Rousseau (ludovic.rousseau@free.fr)
00000117 ccid_usb.c:321:OpenUSBByName() ifdProductString: Generic CCID driver
00000132 ccid_usb.c:322:OpenUSBByName() Copyright: This driver is protected by terms of the GNU Lesser General Public License version 2.1, or (at your option) any later version.
00000619 ccid_usb.c:656:OpenUSBByName() Found Vendor/Product: 20A0/4108 (Nitrokey Nitrokey Pro)
00000006 ccid_usb.c:658:OpenUSBByName() Using USB bus/device: 1/4
00000005 ccid_usb.c:717:OpenUSBByName() bNumDataRatesSupported is 0
02148626 ifdhandler.c:382:IFDHGetCapabilities() tag: 0xFB3, usb:20a0/4108:libhal:/org/freedesktop/Hal/devices/usb_device_20a0_4108_serialnotneeded_if0 (lun: 0)
00000242 readerfactory.c:396:RFAddReader() Using the reader polling thread
00002277 ifdhandler.c:382:IFDHGetCapabilities() tag: 0xFAE, usb:20a0/4108:libhal:/org/freedesktop/Hal/devices/usb_device_20a0_4108_serialnotneeded_if0 (lun: 0)
00000347 ifdhandler.c:477:IFDHGetCapabilities() Reader supports 1 slot(s)
00000178 hotplug_libusb.c:536:HPAddHotPluggable() Adding USB device: 1:4:1
00000040 hotplug_libusb.c:577:HPAddHotPluggable() libusb_open failed: -99
00000430 hotplug_libusb.c:440:HPEstablishUSBNotifications() Driver ifd-ccid.bundle does not support IFD_GENERATE_HOTPLUG. Using active polling instead.
00000122 hotplug_libusb.c:449:HPEstablishUSBNotifications() Polling forced every 1 second(s)
00004232 ifdhandler.c:1158:IFDHPowerICC() action: PowerUp, usb:20a0/4108:libhal:/org/freedesktop/Hal/devices/usb_device_20a0_4108_serialnotneeded_if0 (lun: 0)
00961663 Card ATR: 3B DA 18 FF 81 B1 FE 75 1F 03 00 31 F5 73 C0 01 60 00 90 00 1C 
```
There's a lot of output but nothing to worry about here.

Next, now we have the interface working you can rerun the above command and send
it to the background with `# pcscd`.  Now we've handled the latter portion of
the abstraction: gnupg -> *pcsc-lite -> opensc -> ccid -> nitrokey*.

We'll continue with gnupg, installing version 2.2 if it's not already installed.
```
# pkg_add gnupg  
quirks-3.124 signed on 2019-04-15T12:10:16Z
Ambiguous: choose package for gnupg
a   0: <None>
  1: gnupg-1.4.23p1
    2: gnupg-1.4.23p1-card-ldap
      3: gnupg-2.2.12
      Your choice: 3
      gnupg-2.2.12:libunistring-0.9.7: ok
      gnupg-2.2.12:libidn2-2.0.0p0: ok
      gnupg-2.2.12:libunbound-1.9.1: ok
      gnupg-2.2.12:gmp-6.1.2p3: ok
      gnupg-2.2.12:libnettle-3.4.1p0: ok
      gnupg-2.2.12:libtasn1-4.13p0: ok
      gnupg-2.2.12:p11-kit-0.23.15p0: ok
      gnupg-2.2.12:gnutls-3.6.7: ok
      gnupg-2.2.12:npth-1.6: ok
      gnupg-2.2.12:libgpg-error-1.36: ok
      gnupg-2.2.12:libassuan-2.5.1p0: ok
      gnupg-2.2.12:libgcrypt-1.8.4p0: ok
      gnupg-2.2.12:libksba-1.3.5p1: ok
      gnupg-2.2.12:libsecret-0.18.8p0: ok
      gnupg-2.2.12:pinentry-1.1.0p0: ok
      gnupg-2.2.12: ok
      New and changed readme(s):
        /usr/local/share/doc/pkg-readmes/gnupg
```
Awesome.  Now let's check what gpg2 can see.

```
$ gpg2 --card-status
gpg: directory '/home/jiff/.gnupg' created
gpg: keybox '/home/jiff/.gnupg/pubring.kbx' created
Reader ...........: Nitrokey Nitrokey Pro 00 00
Application ID ...: D2760001240103030005000086BE0000
Version ..........: 3.3
Manufacturer .....: ZeitControl
Serial number ....: 000086BE
Name of cardholder: [not set]
Language prefs ...: de
Sex ..............: unspecified
URL of public key : [not set]
Login data .......: [not set]
Signature PIN ....: forced
Key attributes ...: rsa2048 rsa2048 rsa2048
Max. PIN lengths .: 64 64 64
PIN retry counter : 3 0 3
Signature counter : 0
KDF setting ......: on
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none]
```
[more information available on the GnuPG documentation](https://gnupg.org/howtos/card-howto/en/ch03.html)

Let's generate a test key-pair on device.  Keep in mind the default user pin is
"123456" and the admin pin "12345678" with a maximum PIN length of 20
characters.  3 incorrect PIN attempts cause the device to be locked.  The
Nitrokey Pro here can store three RSA key pairs and elliptical curve key pairs.

First we'll check the card status with gpg.  Take note that gpg often prevents
other programs from accessing the card so we'll need to release gpg's ownership
later.

```

```


