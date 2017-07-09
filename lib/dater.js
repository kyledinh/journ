function weekNumberMondayStart(date) {
    var instance;

    if (typeof date === 'string' && date.length) {
        instance = new Date(date);
    } else if (date instanceof Date) {
        instance = date;
    } else {
        instance = new Date();
    }

    // Create a copy of this date object
    var target = new Date(instance.valueOf());

    // ISO week date weeks start on monday
    // so correct the day number
    var dayNr = (instance.getDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week
    // with the first thursday of that year.
    // Set the target date to the thursday in the target week
    target.setDate(target.getDate() - dayNr + 3);

    // Store the millisecond value of the target date
    var firstThursday = target.valueOf();

    // Set the target to the first thursday of the year
    // First set the target to january first
    target.setMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }

    // The weeknumber is the number of weeks between the
    // first thursday of the year and the thursday in the target week
    var weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
    return weekNumber;
}

function fmtWeekISO8601 (weekNumber) {
    // forces weekNumber to be two digits, ie 07 for 7th week and prepend "W"
    weekNumber = (weekNumber < 10) ? '0' + weekNumber : weekNumber;
    return "W" + weekNumber;
}

var Dater = function () {

    var now = new Date();

    var dspLongDate = function (date) {
        // Uses the Javascript Date Object
        var date = date || now;
        var monthNames = [
          "Jan", "Feb", "Mar",
          "Apr", "May", "Jun", "Jul",
          "Aug", "Sep", "Oct",
          "Nov", "Dec"
        ];
        var dayNames = [
            "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var day = date.getDate();
        var dayIndex = date.getDay();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return dayNames[dayIndex] + ' ' + monthNames[monthIndex] + ' ' + day + ' ' + year;
    }

    var adjustDays = function (days) {
        now.setDate(now.getDate() + days);
    }

    var dayOfMonth = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return now.getDate();
    }
    var dayOfWeek = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return now.getDay() === 0 ? 7 : now.getDay();
    }
    var weekOfYear = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return weekNumberMondayStart(now);
    }

    var getWeekISO = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return fmtWeekISO8601(weekNumberMondayStart(now));
    }

    var monthNum = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return now.getMonth() +1;
    }

    var fileName = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        return now.getFullYear() + "-" + fmtWeekISO8601(weekNumberMondayStart(now)) + "-" + dayOfWeek();
    }

    var fileNameFromDate = function (date) {
        //force date argument
        return now.getFullYear() + "-" + fmtWeekISO8601(weekNumberMondayStart(date)) + "-" + dayOfWeek();
    }

    var listDayFilesForWeek = function (str) {
        now = (str !== undefined) ? new Date(Date.parse(str)) : now;
        var week = weekNumberMondayStart(now);
        var year = now.getFullYear();
        var i, arr = [];
        for (i=7; i > 0; i--) {
            arr.push(year + "-" + fmtWeekISO8601(week) + "-" + i + ".md");
        }
        return arr;
    }

    return {
        dayOfWeek: dayOfWeek,
        weekOfYear: weekOfYear,
        getWeekISO: getWeekISO,
        monthNum: monthNum,
        adjustDays: adjustDays,
        listDayFilesForWeek: listDayFilesForWeek,
        fileName: fileName,
        fileNameFromDate: fileNameFromDate,
        dspLongDate : dspLongDate
    }
};

module.exports = function () {
    return new Dater();
};
