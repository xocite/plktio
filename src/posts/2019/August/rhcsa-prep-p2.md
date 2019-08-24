---
path: "/writing/redhat-csa-rhcsa-prep-p2"
date: "2019-08-24"
title: "RHCSA Exam Prep: Part 2: Essential Tools"
commentary: false
attract: "These are my RHCSA notes."
---
**Keywords: rhsca, preparation, exam, linux, system administrator**

This is part two of my [RHCSA](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) preparation series.   In this part, we'll cover the
first exam objective: 
* Understand and use essential tools for handling files, directories,
  commandline environments, and documentation. *Essential tools*

# Essential tools
I imagine this is the simplest exam topic that probably won't need anything more
than a 10 minute refresher.

From the guidelines, we'll cover:
* [ET.1] Access a shell prompt and issue commands with correct syntax
* [ET.2] Use input-output redirection (>, >>, |, 2> , etc.)
* [ET.3] Use grep and regular expressions to analyse text
* [ET.4] Access remote systems using SSH
* [ET.5] Log in and switch users in multiuser targets
* [ET.6] Archive, compress, unpack, and uncompress files using tar, star, gzip, and bzip2
* [ET.7] Create and edit text files
* [ET.8] Create, delete, copy, and move files and directories
* [ET.9] Create hard and soft links
* [ET.10] List, set, and change standard ugo/rwx permissions
* [ET.11] Locate, read, and use system documentation including man, info, and files in /usr/share/doc

# [ET.1] Access a shell prompt and issue commands with correct syntax
## Console
The console is where you can receive output from the kernel and type commands to
the kernel.  Navigating between consoles is typically done with `Ctrl+Alt+Fn`,
where n is the number of the console and F is one of the function keys.  Virtual
consoles are accessed at the physical machine, not remotely.  Graphical
installations typically take place on console 6.

## Basic commands
Here are the most basic commands you will use in day-to-day administration:

### Navigation and file manipulation
* `ls`: list directory contents
* `cd`: change directory
* `rm`: remove
* `mv`: move
* `cp`: copy
* `pwd`: print working directory
* `mkdir`: make directory
* `touch`: make file
* `head`: read first 10 lines of file
* `tail`: read last 10 lines of file
* `locate`: find file
* `grep`: search a file

### Output and user information
* `echo`: write to output 
* `id`: list user and group IDs
* `date`: print the date

### Manipulating the environment
* `set`: show shell variables
* `alias`: create shell alias
* `env`: show exported variables (from the parent process)
* `which`: show which command from the shell's PATH would run
* `type`: show what type of file 

# [ET.2] Use input-output redirection (>, >>, |, 2> , etc.)
Inside bash there are three file descriptors: `STDOUT`, `STDERR`,
and `STDIN`.

## STDOUT
STOUT is represented by file descriptor 1.  You use the redirection operator to
send output somewhere else.  `ls 1>file1.txt` sends the output of the command to
the file entitled `file1.txt`.

## STDERR
STOUT is represented by file descriptor 2.  You use the redirection operator to
send output somewhere else.  `ls 2>file1.txt` sends any errors from running the
command to the file and still sends `STDOUT` to the virtual console.

## Redirecting both to a file
You can reference the address of a redirection file descriptor to send them to
each other.

For example, `2>&1` means send anything sent to STDERR is redirected to where STDOUT is
pointing.  Another way of specifying this is to use `>&` which is the same as
the previous incantation.

Keep in mind that STDERR is an unbuffered stream so it writes output
immediately.  STDOUT is not so you may want to send each to different files,
like so: `ls >file.txt 2>file-error.txt` to avoid output from STDERR to appear
piecemeal inside STDOUT output.

## Redirection with >>
The only difference between `>` and `>>` is that the latter appends and the
former overwrites.

## Piping
You can chain command output to other programs using piping.  It's much like
redirection except the output comes from STDOUT of one program to the STDIN
of another.

```
$ ls | head
amplifyPublishIgnore.json
default.txt
gatsby-browser.js
gatsby-config.js
gatsby-node.js
gatsby-ssr.js
LICENSE
node_modules
package.json
package-lock.json
$ ls | head | wc -l
10
```

## Redirecting to STDIN
Using the `<` operator we can send input to a programs.  Keep in mind that
programs will not have any metadata about the input.  `cat < hello.txt`

