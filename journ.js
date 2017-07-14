#!/usr/bin/env node
'use strict';

var APP = APP || {};
APP.Journ = function (mode) {

	var Dater = require('./lib/dater');
	var api = require('./lib/api');

	var dater = new Dater();

	var HELP_FLAG = 'help';
	var LIST_FLAG = 'list';
	var NEW_FLAG = 'new';
	var SETUP_FLAG = 'setup';
	var CONFIG_FLAG = 'config';
	var WEEK_FLAG = 'week';
	var WRITE_FLAG = '.';
	var ADD_TASK_FLAG = '+';

	//PRIVATE
	var config = function () {
		console.log("====== config ======");
		api.makeCfg();
	};

	var setup = function () {
		console.log("==== setup ====");
		var cfg = api.readCfg();
		api.makeFileSystem(cfg);
		console.log("Create file system at: ", cfg.journdir, cfg);
	};

	var newDay = function () {
		console.log("===== A New Day ====");
		api.recordLog();
	};

	var processWeek = function (int) {
		if (!isNaN(int)) {
			api.processWeek(int * -1);
		} else {
			api.lastWeek();
		}
	};

	var weekSummary = function (cfg) {
		var cfg = cfg || api.readCfg();
		api.weekSummary(cfg);
	}

	var showHelp = function () {
		var cfg = api.readCfg();
		console.log("====== JOURN USAGE ======\n");
		console.log("journ ", "without args will display journal status.");
		console.log("journ ", HELP_FLAG, " displays help.");
		console.log("journ ", CONFIG_FLAG, " will create a journ.cfg.json file.");
		console.log("journ ", SETUP_FLAG, " creates the file system.");
		console.log("journ ", WRITE_FLAG, "'new entry' will append to the today.md.");
		console.log("journ ", NEW_FLAG, " will archive today.md and start a new one.");
		console.log("Your working directory is ", cfg.journdir);
		console.log("\n");
	};

	var showStatus = function () {
		var cfg = api.readCfg();
		console.log("====== showStatus ======");
		console.log(cfg);
		console.log("Current Week ", dater.weekOfYear());
		console.log("journ ", HELP_FLAG, " displays help.");
	};

	var write = function (arr) {
		var cfg = api.readCfg();
		var newline =  "* " + arr.join(" ") + "\n";
		api.writeTodayLog(cfg, newline);
	};

	var addTask = function (arr) {
		var cfg = api.readCfg();
		var newline =  "* [ ] " + arr.join(" ") + "\n";
		api.addTask(cfg, newline);
	};

	//PUBLIC
	return {
		config: config,
		setup: setup,
		newDay: newDay,
		processWeek: processWeek,
		showHelp : showHelp,
		showStatus: showStatus,
		weekSummary: weekSummary,
		write: write,
		addTask: addTask,
		HELP_FLAG: HELP_FLAG,
		NEW_FLAG: NEW_FLAG,
		SETUP_FLAG: SETUP_FLAG,
		CONFIG_FLAG: CONFIG_FLAG,
		WRITE_FLAG: WRITE_FLAG,
		ADD_TASK_FLAG: ADD_TASK_FLAG,
		WEEK_FLAG: WEEK_FLAG

	}
};

if (process.env.NODE_ENV !== 'test') {
	var Journ = new APP.Journ;

	/* journ {args} first arg is the node exe then the program, then args
	 * [ '/usr/local/bin/node', '/Users/kyle/code/journ/journ.js', { args } ]
	 */

	if (process.argv.length > 2) {
		var args = process.argv;
		switch (args[2]) {
			case Journ.CONFIG_FLAG:
				Journ.config();
				break;
			case Journ.SETUP_FLAG:
				Journ.setup();
				break;
			case Journ.HELP_FLAG:
				Journ.showHelp();
				break;
			case Journ.NEW_FLAG:
				Journ.newDay();
				Journ.weekSummary();
				break;
			case Journ.WEEK_FLAG:
				Journ.processWeek(args[3]);
				Journ.weekSummary();
				break;
			case Journ.WRITE_FLAG:
				Journ.write(args.slice(3));
				break;
			case Journ.ADD_TASK_FLAG:
				Journ.addTask(args.slice(3));
				break;
			default:
				Journ.showHelp();
		}
	} else {
		Journ.showStatus();
		Journ.weekSummary();
	}
}
