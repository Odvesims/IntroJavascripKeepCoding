export default class League {

  constructor(config){
    this.name = config.name;
    this.teams = this.set_teams(config.teams);
  };

  set_teams(teams){
    return teams;
  }

}
