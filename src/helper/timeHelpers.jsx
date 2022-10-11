var dayjs = require('dayjs');

//get time difference between current time and specified time and update it to a readable format
export const getTimeDifference = (time) => {

    const timeDifference = dayjs().diff(dayjs(time), 'seconds');
    if (timeDifference < 60) {
        if (timeDifference === 1) {
            return `${timeDifference} second ago`;
        } else {
            return `${timeDifference} seconds ago`;
        }
    } else if (timeDifference < 3600) {
        const minutes = Math.floor(timeDifference / 60);
        if (minutes === 1) {
            return `${minutes} minute ago`;
        } else {
            return `${minutes} minutes ago`;
        }
    } else if (timeDifference < 86400) {
        const hours = Math.floor(timeDifference / 3600);
        if (hours === 1) {
            return `${hours} hour ago`;
        } else {
            return `${hours} hours ago`;
        }
    } else {
        const days = Math.floor(timeDifference / 86400);
        if (days === 1) {
            return `${days} day ago`;
        } else {
            return `${days} days ago`;
        }
    }
}

