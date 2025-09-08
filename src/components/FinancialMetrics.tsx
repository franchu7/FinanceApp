import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FinancialSummary, Transaction } from '@/types/finance'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from 'lucide-react'

interface FinancialMetricsProps {
  summary: FinancialSummary
  transactions: Transaction[]
}

export const FinancialMetrics = ({ summary, transactions }: FinancialMetricsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Calculate changes based on historical data
  const calculateMonthlyChanges = () => {
    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

    // Current month data
    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= currentMonth
    })

    // Previous month data
    const previousMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= previousMonth && transactionDate <= previousMonthEnd
    })

    // Calculate current month metrics
    const currentIncome = currentMonthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)

    const currentExpenses = Math.abs(currentMonthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0))

    // Calculate previous month metrics
    const previousIncome = previousMonthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)

    const previousExpenses = Math.abs(previousMonthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0))

    // Calculate percentage changes with better logic for zero base values
    let incomeChange = 0
    let incomeChangeText = ''
    if (previousIncome > 0) {
      incomeChange = ((currentIncome - previousIncome) / previousIncome) * 100
      incomeChangeText = `${formatPercentage(incomeChange)} desde el mes pasado`
    } else if (currentIncome > 0) {
      incomeChangeText = 'Nuevo este mes'
    } else {
      incomeChangeText = 'Sin cambios'
    }

    let expenseChange = 0
    let expenseChangeText = ''
    if (previousExpenses > 0) {
      expenseChange = ((currentExpenses - previousExpenses) / previousExpenses) * 100
      expenseChangeText = `${formatPercentage(expenseChange)} desde el mes pasado`
    } else if (currentExpenses > 0) {
      expenseChangeText = 'Nuevo este mes'
    } else {
      expenseChangeText = 'Sin cambios'
    }

    // For monthly balance, calculate actual balance change
    let balanceChangeText = ''
    const currentBalance = currentIncome - currentExpenses
    const previousBalance = previousIncome - previousExpenses

    if (previousBalance !== 0) {
      const balanceChange = ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100
      balanceChangeText = `${formatPercentage(balanceChange)} desde el mes pasado`
    } else if (currentBalance !== 0) {
      balanceChangeText = 'Nuevo este mes'
    } else {
      balanceChangeText = 'Sin cambios'
    }

    let netWorthChangeText = ''
    const currentNetWorth = summary.netWorth
    const previousNetWorth = previousIncome - previousExpenses

    if (previousNetWorth !== 0) {
      const netWorthChange = ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100
      netWorthChangeText = `${formatPercentage(netWorthChange)} desde el mes pasado`
    } else if (currentNetWorth !== 0) {
      netWorthChangeText = 'Nuevo este mes'
    } else {
      netWorthChangeText = 'Sin cambios'
    }

    return {
      incomeChangeText,
      expenseChangeText,
      balanceChangeText,
      netWorthChangeText,
    }
  }

  const changes = calculateMonthlyChanges()

  // Helper function to determine colors based on change text
  const getColorForChange = (changeText: string, isExpense = false, useCustomPositive = false) => {
    if (changeText.includes('insuficientes')) {
      return { color: 'text-muted-foreground', bgColor: 'bg-muted/10' }
    }
    if (changeText.includes('-')) {
      // For expenses: decrease (negative) is good (green), for others: decrease is bad (red)
      return isExpense ? { color: 'text-success', bgColor: 'bg-success/10' } : { color: 'text-destructive', bgColor: 'bg-destructive/10' }
    } else if (changeText.includes('+')) {
      if (useCustomPositive) {
        return { color: 'text-primary', bgColor: 'bg-primary/10' }
      }
      // For expenses: increase (positive) is bad (red), for others: increase is good (green)
      return isExpense ? { color: 'text-destructive', bgColor: 'bg-destructive/10' } : { color: 'text-success', bgColor: 'bg-success/10' }
    } else {
      return { color: 'text-muted-foreground', bgColor: 'bg-muted/10' }
    }
  }

  const incomeColors = getColorForChange(changes.incomeChangeText)
  const expenseColors = getColorForChange(changes.expenseChangeText, true)
  const balanceColors = getColorForChange(changes.balanceChangeText, false, true)
  const networthColors = getColorForChange(changes.netWorthChangeText, false, true)

  const metrics = [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(summary.totalIncome),
      change: changes.incomeChangeText,
      icon: ArrowUpRight,
      color: incomeColors.color,
      bgColor: incomeColors.bgColor,
    },
    {
      title: 'Gastos del Mes',
      value: formatCurrency(summary.totalExpenses),
      change: changes.expenseChangeText,
      icon: ArrowDownRight,
      color: expenseColors.color,
      bgColor: expenseColors.bgColor,
    },
    {
      title: 'Balance del Mes',
      value: formatCurrency(summary.totalIncome - summary.totalExpenses),
      change: changes.balanceChangeText,
      icon: Wallet,
      color: balanceColors.color,
      bgColor: balanceColors.bgColor,
    },
    {
      title: 'Patrimonio Neto',
      value: formatCurrency(summary.netWorth),
      icon: PiggyBank,
      color: networthColors.color,
      bgColor: networthColors.bgColor,
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className='hover:shadow-lg transition-shadow duration-200'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground mb-1'>{metric.value}</div>
              <p className={`text-xs ${metric.color} font-medium`}>{metric.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
