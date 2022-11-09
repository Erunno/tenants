import moment from "moment/moment";

export default function countDays(from, to) {
    return (to ?? moment()).diff(from, 'days') + 1;
}