<img src="assets/icons8-Octopus-96.png" title="Octopus" width="96" height="96">

# Journ, a command line journaling tool based on a weekly calendar

> Years ago, I started logging my daily journal in markdown format. I also started
organizing my schedule by weeks. Counting Week 1 as Monday, Jan 2nd til Sunday,
Jan 8th. Each day was recorded as markdown file with YEAR-WEEK-DAY format.
ie. 2017-02-1 for 2nd week, Monday.

> This method kept all my days into single flat files which I could edit with VIM
or any text editor and allowed easy manipulation to collate reports and storage
in GitHub. I then wrote bash scripts that would concat the files and manage the
files. This project takes those methods and creates a Node tool.

## Install
```
npm install -g journ
```

In your home or project directory, you can create a configuration file
Change the `journ.cfg.json` if you like to `journ` directory to not be your home directory.
The setup process will create the initial working directory and files.

```
journ config
journ setup
```

## Usage
```
journ new
```

Takes the `today.md` file and renames at a dated file for yesterday. Then
creates a new  `today.md` file.

```
journ . <a new line of text>
```
Will write the new line of text to the end of today.md.


```
# Other commands
journ status
journ week
journ   // for status
```

## File system
```
kyle@KMBP:~/journ$ pwd
/Users/kyle/journ
kyle@KMBP:~/journ$ ls -l
total 56
drwxr--r--   9    306B Jul  5 07:10 .
drwxr-xr-x+ 50    1.7K Jul  5 07:09 ..
drwxr-xr-x   6    204B Jul  4 09:43 2017
-rw-r--r--   1     95B Jul  4 07:56 2017-W27-1.md
-rw-r--r--   1     29B Jul  4 07:57 2017-W27-2.md
-rw-r--r--   1     46B Jul  3 10:08 task.md
-rw-r--r--   1     29B Jul  5 07:10 today.md
-rw-r--r--   1    199B Jul  5 07:10 week-27.md
```

## Documents

* [Release Notes](docs/release.md)

## References
I've references these other repos for this project. You may want to check them out, they have
different approaches for journaling.

* https://github.com/uglow/devlog
* https://en.wikipedia.org/wiki/ISO_8601

## License
This software is licensed under the MIT Licence. See [license.md](license.md).
