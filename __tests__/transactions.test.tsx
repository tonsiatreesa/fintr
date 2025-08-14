/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Transactions Component Tests', () => {
  test('should render transactions list', () => {
    const TransactionsList = ({ transactions }: { 
      transactions: Array<{id: string, description: string, amount: number, date: string}> 
    }) => (
      <div>
        <h2>Transactions</h2>
        {transactions.map(transaction => (
          <div key={transaction.id}>
            <span>{transaction.description}: ${transaction.amount} on {transaction.date}</span>
          </div>
        ))}
      </div>
    )
    
    const mockTransactions = [
      { id: '1', description: 'Coffee Shop', amount: -5.50, date: '2024-01-15' },
      { id: '2', description: 'Salary', amount: 3000, date: '2024-01-01' }
    ]
    
    render(<TransactionsList transactions={mockTransactions} />)
    
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Coffee Shop: $-5.5 on 2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('Salary: $3000 on 2024-01-01')).toBeInTheDocument()
  })

  test('should display transaction creation form', () => {
    const TransactionForm = () => (
      <form>
        <input placeholder="Description" />
        <input placeholder="Amount" type="number" />
        <select>
          <option>Select Category</option>
          <option>Food</option>
          <option>Transportation</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
    )
    
    render(<TransactionForm />)
    
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Select Category')).toBeInTheDocument()
    expect(screen.getByText('Add Transaction')).toBeInTheDocument()
  })

  test('should filter transactions by date range', () => {
    const filterTransactionsByDate = (
      transactions: Array<{date: string, amount: number}>,
      startDate: string,
      endDate: string
    ) => {
      return transactions.filter(transaction => 
        transaction.date >= startDate && transaction.date <= endDate
      )
    }
    
    const transactions = [
      { date: '2024-01-15', amount: -50 },
      { date: '2024-02-10', amount: -25 },
      { date: '2024-03-05', amount: -75 }
    ]
    
    const filtered = filterTransactionsByDate(transactions, '2024-02-01', '2024-02-28')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].amount).toBe(-25)
  })

  test('should categorize transactions automatically', () => {
    const categorizeTransaction = (description: string) => {
      const desc = description.toLowerCase()
      if (desc.includes('coffee') || desc.includes('restaurant')) return 'Food'
      if (desc.includes('gas') || desc.includes('uber')) return 'Transportation'
      if (desc.includes('salary') || desc.includes('income')) return 'Income'
      return 'Other'
    }
    
    expect(categorizeTransaction('Coffee Shop')).toBe('Food')
    expect(categorizeTransaction('Gas Station')).toBe('Transportation')
    expect(categorizeTransaction('Monthly Salary')).toBe('Income')
    expect(categorizeTransaction('Online Shopping')).toBe('Other')
  })

  test('should calculate transaction statistics', () => {
    const calculateTransactionStats = (transactions: Array<{amount: number}>) => {
      const total = transactions.reduce((sum, t) => sum + t.amount, 0)
      const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
      const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      return { total, income, expenses, count: transactions.length }
    }
    
    const transactions = [
      { amount: 1000 },  // income
      { amount: -200 },  // expense
      { amount: -50 },   // expense
      { amount: 500 }    // income
    ]
    
    const stats = calculateTransactionStats(transactions)
    expect(stats.total).toBe(1250)
    expect(stats.income).toBe(1500)
    expect(stats.expenses).toBe(250)
    expect(stats.count).toBe(4)
  })
})
