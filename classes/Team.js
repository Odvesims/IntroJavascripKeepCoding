export default class Team {
 
  constructor(config) {
    this.name = config.name;
    this.setup();
  }

  setup(){
    this.details = {
      matchesPlayed: 0, 
      matchesWon: 0, 
      matchesDraw: 0, 
      matchesLost: 0,
      points: 0,
    }
  }

  game_won(){
    this.details.matchesPlayed++;
    this.details.matchesWon++;
  }

  game_lost(){
    this.details.matchesPlayed++;
    this.details.matchesLost++;
  }

  game_draw(){
    this.details.matchesPlayed++;
    this.details.matchesDraw++;
  }

  reset_details(){
    return false;
  }
}