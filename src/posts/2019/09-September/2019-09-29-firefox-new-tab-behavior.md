---
path: "/writing/firefox-new-tab-behavior"
date: "2019-09-26"
title: "Firefox new tab positioning behavior"
commentary: false
attract: "A simple about:config change to make new tabs launch next to the current tab."
---
I've always been briefly annoyed at the new tab behavior when opening tabs on Firefox: namely that they open at the right most end of the tab bar.  I think this decision probably has a lot of history but given that I'll have multiple tabs open at any time, I like to keep related tabs together, sort of a poor man's tree-style-tabs if you will.

Now even though there are a [few](https://addons.mozilla.org/en-US/firefox/addon/always-right/) extensions that fix this and I'm also thinking about writing my own :), you can simply change your about:config as well to enable this change.

Set `browser.tabs.insertAfterCurrent` in about:config to true.  I'm using Firefox Beta 70.0b9 so this may not be available in the current release yet.