(function() {
  var body = document.body,
    timeOfDayDiv = document.getElementsByClassName('currentTimeOfDay')[0],
    currentTimeOfDay = getCurrentPeriod();

  body.className += ' ' + currentTimeOfDay;
  timeOfDayDiv.innerHTML = currentTimeOfDay + ' mode';

}())

function getCurrentPeriod() {
  var time = new Date(),
    hour = time.getHours();

  if (hour >= 17) {
    return 'evening';
  } else if (hour >= 12) {
    return 'afternoon';
  } else if (hour >= 7) {
    return 'morning';
  } else if (hour >= 0) {
    return 'midnight';
  }
  return 'morning';
}