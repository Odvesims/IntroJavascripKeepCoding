import FootballTeam from "./FootballTeam.js";
import League from "./League.js";

export default class FootballLeague extends League{

  constructor(config){
    super(config);
  }

  set_teams(grouped_teams){
    let league_teams = [];
    for (const i in grouped_teams) {
      league_teams.push(new FootballTeam({name: grouped_teams[i], group: ''}));
    }
    return league_teams;
  }
}