```
$ touch hello.txt
$ echo "five" > hello.txt
$ cat hello.txt
five
$ cat < hello.txt
five
```

# [ET.3] Use grep and regular expressions to analyse text
Grep is a very useful tool that can save you hours of writing shell scripts to
query results from a shell command.  At it's most basic invocation, it looks
like: `grep PATTERN`.

Assume we have the following file called `hello.txt`.
``` 
Very nice to meet you.

How have you been today.

Where are you going tomorrow.

How is the weather.

See you tomorrow tomorrow
``` 

Now, we want to see how many times "tomorrow" is written in this file, we can
use grep.

``` 
$ grep tomorrow hello.txt 
Where are you going tomorrow.
See you tomorrow tomorrow
$ grep -c tomorrow hello.txt 
2
``` 
Note that it counts line matches not individual count of the search term.  If
tomorrow was written twice on one line it would be counted once.

## Options
Here are the most common options you should know.
* `-i`: ignore case
* `-c`: print count of matching lines
* `-n`: print the matching line and its line number
* `-l`: print only the file names of files that contain matches
* `-H`: print the file name with the matching line (default if grepping multiple
  files).
* `-A n`: show `n` lines after matching line
* `-B n`: show `n` lines before matching line
* `-C n`: show `n` lines before and after matching line
* `-v`: print lines that don't match the pattern

## Regular expressions (regexs)
Regular expressions can't be covered in detail here and certainly deserve their
own set of books.  For ease of use I recommend using Perl style regex when using
grep: `grep -P`.

Searching the kernel control ring buffer for all usb references in the 2-2
domain.
``` 
$ dmesg | grep -Pi '.*usb 2-2\..*' | head -n3
[107075.519908] usb 2-2.1: new full-speed USB device number 4 using uhci_hcd
[107075.618612] usb 2-2.1: New USB device found, idVendor=0e0f, idProduct=0004,
bcdDevice= 1.00
[107075.618616] usb 2-2.1: New USB device strings: Mfr=1, Product=2,
SerialNumber=0
``` 

# [ET.4] Access remote systems using SSH
You'll absolutely need to understand SSH to access your testing environment.
Fortunately, the commands are pretty simple.  Keep in mind OpenSSH comes from
the BSD world so the command syntax is different than the GNU tools you're used
to.

## Options
These are the most common commands I use.
* `-i identify_file`: use identity file when connecting
* `-D port`: create a SOCKS5 server at specified port and send all incoming
  connections over to the host
* `-L port:host:hostport`: incoming connections on local port be forwarded to
  given host and port on the remote side.
* `-p port`: port to use when connecting to the remote host.
* `-X`: enable X11 forwarding

# [ET.5] Log in and switch users in multiuser targets
SystemD is here and has replaced the init runlevels you may be familiar with.
Instead, we refer to systemd targets.  Thankfully, the older runlevels can still
be referenced if required.

## Targets
Get the default target with `systemctl get-default`.  List current target units
with `systemctl list-units --type target`.  Set the default with `systemctl
set-default multi-user.target`.  Finally, change the current target with
`isolate`: `systemctl isolate name.target`.

``` 
$ sudo systemctl get-default
Password:
graphical.target
$ sudo systemctl list-units --type target
UNIT                LOAD   ACTIVE SUB    DESCRIPTION                  
basic.target        loaded active active Basic System
getty.target        loaded active active Login Prompts
graphical.target    loaded active active Graphical Interface
local-fs-pre.target loaded active active Local File Systems (Pre)
local-fs.target     loaded active active Local File Systems
machines.target     loaded active active Containers
multi-user.target   loaded active active Multi-User System
network.target      loaded active active Network
nss-lookup.target   loaded active active Host and Network Name Lookups
paths.target        loaded active active Paths
remote-fs.target    loaded active active Remote File Systems
slices.target       loaded active active Slices
sockets.target      loaded active active Sockets
swap.target         loaded active active Swap
sysinit.target      loaded active active System Initialization
time-set.target     loaded active active System Time Set
time-sync.target    loaded active active System Time Synchronized
timers.target       loaded active active Timers

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state, i.e. generalization of SUB.
SUB    = The low-level unit activation state, values depend on unit type.

18 loaded units listed. Pass --all to see loaded but inactive units, too.
To show all installed unit files use 'systemctl list-unit-files'.
``` 

