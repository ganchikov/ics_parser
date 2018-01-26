const ical = require('ical');
const json2csv = require('json2csv');
const fs = require('fs');
const moment = require('moment-timezone');

const inputData = ical.parseFile('./data/calendar-sample.ics');

class CalendarItem {
    constructor (person, reason, start, end, stamp) {
        this.person = person;
        this.reason = reason;
        this.start = start;
        this.end = end;
        this.stamp = stamp
    }
};

const dateFormat = "MM-DD-YY"

const calendarItems = []; 

for (let item in inputData){
    if (inputData.hasOwnProperty(item)) {
    const event = inputData[item]
    if (event.type === "VEVENT") {
        calendarItems.push(new CalendarItem(event.organizer.params.CN, event.description, 
                                            moment(event.start).format(dateFormat),
                                            moment(event.end).format(dateFormat), event.dtstamp))
        /*console.log(
            "Conference", 
            event.summary,
            'is in',
            event.location,
            'on the', event.start.getDate(), 'of', months[event.start.getMonth()]);*/
    }
    }        
} 

const parserFields = [
            'person',
            'reason',
            'start',
            'end',
            'stamp'
            ]

const csv = json2csv({data: calendarItems, fields: parserFields, quotes: '', newLine: '\r\n'});

fs.writeFile('./data/output.csv', csv, function(err){
    if (err) throw err
    console.log('file saved');
})


