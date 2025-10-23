# 💰 Clean Savings & Expense Planner

This is a clean, interactive budgeting tool designed to help users allocate their monthly income, track expenses against a set spending budget, and project savings toward a specific goal. The application uses a custom percentage (defaulting to a savings-first approach) to automatically calculate available spending money and required monthly savings.

**This project is ideal for showcasing front-end skills, specifically strong React state management (`useState`, `useMemo`) and responsive, modern CSS design.**

## ✨ Features

* **Savings-First Budgeting:** Automatically calculates a monthly savings goal based on a user-defined percentage (e.g., 35% savings rate).
* **Real-Time Tracking:** Expenses are added and instantly reflected in the **Remaining Budget** calculation.
* **Projected Goal:** Calculates the total projected savings achievable toward a custom goal name and duration (in months).
* **Dynamic UI:** Visually highlights the remaining budget with color (green for positive, red for negative).
* **Local State Management:** **All income, rates, and expenses are stored in component-level React arrays/objects (using `useState` and `useMemo`)**, demonstrating state management without external databases or APIs. Data is non-persistent.
* **Clean Design:** Modern, accessible, and responsive user interface built using inline and embedded CSS.

## 🚀 Getting Started

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [Your-Repo-URL]
    cd clean-savings-expense-planner
    ```

2.  **Install dependencies:**
    Since this is a simple React component structure, assuming you are in a standard React environment (like one created by Vite or Create React App), you just need the core dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the application:**
    ```bash
    npm start
    # or
    yarn dev 
    ```
    The application will typically open at `http://localhost:3000` or `http://localhost:5173`.

## 🛠️ Technology Stack

* **React (Functional Components & Hooks):** Core application framework.
* **`useState`:** Used for managing all income, rates, goals, and the array of expenses.
* **`useMemo`:** Used for all derived, performance-critical calculations (e.g., `monthlySavings`, `remainingBudget`, `totalExpenses`) to ensure calculations only rerun when inputs change.
* **Pure CSS:** All styling is managed within the component's `<style>` tag, utilizing modern CSS features like Grid for layout.
* **ES6+ JavaScript:** Modern syntax for utility functions and logic.

## 📌 Usage

1.  **Enter Income:** Input your total monthly income.
2.  **Set Rate:** Adjust the **Monthly Savings Goal Percentage** (default is 35%). This determines your fixed savings and total available spending budget.
3.  **Set Goal:** Name your goal (e.g., "New Car") and set a timeframe (e.g., 24 months). The app projects your total achievable savings.
4.  **Add Expenses:** Use the Expense Tracker to log your fixed and variable costs.
5.  **Monitor Budget:** The **Remaining Budget** card instantly updates to show how much you have left for flexible spending.
