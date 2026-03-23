//Will display the main menu of the program
const readline = require("readline");
const Employee = require('./models/Employee')
//const search = require('./search_menu')

const rl = readline.createInterface(
	process.stdin,
    process.stdout
);

//Get this method to also print out the employee positions
const findEmployees = async () => {
    const emps = await Employee.find({})
    //query.select('firstname')
    //const emps = await query.exec()
    for(let i = 0; i < emps.length; i++){
        console.log('First Name:', emps[i].firstname, 
                    'Last Name:', emps[i].lastname, 
                    'Register:', emps[i].register, 
                    'Salary:', emps[i].salary)
    }
    return emps
}

async function main_menu() {
    console.log('Welcome to the grocery store database')
    let running = true

    while(running){
        console.log('Type [1] to see a list of employees')
        console.log('Type [2] to see a list of customers')
        console.log('Type [3] to see a list of products')
        console.log('Type [4] to see a list of purchases')
        console.log('Type [5] to exit the database')

        const answer = await askQuestion('Select an option: ');

        switch(answer){
            case '1':
                await findEmployees()
                break
            case '2':
                console.log('Valid')
                break
            case '3':
                console.log('Valid')
                break
            case '4':
                console.log('Valid')
                break
            case '5':
                rl.close()
                running = false
                return
            default:
                console.log('Invalid')
        }
    }
}

// Promise-based question function
function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
});

module.exports = main_menu