const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeToFile = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.
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

// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
function generateHTML(data) {
    fs.access(OUTPUT_DIR, (err) => {
        if (err) {
            fs.mkdir(OUTPUT_DIR, (err) => {
                if (err) throw err;
            });
        }
        fs.writeFile(outputPath, data, (err) => {
            if (err) throw err;
        });
    });
};

async function init() {

    const employeesArray = [];

    let staffSpecs = await staffPrompts();
    employeesArray.push(staffSpecs);

    while (staffSpecs.newMember) {
        staffSpecs = await staffPrompts();
        employeesArray.push(staffSpecs);
    }
    const employees = employeesArray.map((teamMember) => {
        switch (teamMember.role) {
            case "Manager":
                return new Manager(teamMember.name, teamMember.email, teamMember.id, teamMember.officeNumber);
            case "Engineer":
                return new Engineer(teamMember.name, teamMember.email, teamMember.id, teamMember.github);
            case "Intern":
                return new Intern(teamMember.name, teamMember.email, teamMember.id, teamMember.school);
        }
        return employees;
    });

    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!
    const HTMLdata = render(employees);
    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    await generateHTML("team.html", HTMLdata);
    console.log("HTML SUCCESSFULLY GENERATED!")

    // HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
    // and Intern classes should all extend from a class named Employee; see the directions
    // for further information. Be sure to test out each class and verify it generates an 
    // object with the correct structure and methods. This structure will be crucial in order
    // for the provided `render` function to work!
}

init();