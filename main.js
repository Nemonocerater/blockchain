/*
 * Joshua Scott Harris
 * joshua40harris@gmail.com
 * http://github.com/Nemonocerater
 *
 * Based on the following tutorial thread:
 * https://youtu.be/zVqczFZr124
 */

const SHA256 = require('crypto-js/SHA256');

class Transaction {
	constructor (fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor (timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash () {
		return SHA256(
			this.index +
			this.previousHash +
			this.timestamp +
			JSON.stringify (this.transactions) +
			this.nonce
		).toString();
	}

	mineBlock (difficulty) {
		while (this.hash.substring(0, difficulty) !==
			Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("Block mined: " + this.hash);
	}
}

class Blockchain {
	constructor () {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock () {
		return new Block('01/01/2000', 'Genesis Block', '0');
	}

	getLatestBlock () {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions (miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction (transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress (address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid () {
		for (let i = 1; i < this.chain.length; i++) {
			const prevBlock = this.chain[i - 1];
			const currBlock = this.chain[i];

			if (currBlock.hash != currBlock.calculateHash()) {
				return false;
			}

			if (currBlock.previousHash != prevBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

var joshcoin = new Blockchain();
joshcoin.createTransaction(new Transaction('address1', 'address2', 100));
joshcoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("starting the miner...");
joshcoin.minePendingTransactions('josh-is-awesome');

console.log('address1: ' + joshcoin.getBalanceOfAddress('address1'));
console.log('josh-is-awesome: ' + joshcoin.getBalanceOfAddress('josh-is-awesome'));

console.log("starting the miner again...");
joshcoin.minePendingTransactions('josh-is-awesome');

console.log('josh-is-awesome: ' + joshcoin.getBalanceOfAddress('josh-is-awesome'));

/*
console.log("Mining Block 1...");
joshcoin.addBlock(new Block(1, '01/02/2000', { amount: 8 }));
console.log("Mining Block 2...");
joshcoin.addBlock(new Block(2, '01/03/2000', { amount: 23 }));
*/

/*
console.log('Chain valid: ' + joshcoin.isChainValid());
joshcoin.chain[1].data = { amount : 1000 };
joshcoin.chain[1].hash = joshcoin.chain[1].calculateHash();
console.log('Chain valid: ' + joshcoin.isChainValid());
*/

//console.log(JSON.stringify(joshcoin, null, 4));