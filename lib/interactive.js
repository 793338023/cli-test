const inquirer = require("inquirer");

module.exports = async function () {
  let answer;
  console.log(inquirer);
  answer = await inquirer.prompt([
    {
      name: "toppings",
      type: "checkbox",
      message: "Select a package manager",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "jspm", value: "jspm", disabled: true },
      ],
    },
  ]);
  console.log("Answer:", answer);
};
