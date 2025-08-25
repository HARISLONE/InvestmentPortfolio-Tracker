# 📊 Investment Portfolio Tracker

A sleek and responsive web application to track and manage your investments in **stocks, cryptocurrencies, and bonds**.  
The app provides a **real-time overview** of your portfolio, interactive charts, and performance analytics — all in one dashboard.

---

## 🚀 Features

- **User Authentication**

  - Secure login with Google (via Firebase Authentication).
  - Each user’s portfolio is private — only they can view and manage their assets.

- **Portfolio Management**

  - Add, edit, and remove assets (Stocks, Crypto, Bonds).
  - Real-time price updates via **CoinGecko** (crypto) and **Alpha Vantage** (stocks).
  - Persist portfolio data securely in **Firebase Firestore**.

- **Analytics Dashboard**

  - **Portfolio Summary**: Total Cost, Current Value, Profit/Loss (absolute & %).
  - **Distribution Pie Chart**: Visualize allocation by asset type (value-based).
  - **Line Charts**: Historical performance trends for cryptocurrencies.
  - Interactive filters: search, sort, and type-based filtering.

- **Responsive UI**
  - Modern design with glassmorphism touches.
  - Works across desktop and mobile devices.
  - Built with **React**, **Vite**, and **react-google-charts**.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router
- **Charts**: react-google-charts
- **APIs**:
  - [CoinGecko API](https://www.coingecko.com/) – live crypto data
  - [Alpha Vantage API](https://www.alphavantage.co/) – live stock data
- **Backend/Database**: Firebase (Auth + Firestore)
- **Styling**: CSS (custom modules, responsive layout)

---

## ⚙️ Installation & Setup

Clone the repo:

```bash
git clone https://github.com/HARISLONE/InvestmentPortfolio-Tracker.git
cd InvestmentPortfolio-Tracker
npm install
Start the dev server: npm run dev
```

---

## 📈 Future Improvements

- Add draggable, customizable dashboard widgets.

- Stock detail pages with charts and fundamentals.

- Replace Google Charts with Recharts for improved performance & fewer warnings.

---

## 👨‍💻 Author

Haris Hilal

GitHub: [HARISLONE](https://github.com/HARISLONE/InvestmentPortfolio-Tracker) - Project Repo Link
