import Team from "./Team.js";

export default class FootballTeam extends Team {

  constructor(config){
    super(config);
  }

  setup(){
    this.details = { 
      matches_details: []
    };
  }

  add_match_detail(goals_for, goals_against, points, goals_difference){
    let total_points = points;
    let total_goals_for= goals_for;
    let total_goals_against= goals_against;
    this.details.matches_details.forEach(match_detail => {
      total_points += match_detail.points;
      total_goals_for += match_detail.goals_for;
      total_goals_against += match_detail.goals_against;
    });
    let total_goals_difference = total_goals_for - total_goals_against;
    this.details.matches_details.push({goals_for: goals_for, goals_against: goals_against, points: points, goals_difference: goals_difference, cummulative: {goals_for: total_goals_for, goals_against: total_goals_against, points: total_points, goals_difference: total_goals_difference} })
  }

  reset_details(){
    this.details = { 
      matches_details: []
    };
  }
}