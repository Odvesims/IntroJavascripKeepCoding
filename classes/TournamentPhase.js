export default class TournamentPhase {
 constructor(teams, divisions, scoring_config, group_names){
  this.teams = teams;
  this.divisions = new Array(divisions);
  this.matchDaySchedule = [];
  this.scoring_config = scoring_config;
  this.group_names = group_names;
 } 

 divide_teams(){
 }

 play_games(){
 }

}