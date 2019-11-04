---
path: "/writing/macbook-pro-keyboard-recovery"
date: "2019-08-16"
title: "Next steps after getting your Macbook Pro keyboard repaired"
commentary: false
attract: "Follow these steps to avoid heartache when you get your MBP back."
---
**Keywords: macbook pro; keyboard repair; service programme; unshaky**

So you just got your Macbook Pro back from the service centre after having it
repaired for repeating keys?  Here are the steps I followed to avoid this
problem again.

# Precautions

First, I immediately purchased the following:
* Silicone keyboard cover for the Macbook Pro [example on ebay](https://www.ebay.com/itm/143357622678)
* USB-C socket cover [example on ebay](https://www.ebay.com/itm/302850677303)
* 2x compressed air can

Once these arrived, I placed the USB-C covers in the sockets on the side of the
computer.  This should prevent dust from building up in sockets.

I gave the keyboard a thorough spray with the compressed air and, after confirming
there's no lint on the keyboard cover, placed it on top of my keys.

Second, I installed the [Unshaky](https://github.com/aahung/Unshaky/) app
available on GitHub.  I did see some open issues with this version so consider
starting from v0.5.3 if you use the US keyboard layout.  Remember which keys
caused you problems before and immediately set them to a 40ms delay.  This
should cover up the issue if it appears without you even knowing.

I was a bit wary about installing this app and giving it accessibility access so
I forked the repository, restored it to commit
`be5d0d93e9ced97ee508a6d27db3ae0f5974d181^` (note the caret means commit prior
to this one), and built my own version.  This commit was before auto-update was
added.

Finally, when plugging in the power supply at the wall end I made sure it was
grounded to prevent sparks from occuring at the USB-C port and damaging the
logic board.

# Preventative care
You'll want to spray down your keys weekly to make sure there's no dust inside.
(At least that is what Apple tells us.)  Give the silicone cover a good spray as
well when you do so.

While I'm grateful for the free [keyboard service
program](https://support.apple.com/keyboard-service-program-for-mac-notebooks),
it's the first time I've ever had a problem with a computer keyboard.  Can you
imagine buying an Amiga and having problems with the keyboard?  I hope that when
Apple returns to the scissor-switches that they provide that option as a repair
for affected customers.

Once the keyboard service program expires - which I believe is four years after
the purchase date - I'll sell this laptop and pick up the latest Lenovo T3XXX
series.  By that time hopefully we'll have 6 core CPUs with hyperthreading, 90Hz
displays, at least 2K resolution as standard, with a 90 WHr battery.

Have you found other ways to prevent the keys repeating?  Let me know on
Twitter [@plktio](https://twitter.com/plktio).
