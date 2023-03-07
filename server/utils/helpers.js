function dateFormat (date) {
    return new Date(date).toLocaleString("en-us", {
        localeMatcher: "best fit",
        weekday: undefined,
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

module.exports = dateFormat;