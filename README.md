# Doctor GPT

The Doctor GPT fix your developer code and brings the power of AI-driven code completion and suggestions right into your coding environment. This extension enhances your coding experience by providing intelligent suggestions, snippets, and code completions based on the context of your code.

## 🚀 Set API key

[![Vscode extension](/translations/api-key.gif 'Vscode extension demo')](https://learnwithyan.com)

## 🍪 Select the text and call "Doctor GPT - ask chat GPT"

[![Vscode extension](/translations/demo.gif 'Vscode extension demo')](https://learnwithyan.com)

## How to use?

- Doctor GPT works with selected text only.
- First you need to set your [API key](https://platform.openai.com/api-keys). Just press F1 and in menu type "Doctor GPT - set API key".
- After you set the API key token you can use.
- Type any question or select code.
- Now Press F1 and in menu find "Doctor GPT - ask chat GPT".

### Features

- Work on your code with AI that knows your code
- Get AI-powered code completions, right within your IDE
- Ask follow-up questions to refine the output
- View and continue past chat conversations
- Chat in your preferred local language
- Robust data privacy: Your code remains private

### What can you do with Doctor GPT?

- Receive 🚀 immediate responses to your coding inquiries by simply entering your question into the chatbox and allowing Doctor GPT to assist you 😉
- Choose your prefered code language from 45 💥 items list to highlight syntax in a better way
- Set Doctor GPT text size
- Set text Primary color
- Set text Secondary color
- Choose any background color. From all 🌈 rainbow

### List of supported languages

| Language     | Rating |
| ------------ | ------ |
| actionscript | 10     |
| ada          | 10     |
| apex         | 10     |
| assembly     | 10     |
| clojure      | 10     |
| cobol        | 10     |
| coffeescript | 10     |
| common       | 10     |
| csharp       | 10     |
| css          | 10     |
| dart         | 10     |
| delphi       | 10     |
| elixir       | 10     |
| erlang       | 10     |
| fortran      | 10     |
| fsharp       | 10     |
| go           | 10     |
| groovy       | 10     |
| haskell      | 10     |
| java         | 10     |
| javascript   | 10     |
| julia        | 10     |
| kotlin       | 10     |
| lisp         | 8      |
| lua          | 10     |
| matlab       | 10     |
| objective-c  | 10     |
| perl         | 10     |
| php          | 10     |
| powershell   | 10     |
| python       | 10     |
| r            | 10     |
| ruby         | 10     |
| rust         | 10     |
| scala        | 10     |
| scheme       | 6      |
| shell        | 10     |
| smalltalk    | 10     |
| sql          | 10     |
| swift        | 10     |
| tcl          | 8      |
| typescript   | 10     |
| vbnet        | 7      |
| vbscript     | 10     |
| webassembly  | 10     |

### Code generation prompt

> Write a JavaScript function. It accepts a full name as input and returns avatar letters.

    function getAvatarLetters(fullName) {
    	const names = fullName.split(' ');
    	let avatar = '';

    	names.forEach(name => {
    		avatar += name.charAt(0).toUpperCase();
    	});

    	return avatar;
    }

> The database has students and course tables. Write a PostgreSQL query to fetch a list of students who are enrolled in at least 3 courses.

    SELECT student_id, student_name
    FROM students
    WHERE student_id IN (
    SELECT student_id
    FROM course_enrollment
    GROUP BY student_id
    HAVING COUNT(course_id) >= 3
    );

### Shell commands prompt

> Write a shell command to delete all files with the extension '.log' in the 'logs' folder

    rm logs/*.log

### Complete code prompt

> Complete the code

    const animals = ["dogs", "cats", "birds", "fish"];
    let animal = animals[Math.floor(Math.random() * animals.length)];

    switch (animal) {
      case "dogs":
    	console.log(
    	  "Dogs are wonderful companions that bring joy and loyalty into our lives. Their wagging tails and wet noses never fail to make us smile."
    	);
    	break;
    }

Doctor GPT answer:

    const animals = ["dogs", "cats", "birds", "fish"];
    let animal = animals[Math.floor(Math.random() * animals.length)];

    switch (animal) {
    	case "dogs":
    	console.log(
    	"Dogs are wonderful companions that bring joy and loyalty into our lives. Their wagging tails and wet noses never fail to make us smile."
    	);
    	break;
    case "cats":
    	console.log(
    	"Cats are independent and mysterious creatures that can be both playful and aloof. Their purring and soft fur make them great companions."
    	);
    	break;
    case "birds":
    	console.log(
    	"Birds come in all shapes and sizes, from chirping canaries to majestic eagles. Their ability to fly and sing adds a sense of freedom and beauty to our world."
    	);
    	break;
    case "fish":
    	console.log(
    	"Fish are fascinating creatures that inhabit the underwater world. Their colorful scales and graceful movements make them a joy to watch in aquariums or in the wild."
    	);
    	break;
    }

### What will be added in version 2?

- Templates to help you with well-crafted prompts that are readily accessible.
- Simply select a piece of code and choose from one of the 8 standard templates to perform tasks such as
- - Explaining code
- - Checking code performance
- - Generating unit tests
- - Plus, save your favorite prompts for quick access anytime.

### What commands you can use?

- Doctor GPT - read translated Readme
- Doctor GPT - set API key
- Doctor GPT - ask chat GPT

#
