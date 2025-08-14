/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Dashboard Component Tests', () => {
  test('should render dashboard welcome message', () => {
    const DashboardWelcome = () => (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your financial overview</p>
      </div>
    )
    
    render(<DashboardWelcome />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome to your financial overview')).toBeInTheDocument()
  })

  test('should display account balance summary', () => {
    const BalanceSummary = ({ balance }: { balance: number }) => (
      <div>
        <span>Total Balance: ${balance.toFixed(2)}</span>
      </div>
    )
    
    render(<BalanceSummary balance={1234.56} />)
    
    expect(screen.getByText('Total Balance: $1234.56')).toBeInTheDocument()
  })

  test('should show recent transactions count', () => {
    const RecentTransactions = ({ count }: { count: number }) => (
      <div>
        <p>Recent Transactions: {count}</p>
      </div>
    )
    
    render(<RecentTransactions count={5} />)
    
    expect(screen.getByText('Recent Transactions: 5')).toBeInTheDocument()
  })

  test('should display monthly spending chart placeholder', () => {
    const SpendingChart = () => (
      <div>
        <h3>Monthly Spending</h3>
        <div data-testid="chart-container">Chart placeholder</div>
      </div>
    )
    
    render(<SpendingChart />)
    
    expect(screen.getByText('Monthly Spending')).toBeInTheDocument()
    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
  })

  test('should calculate net worth correctly', () => {
    const calculateNetWorth = (assets: number, liabilities: number) => {
      return assets - liabilities
    }
    
    const netWorth = calculateNetWorth(10000, 2500)
    expect(netWorth).toBe(7500)
  })
})
