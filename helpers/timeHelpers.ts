import { Temporal } from "@js-temporal/polyfill";

export function msToHours(time: number | null | undefined) {
    if (time === null || time === undefined) return null;

    const d = Temporal.Duration
        .from({ milliseconds: time })
        .round({ largestUnit: 'hour', smallestUnit: 'second',  roundingMode: 'trunc'});

    const hhmmss = [d.hours, d.minutes, d.seconds]
        .map(n => String(n).padStart(2, '0'))
        .join(':')

    return hhmmss

}
export function msToMinutes(time: number | null | undefined) {
    if (time === null || time === undefined) return null;

    const d = Temporal.Duration
        .from({ milliseconds: time })
        .round({ largestUnit: 'minute', smallestUnit: 'second',  roundingMode: 'trunc'});

    const hhmmss = [d.minutes, d.seconds]
        .map(n => String(n).padStart(2, '0'))
        .join(':')

    return hhmmss

}