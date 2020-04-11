// This class helps with parsing an entire recording that spans several days, into one-day recordings
// that start at 0:00:00 and ends at 23:59:59, except for the first and last day of a recording range
export default class TimeUtilities
{
	constructor(){}


  static get full_day_ms()
  {
    return 86400000;
  }

  static get_days_between(start_date, end_date)
  {
  	// 	let startDate = moment.parseZone("2020-03-15T18:31:23.623794-04:00");
		// let endDate 	= moment.parseZone("2020-03-23T12:17:06.815451-04:00");
  	let startDate = moment.parseZone(start_date);
		let endDate 	= moment.parseZone(end_date);
		let duration  = moment.duration(endDate.diff(startDate));
    let days 			= Math.ceil(duration.asDays());

		let start,end;
		let days_array = [];

    for(let i = 0; i<=days; i++){

      if(startDate.date() === endDate.date())
      {
        start = startDate;
        end = endDate;
      }
      else
      {
        if(i == 0){
          start = startDate;
          end = moment(startDate).endOf("day");
        }else if(i == days){
          start = moment(endDate).startOf('day');
          end = endDate;
        } else {
          start = moment(startDate).add('days', i).startOf('day');
          end = moment(startDate).add('days', i).endOf('day');
        }
      }


		  days_array.push({
		  	start: moment(start),
		  	end: moment(end),
		  	duration_in_seconds: moment.duration(moment(end).diff(moment(start))).asSeconds(),
        absolute_start_date: start_date,
        absolute_end_date: end_date
		  })

		}

		return days_array;
  }

}

