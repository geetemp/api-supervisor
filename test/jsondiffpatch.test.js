var jsondiffpatch = require("jsondiffpatch");

test("jsondiffpatch try test", () => {
  var left = { a: 3, b: 4 };
  var right = { a: 5, c: 9 };
  var delta = jsondiffpatch.diff(left, right);
  jsondiffpatch.console.log(delta);
});

test("jsondiffpatch api test", () => {
  var country = {
    name: "Argentina",
    capital: "Buenos Aires",
    independence: new Date(1816, 6, 9),
    unasur: true
  };

  // clone country, using dateReviver for Date objects
  var country2 = JSON.parse(JSON.stringify(country), jsondiffpatch.dateReviver);

  // make some changes
  country2.name = "Republica Argentina";
  country2.population = "41324992";
  delete country2.capital;

  var delta = jsondiffpatch.diff(country, country2);

  expect(delta).toEqual({
    name: ["Argentina", "Republica Argentina"], // old value, new value
    population: ["41324992"], // new value
    capital: ["Buenos Aires", 0, 0] // deleted
  });

  // patch original
  jsondiffpatch.patch(country, delta);

  // reverse diff
  var reverseDelta = jsondiffpatch.reverse(delta);
  // also country2 can be return to original value with: jsondiffpatch.unpatch(country2, delta);

  var delta2 = jsondiffpatch.diff(country, country2);
  expect(delta2).toBe(undefined);
});
