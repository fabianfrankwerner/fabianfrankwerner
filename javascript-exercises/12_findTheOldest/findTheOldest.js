const findTheOldest = function (people) {
  return people.reduce((oldest, currentPerson) => {
    const getAge = (person) => {
      const deathYear = person.yearOfDeath || new Date().getFullYear();
      return deathYear - person.yearOfBirth;
    };

    const oldestAge = getAge(oldest);
    const currentAge = getAge(currentPerson);

    return currentAge > oldestAge ? currentPerson : oldest;
  });
};

// Do not edit below this line
module.exports = findTheOldest;
