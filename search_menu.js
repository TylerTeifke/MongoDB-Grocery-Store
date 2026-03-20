//This will display the menu for searching the database
const mongoose = require('mongoose')
const readline = require("readline");

//work on querying the database from this menu

const search = () => {
    console.log('Welcome to the grocery store database.')
    console.log('Type [1] to search for an employee')
    console.log('Type [2] to search for a customer')
    console.log('Type [3] to search for the customers and employee is serving')
    console.log("Type [4] to search for a customer's purchases")
    console.log('Type [5] to see a list of products')
    console.log('Type [6] to exit this menu')

    let rl = readline.createInterface(
        process.stdin,
        process.stdout
    );
    rl.setPrompt('Type a number between 1 and 6: ')
    //display initial prompt
    rl.prompt()

    rl.on('line', (line) => {
        //removes spaces from the input
        const input = line.trim()

        switch(input){
            case '1':
                console.log('Valid')
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
                console.log('Valid')
                break
            case '6':
                console.log('Valid')
                rl.close()
                return
            default:
                console.log('Invalid')
        }

        rl.prompt()
    });

    rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
    });
}

module.exports = search