module.exports = {
  name: "Leap Years",
  lang: [{lang:"js", time: 1} , {lang:"py", time: 1}, {lang:"cpp", time: 1}, {lang:"java", time: 1}],
  submitFile: false, //false means code segment only
  points: 5,
  difficulty: "my dog can do it",
  instruction:
    "Submit to ACSL BOT by dm" +
    "You should simply determine whether a given year is a leap year or not. In case you don't know the rules, here they are: \n" +
    "1. The year is evenly divisible by 4;\n" +
    "2. If the year can be evenly divided by 100, it is NOT a leap year, unless;\n" +
    "3. The year is also evenly divisible by 400. Then it is a leap year.\n" +
    "You will also need to structure your code such that it will take 15 input and have 15 output at runtime, make sure to print out exactly 'true'\n" +
    "Input: stdin\n" + "Output: stdout\n",
  testCases: [
    {input: 2000, expected: true},
    {input: 1900, expected: false},
    {input: 2004, expected: true},
    {input: 2100, expected: false},
    {input: 2400, expected: true},
    {input: 1987, expected: false},
    {input: 2008, expected: true},
    {input: 2012, expected: true},
    {input: 2016, expected: true},
    {input: 2020, expected: true},
    {input: 2024, expected: true},
    {input: 2028, expected: true},
    {input: 2032, expected: true},
    {input: 2036, expected: true},
    {input: 2040, expected: true},
  ],
  functionName: "isLeapYear",
  params: ["year"],
};
