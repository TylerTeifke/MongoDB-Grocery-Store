//Will display the main menu of the program
const readline = require("readline");
const Employee = require('./models/Employee')
const Customer = require('./models/Customer')
const Product = require('./models/Product_Detail')
const Individual_Product = require('./models/Product')

const rl = readline.createInterface(
	process.stdin,
    process.stdout
);

//Prints out the information of all employees
const findEmployees = async () => {
    const emps = await Employee.find({}).populate('position_id')
    for(let i = 0; i < emps.length; i++){
        console.log('First Name:', emps[i].firstname, 
                    'Last Name:', emps[i].lastname, 
                    'Register:', emps[i].register, 
                    'Salary:', emps[i].salary,
                    'Position:', emps[i].position_id.name)
    }
}

//Prints out the information of all customers
const findCustomers = async () => {
    const custs = await Customer.find({}).populate('employee')
    for(let i = 0; i < custs.length; i++){
        console.log('First Name:', custs[i].firstname, 
                    'Last Name:', custs[i].lastname, 
                    'Cashier:', custs[i].employee.firstname, custs[i].employee.lastname)
    }
}

//Prints out the information of all products
const findProducts = async () => {
    const pros = await Product.find({}).populate('type')
    for(let i = 0; i < pros.length; i++){
        console.log('Name:', pros[i].name, 
                    'Price:', pros[i].price, 
                    'Type:', pros[i].type.type)
    }
}

//Prints out all of a customer's purchases
const findPurchases = async () => {
    const query = await Customer.find({})
    //const custs = await query
    //await query[0].populate('products')
    for(let i = 0; i < query.length; i++){
        const pros = query[i].products
        for(let j = 0; j < pros.length; j++){
            const pro = await Individual_Product.findOne({ '_id': pros[j]}).populate('details')

            console.log('Customer Name:', query[i].firstname, query[i].lastname, 'Product Name:', pro.details.name)
        }
    }
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
                await findCustomers()
                break
            case '3':
                await findProducts()
                break
            case '4':
                await findPurchases()
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