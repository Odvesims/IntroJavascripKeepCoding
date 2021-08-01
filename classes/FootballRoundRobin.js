import TournamentPhase from "./TournamentPhase.js";
import FootballMatch from "./FootballMatch.js";


export default class FootballRoundRobin extends TournamentPhase {
  constructor(teams, divisions, scoring_config, group_names){
    super(teams, divisions, scoring_config, group_names);
    this.divide_teams();
  }

  divide_teams(){
   let teams_array = this.teams;
   let max_amount = this.teams.length / this.divisions.length
   for(let i = 0; i < this.divisions.length; i++){
     this.divisions[i] = {name: '', group_teams: [], matched_teams: [], group_matches: []};
    for(let n = 0; n < max_amount; n++){
      let random_index = Math.floor(Math.random() * teams_array.length);
      this.divisions[i].group_teams.push(teams_array[random_index]);
      this.divisions[i].name = this.group_names[i];
      teams_array.splice(random_index, 1);
    }
   }
  }

  play_matches(){
    this.divisions.forEach(division => {
      const temporary_matches = division.matched_teams;
      const journeys = temporary_matches.length / 2;
      const matches_per_journey = temporary_matches.length / journeys; 
      let forward_index = 0;
      let reverse_index = temporary_matches.length - 1;
      for(let i = 0; i < temporary_matches.length / 2; i++){
        let forward = temporary_matches[forward_index];
        let backward = temporary_matches[reverse_index];
        for(let x = 0; x < matches_per_journey; x++){
          let teams_playing = forward;
          if(x % 2 != 0){
            teams_playing = backward;
          }
          const match = new FootballMatch(teams_playing.home, teams_playing.visitor, this.scoring_config);
          match.play_match(10);
          division.group_matches.push(match); 
        }
        forward_index++;
        reverse_index--;
      }
    });
  }
  
  set_up_matches(){
    let max_as_home = Math.round(this.divisions[0].group_teams.length / 2);
    for(let i = 0; i < this.divisions.length; i++){
      const group = this.divisions[i].group_teams;
      for(let x = 0; x < group.length; x++){
        let playing_as_home = 1;
        for(let n = x + 1; n < group.length; n++){
          let home = group[x];
          let visitor = group[n];
          if(playing_as_home === max_as_home){ //If current team has reached max times it can play as home, switch it to visitor.
            home = group[n];
            visitor = group[x];
          }
          const match_teams = {home: home, visitor: visitor}
          this.divisions[i].matched_teams.push(match_teams);
          playing_as_home++;
        }
      } 
    }
  }

  arrange_teams(teams, index){
    let team_a_name, team_b_name;
    teams.sort(function(team_a, team_b) {
      if(!team_a.hasOwnProperty('division')){
        team_a_name = team_a.name; 
        team_b_name = team_b.name;
        team_a = team_a.details.matches_details[index].cummulative;
        team_b = team_b.details.matches_details[index].cummulative;
      } else {
        team_a_name = team_a.team.name;
        team_b_name = team_b.team.name;
        team_a = team_a.team.details.matches_details[index].cummulative;
        team_b = team_b.team.details.matches_details[index].cummulative;
      }
        return team_a.points - team_b.points || (team_b.goals_difference * -1) - (team_a.goals_difference * -1) || team_b_name.localeCompare(team_a_name);
    });
    teams.reverse();
  }

  
}