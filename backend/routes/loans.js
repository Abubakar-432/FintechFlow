const express = require('express');
const router = express.Router();

let loans = [];

router.get('/', (req, res) => {
    if (req.baseUrl.includes('emi-calculator')) {
        const { principal, annualRate, months } = req.query;
        if (!principal || !annualRate || !months) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }

        const P = parseFloat(principal);
        const r = (parseFloat(annualRate) / 100) / 12;
        const n = parseInt(months);

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        const totalInterest = totalPayable - P;

        return res.status(200).json({
            emi: Math.round(emi),
            totalPayable: Math.round(totalPayable),
            totalInterest: Math.round(totalInterest)
        });
    }
    res.status(200).json(loans);
});

router.post('/apply', (req, res) => {
    const { name, amount, purpose, tenure } = req.body;
    if (!name || !amount || !purpose || !tenure) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const newLoan = {
        id: `LOAN-${Date.now()}`,
        applicant: name,
        amount: parseFloat(amount),
        purpose,
        tenure: parseInt(tenure),
        status: 'pending'
    };
    
    loans.push(newLoan);
    res.status(201).json({ message: "Loan submitted.", loanId: newLoan.id });
});

router.patch('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'approved' && status !== 'rejected') {
        return res.status(400).json({ error: "Invalid status." });
    }

    const loanIndex = loans.findIndex(l => l.id === id);
    if (loanIndex === -1) return res.status(404).json({ error: "Loan not found." });

    loans[loanIndex].status = status;
    res.status(200).json({ message: `Status updated to ${status}.`, loan: loans[loanIndex] });
});

module.exports = router;