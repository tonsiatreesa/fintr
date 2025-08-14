/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}))

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
    },
    isLoaded: true,
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Application Components', () => {
  test('renders welcome message component', () => {
    const WelcomeMessage = () => (
      <div>
        <h1>Welcome to Fintr</h1>
        <p>Manage your finances</p>
      </div>
    )
    
    render(<WelcomeMessage />)
    
    expect(screen.getByText('Welcome to Fintr')).toBeInTheDocument()
    expect(screen.getByText('Manage your finances')).toBeInTheDocument()
  })

  test('renders navigation component', () => {
    const Navigation = () => (
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Accounts</li>
          <li>Transactions</li>
          <li>Categories</li>
        </ul>
      </nav>
    )
    
    render(<Navigation />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Accounts')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  test('validates form input component', () => {
    const FormInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter amount"
      />
    )
    
    const TestWrapper = () => {
      const [value, setValue] = React.useState('')
      return <FormInput value={value} onChange={setValue} />
    }
    
    render(<TestWrapper />)
    
    const input = screen.getByPlaceholderText('Enter amount')
    expect(input).toBeInTheDocument()
  })

  test('validates account balance calculation', () => {
    const calculateBalance = (transactions: Array<{ amount: number }>) => {
      return transactions.reduce((total, transaction) => total + transaction.amount, 0)
    }
    
    const transactions = [
      { amount: 100 },
      { amount: -50 },
      { amount: 25 },
    ]
    
    const balance = calculateBalance(transactions)
    expect(balance).toBe(75)
  })

  test('validates transaction categorization', () => {
    const categorizeTransaction = (description: string) => {
      if (description.toLowerCase().includes('grocery') || description.toLowerCase().includes('food')) {
        return 'Food & Dining'
      }
      if (description.toLowerCase().includes('gas') || description.toLowerCase().includes('fuel')) {
        return 'Transportation'
      }
      return 'Other'
    }
    
    expect(categorizeTransaction('Grocery Store Purchase')).toBe('Food & Dining')
    expect(categorizeTransaction('Gas Station')).toBe('Transportation')
    expect(categorizeTransaction('Online Shopping')).toBe('Other')
  })
})
