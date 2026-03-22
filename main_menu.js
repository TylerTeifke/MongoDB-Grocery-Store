//Will display the main menu of the program
const readline = require("readline");
const search = require('./search_menu')

const main_menu = () => {
    console.log('Connected to MongoDB')
    console.log('Welcome to the grocery store database.')
    console.log('Type [1] to search the database')
    console.log('Type [2] to add entries')
    console.log('Type [3] to delete entries')
    console.log('Type [4] to update entries')
    console.log('Type [5] to exit the database')

    let rl = readline.createInterface(
		process.stdin,
        process.stdout
	);

    rl.setPrompt('Type a number between 1 and 5: ')

    //display initial prompt
    rl.prompt()

    
    rl.on('line', (line) => {
        //removes spaces from the input
        const input = line.trim()

        switch(input){
            case '1':
                rl.pause()
                search()
                rl.resume()
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
                rl.close()
                return
            default:
                console.log('Invalid')
        }

        rl.prompt()
    });

    //rl.on('close', () => {
    //    console.log('Goodbye!');
    //    process.exit(0);
    //});
}

module.exports = main_menu