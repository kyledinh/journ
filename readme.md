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
kyle@KMBP:~/journ$ ll
total 48
drwxr--r--  10 kyle  staff   340B Jul  4 07:57 .
drwxr-xr-x+ 50 kyle  staff   1.7K Jul  4 07:56 ..
drwxr-xr-x   2 kyle  staff    68B Jul  4 09:34 2017
-rw-r--r--   1 kyle  staff    95B Jul  4 07:56 2017-27-1.md
-rw-r--r--   1 kyle  staff    46B Jul  3 10:08 task.md
-rw-r--r--   1 kyle  staff    29B Jul  4 07:57 today.md
-rw-r--r--   1 kyle  staff   170B Jul  4 08:42 week-27.md

```


## References
I've references these other repos for this project. You may want to check them out, they have
different approaches for journaling.

* https://github.com/uglow/devlog


## License
This software is licensed under the MIT Licence. See [license.md](license.md).
