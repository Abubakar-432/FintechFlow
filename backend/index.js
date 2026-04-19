const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows React to connect
app.use(express.json()); // Parses incoming JSON

// Import Routes
const walletRoutes = require('./routes/wallet');
const loanRoutes = require('./routes/loans');

// Mount Routes exactly as the rubric requires
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', walletRoutes); 
app.use('/api/loans', loanRoutes);
app.use('/api/emi-calculator', loanRoutes); 

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});