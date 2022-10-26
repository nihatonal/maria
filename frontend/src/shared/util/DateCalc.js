import { useState, useEffect } from "react";

export const DateCalc = (date) => {
  let data;
  let today = new Date();
  let diffMs = today - date; // milliseconds between now & Christmas
  let diffDays = Math.floor(diffMs / 86400000); // days
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  if (diffDays === 0 && diffHrs === 0) {
    data = diffMins + " мин ";
  } else if (diffDays === 0) {
    data = diffHrs + " ч " + diffMins + " мин ";
  } else {
    data = diffDays + " дня " + diffHrs + " ч " + diffMins + " мин ";
  }
  return data + "назад";
};
