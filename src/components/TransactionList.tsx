import { TransactionFilter } from "@/components/TransactionFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction, TransactionFilters } from "@/types/finance";
import { ArrowDownRight, ArrowUpRight, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  filters?: TransactionFilters;
  onFiltersChange?: (filters: TransactionFilters) => void;
  availableCategories?: string[];
}

export const TransactionList = ({ 
  transactions, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction,
  filters,
  onFiltersChange,
  availableCategories
}: TransactionListProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'vivienda': 'bg-blue-100 text-blue-800',
      'transporte': 'bg-green-100 text-green-800',
      'ocio': 'bg-purple-100 text-purple-800',
      'alimentación': 'bg-orange-100 text-orange-800',
      'salario': 'bg-emerald-100 text-emerald-800',
      'inversión': 'bg-indigo-100 text-indigo-800',
      'otros': 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors['otros'];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Transacciones 
            {transactions.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({transactions.length} {transactions.length === 1 ? 'transacción' : 'transacciones'})
              </span>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            {filters && onFiltersChange && availableCategories && (
              <TransactionFilter
                filters={filters}
                onFiltersChange={onFiltersChange}
                availableCategories={availableCategories}
                isOpen={filterOpen}
                onToggle={() => setFilterOpen(!filterOpen)}
              />
            )}
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary" onClick={onAddTransaction}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No se encontraron transacciones</p>
              {filters && (filters.type !== 'all' || filters.category || filters.searchText) && (
                <p className="text-sm mt-2">Prueba a ajustar los filtros para ver más resultados</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-warning/20 text-warning'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(transaction.category)}
                >
                  {transaction.category}
                </Badge>
                <div className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-warning'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditTransaction(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};