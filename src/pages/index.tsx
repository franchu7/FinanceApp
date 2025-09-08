import { ExpenseChart } from '@/components/ExpenseChart'
import { FinancialMetrics } from '@/components/FinancialMetrics'
import { Navigation } from '@/components/Navigation'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionList } from '@/components/TransactionList'
import type { FinancialSummary, Transaction, TransactionFilters } from '@/types/finance'
import { useMemo, useState } from 'react'

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: null,
    amountMax: null,
    searchText: '',
  })

  // Form state
  const [transactionFormOpen, setTransactionFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false
      }

      // Date range filter
      if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) {
        return false
      }

      if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) {
        return false
      }

      // Amount range filter
      const absAmount = Math.abs(transaction.amount)
      if (filters.amountMin !== null && absAmount < filters.amountMin) {
        return false
      }

      if (filters.amountMax !== null && absAmount > filters.amountMax) {
        return false
      }

      // Search text filter
      if (filters.searchText && !transaction.description.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false
      }

      return true
    })
  }, [transactions, filters])

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const categories = [...new Set(transactions.map((t) => t.category))]
    return categories.sort((a, b) => a.localeCompare(b))
  }, [transactions])

  // Calculate financial summary based on current month data
  const financialSummary = useMemo((): FinancialSummary => {
    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= currentMonth
    })

    const totalIncome = currentMonthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = Math.abs(currentMonthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0))

    // Calculate historical net worth (all-time income - all-time expenses)
    const allTimeIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)

    const allTimeExpenses = Math.abs(transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0))

    const netWorth = allTimeIncome - allTimeExpenses

    // Net worth calculation for monthly balance: current month income - expenses
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    return {
      totalIncome,
      totalExpenses,
      netWorth,
      savingsRate,
      monthlyChange: 0, // This is now calculated in FinancialMetrics component
    }
  }, [transactions])

  // Transaction CRUD operations
  const handleAddTransaction = () => {
    setEditingTransaction(undefined)
    setTransactionFormOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setTransactionFormOpen(true)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const handleTransactionSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    // Ensure expenses are negative and incomes are positive
    const amount = transactionData.type === 'expense' ? -Math.abs(transactionData.amount) : Math.abs(transactionData.amount)

    const processedTransaction = {
      ...transactionData,
      amount,
    }

    if (editingTransaction) {
      // Update existing transaction
      setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? { ...processedTransaction, id: editingTransaction.id } : t)))
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        ...processedTransaction,
        id: Date.now().toString(),
      }
      setTransactions((prev) => [newTransaction, ...prev])
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className='space-y-8'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-2'>Dashboard Financiero</h2>
              <p className='text-muted-foreground'>Resumen completo de tu situación financiera</p>
            </div>
            <FinancialMetrics summary={financialSummary} transactions={transactions} />
            <ExpenseChart transactions={transactions} />
            <TransactionList
              transactions={transactions.slice(0, 5)}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )
      case 'transactions':
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-2'>Transacciones</h2>
              <p className='text-muted-foreground'>Gestiona todos tus ingresos y gastos</p>
            </div>
            <TransactionList
              transactions={filteredTransactions}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              filters={filters}
              onFiltersChange={setFilters}
              availableCategories={availableCategories}
            />
          </div>
        )
      case 'budgets':
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-2'>Presupuestos</h2>
              <p className='text-muted-foreground'>Define y controla tus límites de gasto</p>
            </div>
            <div className='text-center py-12 text-muted-foreground'>
              <p>Funcionalidad de presupuestos próximamente...</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-2'>Configuración</h2>
              <p className='text-muted-foreground'>Personaliza tu experiencia</p>
            </div>
            <div className='text-center py-12 text-muted-foreground'>
              <p>Panel de configuración próximamente...</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/30'>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className='container mx-auto px-4 py-8'>{renderContent()}</main>

      {/* Forms */}
      <TransactionForm
        open={transactionFormOpen}
        onClose={() => {
          setTransactionFormOpen(false)
          setEditingTransaction(undefined)
        }}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction}
      />
    </div>
  )
}

export default Index
