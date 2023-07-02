module.exports = {
  name: "Leap Years",
  lang: [
    {
      name: "js",
      runtime: 1,
      id: 63,
      filename: "submission",
      main: `
      const isLeapYear = require('./isLeapYear.js');
      console.log(isLeapYear(2000));
      console.log(isLeapYear(1900));
      console.log(isLeapYear(2004));
      console.log(isLeapYear(2100));
      console.log(isLeapYear(2400));
      console.log(isLeapYear(1987));
      `,
      submit: 
      `function isLeapYear(year) {
        // Your code here. No function signature is required. The year variable is called 'year'. Return your answer at the end.
      }
      export {isLeapYear};
      `,
    },
    {
      name: "py",
      runtime: 1,
      id: 71,
      filename: "submission",
      main: `
      import isLeapYear
      print(isLeapYear(2000))
      print(isLeapYear(1900))
      print(isLeapYear(2004))
      print(isLeapYear(2100))
      print(isLeapYear(2400))
      print(isLeapYear(1987))
      `,
      submit:
        `def isLeapYear(year):
          # Your code here. No function signature is required. The year variable is called 'year'. Return your answer at the end.
        `,
    },
    {
      name: "java",
      runtime: 3,
      id: 62,
      filename: "Submission",
      main: `
      import isLeapYear;
      public class Main {
        public static void main(String[] args) {
          System.out.println(isLeapYear(2000));
          System.out.println(isLeapYear(1900));
          System.out.println(isLeapYear(2004));
          System.out.println(isLeapYear(2100));
          System.out.println(isLeapYear(2400));
          System.out.println(isLeapYear(1987));
        }
      }
      `,
      submit: 
      `public class Submission {
        public static boolean isLeapYear(int year) {
          // Your code here. No function signature is required. The year variable is called 'year'. Return your answer at the end.
       }`,
    },
    {
      name: "cpp",
      runtime: 3,
      id: 54,
      filename: "submission",
      main: `
      #include <iostream>
      #include "submission.cpp"
      using namespace std;
      int main() {
        cout << isLeapYear(2000) << endl;
        cout << isLeapYear(1900) << endl;
        cout << isLeapYear(2004) << endl;
        cout << isLeapYear(2100) << endl;
        cout << isLeapYear(2400) << endl;
        cout << isLeapYear(1987) << endl;
      }
      `,
      submit: 
      `
      bool isLeapYear(int year) {
        // Your code here. No function signature is required. The year variable is called 'year'. Return your answer at the end.
      }
      `
    },
  ],
  submitFile: false, //false means code segment only
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
    "Please dm ACSL Bot with !q language  to get the pesudo code for this question. the language should be either js, py, java, or cpp.",
  testCases: [
    {input: 2000, expected: true},
    {input: 1900, expected: false},
    {input: 2004, expected: true},
    {input: 2100, expected: false},
    {input: 2400, expected: true},
    {input: 1987, expected: false},
  ],
  functionName: "isLeapYear",
  params: ["year"],
};
