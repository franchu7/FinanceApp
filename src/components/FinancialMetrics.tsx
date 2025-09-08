import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialSummary, Investment, Transaction } from "@/types/finance";
import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp, Wallet } from "lucide-react";

interface FinancialMetricsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  investments: Investment[];
}

export const FinancialMetrics = ({ summary, transactions, investments }: FinancialMetricsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Calculate changes based on historical data
  const calculateMonthlyChanges = () => {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Current month data
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= currentMonth;
    });

    // Previous month data
    const previousMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= previousMonth && transactionDate <= previousMonthEnd;
    });

    // Calculate current month metrics
    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentExpenses = Math.abs(currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0));

    // Calculate previous month metrics
    const previousIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousExpenses = Math.abs(previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0));

    // Calculate percentage changes with better logic for zero base values
    let incomeChange = 0;
    let incomeChangeText = "";
    if (previousIncome > 0) {
      incomeChange = ((currentIncome - previousIncome) / previousIncome) * 100;
      incomeChangeText = formatPercentage(incomeChange);
    } else if (currentIncome > 0) {
      incomeChange = 0; // No percentage change to show
      incomeChangeText = "Nuevo este mes";
    } else {
      incomeChange = 0;
      incomeChangeText = "Sin cambios";
    }

    let expenseChange = 0;
    let expenseChangeText = "";
    if (previousExpenses > 0) {
      expenseChange = ((currentExpenses - previousExpenses) / previousExpenses) * 100;
      expenseChangeText = formatPercentage(-expenseChange); // Negative because decrease is good
    } else if (currentExpenses > 0) {
      expenseChange = 0; // No percentage change to show
      expenseChangeText = "Nuevo este mes";
    } else {
      expenseChange = 0;
      expenseChangeText = "Sin cambios";
    }

    // For net worth, calculate actual previous month net worth vs current
    let patrimonioNetWorthChangeText = "";
    
    // Calculate previous month net worth
    const previousMonthAllIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date) <= previousMonthEnd)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousMonthAllExpenses = Math.abs(transactions
      .filter(t => t.type === 'expense' && new Date(t.date) <= previousMonthEnd)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0));
    
    // Previous month investments value (assuming same quantities but different prices)
    const previousMonthInvestments = investments.length > 0
      ? investments.reduce((sum, inv) => sum + (inv.quantity * inv.purchasePrice), 0) // Simplified: using purchase price as previous value
      : 0;
    
    const previousNetWorth = previousMonthAllIncome - previousMonthAllExpenses + previousMonthInvestments;
    
    // Current net worth calculation (all time income - all time expenses + current investments value)
    const currentAllIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentAllExpenses = Math.abs(transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0));
    
    const currentInvestmentsValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
    const currentNetWorth = currentAllIncome - currentAllExpenses + currentInvestmentsValue;
    
    if (previousNetWorth > 0) {
      const netWorthChange = ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100;
      patrimonioNetWorthChangeText = formatPercentage(netWorthChange);
    } else if (currentNetWorth !== 0) {
      patrimonioNetWorthChangeText = "Nuevo este mes";
    } else {
      patrimonioNetWorthChangeText = "Sin cambios";
    }

    // For monthly balance, use simple calculation based on income vs expenses change
    let netWorthChangeText = "";
    if (previousIncome > 0 || previousExpenses > 0) {
      const balanceChange = incomeChange - expenseChange;
      netWorthChangeText = formatPercentage(balanceChange);
    } else if (currentIncome > 0 || currentExpenses > 0) {
      netWorthChangeText = "Nuevo este mes";
    } else {
      netWorthChangeText = "Sin cambios";
    }

    // For investments, calculate based on current vs purchase price average
    let investmentChangeText = "";
    if (investments.length > 0) {
      const investmentChange = investments.reduce((avg, inv) => {
        const change = ((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100;
        return avg + change;
      }, 0) / investments.length;
      investmentChangeText = formatPercentage(investmentChange);
    } else {
      investmentChangeText = "Sin inversiones";
    }

    return {
      incomeChangeText,
      expenseChangeText,
      netWorthChangeText,
      investmentChangeText,
      patrimonioNetWorthChangeText
    };
  };

  const changes = calculateMonthlyChanges();

  // Helper function to determine colors based on change text
  const getColorForChange = (changeText: string, isExpense = false, useCustomPositive = false) => {
    if (changeText.includes("-")) {
      return isExpense 
        ? { color: "text-success", bgColor: "bg-success/10" }
        : { color: "text-destructive", bgColor: "bg-destructive/10" };
    } else if (changeText.includes("+")) {
      if (useCustomPositive) {
        return { color: "text-primary", bgColor: "bg-primary/10" };
      }
      return isExpense
        ? { color: "text-warning", bgColor: "bg-warning/10" }
        : { color: "text-success", bgColor: "bg-success/10" };
    } else {
      return { color: "text-muted-foreground", bgColor: "bg-muted/10" };
    }
  };

  const incomeColors = getColorForChange(changes.incomeChangeText);
  const expenseColors = getColorForChange(changes.expenseChangeText, true);
  const netWorthColors = getColorForChange(changes.netWorthChangeText, false, true);
  const investmentColors = getColorForChange(changes.investmentChangeText);
  const patrimonioColors = getColorForChange(changes.patrimonioNetWorthChangeText, false, true);

  const metrics = [
    {
      title: "Ingresos del Mes",
      value: formatCurrency(summary.totalIncome),
      change: changes.incomeChangeText,
      icon: ArrowUpRight,
      color: incomeColors.color,
      bgColor: incomeColors.bgColor
    },
    {
      title: "Gastos del Mes",
      value: formatCurrency(summary.totalExpenses),
      change: changes.expenseChangeText,
      icon: ArrowDownRight,
      color: expenseColors.color,
      bgColor: expenseColors.bgColor
    },
    {
      title: "Balance del Mes",
      value: formatCurrency(summary.totalIncome - summary.totalExpenses),
      change: changes.netWorthChangeText,
      icon: Wallet,
      color: netWorthColors.color,
      bgColor: netWorthColors.bgColor
    },
    {
      title: "Inversiones Totales",
      value: formatCurrency(summary.totalInvestments),
      change: changes.investmentChangeText,
      icon: TrendingUp,
      color: investmentColors.color,
      bgColor: investmentColors.bgColor
    },
    {
      title: "Patrimonio Neto",
      value: formatCurrency(summary.netWorth),
      change: changes.netWorthChangeText,
      icon: PiggyBank,
      color: patrimonioColors.color,
      bgColor: patrimonioColors.bgColor
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <p className={`text-xs ${metric.color} font-medium`}>
                {metric.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};