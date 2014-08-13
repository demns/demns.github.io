(function() {
  var body = document.body,
    timeOfDayDiv = document.getElementsByClassName('currentTimeOfDay')[0],
    currentTimeOfDay = getCurrentPeriod(),
    humanImageDiv = document.getElementById('humanImage'),
    computerImageDiv = document.getElementById('computerImage');

  humanImageDiv.onclick = function() {
    console.log('human first');
  };
  computerImageDiv.onclick = function() {
    console.log('computer first');
  };

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