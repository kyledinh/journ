var fs = require('fs');
var concat = require('concat-files');
var markdownpdf = require("markdown-pdf");
var userhome = require('userhome');
var Dater = require('./dater');

require.extensions['.css'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var pdfcss = require("../assets/pdf.css");

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
        fs.statSync("./journ.cfg.json");
    } catch (err) {
        console.log("ERROR: missing journ.cfg.json");
        return false;
    }

    var cfg = cfg || JSON.parse(fs.readFileSync("./journ.cfg.json", "utf8"));

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

function mdToPdf (md, pdf, options) {
    fs.createReadStream(md)
        .pipe(markdownpdf(options))
        .pipe(fs.createWriteStream(pdf));
}

function weekSummary (cfg) {
    var cfg = cfg || JSON.parse(fs.readFileSync("./journ.cfg.json", "utf8"));
    if (checkAllSystems(cfg)) {
        console.log("==== weekSummary ====");

        var dater = new Dater();
        var weekSummaryMd = cfg.journdir + "/week-" + dater.weekOfYear() + ".md";
        var weekSummaryPdf = cfg.journdir + "/week-" + dater.weekOfYear() + ".pdf";
        var options = cfg.pdfcss ? { cssPath: cfg.pdfcss } : {};
        //console.log("options: ", options);

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

        fs.closeSync(fs.openSync(weekSummaryMd, 'w'));
        //fs.truncateSync(weekSummaryMd, 0);
        concat(files, weekSummaryMd, function(err) {
            if (err) {
                console.log("Error concating files: ", err);
            } else {
                mdToPdf(weekSummaryMd, weekSummaryPdf, options);
            }
        });
    }
}

module.exports.processWeek = function (int) {
    processWeek(int);
};

module.exports.lastWeek = function () {
    lastWeek();
};

module.exports.weekSummary = function (cfg) {
    weekSummary(cfg);
};

module.exports.dirSlash = function (str) {
    return dirSlash(str);
};

module.exports.makeCfg = function (str) {
    try {
        fs.statSync("./journ.cfg.json");
        console.log("journ.cfg.json already exist!! Remove to create another.");
    } catch (err) {
        var config = {
            journdir: userhome() + "/journ",
            todayfile: userhome() + "/journ/today.md",
            taskfile: userhome() + "/journ/task.md",
            pdfcss: userhome() + "/journ/pdf.css"
        };
		try {
            fs.writeFile("./journ.cfg.json", JSON.stringify(config));
		} catch (err) {
			console.log("Error writing to config file! \n", err);
		}
    }
    console.log("config: ", JSON.stringify(config));
};

module.exports.makeFileSystem = function (cfg) {
    ensureExists(cfg.journdir, 0744, function(err) {
        if (err) {
            console.log("Error with setup of ", cfg.journdir);
        } else {
            fs.writeFileSync(cfg.pdfcss, pdfcss);
            console.log("Created pdf.css");
        }
    });
};

module.exports.recordLog = function () {

    var cfg = JSON.parse(fs.readFileSync("./journ.cfg.json", "utf8"));
    var dater = new Dater();

    try {
        var filestat = fs.statSync(cfg.todayfile);
        // var adate = new Date(Date.parse(filestat.atime));
        // var target = cfg.journalfile = dirSlash(cfg.journdir) + dater.fileNameFromDate(adate) + ".md";
        var lines = fs.readFileSync(cfg.todayfile, "utf-8").split("\n").filter(Boolean);
        var target = cfg.journalfile = dirSlash(cfg.journdir)
            + lines[0].substring(lines[0].indexOf("# ") +2,lines[0].indexOf(" :"))
            + ".md";

        fs.rename(cfg.todayfile, target);
        console.log("wrote to file: ", target);
        // /Users/kyle/journ/2017-W28-5.md

    } catch (err) {
        console.log("error moving today.md to archive");
    }

    var today = new Dater();
    var newline = "## " + today.fileName() + " : " + dater.dspLongDate(new Date()) + "\n";
    createTodayFile(cfg, newline);
};

module.exports.readCfg = function () {
    try {
        fs.statSync("./journ.cfg.json");
        try {
            return JSON.parse(fs.readFileSync("./journ.cfg.json", "utf8"));
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
