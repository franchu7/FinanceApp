import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import type { FinancialSummary } from "@/types/finance";

interface FinancialMetricsProps {
  summary: FinancialSummary;
}

export const FinancialMetrics = ({ summary }: FinancialMetricsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const metrics = [
    {
      title: "Ingresos Totales",
      value: formatCurrency(summary.totalIncome),
      change: "+12.5%",
      icon: ArrowUpRight,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Gastos Totales",
      value: formatCurrency(summary.totalExpenses),
      change: "-3.2%",
      icon: ArrowDownRight,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Patrimonio Neto",
      value: formatCurrency(summary.netWorth),
      change: formatPercentage(summary.monthlyChange),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Inversiones",
      value: formatCurrency(summary.totalInvestments),
      change: "+8.7%",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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