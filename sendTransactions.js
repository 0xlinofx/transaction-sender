#!/usr/bin/env node

const { ethers } = require('ethers'); // Import ethers  
const inquirer = require('inquirer').default; // Import inquirer for user input  

// Function to get user input  
async function getUserInput() {  
  try {  
    // Prompt the user for RPC URL  
    const rpcUrl = await inquirer.prompt({  
      type: 'input',  
      name: 'rpcUrl',  
      message: 'Enter RPC URL:',  
      default: 'https://api.trongrid.io'  
    });  

    // Prompt the user for private key  
    const privateKey = await inquirer.prompt({  
      type: 'password',  
      name: 'privateKey',  
      message: 'Enter private key:',  
      mask: '*'  
    });  

    // Prompt the user for number of transactions  
    const numTransactions = await inquirer.prompt({  
      type: 'number',  
      name: 'numTransactions',  
      message: 'Enter number of transactions:',  
      default: 4 // assuming 4 transactions  
    });  

    // Prompt the user to add recipient addresses  
    const recipient1 = await inquirer.prompt({  
      type: 'input',  
      name: 'recipient1',  
      message: 'Enter recipient address 1:'  
    });  

    const recipient2 = await inquirer.prompt({  
      type: 'input',  
      name: 'recipient2',  
      message: 'Enter recipient address 2:'  
    });  

    const recipient3 = await inquirer.prompt({  
      type: 'input',  
      name: 'recipient3',  
      message: 'Enter recipient address 3:'  
    });  

    // Return the user input  
    return {  
      rpcUrl: rpcUrl.rpcUrl,  
      privateKey: privateKey.privateKey,  
      numTransactions: numTransactions.numTransactions,  
      recipients: [recipient1.recipient1, recipient2.recipient2, recipient3.recipient3]  
    };  
  } catch (error) {  
    console.error('Error getting user input:', error);  
    process.exit(1);  
  }  
}  

// Function to send transactions  
async function sendTransactions(rpcUrl, privateKey, numTransactions, recipients) {  
  try {  
    // Create a provider instance  
    const provider = new ethers.JsonRpcProvider(rpcUrl); // Updated for ethers.js v6  

    // Create a wallet instance  
    const wallet = new ethers.Wallet(privateKey, provider);  

    // Define the transaction amounts and intervals  
    const amounts = [0.02, 0.021, 0.0104, 0.013];  
    const intervals = [5, 3, 6, 5];  

    // Send transactions  
    let transactionCount = 0; // Initialize transaction count  
    for (let i = 0; i < numTransactions; i++) {  
      for (let recipient of recipients) {  
        const tx = await wallet.sendTransaction({  
          to: recipient,  
          value: ethers.parseUnits(amounts[i % amounts.length].toString(), 18) // Updated for ethers.js v6  
        });  

        transactionCount++; // Increment transaction count  
        console.log(`Transaction ${transactionCount}: Sent ${amounts[i % amounts.length]} TEA to ${recipient}. Tx Hash: ${tx.hash}`);  

        // Wait for the transaction to be mined at the specified interval  
        await new Promise(resolve => setTimeout(resolve, intervals[i % intervals.length] * 1000));  

        // Wait for the transaction to be mined  
        await tx.wait();  
        console.log(`Transaction ${transactionCount} confirmed.`);  
      }  
    }  

    console.log('All transactions sent successfully.');  
  } catch (error) {  
    console.error('Error sending transactions:', error);  
    process.exit(1);  
  }  
}  

// Run the script  
async function run() {  
  // Get user input  
  const userInput = await getUserInput();  

  // Send transactions  
  await sendTransactions(userInput.rpcUrl, userInput.privateKey, userInput.numTransactions, userInput.recipients);  
}  

run();


