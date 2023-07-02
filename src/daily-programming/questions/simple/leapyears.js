module.exports = {
  name: "Leap Years",
  lang: ["js, cpp, py, java"],
  maxRunTime: 1000,
  points: 5,
  difficulty: "0",
  instruction:
    "You will submit the following code using the format below:\n" +
    "`!submit`\n" +
    "\\```js\n" +
    "// Your code here. No function signature is required. The year variable is called 'year'. Return your answer at the end.\n" +
    "\\```\n",
  questions:
    "You should simply determine whether a given year is a leap year or not. In case you don't know the rules, here they are: \n" +
    "1. The year is evenly divisible by 4;\n" +
    "2. If the year can be evenly divided by 100, it is NOT a leap year, unless;\n" +
    "3. The year is also evenly divisible by 400. Then it is a leap year.\n" +
    "Please write a function called isLeapYear(year) in JavaScript that takes a year as input and returns true if the year is a leap year, and false otherwise.",
  testCases: [
    {input: 2000, expected: true},
    {input: 1900, expected: false},
    {input: 2004, expected: true},
    {input: 2100, expected: false},
    {input: 2400, expected: true},
    {input: 1987, expected: false},
  ],
  code: `function isLeapYear(year) {// Your code here}`,
  functionName: "isLeapYear",
  params: ["year"],
};
