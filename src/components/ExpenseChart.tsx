import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/types/finance";
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  const expenseData = useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280', '#EF4444', '#14B8A6'];
    
    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[index % colors.length]
    }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    // Group transactions by month
    const monthlyGroups = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { 
        month: 'short',
        year: date.getFullYear() !== new Date().getFullYear() ? '2-digit' : undefined 
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          ingresos: 0,
          gastos: 0,
          sortKey: monthKey
        };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].ingresos += transaction.amount;
      } else {
        acc[monthKey].gastos += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {} as Record<string, { month: string; ingresos: number; gastos: number; sortKey: string }>);

    // Convert to array and sort by date, then take last 6 months
    return Object.values(monthlyGroups)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-6)
      .map((item) => ({
        month: item.month,
        ingresos: item.ingresos,
        gastos: item.gastos
      }));
  }, [transactions]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`€${value}`, 'Importe']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ingresos vs Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, '']} />
              <Legend />
              <Bar dataKey="ingresos" fill="hsl(var(--success))" name="Ingresos" />
              <Bar dataKey="gastos" fill="hsl(var(--warning))" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};