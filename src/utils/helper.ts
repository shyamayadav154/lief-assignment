import { differenceInDays, format } from "date-fns";

export function relativeDay(date: Date | null) {
    if (date == null) return null;
    const today = new Date();
    const difference = differenceInDays(date, today);
    if (difference === 0) {
        return "Today";
    } else if (difference === 1) {
        return "Tomorrow";
    } else if (difference === -1) {
        return "Yesterday";
    } else {
        return format(date, "PPP");
    }
}
