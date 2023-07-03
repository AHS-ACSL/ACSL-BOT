module.exports = {
  name: "CringeCord Message Splitting",
  lang: [
    {lang: "js", time: 2},
    {lang: "py", time: 2},
    {lang: "cpp", time: 2},
    {lang: "java", time: 2},
  ],
  points: 10,
  difficulty: "Median",
  instruction:
    "Submit to ACSL BOT by dm\n " +
    "Sebastian Farrington is a member of the ACSL Club and uses the online chatting platform, Cringeord, for his communications. " +
    "Due to the design limitations of Cringeord, each message can only contain a maximum of **21 characters**. " +
    "Sebastian needs to make a lengthy announcement in the ACSL Club server, but to do so, he must split his message into multiple parts that each fit within Cringeord's character limit.\n" +
    'Sebastian and his club members have devised a symbol system to represent the following words : "the," "a," "an," "and," "or," and "but" within their messages. ' +
    'This system allows them to use less characters. However, the challenge is that these symbols can\'t be part of other words (for example, if "%" represents "but," it can\'t be used in "%ter" to mean "butter"). ' +
    "It's crucial to maintain readability, so words must not be split across messages.\n" +
    "You need to create the symbol system so it does not conflict with any words. every ASCII character will be a part of the string message.\n" +
    "Given a set of 30 sentences(Repeat the loop 30 times), your task is to output the least number of messages Sebastian would need to send each sentence.\n" +
    "Input: String/stdin\nOutput: Integer/stdout\n" +
    "You need to keep in mind the word-symbol mapping and Cringeord's 21-character limit per message. Note that spaces, punctuation, and symbols used for common words also count towards the character limit.\n" +
    "There will not be a sentence that has more than 21 connected characters.\n\n" +
    'Example: Input: "I like to eat apples and oranges &152*124)*(&@%! and i have java lol this is good"\n' +
    "If we define the encoding as follows:\n" +
    ' - "the" to represent "的"\n' +
    ' - "a" to represent "一"\n' +
    ' - "an" to represent "个"\n' +
    ' - "and" to represent "和"\n' +
    ' - "or" to represent "或"\n' +
    ' - "but" to represent "但"\n' +
    'Then the sentence will be "I like to eat apples 和 oranges &152*124)*(&@%! 和 i have java lol this is good"\n' +
    "The sentence can be split into 4 messages:\n" +
    '1. "I like to eat apples"\n' +
    '2. "和 oranges &152*124)*"\n' +
    '3. "(&@%! 和 i have java"\n' +
    '4. "lol this is good"\n' +
    "Note: symbol is not a word and thus can be split in between",
  testCases:[
    {
      input: "I like to eat apples and oranges &152*124)*(&@%! and i have java lol this is good",
      expected: 4,
    },
    {
      input: "Sebatpi 9851 afsbjlk %!_241076 JLBKsa f4)&*(!@$)(*& jkbasf @!%$)^&*( aslbkjfsa 97210 46abfls 124",
      expected: 5,
    },
    {
      input: "1875asl bhkj safigy hu1289y fsbasfjkbla  sfjkhl89y124 afsi huljafslhjafs ihjl21 49y-9",
      expected: 5,
    },
    {
      input: "fashkj asfjklh214 flsa",
      expected: 2,
    },
    {
      input: "short",
      expected: 1,
    },
    {
      input: "hello wnord",
      expected: 1,
    },
    {
      input: "never goona give you up, never goona let you down, never g@onna run a round and dersiver t u, never goona make you crym, bnaevery goona say good bye",
      expected: 7,
    },
    {
      input: "never goona tleall a lie and heart you asg",
      expected: 2,
    },
    {
      input: "_(-8124 lsakjf pi is 3.1415926 because it is cool",
      expected: 5,
    },
    {
      input: "12408 asflbfu 075210958 1205978123 008213 2108351 0980125",
      expected: 6,
    },
    {
      input: "@!!%)( @!# Hello, how are you today? I hope you're doing well.",
      expected: 2,
    },
    {
      input: "This is a test sentence to check the symbol encoding and message splitting. @!#)(@!!%",
      expected: 3,
    },
    {
      input: "The quick brown fox jumps over the lazy dog, but the dog @!#)(@!!% doesn't seem to care.",
      expected: 3,
    },
    {
      input: "Can you believe it? @!!%) The cat caught a mouse @!#)(@!!% while we were sleeping.",
      expected: 3,
    },
    {
      input: "I'm planning a party @!#)(@!!% with balloons, cake, and lots of fun games. @!!%) Are you coming?",
      expected: 4,
    },
    {
      input: "@!!%)( @!# The weather forecast says it's going to rain tomorrow, @!#)(@!!% so don't forget your umbrella.",
      expected: 4,
    },
    {
      input: "I just bought a new phone, @!#)(@!!% and it has a powerful processor and a high-resolution screen.",
      expected: 4,
    },
    {
      input: "@!!%)( @!# The concert tickets sold out within minutes, @!#)(@!!% so I couldn't get any.",
      expected: 5,
    },
    {
      input: "I'm excited for the weekend @!#)(@!!% because I'm going on a road trip with friends. @!!%)( @!#",
      expected: 6,
    },
    {
      input: "@!!%)( @!# My favorite food is pizza, @!!%) especially when it's topped with lots of cheese @!#)(@!!% and pepperoni.",
      expected: 5,
    },
    {
      input: "I'm taking a break from work @!#)(@!!% and going on a vacation to a tropical island. @!!%) Can't wait!",
      expected: 5,
    },
    {
      input: "@!!%)( @!# I love solving puzzles and riddles, @!#)(@!!% they always keep my mind sharp.",
      expected: 5,
    },
    {
      input: "Yesterday, I watched a @!#)(@!!% thrilling movie that had me on the edge of my seat the whole time. @!!%",
      expected: 5,
    },
    {
      input: "@!!%)( @!# The traffic was terrible today, @!#)(@!!% and it took me twice as long to get to work.",
      expected: 6,
    },
    {
      input: "I'm learning to play the guitar, @!#)(@!!% and it's challenging but also very rewarding. @!!%) Practice makes perfect!",
      expected: 5,
    },
    {
      input: "@!!%)( @!# The bookstore has a wide selection of books, @!#)(@!!% so I spent hours browsing and couldn't decide which ones to buy.",
      expected: 4,
    },
    {
      input: "I'm attending a conference @!#)(@!!% next week, where I'll be presenting my research findings. @!!%) Wish me luck!",
      expected: 5,
    },
    {
      input: "@!!%)( @!# The restaurant serves delicious food @!#)(@!!% and has a cozy atmosphere. It's perfect for a romantic dinner.",
      expected: 5,
    },
    {
      input: "Today, I tried a new recipe @!#)(@!!% that I found online. It turned out to be a culinary masterpiece!",
      expected: 6,
    },
    {
      input: "@!!%)( @!# I'm starting a new fitness routine, @!!%) which includes cardio, strength training, and yoga. @!#)(@!!%",
      expected: 6,
    },
  ],
};
