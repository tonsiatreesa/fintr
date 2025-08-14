/**
 * @jest-environment jsdom
 */
import { 
  cn, 
  convertAmountFromMiliunits, 
  convertAmountToMiliunits,
  formatCurrency,
  calculatePercentageChange,
  fillMissingDays,
  formatDateRange,
  formatPercentage
} from '../lib/utils'

describe('Utility Functions Tests', () => {
  test('cn should merge class names correctly', () => {
    const result = cn('text-blue-500', 'bg-white', 'hover:bg-gray-100')
    expect(result).toBe('text-blue-500 bg-white hover:bg-gray-100')
  })

  test('cn should handle conditional class names', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn('base-class', {
      'active-class': isActive,
      'disabled-class': isDisabled
    })
    
    expect(result).toContain('base-class')
    expect(result).toContain('active-class')
    expect(result).not.toContain('disabled-class')
  })

  test('convertAmountFromMiliunits should convert correctly', () => {
    expect(convertAmountFromMiliunits(1000)).toBe(1)
    expect(convertAmountFromMiliunits(2500)).toBe(2.5)
    expect(convertAmountFromMiliunits(0)).toBe(0)
  })

  test('convertAmountToMiliunits should convert correctly', () => {
    expect(convertAmountToMiliunits(1)).toBe(1000)
    expect(convertAmountToMiliunits(2.5)).toBe(2500)
    expect(convertAmountToMiliunits(0)).toBe(0)
  })

  test('formatCurrency should format numbers as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
    expect(formatCurrency(0)).toBe('$0.00')
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
  })

  test('calculatePercentageChange should calculate percentage correctly', () => {
    expect(calculatePercentageChange(120, 100)).toBe(20)
    expect(calculatePercentageChange(80, 100)).toBe(-20)
    expect(calculatePercentageChange(100, 100)).toBe(0)
    expect(calculatePercentageChange(100, 0)).toBe(100)
    expect(calculatePercentageChange(0, 0)).toBe(0)
  })

  test('fillMissingDays should fill gaps in date ranges', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-03')
    const activeDays = [
      { date: new Date('2024-01-01'), income: 100, expenses: 50 },
      { date: new Date('2024-01-03'), income: 200, expenses: 75 }
    ]

    const result = fillMissingDays(activeDays, startDate, endDate)
    
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ date: new Date('2024-01-01'), income: 100, expenses: 50 })
    expect(result[1]).toEqual({ date: new Date('2024-01-02'), income: 0, expenses: 0 })
    expect(result[2]).toEqual({ date: new Date('2024-01-03'), income: 200, expenses: 75 })
  })

  test('fillMissingDays should return empty array for empty input', () => {
    const result = fillMissingDays([], new Date(), new Date())
    expect(result).toEqual([])
  })

  test('formatDateRange should format date ranges correctly', () => {
    const period = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31')
    }
    
    const result = formatDateRange(period)
    expect(result).toBe('Jan 01 - Jan 31, 2024')
  })

  test('formatDateRange should handle single date', () => {
    const period = {
      from: new Date('2024-01-01'),
      to: undefined
    }
    
    const result = formatDateRange(period)
    expect(result).toBe('Jan 01, 2024')
  })

  test('formatPercentage should format percentages correctly', () => {
    expect(formatPercentage(50)).toBe('50%')
    expect(formatPercentage(25)).toBe('25%')
    expect(formatPercentage(100)).toBe('100%')
  })

  test('formatPercentage should add prefix when requested', () => {
    expect(formatPercentage(25, { addPrefix: true })).toBe('+25%')
    expect(formatPercentage(-25, { addPrefix: true })).toBe('-25%')
    expect(formatPercentage(0, { addPrefix: true })).toBe('0%')
  })
})
