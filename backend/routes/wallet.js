const express = require('express');
const router = express.Router();

// In-Memory Storage (Trap 1 Defeated: No Database)
let wallet = { balance: 0, currency: 'PKR', owner: 'Student' };
let transactions = [];

const addTransaction = (type, amount, description) => {
    transactions.unshift({
        id: Date.now().toString(),
        type,
        amount,
        timestamp: new Date().toISOString(),
        description
    });
};

router.get('/', (req, res, next) => {
    // If the request is for transactions, send transactions
    if (req.baseUrl.includes('transactions')) {
        const { type } = req.query;
        if (type === 'credit' || type === 'debit') {
            return res.status(200).json(transactions.filter(t => t.type === type));
        }
        return res.status(200).json(transactions);
    }
    // Otherwise, send wallet info
    res.status(200).json(wallet);
});

router.post('/deposit', (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount must be > 0." });
    
    wallet.balance += parseFloat(amount);
    addTransaction('credit', parseFloat(amount), 'Wallet Deposit');
    res.status(200).json({ message: "Deposit successful", balance: wallet.balance });
});

router.post('/withdraw', (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Amount must be > 0." });
    if (amount > wallet.balance) return res.status(400).json({ error: "Insufficient balance." });
    
    wallet.balance -= parseFloat(amount);
    addTransaction('debit', parseFloat(amount), 'Wallet Withdrawal');
    res.status(200).json({ message: "Withdrawal successful", balance: wallet.balance });
});

module.exports = router;