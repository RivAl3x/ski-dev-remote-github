import * as moment from 'moment';

export class AppDateTimeUtils {

    static formatDate(date: Date, dateFormat = null) {
        if (!date) { return '-'; }
        return (dateFormat || 'dd-mm-yy').replace('yy', date.getFullYear()).replace('mm', ('0' + (date.getMonth() + 1)).slice(-2)).replace('dd', ('0' + date.getDate()).slice(-2));
    }

    static formatDateTime(date: Date, dateFormat = null) {
        if (!date) { return '-'; }
        return `${AppDateTimeUtils.formatDate(date, dateFormat)} ${AppDateTimeUtils.toStringTime(date)}`;

    }

    static toStringDate(date: Date, dateSeparator = '-') {
        if (!date) { return '-'; }
        dateSeparator = dateSeparator === null ? '-' : dateSeparator;
        return `${date.getFullYear()}${dateSeparator}${('0' + (date.getMonth() + 1)).slice(-2)}${dateSeparator}${('0' + date.getDate()).slice(-2)}`;
    }


    static toStringTime(date) {
        if (!date) { return '-'; }
        return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    }

    static toStringShortTime(date) {
        const time = AppDateTimeUtils.toStringTime(date).split(':');
        if (time.length < 2) { return '-'; }
        return `${time[0]}:${time[1]}`;
    }

    static toStringDateTime(date, utc = false): string {
        return `${AppDateTimeUtils.toStringDate(date)}${utc ? 'T' : ' '}${AppDateTimeUtils.toStringTime(date)}`;
    }

    static toStringShortDateTime(date, utc = false): string {
        return `${AppDateTimeUtils.toStringDate(date)}${utc ? 'T' : ' '}${AppDateTimeUtils.toStringShortTime(date)}`;
    }

    static toUtcStringDateTime(date): string {
        return `${AppDateTimeUtils.toStringDate(date)}T${AppDateTimeUtils.toStringTime(date)}`;
    }

    static toNumber(date): number {
        if (!date) { return 0; }
        const sDate = AppDateTimeUtils.toStringDate(date, '');
        const sTime = AppDateTimeUtils.toStringTime(date);
        const result = parseInt(`${sDate}${sTime.replace(/:/gi, '')}`, 10);
        return result || 0;
    }

    static toDate(date: string) {
        let result = new Date();
        if (date) {

            date = AppDateTimeUtils.ensureDateAsString(date);
            date = date.toLocaleLowerCase().replace('t', ' ').replace('z', '');
            const dateParts = date.split(' ');
            const [hh, mm, ss] = (dateParts.length > 1 ? dateParts[1].split(':') : []).map(i => parseInt(i) || 0);
            result = new Date(dateParts[0]);
            result.setHours(hh);
            result.setMinutes(mm);
            result.setSeconds(ss);
        }
        return result;

    }

    static get nowFormated(): string {
        return AppDateTimeUtils.toStringDateTime(new Date());
    }

    static ensureDateAsString(date): string {
        if (!date) { return this.nowFormated; }
        if (typeof date === 'string') {
            return date;
        }
        if (date.hasOwnProperty('_isValid')) {
            // is moment date
            return AppDateTimeUtils.toStringDateTime(date.toDate());
        }
        return AppDateTimeUtils.toStringDateTime(date);
    }
}