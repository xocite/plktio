---
path: "/writing/integrating-nitrokey"
date: "2019-07-30"
title: "(WIP) Integrating Nitrokey into your workflow"
commentary: false
attract: "Using Nitrokey to manage your SSH keys."
---
*Keywords: ssh-agent, ssh-forwarding, yubikey, nitrokey*

*This is a work in progress document.*

I recently collected a new [Nitrokey Pro](https://www.nitrokey.com/).  This post
explains how I integrated it into my authentication flow.

# Before connecting the Nitrokey
The Nitrokey supports the OpenPGP standard so you'll be mainly interacting with
it using GPG. On Gentoo Linux, you'll need gnupg with the +smartcard and +usb USE flags
enabled.

`# echo "app-crypt/gnupg usb smartcard" >> /etc/portage/package.use/gnupg`

Next, we'll install the required packages.

`$ sudo emerge -av sys-apps/pcsc-tools sys-apps/pcsc-lite dev-libs/opensc \
app-crypt/ccid app-crypt/gnupg`

The abstractions work like the following: gnupg -> pcsc-lite -> opensc -> ccid
-> nitrokey.

# Connecting the Nitrokey

Here's the immediate output from `dmesg`.
```
[24798.012187] usb 2-2.2: new full-speed USB device number 5 using uhci_hcd
[24798.450042] usb 2-2.2: New USB device found, idVendor=20a0, idProduct=4108,
bcdDevice= 1.01
[24798.450044] usb 2-2.2: New USB device strings: Mfr=1, Product=2,
SerialNumber=3
[24798.450046] usb 2-2.2: Product: Nitrokey Pro
[24798.450047] usb 2-2.2: Manufacturer: Nitrokey
[24798.450048] usb 2-2.2: SerialNumber: 0000000000000000000086BE
[24798.467777] hid-generic 0003:20A0:4108.0002: hiddev96,hidraw1: USB HID v1.10
Device [Nitrokey Nitrokey Pro] on usb-0000:02:00.0-2.2/input0
```

Let's see if pcsc supports the smart card.

```
$ sudo pcscd -a -d -f
[..snip..]
00005549 /var/tmp/portage/sys-apps/pcsc-lite-1.8.24/work/pcsc-lite-1.8.24/src/eventhandler.c:289:EHStatusHandlerThread()
powerState: POWER_STATE_POWERED
[..snip..]
```

This looks good; the card was recognised.  Next, we'll start the service and let it run on boot.

```
$ sudo systemctl start pcscd.service pcscd.socket
$ sudo systemctl enable pcscd.service pcscd.socket
```

The services should now be loaded in systemctl memory and running.

```
$ systemctl list-units --type=service,socket --state=running pcsc*
UNIT          LOAD   ACTIVE SUB     DESCRIPTION
pcscd.service loaded active running PC/SC Smart Card Daemon
pcscd.socket  loaded active running PC/SC Smart Card Daemon Activation Socket
```

Finally, we'll confirm that gpg can see the card as well.

```
$ gpg --card-status
Reader ...........: Nitrokey Nitrokey Pro (0000000000000000000086BE) 00 00
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
$
```
And gpg looks good too.

# Keypair configuration
According to the Nitrokey
[datasheet](https://www.nitrokey.com/files/doc/Nitrokey_Pro_factsheet.pdf) it
supports RSA-2048 up to RSA-4096 and ECC-256 up to ECC-512 (Brainpool and NIST
algorithms).  For compatibility reasons, it's probably best to use RSA-2048
keypairs despite them being slower and larger than equivalent ECC keypairs.
* According to Microsoft Research, ECC (elliptical curve
cryptography) key pairs are [easier to
crack](https://eprint.iacr.org/2017/598.pdf) than RSA key pairs with a
sufficiently powerful quantum computer.  
* The algorithms supported by the Nitrokey are supposedly vunerable to
  side-channel attacks due to implementing a Montogmery power ladder.  Keep in
  mind however, ECC is used for Bitcoin, just secp256k1 which is not supported
  by the Nitrokey.

We'll be creating:
* All keys: RSA-2048, expires on 1 August, SHA-2 series output digest
* Primary key: certify and signing
** Subkey (encryption)
** Subkey (authentication)
* Revocation certificate stored offsite

```
$ gpg --full-generate-key --expert
gpg (GnuPG) 2.2.15; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
   (9) ECC and ECC
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (13) Existing key
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048)
Requested keysize is 2048 bits
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want for the subkey? (2048)
Requested keysize is 2048 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 358
Key expires at Sat 01 Aug 2020 20:33:09 BST
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: Antony Jepson
Email address: a@plkt.io
Comment: RSA key for Antony Jepson.  Renewed every 1 August.
You selected this USER-ID:
    "Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? o
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
gpg: /home/bnt/.gnupg/trustdb.gpg: trustdb created
gpg: key 718044D8003D317A marked as ultimately trusted
gpg: directory '/home/bnt/.gnupg/openpgp-revocs.d' created
gpg: revocation certificate stored as '/home/bnt/.gnupg/openpgp-revocs.d/0F8D4AD674DB570DB095CB3F718044D8003D317A.rev'
public and secret key created and signed.

pub   rsa2048 2019-08-09 [SC] [expires: 2020-08-01]
      0F8D4AD674DB570DB095CB3F718044D8003D317A
uid                      Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>
sub   rsa2048 2019-08-09 [E] [expires: 2020-08-01]

$ gpg --edit-key --expert a@plkt.io
gpg (GnuPG) 2.2.15; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

gpg: checking the trustdb
gpg: marginals needed: 3  completes needed: 1  trust model: pgp
gpg: depth: 0  valid:   1  signed:   0  trust: 0-, 0q, 0n, 0m, 0f, 1u
gpg: next trustdb check due at 2020-08-01
sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> addkey
Please select what kind of key you want:
   (3) DSA (sign only)
   (4) RSA (sign only)
   (5) Elgamal (encrypt only)
   (6) RSA (encrypt only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
Your selection? 8

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Sign Encrypt

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? A

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Sign Encrypt Authenticate

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? S

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Encrypt Authenticate

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? E

Possible actions for a RSA key: Sign Encrypt Authenticate
Current allowed actions: Authenticate

   (S) Toggle the sign capability
   (E) Toggle the encrypt capability
   (A) Toggle the authenticate capability
   (Q) Finished

Your selection? q
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048)
Requested keysize is 2048 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 358
Key expires at Sat 01 Aug 2020 20:37:48 BST
Is this correct? (y/N) y
Really create? (y/N) y
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb  rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> quit
Save changes? (y/N) y
```

Next, we'll copy the keys to the Nitrokey.
```
$ gpg --export-secret-keys a@plkt.io > sec-key.asc
$ gpg --edit-key --expert a@plkt.io
gpg (GnuPG) 2.2.15; Copyright (C) 2019 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb  rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> keytocard
Really move the primary key? (y/N) y
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection? 1

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb  rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> key 1

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb* rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb  rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> keytocard
Please select where to store the key:
   (2) Encryption key
Your selection? 2

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb* rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb  rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> key 2

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb* rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb* rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> key 1

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb* rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> keytocard
Please select where to store the key:
   (3) Authentication key
Your selection? 3

sec  rsa2048/718044D8003D317A
     created: 2019-08-09  expires: 2020-08-01  usage: SC
     trust: ultimate      validity: ultimate
ssb  rsa2048/692971AD1D29742D
     created: 2019-08-09  expires: 2020-08-01  usage: E
ssb* rsa2048/73CCBEF81E3522EB
     created: 2019-08-09  expires: 2020-08-01  usage: A
[ultimate] (1). Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>

gpg> quit
Save changes? (y/N) y
$ gpg --armor --export a@plkt.io > pubkey.asc
$ cat pubkey.asc
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
Z1dEv2yM
=kOb4
-----END PGP PUBLIC KEY BLOCK-----
$ gpg --card-edit

Reader ...........: Nitrokey Nitrokey Pro (0000000000000000000086BE) 00 00
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
Signature key ....: 0F8D 4AD6 74DB 570D B095  CB3F 7180 44D8 003D 317A
      created ....: 2019-08-09 19:34:03
Encryption key....: FECA 217D E1E5 96AA A7F5  86F1 6929 71AD 1D29 742D
      created ....: 2019-08-09 19:34:03
Authentication key: D6CF ED7E FA74 999D 2E99  AEE4 73CC BEF8 1E35 22EB
      created ....: 2019-08-09 19:36:50
General key info..:
pub  rsa2048/718044D8003D317A 2019-08-09 Antony Jepson (RSA key for Antony Jepson.  Renewed every 1 August.) <a@plkt.io>
sec>  rsa2048/718044D8003D317A  created: 2019-08-09  expires: 2020-08-01
                                card-no: 0005 000086BE
ssb>  rsa2048/692971AD1D29742D  created: 2019-08-09  expires: 2020-08-01
                                card-no: 0005 000086BE
ssb>  rsa2048/73CCBEF81E3522EB  created: 2019-08-09  expires: 2020-08-01
                                card-no: 0005 000086BE

gpg/card> admin
Admin commands are allowed

gpg/card> url
URL to retrieve public key: https://plkt.io/key

gpg/card> quit
```

More information available on Nitrokey's website (guide)[https://www.nitrokey.com/documentation/openpgp-create-backup].

The keys shown in this example are just for reference.  My actual public key is stored at **https://plkt.io/key**.

# Using the keypair
So I think for most people this is the stopping point -- people don't actually integrate it into their flow.  Here's how I use this Nitrokey for day to day usage.

## Signing code commits

## Signing email

## Logging into remote systems

## Encrypting files

## Encrypting mail

# Summary

Using public keys with a smart card wasn't as difficult as expected.
