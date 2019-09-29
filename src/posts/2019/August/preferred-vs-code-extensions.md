---
path: "/writing/preferred-vs-code-extensions"
date: "2019-08-26"
title: "VSCode Extensions"
commentary: false
attract: "What I use to get comfortable in VSCode."
---
**Keywords: vscode, extensions, microsoft windows**

I've recently started doing my development entirely in containers and virtual machines (with the exception of iOS development).

This has enabled me to switch computers and use Git to keep them in sync.  On Windows, I prefer using VSCode for my development and on Mac I fullscreen the VM and use dwm + rxvt-unicode.  While I'm not 100% sure about the future of VSCode with Microsoft at the helm nor am I super happy about Electron being the framework it's built on, but you can't deny it's a good environment to write javascript and do basic development.

# Bringing over vim settings
As of writing, my [.vimrc](https://github.com/xocite/dotrc/blob/master/vimrc) is pretty minimal.
* 80 character width with forced wrap (not visual wrap)
* tabs turned into spaces
* tabstop of 2 spaces
* automatically indent according to language paradigms
* UTF-8 encoding