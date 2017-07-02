#!/usr/bin/env node
'use strict';

var APP = APP || {};
APP.Journ = function (mode) {

	var Dater = require('./lib/dater');
	var util = require('./lib/util');

	var dater = new Dater();

	var HELP_FLAG = 'help';
	var LIST_FLAG = 'list';
	var NEW_FLAG = 'new';
	var SETUP_FLAG = 'setup';
	var CONFIG_FLAG = 'config';
	var WRITE_FLAG = '.';

	//PRIVATE
	var config = function () {
		console.log("====== config ======");
		util.makeCfg();
	}

	var setup = function () {
		console.log("==== setup ====");
		var cfg = util.readCfg();
		util.makeFileSystem(cfg);
		console.log("Create file system at: ", cfg.journdir);
	};

	var showHelp = function () {
		var cfg = util.readCfg();
		console.log("====== JOURN USAGE ======\n");
		console.log("journ ", "without args will display journal status.");
		console.log("journ ", HELP_FLAG, " displays help.");
		console.log("journ ", CONFIG_FLAG, " will enter the configurator.");
		console.log("Your logfile is ", cfg.logfile);
		console.log("\n");
	};

	var showList = function () {
		console.log("====== showList ======");
	}

	var showStatus = function () {
		var cfg = util.readCfg();
		console.log("====== showStatus ======");
		console.log(cfg);
		console.log("Current Week ", dater.weekOfYear());
	}

	var write = function (arr) {
		var cfg = util.readCfg();
		var newline =  "* " + arr.join(" ") + "\n";
		util.writeTodayLog(cfg, newline);
	};

	//PUBLIC
	return {
		config: config,
		setup: setup,
		showHelp : showHelp,
		showStatus: showStatus,
		write: write,
		HELP_FLAG: HELP_FLAG,
		LIST_FLAG: LIST_FLAG,
		NEW_FLAG: NEW_FLAG,
		SETUP_FLAG: SETUP_FLAG,
		CONFIG_FLAG: CONFIG_FLAG,
		WRITE_FLAG: WRITE_FLAG

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
			case Journ.LIST_FLAG:
				Journ.showList();
				break;
			case Journ.WRITE_FLAG:
				args.shift(); // node
				args.shift(); // journ exe
				args.shift(); // . flag
				Journ.write(args);
				break;
			default:
				Journ.showHelp();
		}
	} else {
		Journ.showStatus();
	}
}
