import React, { useState, useMemo } from 'react';

// --- Utility Functions (No Change) ---
const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(numAmount);
};

// --- Custom Icons (No Change) ---
const IconDollarSign = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const IconTarget = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);
const IconWallet = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
);
const IconTrash = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const IconTrendingUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

// --- React Component ---
const App = () => {
  // --- Data State (Now local) ---
  const [income, setIncome] = useState(0); 
  const [savingsRate, setSavingsRate] = useState(35);
  const [goal, setGoal] = useState({ name: 'Dream Trip', durationMonths: 12 });
  const [expenses, setExpenses] = useState([]);
  
  // --- Input State (Local state for controlling input fields) ---
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [incomeInput, setIncomeInput] = useState('');
  const [rateInput, setRateInput] = useState(35);
  const [goalNameInput, setGoalNameInput] = useState('');
  const [goalDurationInput, setGoalDurationInput] = useState(12);

  // --- HANDLERS (Now update local state directly) ---
  
  const handleSaveIncome = (value) => {
    setIncomeInput(value); 
    const budget = parseFloat(value) || 0;
    setIncome(budget); 
  };

  const handleSaveRate = (value) => {
    if (value.trim() === '') {
        setRateInput('');
        return;
    }
    
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    
    setRateInput(value);
    setSavingsRate(rate);
  };
  
  const handleSaveGoal = (name, duration) => {
    setGoalNameInput(name);
    setGoalDurationInput(duration);
    
    const durationNum = parseInt(duration) || 1;
    const newGoal = {
      name: name.trim() || 'Dream Trip',
      durationMonths: Math.max(1, durationNum),
    };
    
    setGoal(newGoal);
  };

  const handleAddExpense = () => {
    const name = newExpense.name.trim();
    const amount = parseFloat(newExpense.amount);

    if (!name || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid name and positive amount for the expense.");
      return;
    }

    const newExpenseItem = {
      id: Date.now(),
      name: name,
      amount: amount,
      timestamp: Date.now()
    };
    
    setExpenses(prevExpenses => [newExpenseItem, ...prevExpenses].sort((a, b) => b.timestamp - a.timestamp));
    setNewExpense({ name: '', amount: '' });
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== expenseId));
  };

  // --- CALCULATIONS (All calculations are performed here) ---
  const {
    monthlySavings,
    totalSpendingBudget,
    totalExpenses,
    remainingBudget,
    projectedSavings
  } = useMemo(() => {
    const savingsFraction = savingsRate / 100;
    const spendingFraction = 1 - savingsFraction;

    const monthlySavings = income * savingsFraction;
    const totalSpendingBudget = income * spendingFraction;
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const remainingBudget = totalSpendingBudget - totalExpenses;
    const projectedSavings = monthlySavings * goal.durationMonths;

    return {
      monthlySavings,
      totalSpendingBudget,
      totalExpenses,
      remainingBudget,
      projectedSavings
    };
  }, [income, savingsRate, expenses, goal.durationMonths]);

  // --- RENDER HELPERS (No Change) ---
  const getRemainingBudgetCardStyle = () => {
    const isNegative = remainingBudget < 0;
    return {
      backgroundColor: isNegative ? '#fee2e2' : '#dcfce7',
      border: `1px solid ${isNegative ? '#ef4444' : '#10b981'}`,
      color: isNegative ? '#991b1b' : '#047857',
    };
  };
  
  const getRemainingBudgetTextStyle = () => {
    const isNegative = remainingBudget < 0;
    return {
      color: isNegative ? '#b91c1c' : '#065f46',
      fontWeight: 800,
    };
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f7f9fb;
            min-height: 100vh;
            margin: 0;
            /* FIX: Remove body padding to allow the container's margin: 0 auto to work perfectly */
            padding: 0; 
          }
          .app-container {
            background-color: white;
            width: 100%;
            max-width: 900px;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e5e7eb;
            /* Center the container */
            margin: 0 auto; 
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e0e7ff;
          }
          .header h1 {
            font-size: 30px;
            font-weight: 800;
            color: #1f2937;
            margin: 0;
          }
          .input-group {
            margin-bottom: 24px;
          }
          .input-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          .input-field {
            display: block;
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 18px;
            color: #1f2937;
            background-color: #f9fafb;
            box-sizing: border-box;
          }
          .input-field:focus {
            border-color: #4f46e5;
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
          }
          .rate-section {
            padding: 16px;
            margin-bottom: 32px;
            background-color: #fffbeb;
            border: 1px solid #fcd34d;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .rate-input {
            padding-right: 48px;
            border-color: #f59e0b;
            background-color: #fff7ed;
          }
          .rate-suffix {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-weight: 700;
            color: #d97706;
            font-size: 18px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 32px;
          }
          @media (min-width: 768px) {
            .summary-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .expense-form-group {
              grid-template-columns: 2fr 1fr 1fr;
            }
          }
          .card {
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .teal-card {
            background-color: #f0fdf4;
            border: 1px solid #6ee7b7;
          }
          .indigo-card {
            background-color: #eef2ff;
            border: 1px solid #a5b4fc;
          }
          .purple-card {
            background-color: #faf5ff;
            border: 1px solid #c4b5fd;
          }
          .green-card {
            background-color: #f0fdf4;
            border: 1px solid #34d399;
          }
          .card-icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            stroke-width: 2.5;
          }
          .teal-card .card-icon { color: #0d9488; }
          .indigo-card .card-icon { color: #4f46e5; }
          .purple-card .card-icon { color: #8b5cf6; }
          .green-card .card-icon { color: #059669; }
          .card-title {
            font-size: 14px;
            font-weight: 600;
            color: #0f766e;
            margin: 0;
          }
          .card-amount {
            font-size: 24px;
            font-weight: 800;
            color: #134e4a;
            margin: 0;
          }
          .expense-form-group {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 20px;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .expense-input-money {
            padding-left: 30px;
          }
          .btn-primary {
            background-color: #4f46e5;
            color: white;
            font-weight: 600;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.15s;
            border: none;
            font-size: 16px;
          }
          .btn-primary:hover {
            background-color: #4338ca;
          }
          .expense-list {
            max-height: 240px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-right: 8px;
          }
          .expense-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background-color: white;
            border: 1px solid #f3f4f6;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
          }
          .delete-btn {
            color: #ef4444;
            cursor: pointer;
            transition: color 0.15s;
            background: none;
            border: none;
            padding: 4px;
          }
          .delete-btn:hover {
            color: #b91c1c;
          }
          .remaining-budget-card {
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
          }
          .remaining-budget-amount {
            font-size: 36px;
            font-weight: 900;
            margin-top: 4px;
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
        `}
      </style>

      <div className="app-container">
        
        {/* Header */}
        <header className="header">
            <h1>Clean Savings & Expense Planner</h1>
            <p style={{ fontSize: '18px', color: '#6b7280', marginTop: '8px' }}>
            Set your goals and track your spending with confidence.
            </p>
        </header>

        {/* 1. Income Input */}
        <div className="input-group">
            <label htmlFor="monthlyIncome" className="input-label">1. Enter Your Total Monthly Budget/Income:</label>
            <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '700' }}>$</span>
            <input
                type="number"
                id="monthlyIncome"
                className="input-field"
                placeholder="e.g., 5000"
                min="0"
                value={incomeInput}
                onChange={(e) => handleSaveIncome(e.target.value)}
                style={{ paddingLeft: '28px' }}
            />
            </div>
        </div>

        {/* 2. Savings Rate Section */}
        <div className="input-group rate-section">
            <label htmlFor="savingsRateInput" className="input-label" style={{ color: '#92400e' }}>
            2. Set Your Custom Monthly Savings Goal Percentage:
            </label>
            <div style={{ position: 'relative' }}>
            <input
                type="number"
                id="savingsRateInput"
                className="input-field rate-input"
                placeholder="e.g., 35"
                min="0"
                max="100"
                value={rateInput}
                onChange={(e) => handleSaveRate(e.target.value)}
            />
            <span className="rate-suffix">%</span>
            </div>
            <p style={{ fontSize: '12px', color: '#b45309', marginTop: '4px' }}>
            The default is 35%. This determines your total available spending budget.
            </p>
        </div>
        
        {/* 3. Goal/Timeframe Section */}
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', paddingTop: '8px' }}>3. Set a Specific Savings Goal</h2>
        <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', padding: '20px', backgroundColor: '#eef2ff', border: '1px solid #a5b4fc', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div>
            <label htmlFor="goalNameInput" className="input-label" style={{ color: '#3730a3' }}>Goal Name</label>
            <input
                type="text"
                id="goalNameInput"
                className="input-field"
                placeholder="e.g., Down Payment, Dream Vacation"
                value={goalNameInput}
                onChange={(e) => {
                handleSaveGoal(e.target.value, goalDurationInput);
                }}
                style={{ backgroundColor: 'white', fontSize: '16px', padding: '10px' }}
            />
            </div>
            <div>
            <label htmlFor="goalDurationInput" className="input-label" style={{ color: '#3730a3' }}>Duration</label>
            <div style={{ position: 'relative' }}>
                <input
                type="number"
                id="goalDurationInput"
                className="input-field"
                placeholder="e.g., 12"
                min="1"
                value={goalDurationInput}
                onChange={(e) => {
                    handleSaveGoal(goalNameInput, e.target.value);
                }}
                style={{ backgroundColor: 'white', fontSize: '16px', padding: '10px', paddingRight: '60px' }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: '500', color: '#4f46e5' }}>months</span>
            </div>
            </div>
        </div>

        {/* 4. Budget Allocation Summary */}
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', paddingTop: '8px' }}>4. Budget Allocation Summary</h2>
        <div className="summary-grid">
            
            {/* Monthly Income Card */}
            <div className="card green-card">
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <IconTrendingUp className="card-icon" style={{ color: '#059669' }} />
                <p className="card-title" style={{ color: '#047857' }}>Monthly Income</p>
                </div>
            </div>
            <div className="card-amount" style={{ color: '#065f46' }}>{formatCurrency(income)}</div>
            </div>

            {/* Monthly Savings Goal */}
            <div className="card teal-card">
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <IconTarget className="card-icon" style={{ color: '#0d9488' }} />
                <p className="card-title">Monthly Savings Goal ({savingsRate}%)</p>
                </div>
            </div>
            <div className="card-amount" style={{ color: '#134e4a' }}>{formatCurrency(monthlySavings)}</div>
            </div>

            {/* Total Available Spending Budget */}
            <div className="card indigo-card">
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <IconWallet className="card-icon" style={{ color: '#4f46e5' }} />
                <p className="card-title">Available Spending ({100 - savingsRate}%)</p>
                </div>
            </div>
            <div className="card-amount" style={{ color: '#3730a3' }}>{formatCurrency(totalSpendingBudget)}</div>
            </div>
        </div>

        {/* 5. Monthly Expense Tracker */}
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', paddingTop: '8px' }}>5. Monthly Expense Tracker</h2>
        
        {/* Add New Expense Form */}
        <div className="expense-form-group input-group">
            <input
            type="text"
            placeholder="Expense Name (e.g., Groceries)"
            className="input-field"
            value={newExpense.name}
            onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
            style={{ fontSize: '16px', padding: '10px' }}
            />
            <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' }}>$</span>
            <input
                type="number"
                placeholder="Amount (1500)"
                className="input-field expense-input-money"
                min="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                style={{ fontSize: '16px', padding: '10px' }}
            />
            </div>
            <button onClick={handleAddExpense} className="btn-primary">
            Add Expense
            </button>
        </div>

        {/* Expense List and Remaining Budget Grid */}
        <div className="summary-grid" style={{ gridTemplateColumns: '1fr 1fr' }}> 
            
            {/* Expense List Container */}
            <div style={{ backgroundColor: 'white', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>Total Planned Expenses:</h3>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="expense-list">
                {expenses.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic', padding: '8px' }}>No expenses added yet. Start tracking your spending!</p>
                ) : (
                expenses.map((expense) => (
                    <div key={expense.id} className="expense-item">
                    <span style={{ color: '#1f2937', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>
                        {expense.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#374151', fontWeight: '700' }}>{formatCurrency(expense.amount)}</span>
                        <button onClick={() => handleDeleteExpense(expense.id)} className="delete-btn" title="Delete Expense">
                        <IconTrash width="20" height="20" />
                        </button>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>

            {/* Remaining Budget Card */}
            <div className="remaining-budget-card" style={getRemainingBudgetCardStyle()}>
            <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Remaining Budget:</p>
            <div className="remaining-budget-amount" style={getRemainingBudgetTextStyle()}>{formatCurrency(remainingBudget)}</div>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Money left for flexible spending this month.</p>
            </div>
        </div>
        
        {/* Projected Savings */}
        <div className="card purple-card" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconDollarSign className="card-icon" style={{ color: '#8b5cf6' }} />
            <div>
                <p className="card-title" style={{ color: '#6d28d9' }}>
                Projected Savings for {goal.name}
                </p>
                <p style={{ fontSize: '12px', color: '#9333ea', fontWeight: '600' }}>
                ({goal.durationMonths} {goal.durationMonths === 1 ? 'month' : 'months'})
                </p>
            </div>
            </div>
            <div className="card-amount" style={{ color: '#6b21a8' }}>{formatCurrency(projectedSavings)}</div>
        </div>

        {/* Footer/Info */}
        <footer className="footer">
            <p style={{ marginBottom: '4px' }}>All data is stored locally in your browser's memory and will be lost on refresh.</p>
        </footer>
      </div>
    </>
  );
};

export default App;