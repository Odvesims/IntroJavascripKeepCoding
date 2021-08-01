export function pad_string(string, required_length){
  const padding_length = required_length - string.length;
  for(let i = 0; i < padding_length; i++){
    string += " ";
  }
  return string;
}

export function display_round_robin_header(){
  console.log(' ');
  console.log(' ');
  console.log('Groups and Teams');
  console.log('-------------------------------');
  console.log('-------------------------------');
}

export function display_round_robin_division_teams(division){
  console.log(' ');
  console.log(division.name);
  console.log('-----------------------');
  console.log(' ');
  division.group_teams.forEach(team => {
    console.log(team.name);
  });
}

export function display_round_robin_journeys(division, start_index, end_index, total_journeys, matches_per_journey){ 
  for(let i = 0; i < total_journeys; i++){
    console.log(' ');
    console.log(`Journey ${i + 1}`);
    console.log('-------------------------------');
    for(let x = start_index; x < end_index; x++){
      console.log(`${division.group_matches[x].home.name} vs ${division.group_matches[x].visitor.name}`);
    }
    start_index+= matches_per_journey;
    end_index+= matches_per_journey;
  };
}

export function display_tournament_header(tournament_name, year){
  console.log(' ');
  console.log(' ');
  console.log('------------------------------------------');
  console.log('------------------------------------------');
  console.log(`-----------${tournament_name} ${year} STARTS-----------`);
  console.log('------------------------------------------');
  console.log('------------------------------------------');
  console.log(' ');
  console.log(' ');
}

export function display_playoff_header() {
  console.log(' ');
  console.log(' ');
  console.log('------------------------------------------');
  console.log('------------------------------------------');
  console.log(`-----------PLAYOFF PHASE STARTS-----------`);
  console.log('------------------------------------------');
  console.log('------------------------------------------');
  console.log(' ');
}
export function display_playoff_phase_header(phase_name) {
  console.log(' ');
  console.log(`==== ${phase_name} ====`);
  console.log(' ');
}

export function display_tournament_winner(winner_name, tournament_name){
  console.log(' ');
  console.log('========================================');
  console.log(`${winner_name} ${tournament_name}'s winner!!`)
  console.log('========================================');

}

export function display_round_robin_matches(round_robin, total_journeys, matches_per_journey, start_index, end_index){
  for(let i = 0; i < total_journeys; i++){
    round_robin.divisions.forEach(division => {
      console.log(`${division.name} - Journey ${i + 1}`);
      console.log('-------------------------------');
      for(let x = start_index; x < end_index; x++){
        console.log(`${division.group_matches[x].home.name} ${division.group_matches[x].home.details.matches_details[i].goals_for} - ${division.group_matches[x].visitor.details.matches_details[i].goals_for} ${division.group_matches[x].visitor.name}`);
      }
      console.log(' ');
      console.log('------------------------------------------------------------------------------------');
      console.log('|Index|Team                   |Points | Goals For | Goals Against| Goals Difference|');
      console.log('------------------------------------------------------------------------------------');
      let index = 0;
      round_robin.arrange_teams(division.group_teams, i);
      division.group_teams.forEach(team => {
        let goals_for = team.details.matches_details[i].cummulative.goals_for;
        let goals_against = team.details.matches_details[i].cummulative.goals_against;
        let points = team.details.matches_details[i].cummulative.points;
        let goals_difference = team.details.matches_details[i].cummulative.goals_difference;
        console.log(`|${pad_string(index.toString(), 5)}|${pad_string(team.name, 23)}|${pad_string(points.toString(), 7)}|${pad_string(goals_for.toString(), 11)}|${pad_string(goals_against.toString(), 14)}|${pad_string(goals_difference.toString(), 17)}|`);
        index++;
      });
      console.log('------------------------------------------------------------------------------------');
      console.log(' ');
    });
    start_index += matches_per_journey;
    end_index += matches_per_journey;
  }
}

export function display_playoff_phase_matches(group_matches){
  group_matches.forEach(group_match => {
    let match_display = "";
    let count = 0;
    for(let count = 0; count < group_match.matches.length; count++){
      let match = group_match.matches[count];
      match_display += `${match.home.name} ${match.match_result.home.goals_for} - ${match.match_result.visitor.goals_for} ${match.visitor.name} `;
      if(group_match.matches.length > 1){
        if(count != group_match.matches.length - 1){
          match_display += ` => ${match.match_result.winner.name}`
          match_display = pad_string(match_display, 100);
          console.log(match_display);
          match_display = '';
        }
      }
    }
    let winning_team = group_match.matches[group_match.matches.length - 1].match_result.winner.name;
    match_display += ` => ${winning_team}`
    match_display = match_display;
    console.log(match_display);
  })
}

export function get_round_robin_qualified_teams(divisions, total_journeys){
  let qualified_teams = {first_placers: [], second_placers: [], third_placers: []};
  for(let i = 0; i < total_journeys; i++){
    divisions.forEach(division => {
      if(i == total_journeys - 1){
        qualified_teams.first_placers.push({division: division.name, team: division.group_teams[0]});
        qualified_teams.second_placers.push({division: division.name, team: division.group_teams[1]});
        qualified_teams.third_placers.push({division: division.name, team: division.group_teams[2]});
      };
    });
  };
  return qualified_teams;
}