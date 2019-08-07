export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/*
Timezone adjustment flow
All times are stores in database in GMT+00 timezone
1. Mentor selects availabilities slots in format Sunday-9am-12pm
2. The slots are converted to times in format Sunday 9.00am
3. Times are converted to GMT+00 using mentor's timezone
4. When time is being displayed (on mentor's backlog/confirmed calls OR mentee's schedules), time is adjusted per mentee/mentor timezone
*/

/**
 * 
 * @param {string} day - e.g. Sunday
 * @param {number} startTimeIn24h - e.g. 2100
 * @param {number} slotsNum - number of slots to generate
 * @returns {{time: number, day: string}[]} - e.g. [{time: 2100, day: 'Sunday'}, ...]
 */
export function generateTimesfromStartOfSlot(day, startTimeIn24h, slotsNum) {
    let allTimes = []
    let dayMoved = false; // day is only going to be moved once possibly in one timeSlot
    while (slotsNum) {
        slotsNum--;
        allTimes.push({time: startTimeIn24h%2400, day: day});
        startTimeIn24h += 50; // increment by 30 min
        if (startTimeIn24h/2400 > 1 && !dayMoved) {
            day = moveDay(day, true); // move day forward if time is in next day, only possibility is moving day forward
            dayMoved = true;
        }
    }
    return allTimes;
}

/**
 * 
 * @param {string} time - e.g. 9.30pm
 * @returns {number} - e.g. 2150
 */
export function convertTo24hoursFromDatabaseTime(time)
{
    let viewerAdjustedTime = 0;
    let pm = time.substring(time.length-2) === 'pm'
    let parts = time.split('.');
    let minStr = parts[1].substring(0,2);
    let min = minStr === '30' ? 50 : 0;
    let hours = parts[0].length > 1 ? parseInt(parts[0].substring(0,2))*100 : parseInt(time[0])*100;
    if ( (pm && hours === 1200) || (!pm && hours === 1200) ) {
        hours = 0; //1200 will be added to pm, 12am needs to be reset to 0
    }
    viewerAdjustedTime = hours + (pm ? 1200 : 0) + min;
    return viewerAdjustedTime;
}

/**
 * 
 * @param {number} time - in 24 hr format 2350
 * @returns {string} - 12.30pm
 */
export function convertTo12h(time) {
    let hh = parseInt(time/100);
    let mm = (time%100)
    let mmString = mm === 50 ? `30` : `00`;
    let meridian = hh/12 > 1 && hh/12 < 2 ? 'pm' : 'am';
    return `${hh%12===0 ? 12: hh%12}.${mmString}${meridian}`
}

/**
 * 
 * @param {string} time - in format 9am or 12pm
 * @returns {number} - 2350
 */
export function convertTo24hoursFromSlotBeginning(time) {
    let pm = time.substring(time.length-2) === 'pm'
    let adjustedTime = 0;
    let hours = time.length > 3 ? parseInt(time.substring(0,2))*100 : parseInt(time[0])*100;
    if ( (pm && hours === 1200) || (!pm && hours === 1200) ) {
        hours = 0; //1200 will be added to pm, 12am needs to be reset to 0
    }
    adjustedTime = hours + (pm ? 1200 : 0);
    return adjustedTime;
}

/**
 * 
 * @param {string} day - e.g. Sunday
 * @param {bool} moveDayForward 
 */
export function moveDay(day, moveDayForward) {
    let dayInd = (days.indexOf(day) + (moveDayForward ? 1 : -1)) % days.length
    if (dayInd < 0) {
        return days[6];
    }
    return days[dayInd];
}

/**
 * @param {string[]} timeSlots - e.g. ['Sunday-9am-12pm', 'Monday-6pm-9pm']
 * @param {string} timezone - e.g. GMT+0600
 * @returns {string[]} - e.g. ['Sunday-9.00am', 'Sunday-9.30am', ...]
 */
export function adjustTimeForStorage(timeSlots, timezone) {
    let allTimesAdjusted = [];
    let GMTOffset = parseInt(timezone.substring(3));
    for (let slot in timeSlots) {
        console.log("converting slot:", slot)
        let parts = slot.split('-');
        let slotBegin = parts[1];
        let dayInfo = parts[0];
        // get 24h beginning of timeSlots
        console.log("slot begin is", slotBegin)
        let _24hBegin = convertTo24hoursFromSlotBeginning(slotBegin);
        // strip timezone from 24h time
        let timezoneStripped24h = _24hBegin - GMTOffset;
        let timeIn24h = timezoneStripped24h;
        let day = '';
        // move day forward
        if (timezoneStripped24h > 2400) {
            day = moveDay(dayInfo, true);
            timeIn24h = timezoneStripped24h % 2400;
        }
        // move day backward
        if (timezoneStripped24h < 0) {
            day = moveDay(dayInfo, false);
            timeIn24h = 2400+timezoneStripped24h;
        }
        // generate 6 times
        let timesFromSlot =  generateTimesfromStartOfSlot(day, timeIn24h, 6);
        allTimesAdjusted.push(timesFromSlot.map(timeSlot => {
            let _12hrTime = convertTo12h(timeSlot.time)
            console.log('time about to be stored is', `${timeSlot.day}-${_12hrTime}`);
            return `${timeSlot.day}-${_12hrTime}`;
        }))
    }
    return allTimesAdjusted;
}

/**
 * @param {string} time of format Sunday-9.30pm
 * @param {string} viewerGMT 
 * @returns {string} string of format Sunday 9.30pm
 */
export function convertToViewerTimeZone(time, viewerGMT) {
    let parts = time.split('-');
    let GMTOffset = 0;
    GMTOffset = parseInt(viewerGMT.substring(3))
    let adjustedTime = 0;
    adjustedTime = convertTo24hoursFromDatabaseTime(parts[1]) + GMTOffset;
    let day = parts[0];
    let timeIn24h = adjustedTime;
    // move day forward
    if (adjustedTime > 2400) {
        day = moveDay(parts[0], true);
        timeIn24h = adjustedTime%2400;
    }
    // move day backward
    if (adjustedTime < 0) {
        day = moveDay(parts[0], false);
        timeIn24h = 2400+adjustedTime;
    }
    let timeDisplay = `${day} ${convertTo12h(timeIn24h)}`.replace('{"','');
    return (timeDisplay);
}