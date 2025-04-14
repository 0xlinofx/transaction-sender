import inquirer from 'inquirer';
import { ethers } from 'ethers';

// Prompt user for input
async function getUserInput() {
  return inquirer.prompt([
    { type: 'input', name: 'rpcUrl', message: 'Enter the RPC URL:' },
    { type: 'password', name: 'privateKey', message: 'Enter your private key:' },
    { type: 'number', name: 'numTransactions', message: 'Number of transactions to send:' },
    { type: 'input', name: 'recipients', message: 'Comma-separated recipient addresses:' }
  ]).then(answers => ({
    ...answers,
    recipients: answers.recipients.split(',').map(addr => addr.trim())
  }));
}

async function sendTransactions(rpcUrl, privateKey, numTransactions, recipients) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    for (let i = 0; i < numTransactions; i++) {
      const recipient = recipients[i % recipients.length]; // Loop recipients if fewer than txs

      const tx = await wallet.sendTransaction({
        to: recipient,
        value: ethers.parseEther("0.001")
      });

      console.log(`Transaction ${i + 1} sent: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction ${i + 1} confirmed.`);
    }

    console.log('All transactions sent successfully.');
  } catch (error) {
    console.error('Error sending transactions:', error);
    process.exit(1);
  }
}

// Run the script
async function run() {
  const userInput = await getUserInput();
  await sendTransactions(userInput.rpcUrl, userInput.privateKey, userInput.numTransactions, userInput.recipients);
}

run();
