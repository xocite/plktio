---
path: "/writing/vanity-gpg-keys"
date: "2019-08-10"
title: "Vanity GPG keys"
commentary: false
attract: "How I generate GPG keys with a specific SHA2 hash."
---
*Keywords: gpg, vanity, keypair, nist*

Referencing the very useful [GPG unattended key generation
guide](https://www.gnupg.org/documentation/manuals/gnupg/Unattended-GPG-key-generation.html),
I wanted to see how easy it would be to generate a key with a specific hash.

For my initial test, I wanted to make it as simple as possible only using the
default settings.

Let's start by building the structure of the looping key generation.

We'll pipe an incrementing counter to sha256sum to calculate the hash.  Using
grep, we'll search for a specific vanity key in the last 2 hexadecimal
characters.

```
#!/bin/bash

i="0"
vanity_key="99"

while true; do
  TIME=`date +%H:%M:%S`
  if echo -n "$i" | sha256sum --tag | grep -iqE "$vanity_key\$"; then
    echo $i
    break
  fi

  i=$[$i+1]
done
```

This outputs 109. 

Now that the looping logic works, we'll start writing the key generation
portion. 

```
%echo Generating key...
%no-protection
Key-Type: default
Subkey-Type: default
Name-Real: Test User
Name-Email: test.user@domain.tld
Expire-Date: 0
%commit
%echo Key generation complete :)
```

Unfortunately, this took 34 minutes.  We'll add %transient-key to reduce the
entropy requirements with the caveat that any key generated this way can't
actually be used.  Perhaps at a later stage I can use the true random number
generator present on my Nitrokey.

```
%echo Generating key...
%transient-key
%no-protection
Key-Type: default
Subkey-Type: default
Name-Real: Test User
Name-Email: test.user@domain.tld
Expire-Date: 0
%commit
%echo Key generation complete :)
```

```
$ time GNUPGHOME="$(mktemp -d)" gpg --batch --generate-key key_gen
gpg: keybox '/tmp/tmp.jccfyYaR2R/pubring.kbx' created
gpg: Generating key...
gpg: /tmp/tmp.jccfyYaR2R/trustdb.gpg: trustdb created
gpg: key 7467B1A5706D1A65 marked as ultimately trusted
gpg: directory '/tmp/tmp.jccfyYaR2R/openpgp-revocs.d' created
gpg: revocation certificate stored as '/tmp/tmp.jccfyYaR2R/openpgp-revocs.d/EB64E5588879FF739C00DF767467B1A5706D1A65.rev'
gpg: Key generation complete :)

real    0m0.434s
user    0m0.002s
sys     0m0.007s
```

This is much faster.

Now we can work on parsing the output from gpg.

```
#!/bin/bash

vanity_key="99"

while true; do
  TIME=`date +%H:%M:%S`
  TEMP=$(mktemp -d)
  GNUPGHOME=$TEMP gpg --batch --quiet --generate-key key_gen
	KEY_FINGERPRINT=$(GNUPGHOME=$TEMP gpg --batch --quiet --list-keys --with-colons | grep fpr | head -n1)
	if echo -n $KEY_FINGERPRINT | grep -iEq "$vanity_key:\$"; then 
		GNUPGHOME=$TEMP gpg --list-keys
		break
	fi
	echo Deleting...
	rm -r $TEMP
done
```

```
gpg: Generating key...
gpg: key 1EB473A3ADC44699 marked as ultimately trusted
gpg: Key generation complete :)
/tmp/tmp.h6wYHFfIu6/pubring.kbx
-------------------------------
pub   rsa2048 2019-08-10 [SC]
      2B6692A4EB91FB47AFA87F681EB473A3ADC44699
uid           [ultimate] Test User <test.user@domain.tld>
sub   rsa2048 2019-08-10 [E]


real    5m5.063s
user    0m4.333s
sys     0m11.511s
```

This took five minutes to generate a 2048-bit RSA key that ends in 99 with
reduced randomness.  Note that it could take longer or shorter depending on the
length of the vanity key.

This is a running on a single CPU core with a benchmark score (`sysbench --test=cpu run`): 1567.26 events per second.

Next, we'll try to run these scripts so that they use all the cores.

We'll make a wrapper script that runs these scripts across all available 4 cores.

```
#!/bin/bash
./file.sh & 
./file.sh &
./file.sh & 
./file.sh &

wait
echo "Done."

```

And we'll add a check in each loop that searches for a specific file that's
created upon a match.  This will stop all the scripts.

```
#!/bin/bash

vanity_key="99"
STOPLOCK="match-found"

while true; do
  if [[ -f "$STOPLOCK" ]]; then
		break
	fi
  TIME=`date +%H:%M:%S`
  TEMP=$(mktemp -d)
  GNUPGHOME=$TEMP gpg --batch --quiet --generate-key key_gen
	KEY_FINGERPRINT=$(GNUPGHOME=$TEMP gpg --batch --quiet --list-keys --with-colons | grep fpr | head -n1)
	if echo -n $KEY_FINGERPRINT | grep -iEq "$vanity_key:\$"; then 
		GNUPGHOME=$TEMP gpg --list-keys
		touch $STOPLOCK
		break
	fi
	echo Deleting...
	rm -r $TEMP
done
```

Timing the run of the new parallel script gives us:
```
real    0m5.852s
user    0m0.334s
sys     0m0.579s
```

Again, this value depends on the random values used.  Now, let's update the vanity number to be something more difficult to find.  We'll use "999".

```
gpg: Key generation complete :)
/tmp/tmp.I03FUioXup/pubring.kbx
-------------------------------
pub   rsa2048 2019-08-10 [SC]
      D1BED2A845408097BD06081F1D10BEB494695999
uid           [ultimate] Test User <test.user@domain.tld>
sub   rsa2048 2019-08-10 [E]

[..snip from other processes..]

real    5m11.555s
user    0m17.176s
sys     0m31.377s
```

This took a much longer.  One of the limiting factors for doing this for an
actual key is the available entropy.  Once we remove the %transient-key option
from the key generation file, we'll find this could take days or even months to
finish.

In other post, I'll explore ways to increase entropy so we can generate secure vanity keys.
