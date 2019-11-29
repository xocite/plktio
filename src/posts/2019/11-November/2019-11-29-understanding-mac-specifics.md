---
path: "/writing/mac-specifics"
date: "2019-11-29"
title: "Understanding Mac specifics"
commentary: false
attract: "Like systemctl, but, Mac."
---

I use a Mac as my main dev box for better or for worse.  I also use a mini-PC for deployments I want accessible to all my devices.  To orchestrate all these devices, I use a combination of [Vagrant](https://www.vagrantup.com/intro/index.html), for virtual machine provisioning, [Ansible](https://www.ansible.com/), for writing playbooks to get the *ahem* required *ahem* Docker installed, and [Docker](https://www.docker.com/) to handle my containers.  I am also building a local container registry which houes custom builds of various programs.  Of course, all this is run locally by [minikube](https://github.com/kubernetes/minikube), the Kubernetes local cluster.

It's quite a complicated setup and I was using LXD before but I just found snapd to cause so many difficult to debug problems that I decided to fully embrace the, as Elon puts it, massive spire in the topological map of technological advancements (from this [interview](https://www.youtube.com/watch?v=f3lUEnMaiAU)).

Before installing all these programs, I took some time to look at how services and networking is managed in macOS as I just knew I would run into some configuration problems down the road.

# Networking
Most of macOS networking is sufficiently handled with the System Preferences Networking pane.  For quick terminal look up, you can use the netstat and ifconfig tools.  On modern distros, these tools are supplanted by `ss` and `ip` respectively.

# System services
[`launchd`](https://www.launchd.info/) manages the daemons, applications, processes, and scripts in macOS.  It's not as powerful as a modern installation of systemd but it just works, so to speak.  Agents and daemons are usually stored in the /Library set of directories: ~/Library for local agents, /Library for global agents, and /System/Library for system agents.

These directories contain XML files that specify what they want launchd to do for a particular service.  Go ahead and run `launchctl list` to see the list of loaded services.  Like systemctl you can run `launchctl enable <service>` to start something and with `disable` to disable it.

When I'm troubleshooting problems it can be informative to list all the non-Apple agents with `launchctl list | grep -v 'com.apple'`.

```
launchctl list | grep -v 'com.apple'
PID     Status  Label
355     0       com.wacom.DataStoreMgr
1774    0       com.microsoft.edgemac.Canary.18720
780     0       com.openssh.ssh-agent
-       0       com.wireguard.macos.login-item-helper
-       0       com.microsoft.update.agent
352     0       com.wacom.wacomtablet
397     0       com.wireguard.macos.18228
-       0       com.valvesoftware.steamclean
598     0       com.vmware.fusion.15568
372     0       com.manytricks.Moom.13396
3066    0       com.microsoft.VSCodeInsiders.18956
781     0       org.mozilla.firefox.15760
-       0       com.oracle.java.Java-Updater
1248    0       org.mozilla.thunderbird.15376
3087    0       com.microsoft.VSCodeInsiders.ShipIt
1320    0       com.microsoft.onenote.mac.18712
```

Let's say I want to see the status of VSCode -- I can use the gui service specifier.
```
launchctl print gui/501/com.microsoft.VSCodeInsiders.ShipIt
com.microsoft.VSCodeInsiders.ShipIt = {
	active count = 1
	path = (submitted by Electron.3066)
	state = running

	program = /Users/user1/Applications/Visual Studio Code - Insiders.app/Contents/Frameworks/Squirrel.framework/Resources/ShipIt
	arguments = {
		/Users/user1/Applications/Visual Studio Code - Insiders.app/Contents/Frameworks/Squirrel.framework/Resources/ShipIt
		com.microsoft.VSCodeInsiders.ShipIt
		/Users/user1/Library/Caches/com.microsoft.VSCodeInsiders.ShipIt/ShipItState.plist
	}

	stdout path = /Users/user1/Library/Caches/com.microsoft.VSCodeInsiders.ShipIt/ShipIt_stdout.log
	stderr path = /Users/user1/Library/Caches/com.microsoft.VSCodeInsiders.ShipIt/ShipIt_stderr.log
	inherited environment = {
		Apple_PubSub_Socket_Render => /private/tmp/com.apple.launchd.ZqVikU4Yim/Render
		SSH_AUTH_SOCK => /private/tmp/com.apple.launchd.lx5o1GBYry/Listeners
	}

	default environment = {
		PATH => /usr/bin:/bin:/usr/sbin:/sbin
	}

	environment = {
		XPC_SERVICE_NAME => com.microsoft.VSCodeInsiders.ShipIt
	}

	domain = com.apple.xpc.launchd.user.domain.501.100009.Aqua
	asid = 100009
	minimum runtime = 2
	exit timeout = 5
	nice = -1
	runs = 1
	successive crashes = 0
	pid = 3087
	immediate reason = semaphore
	forks = 0
	execs = 1
	initialized = 1
	trampolined = 1
	started suspended = 0
	proxy started suspended = 0
	last exit code = (never exited)

	semaphores = {
		successful exit => 0
	}

	event triggers = {
	}

	endpoints = {
		"com.microsoft.VSCodeInsiders.ShipIt" = {
			port = 0xb6d9f
			active = 0
			managed = 1
			reset = 0
			hide = 0
		}
	}

	dynamic endpoints = {
	}

	pid-local endpoints = {
	}

	instance-specific endpoints = {
	}

	event channels = {
	}

	sockets = {
	}

	spawn type = daemon
	spawn role = (null)
	jetsam priority = 3
	jetsam memory limit (active) = (unlimited)
	jetsam memory limit (inactive) = (unlimited)
	jetsamproperties category = daemon
	submitted job. ignore execute allowed
	jetsam thread limit = 32
	cpumon = default

	properties = {
		partial import = 0
		launchd bundle = 0
		xpc bundle = 0
		keepalive = 0
		runatload = 0
		low priority i/o = 0
		low priority background i/o = 0
		legacy timer behavior = 0
		exception handler = 0
		multiple instances = 0
		supports transactions = 0
		supports pressured exit = 0
		supports idle hysteresis = 0
		enter kdp before kill = 0
		wait for debugger = 0
		app = 0
		system app = 0
		creates session = 0
		inetd-compatible = 0
		inetd listener = 0
		abandon process group = 0
		one-shot = 0
		event monitor = 0
		penalty box = 0
		pended non-demand spawn = 0
		role account = 0
		launch only once = 0
		system support = 0
		app-like = 0
		inferred program = 1
		joins gui session = 0
		joins host session = 0
		parameterized sandbox = 0
		resolve program = 0
		abandon coalition = 0
		high bits aslr = 0
		extension = 0
		nano allocator = 0
		no initgroups = 0
		start on fs mount = 0
		endpoints initialized = 1
		disallow all lookups = 0
		system service = 0
	}
}
```

However, what about the sneaky java auto-updater?  It's not running now but surely it's scheduled to phone home at some point in the next few minutes ;).  How do I check the run frequency of it?  We can look at the property list file to find more information.  Querying launchctl seems to change between releases so what works on Mojave might not work in Catalina.

Java's property list file is installed globally in /Library/LaunchAgents.
```
 $ cat /Library/LaunchAgents/com.oracle.java.Java-Updater.plist 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>com.oracle.java.Java-Updater</string>
        <key>ProgramArguments</key>
        <array>
        <string>/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Resources/Java Updater.app/Contents/MacOS/Java Updater</string>
        <string>-bgcheck</string>
        </array>
        <key>StartCalendarInterval</key>
        <dict>
                <key>Hour</key>
                <integer>01</integer>
                <key>Minute</key>
                <integer>19</integer>
                <key>Weekday</key>
                <integer>4</integer>
        </dict>
        <key>StandardErrorPath</key>
        <string>/dev/null</string>
        <key>StandardOutPath</key>
        <string>/dev/null</string>
</dict>
</plist>
```

It's scheduled to run weekly.  We can disable the auto-updater with `launchctl remove <LaunchDaemon>` -- in this case `launchctl remove com.oracle.java.Java-Updater`.  Now the java auto-updater no longer appears in the list of LaunchAgents.