//Global classes and requirements to run application
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

//Global Paths for execution
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");


// Use inquirer to gather information about the development team members,
// some questions are customized to particular roles using 'when' arrow functions.
function staffPrompts() {
    const questions = [
        {
            type: "input",
            name: "name",
            message: "What is your full name (first and last)? ",
            default: "Dany Grimaldo"
        },
        {
            type: "input",
            name: "email",
            message: "What is your email address? ",
            default: "test@gmail.com"
        },
        {
            type: "input",
            name: "eid",
            message: "What is your employee identification number? ",
            default: "000"
        },
        {
            type: "list",
            name: "role",
            message: "What is your role with the company?",
            choices: [Manager, Engineer, Intern]
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is your office number? ",
            default: "678.123.4567",
            when: (answers) => answers.role === "Manager"
        },
        {
            type: "input",
            name: "github",
            message: "What is your GitHub username? ",
            default: "mygithub",
            when: (answers) => answers.role === "Engineer"
        },
        {
            type: "input",
            name: "school",
            message: "What school do you attend? ",
            default: "University of Georgia",
            when: (answers) => answers.role === "Intern"
        },
        {
            type: "confirm",
            name: "newMember",
            message: "Add another team member?"
        }
    ];

    const teamMember = inquirer.prompt(questions);
    return teamMember;
};

// This function checks and/or creates a new directory for the output
//and writes the file once directory returns true.
function writeToFile(writeFolder, writePath, HTML) {
    fs.access(writeFolder, (err) => {
        if (err) {
            fs.mkdir(writeFolder, (err) => {
                if (err) throw err;
            });
        }
        fs.writeFile(writePath, HTML, (err) => {
            if (err) throw err;
        });
    });
}

async function init() {

    //empty array to store employees
    const employeesArray = [];

    //Collect the specs based on user input and setting it into 'staffSpecs'
    //as a variable. Then it pushes into the 'employees array'
    let staffSpecs = await staffPrompts();
    employeesArray.push(staffSpecs);

    console.log(staffSpecs);

    //As long as the user selectes to add more employees, it will continue to prompt and collect data,
    //to then push into the employees array.
    while (staffSpecs.newMember) {
        staffSpecs = await staffPrompts();
        employeesArray.push(staffSpecs);

        //a new array will be generted by taking each team member and setting them
        //as new objeects within, according to their role.
    }
    const employees = employeesArray.map((teamMember) => {
        switch (teamMember.role) {
            case "Manager":
                return new Manager(teamMember.name, teamMember.eid, teamMember.email, teamMember.officeNumber);
            case "Engineer":
                return new Engineer(teamMember.name, teamMember.eid, teamMember.email, teamMember.github);
            case "Intern":
                return new Intern(teamMember.name, teamMember.eid, teamMember.email, teamMember.school);
        }
        return employees;
    });

    //Assign data into a variable that will then be used to generate the HTML.
    const HTMLdata = render(employees);
    await writeToFile(OUTPUT_DIR, outputPath, HTMLdata);

    console.log("HTML SUCCESSFULLY GENERATED!")
}

init();