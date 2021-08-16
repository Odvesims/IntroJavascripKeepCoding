import FootballLeague from "./classes/FootballLeague.js";
import FootballRoundRobin from "./classes/FootballRoundRobin.js";
import FootballPlayOff from "./classes/FootballPlayOff.js";

import { teams } from "./constants/teams.js";
import { 
  display_round_robin_division_teams, 
  display_round_robin_header, 
  display_round_robin_journeys, 
  display_tournament_header, 
  display_round_robin_matches, 
  get_round_robin_qualified_teams, 
  display_playoff_header,
  display_playoff_qualified_teams,
  display_playoff_phase_header,
  display_playoff_phase_matches,
  display_tournament_winner } from "./functions/index.js";

const uefa_2021 = new FootballLeague({name: 'UEFA Euro Cup 2021', teams: teams});

const scoring_match = {points_per_win: 3, points_per_draw: 1, points_per_lost: 0};
const round_robin = new FootballRoundRobin(uefa_2021.teams, 6, scoring_match, ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F']);
round_robin.set_up_matches();
round_robin.play_matches();

display_round_robin_header();

const total_journeys = round_robin.divisions[0].group_teams.length - 1
const matches_per_journey = round_robin.divisions[0].group_matches.length / total_journeys;
var start_index = 0;
var end_index = matches_per_journey;
round_robin.divisions.forEach(division => {
  display_round_robin_division_teams(division);
  display_round_robin_journeys(division, start_index, end_index, total_journeys, matches_per_journey);
});
display_tournament_header('UEFA CUP', '2021');
display_round_robin_matches(round_robin, total_journeys, matches_per_journey, start_index, end_index);

start_index = 0;
end_index = matches_per_journey;
let round_robin_qualified_teams = get_round_robin_qualified_teams(round_robin.divisions, total_journeys);
round_robin.arrange_teams(round_robin_qualified_teams.third_placers, total_journeys - 1);
round_robin_qualified_teams.third_placers.splice(-2); //Trim the array so it only includes the top four 3rd placers.

const play_offs = new FootballPlayOff(round_robin_qualified_teams, 1, scoring_match, ['']);
play_offs.divide_teams();
play_offs.set_up_matches();
play_offs.play_matches();
let round_of_sixteen_qualified_teams = play_offs.get_play_offs_qualified_teams(2);
display_playoff_header();
display_playoff_phase_header('Round of 16');
display_playoff_qualified_teams(play_offs.divisions[0].group_matches);
display_playoff_phase_matches(play_offs.divisions[0].group_matches);

play_offs.divisions[0] = {name: 'Quartet Finals', group_teams: [], matched_teams: [], group_matches: []};
round_of_sixteen_qualified_teams.forEach(qualified_teams => {
  play_offs.divisions[0].group_teams.push(qualified_teams.team_a);
  play_offs.divisions[0].group_teams.push(qualified_teams.team_b);
  play_offs.divisions[0].matched_teams.push({home: {team: qualified_teams.team_a, q: ''}, visitor: {team: qualified_teams.team_b, q: ''}});
})
play_offs.play_matches();
display_playoff_phase_header('Quarter Finals');
display_playoff_phase_matches(play_offs.divisions[0].group_matches);

let quartet_finals_qualified_teams = play_offs.get_play_offs_qualified_teams(3);
play_offs.divisions[0] = {name: 'Semi Finals', group_teams: [], matched_teams: [], group_matches: []};
quartet_finals_qualified_teams.forEach(qualified_teams => {
  play_offs.divisions[0].group_teams.push(qualified_teams.team_a);
  play_offs.divisions[0].group_teams.push(qualified_teams.team_b);
  play_offs.divisions[0].matched_teams.push({home: {team: qualified_teams.team_a, q: ''}, visitor: {team: qualified_teams.team_b, q: ''}});
})
play_offs.play_matches();
display_playoff_phase_header('Semi Finals');
display_playoff_phase_matches(play_offs.divisions[0].group_matches);

var losers = [];
let group_matches_temp = play_offs.divisions[0].group_matches;
play_offs.divisions[0] = {name: 'Third and Fourth', group_teams: [], matched_teams: [], group_matches: []};
group_matches_temp.forEach(group_match => {
  let match = group_match.matches[group_match.matches.length - 1];
  play_offs.divisions[0].group_teams.push(match.match_result.loser);
  losers.push(match.match_result.loser)
});
play_offs.divisions[0].matched_teams.push({home: {team: losers[0], q: ''}, visitor: {team: losers[1], q: ''}});
play_offs.play_matches();
display_playoff_phase_header('Third and Fourth Place');
display_playoff_phase_matches(play_offs.divisions[0].group_matches);

var winners = [];
play_offs.divisions[0] = {name: 'Finals', group_teams: [], matched_teams: [], group_matches: []};
group_matches_temp.forEach(group_match => {
  let match = group_match.matches[group_match.matches.length - 1];
  play_offs.divisions[0].group_teams.push(match.match_result.winner);
  winners.push(match.match_result.winner)
});
play_offs.divisions[0].matched_teams.push({home: {team: winners[0], q: ''}, visitor: {team: winners[1], q: ''}});
play_offs.play_matches();
display_playoff_phase_header('FINALS');
display_playoff_phase_matches(play_offs.divisions[0].group_matches);

let winner_name = play_offs.divisions[0].group_matches[play_offs.divisions[0].group_matches.length - 1].matches[play_offs.divisions[0].group_matches[play_offs.divisions[0].group_matches.length - 1].matches.length - 1].match_result.winner.name;
display_tournament_winner(winner_name, 'UEFA Euro Cup 2021');