The main runlevel targets:
* {poweroff, rescue, multi-user, graphical, reboot}.target}
* You can also use emergency.target: `systemctl isolate emergency` if you can't
  even transition to the rescue runlevel.

## Switching users
Switch users can be done using `su`.
```
$ su john
$ 
```

# [ET.6] Archive, compress, unpack, and uncompress files using tar, star, gzip, and bzip2
The tar command is the default and lauded command to package sets of files and directories together as well as compress them.  The default and preferred compression format is `bzip2`.  It can be used with tar or separately.

## tar
Modern day `tar` has sane defaults and an invocation with `xf` will usually decompress any file it can handle: `tar xf file`.

More options:
* `c`: create.  Usually followed by `f` to indicate the filename of the new tarball.
* `x`: extract.
* `a`: append
* `d`: delete
* `v`: verbose

## bzip2
If you receive a bzipped file, you can use bzip2 to decompress them in the current directory - which will result in a file named the same sans the bz2 extension.

# [ET.7] Create and edit text files
Become familiar with vi and ed just in case you are dropped into an emergency
shell.

# [ET.8] Create, delete, copy, and move files and directories
You can reference ET.1 for some of the basic commands here.  Things to keep in
mind:
* `mv` has a backup command that is non-destructive.  Good for testing moves
  before making them part of a shell script.
* `rm` has an iteractive mode -- good for checking that recursive deletes won't
  remove anything important
* `rm` also has a -d flag which removes empty directories.
* `touch` is the default command for creating files.  `mkdir` is the command for
  creating directories.  You'll often use the -p option on `mkdir` to make a
  nested set of directories.

# [ET.9] Create hard and soft links
`ln` is the tool of choice to create links.  `ln -s` creates soft links and
simple `ln` creates hard links.  Hard links are essentially the same file so if
you delete one you'll delete the other.  Soft links are a reference so you can
delete the soft link without removing the target.

I often get the order mixed up (TARGET vs LINK_NAME) for linking files:
```
       ln - make links between files

SYNOPSIS
       ln [OPTION]... [-T] TARGET LINK_NAME
       ln [OPTION]... TARGET
       ln [OPTION]... TARGET... DIRECTORY
       ln [OPTION]... -t DIRECTORY TARGET...

       ln - make links between files
```

I fixed that problem by remembering that ln will create the link in the current directory if the link name is not specified.  That way you know that the link name is the 2nd argument.

# [ET.10] List, set, and change standard ugo/rwx permissions
There are a lot of tricks to changing permissions that are much easier than remembering the octals (777, for example).  You can directly reference the target `ugo` for user, group, and other respectively and then use an operator along with the permission to be affected.

For example, to give the group permissions to read and write, you can issue: `chmod g+rw`.

Listing permissions is given by `ls -l`.

## Sticky bit
Means that only the owner can delete the file.  Good for `/tmp` directories.

## SUID/GUID
Simply means that when the file in question is executed it will be executed with the permissions of the owner.  Can be checked by looking at `ls` output and seeing the `s` bit set in place of execute.  If it's a capital `S` then the execute bit hasn't been set.


# [ET.11] Locate, read, and use system documentation including man, info, and files in /usr/share/doc
For the exam, my goal is to generally avoid documentation where possible -- simply because I want to know the command well enough to go from memory.  That being said, you may blank of the order of options so I'd generally recommend to get bash-completion installed first and then go to the manpage.

## Bash completion
Can be installed with `yum install bash-completion`.

## Man pages
Man pages can be read with `man command`.  It's split into sections (see `man man`) and you'll probably only need to know sections 1 (executable programs), 5 (file formats), and 8 (system administration commands).

## Info documents
Consider info documents a newer, more comprehensive version of man pages.
Typically man pages will be enough to understand how to run the program but
you'll find that GNU utilities have a very well written info document.  Open
them with `info command`.

## /usr/share/doc
Often the `/usr/share/doc` directory contains a lot more details and sample
configuration files.  Keep that in mind if you need to start a service or define
a configuration and you don't know how to get started.  Use grep to find the
service/config name and work from there.