export const getCurrentHMDecimalFormat = () => {
  let hour = new Date().getHours();
  let minutes = (new Date().getMinutes() / 100).toString();
  let findPeriod = minutes.indexOf(".");
  let getMinutes = minutes.substring(findPeriod + 1);
  return `${hour}.${getMinutes}`;
};
