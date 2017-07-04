var fs = require('fs');
var concat = require('concat-files');
var userhome = require('userhome');
var Dater = require('./dater');

function dirSlash (str) {
    if (str.endsWith('/')) {
        return str;
    }
    return str + "/";
};

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

function createTodayFile (cfg, newline) {
    var file = cfg.todayfile;
    try {
        fs.statSync(file);
        fs.appendFileSync(file, newline);
    } catch (err) {
        try {
            fs.writeFileSync(file, newline);
            console.log("written to today.md ", newline);
        } catch (err) {
            console.log("Error writing to today.md ", file);
        }
    }
}

function lastWeek () {
    var dater = new Dater();
    var weekSummary = dater.weekOfYear();
    dater.adjustDays(-7);
    var lastWeek = dater.weekOfYear();
    console.log("Weeks: ", weekSummary, " and last Week: ", lastWeek);
}

function processWeek (int) {
    var weeksAgo = int * -1;
    console.log("processing week ", weeksAgo);
}

function checkAllSystems (cfg) {
    try {
        fs.statSync('./journ.cfg.json');
    } catch (err) {
        console.log("ERROR: missing journ.cfg.json");
        return false;
    }

    var cfg = cfg || JSON.parse(fs.readFileSync('./journ.cfg.json', 'utf8'));

    try {
        fs.statSync(cfg.todayfile);
    } catch (err) {
        console.log("ERROR: missing today.md");
        return false;
    }

    try {
        fs.statSync(cfg.taskfile);
    } catch (err) { console.log("ERROR: missing task.md");
        return false;
    }

    return true;
}

function weekSummary (cfg) {
    console.log("cfg in weekSummary", cfg);
    var cfg = cfg || JSON.parse(fs.readFileSync('./journ.cfg.json', 'utf8'));
    if (checkAllSystems(cfg)) {
        console.log("==== weekSummary ====");

        var dater = new Dater();
        var weekSummaryFile = cfg.journdir + "/week-" + dater.weekOfYear() + ".md";
        var allfiles = dater.listDayFilesForWeek();
        allfiles.unshift("today.md");
        allfiles.unshift("task.md");
        allfiles.unshift("preamble.md");
        var files = [];

        allfiles.forEach(function (file) {
            if (fs.existsSync(cfg.journdir + "/"+ file)) {
                files.push(cfg.journdir + "/"+ file);
            }
        });
        console.log(files);

        fs.truncate(weekSummaryFile, 0, function() {
            concat(files, weekSummaryFile, function(err) {
                if (err) {
                    console.log("Error concating files: ",err);
                }
            });
        });
    }
}

module.exports.processWeek = function (int) {
    processWeek(int);
};

module.exports.lastWeek = function () {
    lastWeek();
};

module.exports.weekSummary = function () {
    weekSummary();
};

module.exports.dirSlash = function (str) {
    return dirSlash(str);
};

module.exports.makeCfg = function (str) {
    try {
        fs.statSync('./journ.cfg.json');
        console.log("journ.cfg.json already exist!! Remove to create another.");
    } catch (err) {
        var config = {
            journdir: userhome() + "/journ",
            todayfile: userhome() + "/journ/today.md",
            taskfile: userhome() + "/journ/task.md"
        };
		try {
            fs.writeFile('./journ.cfg.json', JSON.stringify(config));
		} catch (err) {
				console.log("Error writing to config file! \n", err);
		}
    }
    console.log("config: ", JSON.stringify(config));
};

module.exports.makeFileSystem = function (cfg) {
    ensureExists(cfg.journdir, 0744, function(err) {
        if (err) // handle folder creation error
        { } else { }// we're all good
    });
};

module.exports.recordLog = function (days) {

    var cfg = JSON.parse(fs.readFileSync('./journ.cfg.json', 'utf8'));

    var dater = new Dater();
    if (days !== undefined) {
        dater.adjustDays(days);
    } else {
        dater.adjustDays(-1); // yesterday
    }

    try {
        var target = cfg.journalfile = dirSlash(cfg.journdir)  + dater.fileName() + ".md";
        fs.rename(cfg.todayfile, target);
        console.log("wrote to file: ", target);
    } catch (err) {

    }

    var today = new Dater();
    var newline = "# " + today.fileName() + " : " + dater.dspLongDate(new Date()) + "\n";
    createTodayFile(cfg, newline);

};

module.exports.readCfg = function () {
    try {
        fs.statSync('./journ.cfg.json');
        try {
            return JSON.parse(fs.readFileSync('./journ.cfg.json', 'utf8'));
        } catch (err) {
            console.log("ERROR parsing config file. Needs fixing.\n", err);
        }
    } catch (err) {
        console.log("No config file! Please create a config file with 'journ config' command.\n");
    }
};

module.exports.writeTodayLog = function (cfg, newline) {

    ensureExists(cfg.journdir, 0744, function(err) {
        if (err) // handle folder creation error
        { } else { }// we're all good
    });

    var file = cfg.todayfile;
    try {
        fs.statSync(file);
        fs.appendFileSync(file, newline);
    } catch (err) {
        try {
            fs.writeFileSync(file, newline);
            console.log("written to today.md ", newline);
        } catch (err) {
            console.log("Error writing to today.md ", file);
        }
    }
};

module.exports.addTask = function (cfg, newline) {

    ensureExists(cfg.journdir, 0744, function(err) {
        if (err) // handle folder creation error
        { } else { }// we're all good
    });

    var file = cfg.taskfile;
    try {
        fs.statSync(file);
        fs.appendFileSync(file, newline);
    } catch (err) {
        try {
            fs.writeFileSync(file, newline);
            console.log("written to task.md ", newline);
        } catch (err) {
            console.log("Error writing to task.md ", file);
        }
    }
};
