import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const expenseData = [
  { name: 'Vivienda', value: 1200, color: '#3B82F6' },
  { name: 'Alimentación', value: 400, color: '#10B981' },
  { name: 'Transporte', value: 300, color: '#F59E0B' },
  { name: 'Ocio', value: 250, color: '#8B5CF6' },
  { name: 'Otros', value: 180, color: '#6B7280' },
];

const monthlyData = [
  { month: 'Ene', ingresos: 3500, gastos: 2330 },
  { month: 'Feb', ingresos: 3200, gastos: 2100 },
  { month: 'Mar', ingresos: 3800, gastos: 2800 },
  { month: 'Abr', ingresos: 3600, gastos: 2400 },
  { month: 'May', ingresos: 4000, gastos: 2600 },
  { month: 'Jun', ingresos: 3900, gastos: 2500 },
];

export const ExpenseChart = () => {
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