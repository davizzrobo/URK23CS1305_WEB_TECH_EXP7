import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * EMI Calculator Component
 * Calculates Equated Monthly Installment for loans
 * Formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
 */
function App() {
  // State management using useState hook
  const [loanAmount, setLoanAmount] = useState(''); // Principal amount (P)
  const [annualInterestRate, setAnnualInterestRate] = useState(''); // Annual interest rate in %
  const [loanTenure, setLoanTenure] = useState(''); // Loan tenure in months (N)
  const [result, setResult] = useState(null); // Stores calculation results
  const [showResult, setShowResult] = useState(false); // Controls result display

  /**
   * Handles loan amount input with validation
   * Limits to 7 digits (9,999,999)
   */
  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 7 digits
    if (value === '' || (/^\d+$/.test(value) && value.length <= 7)) {
      setLoanAmount(value);
    }
  };

  /**
   * Handles interest rate input with validation
   * Limits to 100
   */
  const handleInterestRateChange = (e) => {
    const value = e.target.value;
    // Allow numbers with decimals and limit to 100
    if (value === '' || (parseFloat(value) <= 100 && /^\d*\.?\d{0,2}$/.test(value))) {
      setAnnualInterestRate(value);
    }
  };

  /**
   * Handles loan tenure input with validation
   * Limits to 360 months (30 years)
   */
  const handleLoanTenureChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 360
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 360)) {
      setLoanTenure(value);
    }
  };

  /**
   * Validates input fields
   * @returns {boolean} - true if all inputs are valid
   */
  const validateInputs = () => {
    // Check if any field is empty
    if (!loanAmount || !annualInterestRate || !loanTenure) {
      alert('Please fill in all fields');
      return false;
    }

    // Convert to numbers for validation
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(annualInterestRate);
    const tenure = parseFloat(loanTenure);

    // Check if values are valid numbers
    if (isNaN(principal) || isNaN(rate) || isNaN(tenure)) {
      alert('Please enter valid numeric values');
      return false;
    }

    // Check if values are positive
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      alert('Please enter positive values only');
      return false;
    }

    return true;
  };

  /**
   * Calculates EMI using the standard formula
   * EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
   */
  const calculateEMI = () => {
    // Validate inputs before calculation
    if (!validateInputs()) {
      setShowResult(false);
      return;
    }

    // Parse input values
    const P = parseFloat(loanAmount); // Principal (Loan Amount)
    const annualRate = parseFloat(annualInterestRate);
    const N = parseFloat(loanTenure); // Tenure in months

    // Calculate monthly interest rate
    // R = Annual Rate / 12 / 100
    const R = annualRate / 12 / 100;

    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    // Handle special case: 0% interest rate
    if (R === 0) {
      emi = P / N;
      totalPayment = P;
      totalInterest = 0;
    } else {
      // Standard EMI formula
      // EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
      const numerator = P * R * Math.pow(1 + R, N);
      const denominator = Math.pow(1 + R, N) - 1;
      emi = numerator / denominator;

      // Calculate total payment and interest
      totalPayment = emi * N;
      totalInterest = totalPayment - P;
    }

    // Store results in state
    setResult({
      loanAmount: P,
      monthlyEMI: emi,
      totalInterest: totalInterest,
      totalPayment: totalPayment
    });

    // Show result section
    setShowResult(true);
  };

  /**
   * Formats number to Indian currency format
   * @param {number} num - Number to format
   * @returns {string} - Formatted currency string
   */
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="app-container">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* Main Card */}
            <div className="card shadow-lg p-4">
              {/* Header */}
              <h1 className="text-center mb-4 text-primary fw-bold">
                💰 EMI Calculator
              </h1>
              <p className="text-center text-muted mb-4">
                Calculate your monthly loan installment
              </p>

              {/* Input Form */}
              <div className="mb-3">
                <label htmlFor="loanAmount" className="form-label fw-semibold">
                  Loan Amount (₹)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="loanAmount"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  maxLength="7"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="interestRate" className="form-label fw-semibold">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="interestRate"
                  placeholder="Enter annual interest rate"
                  value={annualInterestRate}
                  onChange={handleInterestRateChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="loanTenure" className="form-label fw-semibold">
                  Loan Tenure (Months)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="loanTenure"
                  placeholder="Enter loan tenure in months"
                  value={loanTenure}
                  onChange={handleLoanTenureChange}
                  maxLength="3"
                />
              </div>

              {/* Calculate Button */}
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={calculateEMI}
              >
                Calculate EMI
              </button>

              {/* Result Section - Conditional Rendering */}
              {showResult && result && (
                <div className="result-section mt-4 p-4 bg-light rounded border">
                  <h4 className="text-center mb-4 text-success fw-bold">
                    📊 Calculation Results
                  </h4>

                  {/* Loan Amount Display */}
                  <div className="result-item mb-3 p-3 bg-white rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Loan Amount:</span>
                      <span className="text-primary fw-bold fs-5">
                        ₹{formatCurrency(result.loanAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Monthly EMI Display */}
                  <div className="result-item mb-3 p-3 bg-white rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Monthly EMI:</span>
                      <span className="text-success fw-bold fs-5">
                        ₹{formatCurrency(result.monthlyEMI)}
                      </span>
                    </div>
                  </div>

                  {/* Total Interest Display */}
                  <div className="result-item mb-3 p-3 bg-white rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Total Interest:</span>
                      <span className="text-danger fw-bold fs-5">
                        ₹{formatCurrency(result.totalInterest)}
                      </span>
                    </div>
                  </div>

                  {/* Total Payment Display */}
                  <div className="result-item p-3 bg-white rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Total Payment:</span>
                      <span className="text-info fw-bold fs-5">
                        ₹{formatCurrency(result.totalPayment)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
