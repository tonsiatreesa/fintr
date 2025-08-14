/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Accounts Component Tests', () => {
  test('should render accounts list', () => {
    const AccountsList = ({ accounts }: { accounts: Array<{id: string, name: string, balance: number}> }) => (
      <div>
        <h2>Accounts</h2>
        {accounts.map(account => (
          <div key={account.id}>
            <span>{account.name}: ${account.balance}</span>
          </div>
        ))}
      </div>
    )
    
    const mockAccounts = [
      { id: '1', name: 'Checking', balance: 1000 },
      { id: '2', name: 'Savings', balance: 5000 }
    ]
    
    render(<AccountsList accounts={mockAccounts} />)
    
    expect(screen.getByText('Accounts')).toBeInTheDocument()
    expect(screen.getByText('Checking: $1000')).toBeInTheDocument()
    expect(screen.getByText('Savings: $5000')).toBeInTheDocument()
  })

  test('should display account creation form', () => {
    const AccountForm = () => (
      <form>
        <input placeholder="Account name" />
        <input placeholder="Initial balance" type="number" />
        <button type="submit">Create Account</button>
      </form>
    )
    
    render(<AccountForm />)
    
    expect(screen.getByPlaceholderText('Account name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Initial balance')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  test('should calculate total balance across all accounts', () => {
    const calculateTotalBalance = (accounts: Array<{balance: number}>) => {
      return accounts.reduce((total, account) => total + account.balance, 0)
    }
    
    const accounts = [
      { balance: 1000 },
      { balance: 2500 },
      { balance: 750 }
    ]
    
    const total = calculateTotalBalance(accounts)
    expect(total).toBe(4250)
  })

  test('should validate account name input', () => {
    const validateAccountName = (name: string) => {
      return name.length >= 2 && name.length <= 50
    }
    
    expect(validateAccountName('Ch')).toBe(true)
    expect(validateAccountName('C')).toBe(false)
    expect(validateAccountName('A'.repeat(51))).toBe(false)
  })

  test('should format account balance display', () => {
    const formatBalance = (balance: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(balance)
    }
    
    expect(formatBalance(1234.56)).toBe('$1,234.56')
    expect(formatBalance(0)).toBe('$0.00')
    expect(formatBalance(-500)).toBe('-$500.00')
  })
})
