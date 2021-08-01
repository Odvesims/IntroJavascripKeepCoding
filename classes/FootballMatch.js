import Match from "./Match.js";

export default class FootballMatch extends Match {

  constructor(home, visitor, config){
    super(home, visitor, config);
    this.match_result = {home: {goals_for: 0, goals_against: 0, points: 0, goals_difference: 0}, visitor: {goals_for: 0, goals_against: 0, points: 0, goals_difference: 0}}
  }

  setup(config){
    this.points_per_win = config.points_per_win,
    this.points_per_draw = config.points_per_draw,
    this.points_per_lost = config.points_per_lost
    
  }

  /* Plays a match between two teams and determines the points each one receive base on the match's results. 
  It receives a number as a parameter to determine what woul be the most goals a team can score in a match */
  
  play_match(max_goals){
    const home_team_goals = Math.floor(Math.random() * max_goals) + 1;
    const visitor_team_goals = Math.floor(Math.random() * max_goals) + 1;

    let home_match_points = 0;
    let visitor_match_points = 0;
    let winner;
    let loser;
    if(home_team_goals > visitor_team_goals){
      home_match_points += this.points_per_win;
      visitor_match_points += this.points_per_lost;
      winner = this.home;
      loser = this.visitor;
    } else if(home_team_goals < visitor_team_goals){
      home_match_points += this.points_per_lost;
      visitor_match_points += this.points_per_win;
      winner = this.visitor;
      loser = this.home;
    } else if(home_team_goals === visitor_team_goals){
      home_match_points += this.points_per_draw;
      visitor_match_points += this.points_per_draw;
      winner = { name: 'DRAW'};
      loser = { name: 'DRAW' }
    }
    this.home.add_match_detail(home_team_goals, visitor_team_goals, home_match_points, home_team_goals - visitor_team_goals);
    this.visitor.add_match_detail(visitor_team_goals, home_team_goals, visitor_match_points, visitor_team_goals - home_team_goals);
    this.set_match_final_score({ goals: home_team_goals, points: home_match_points}, { goals: visitor_team_goals, points: visitor_match_points }, winner, loser);
  }

  //Sets the final score for the Match's instance. It also states which team won and which one lost.

  set_match_final_score(home, visitor, winner, loser){
    this.match_result.winner = winner;
    this.match_result.loser = loser;
    this.match_result.home.goals_for = home.goals;
    this.match_result.home.goals_against = visitor.goals;
    this.match_result.home.goals_difference = home.goals - visitor.goals;
    this.match_result.home.points = home.points;
    
    this.match_result.visitor.goals_for = visitor.goals;
    this.match_result.visitor.goals_against = home.goals;
    this.match_result.visitor.goals_difference = visitor.goals - home.goals;
    this.match_result.visitor.points = visitor.points;
  }
}