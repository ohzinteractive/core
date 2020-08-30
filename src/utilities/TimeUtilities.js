export default class TimeUtilities
{
  constructor()
  {}

  // Converts a time string (00:00:00.45) into miliseconds
  time_str_to_ms(time_str)
  {
    time_str = time_str.split(':');

    let hours = Number(time_str[0]);
    hours = hours * 60 * 60 * 1000;

    let minutes = Number(time_str[1]);
    minutes = minutes * 60 * 1000;

    let seconds = Number(time_str[2]);
    seconds = seconds * 1000;

    return hours + minutes + seconds;
  }
}
