# FintechFlow - Personal Finance & Loan Manager

## Project Description
FintechFlow is a full-stack web application designed for personal finance management. It features a digital wallet, an interactive transaction history with live filtering, a multi-step loan application process with strict CNIC validation, an administrative loan status viewer with 3D flip cards, and an EMI calculator featuring dynamic server-side computation and client-side amortization generation.

## How to Run Locally
1. **Clone the repository:** `git clone <your-repo-link>`
2. **Start Backend:**
   - `cd backend`
   - `npm install`
   - `node index.js` (Runs on port 5000)
3. **Start Frontend:**
   - Open a new terminal.
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Runs on port 5173)

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet` | Returns wallet balance and info. |
| POST | `/api/wallet/deposit` | Adds amount to balance and logs transaction. |
| POST | `/api/wallet/withdraw` | Deducts amount and logs transaction. |
| GET | `/api/transactions` | Returns transactions (supports `?type=credit/debit`). |
| POST | `/api/loans/apply` | Submits a loan application. |
| GET | `/api/loans` | Returns all loan applications. |
| PATCH | `/api/loans/:id/status` | Updates a loan status (approved/rejected). |
| GET | `/api/emi-calculator` | Calculates EMI dynamically based on query params. |

## Student Details
**Name:** Abubakar Siddique Butt
**Roll Number:** 23i-5562