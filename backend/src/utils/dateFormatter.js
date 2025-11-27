// src/utils/dateFormatter.js
function padTwoDigits(num) {
    return num.toString().padStart(2, "0");
  }
  
// Added default value "new Date()" to the argument
export function dateInYyyyMmDdHhMmSs(date = new Date(), dateDivider = "-") {
return (
    [
    date.getFullYear(),
    padTwoDigits(date.getMonth() + 1),
    padTwoDigits(date.getDate()),
    ].join(dateDivider) +
    "_" + // Changed space to underscore for safer filenames
    [
    padTwoDigits(date.getHours()),
    padTwoDigits(date.getMinutes()),
    padTwoDigits(date.getSeconds()),
    ].join("-") // Changed colon to dash for safer filenames
);
}