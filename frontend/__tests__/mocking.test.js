function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('peaches');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('peaches');
    fetchDogs();
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it('can create a person', () => {
    const person = new Person('John', ['fries', 'pizza']);
    expect(person.name).toBe('John');
  });

  it('can fetch foods', async () => {
    const person = new Person('John', ['fries', 'pizza']);
    // mock the favFoods function
    person.fetchFavFoods = jest.fn().mockResolvedValue(['tofu', 'soy burger']);
    const favFoods = await person.fetchFavFoods();
    console.log(favFoods);
    expect(favFoods).toContain('tofu');
  });
});
