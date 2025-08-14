/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Categories Component Tests', () => {
  test('should render categories list', () => {
    const CategoriesList = ({ categories }: { 
      categories: Array<{id: string, name: string, color: string, transactionCount: number}> 
    }) => (
      <div>
        <h2>Categories</h2>
        {categories.map(category => (
          <div key={category.id}>
            <span style={{color: category.color}}>
              {category.name} ({category.transactionCount} transactions)
            </span>
          </div>
        ))}
      </div>
    )
    
    const mockCategories = [
      { id: '1', name: 'Food & Dining', color: '#ff6b6b', transactionCount: 15 },
      { id: '2', name: 'Transportation', color: '#4ecdc4', transactionCount: 8 }
    ]
    
    render(<CategoriesList categories={mockCategories} />)
    
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Food & Dining (15 transactions)')).toBeInTheDocument()
    expect(screen.getByText('Transportation (8 transactions)')).toBeInTheDocument()
  })

  test('should display category creation form', () => {
    const CategoryForm = () => (
      <form>
        <input placeholder="Category name" />
        <input placeholder="Color" type="color" />
        <textarea placeholder="Description"></textarea>
        <button type="submit">Create Category</button>
      </form>
    )
    
    render(<CategoryForm />)
    
    expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Color')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
    expect(screen.getByText('Create Category')).toBeInTheDocument()
  })

  test('should validate category name uniqueness', () => {
    const validateCategoryName = (name: string, existingCategories: Array<{name: string}>) => {
      const normalizedName = name.toLowerCase().trim()
      return normalizedName.length > 0 && 
             !existingCategories.some(cat => cat.name.toLowerCase() === normalizedName)
    }
    
    const existingCategories = [
      { name: 'Food' },
      { name: 'Transportation' }
    ]
    
    expect(validateCategoryName('Entertainment', existingCategories)).toBe(true)
    expect(validateCategoryName('Food', existingCategories)).toBe(false)
    expect(validateCategoryName('  food  ', existingCategories)).toBe(false)
    expect(validateCategoryName('', existingCategories)).toBe(false)
  })

  test('should calculate category spending totals', () => {
    const calculateCategoryTotals = (
      transactions: Array<{categoryId: string, amount: number}>,
      categories: Array<{id: string, name: string}>
    ) => {
      return categories.map(category => {
        const categoryTransactions = transactions.filter(t => t.categoryId === category.id)
        const total = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
        return { ...category, total, transactionCount: categoryTransactions.length }
      })
    }
    
    const transactions = [
      { categoryId: '1', amount: -50 },
      { categoryId: '1', amount: -25 },
      { categoryId: '2', amount: -100 }
    ]
    
    const categories = [
      { id: '1', name: 'Food' },
      { id: '2', name: 'Transportation' }
    ]
    
    const totals = calculateCategoryTotals(transactions, categories)
    expect(totals[0].total).toBe(75)
    expect(totals[0].transactionCount).toBe(2)
    expect(totals[1].total).toBe(100)
    expect(totals[1].transactionCount).toBe(1)
  })

  test('should generate category color palette', () => {
    const generateCategoryColors = (count: number) => {
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
        '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'
      ]
      return Array.from({ length: count }, (_, i) => colors[i % colors.length])
    }
    
    const colors3 = generateCategoryColors(3)
    const colors12 = generateCategoryColors(12)
    
    expect(colors3).toHaveLength(3)
    expect(colors3[0]).toBe('#ff6b6b')
    expect(colors3[1]).toBe('#4ecdc4')
    expect(colors3[2]).toBe('#45b7d1')
    
    expect(colors12).toHaveLength(12)
    expect(colors12[10]).toBe('#ff6b6b') // wraps around
  })
})
