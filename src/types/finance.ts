export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
  tags?: string[]
}

export interface TransactionFilters {
  type: 'all' | 'income' | 'expense'
  category: string
  dateFrom: string
  dateTo: string
  amountMin: number | null
  amountMax: number | null
  searchText: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly' | 'yearly'
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netWorth: number
  savingsRate: number
  monthlyChange: number
}
