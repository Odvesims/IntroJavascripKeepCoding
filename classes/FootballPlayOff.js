import TournamentPhase from './TournamentPhase.js';
import FootballMatch from './FootballMatch.js';

export default class FootballPlayOff extends TournamentPhase{

  constructor(teams, divisions, scoring_config, group_names){
    super(teams, divisions, scoring_config, group_names);
    this.divisions[0] = {name: group_names[0], group_teams: [], matched_teams: [], group_matches: []};
    this.home_teams = [];
    this.visitor_teams = [];
  }

  /* Divide the teams that qualified from the group phases */

  divide_teams(){
    var first_placers = this.teams.first_placers.reverse();
    var second_placers = this.teams.second_placers;
    var third_placers = this.teams.third_placers;
    this.home_teams = first_placers;
    this.visitor_teams = third_placers;
    for(let i = 0; i < second_placers.length; i++){
      let second_placer = second_placers[i];
      var found = false;
      for(let x = 0; x < third_placers.length; x++){
        let third_placer = third_placers[x];
        if(second_placer.division === third_placer.division){
          found = true;
          break;
        }
      };
      if(!found){
        this.home_teams.push(second_placer);
        second_placers.slice(i, 1)
      } else{
        this.visitor_teams.push(second_placer);
      }
    };
    this.divisions[0].teams = [...this.home_teams, ...this.visitor_teams];
  }

  /* Set the matches for the qualified teams */
  
  set_up_matches(){
    let total_home_teams = this.home_teams.length;
    for(let i = 0; i < this.home_teams.length; i++){
      let home_team = this.home_teams[i];
      for(let x = 0; x < this.visitor_teams.length; x++){
        let visitor_team = this.visitor_teams[x];
        if(home_team.division !== visitor_team.division){
          let match_teams = {home: home_team, visitor: visitor_team}
          this.divisions[0].matched_teams.push(match_teams);
          this.home_teams.splice(i, 1);
          this.visitor_teams.splice(x, 1);
          break;
        }
      }
      if(this.divisions[0].matched_teams !== total_home_teams){
        i = -1;
      }
    }
  }

  play_matches(){
    let play_off_matches = this.divisions[0].matched_teams.length / 2;
    let first_batch = this.divisions[0].matched_teams.slice(0, play_off_matches);
    let second_batch = this.divisions[0].matched_teams.slice(play_off_matches, this.divisions[0].matched_teams.length);
    for(let i = 0; i < first_batch.length; i++){
      let match_teams = first_batch[i];
      this.play_off_matches(match_teams.home.team, match_teams.visitor.team, i);
    }
    for(let i = 0; i < second_batch.length; i++){
      let second_match_teams = second_batch[i];
      this.play_off_matches(second_match_teams.home.team, second_match_teams.visitor.team, i + play_off_matches);
    }
  }

  play_off_matches(home, visitor, index){
    let matches_array = []
    const match = new FootballMatch(home, visitor, this.scoring_config);
    match.play_match(10);
    matches_array.push(match);
    let match_score = (match.match_result.home.goals_difference - match.match_result.visitor.goals_difference); 
    while(match_score === 0){
      const match = new FootballMatch(home, visitor, this.scoring_config);
      match.play_match(5);
      matches_array.push(match);
      match_score = (match.match_result.home.goals_difference - match.match_result.visitor.goals_difference);
    } 
    this.divisions[0].group_matches.push({ q: `Q${index + 1 }`, matches: matches_array}); 
  }

  /* It returns the teams that qualified to the next round paired with their opposing team. It receives an number (mode) as a parameter to determine the way the 
  teams will be arranged and paired. 
  Mode 1 : A team is matched with the winner of its direct sibling.
  Mode 2 : A team is matched with the winner of match following its direct sibling. 
  Mode 3 : Teams are crossed match (1 vs last, 2 vs second to last, etc...)*/

  get_play_offs_qualified_teams(mode){
    let qualified_teams = [];
    let play_off_matches = this.divisions[0].group_matches;
    let total_matches = play_off_matches.length / 2;
    let go_forward = false;
    let reverse_index = 0;
    switch(mode){
      case(1) : 
        reverse_index = 1;
      break;
      case(2) : 
        reverse_index = play_off_matches.length - 1;
      break;
      case(3) : 
        go_forward = true;
        reverse_index = total_matches;
      break;
    }
    for(let i = 0; i < total_matches; i++){
      let top_batch = play_off_matches[i].matches[play_off_matches[i].matches.length - 1].match_result.winner;
      let bottom_batch = play_off_matches[reverse_index].matches[play_off_matches[reverse_index].matches.length - 1].match_result.winner;
      qualified_teams.push({team_a: top_batch, team_b: bottom_batch});
      if(!go_forward){
        reverse_index--;
      } else{
        reverse_index++;
      }
    }
    return qualified_teams;
  }
}