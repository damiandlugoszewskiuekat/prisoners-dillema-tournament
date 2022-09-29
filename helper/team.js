const preparePartOfTeam = (condition, first, second, result) => {
  first.forEach((first_player, index) => {
    result[index].push([first_player, second[index]]);
  });
  const last_element_of_first = first[first.length - 1];
  const [first_element_of_first_array, ...other_element_of_first_array] = first;
  const [first_element_of_second_array, ...other_element_of_second_array] = second;

  const new_first = [first_element_of_first_array, first_element_of_second_array, ...other_element_of_first_array];
  new_first.pop();
  const new_second = [...other_element_of_second_array, last_element_of_first];
  if (new_second[0] !== condition) {
    preparePartOfTeam(condition, new_first, new_second, result);
  }
};

export const prepareTeams = (array) => {
  if (array.length === 2) {
    return { teams: [[array]], game_count: 1 };
  }
  const length = array.length / 2;
  const firstHalf = array.slice(0, length);
  const secondHalf = array.slice(length);
  const teams = [];

  for (let i = 1; i <= length; i += 1) {
    teams.push([]);
  }

  preparePartOfTeam(secondHalf[0], firstHalf, secondHalf, teams);

  return { teams, game_count: teams[0].length };
};
