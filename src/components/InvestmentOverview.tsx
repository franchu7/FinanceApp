import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus, Edit, Trash2 } from "lucide-react";
import type { Investment } from "@/types/finance";

interface InvestmentOverviewProps {
  investments: Investment[];
  onAddInvestment: () => void;
  onEditInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export const InvestmentOverview = ({ investments, onAddInvestment, onEditInvestment, onDeleteInvestment }: InvestmentOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateReturn = (investment: Investment) => {
    const totalReturn = (investment.currentPrice - investment.purchasePrice) * investment.quantity;
    const returnPercentage = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
    return { totalReturn, returnPercentage };
  };

  const getInvestmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'stocks': 'bg-blue-100 text-blue-800',
      'etf': 'bg-green-100 text-green-800',
      'crypto': 'bg-purple-100 text-purple-800',
      'bonds': 'bg-yellow-100 text-yellow-800',
      'gold': 'bg-amber-100 text-amber-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getInvestmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'stocks': 'Acciones',
      'etf': 'ETF',
      'crypto': 'Crypto',
      'bonds': 'Bonos',
      'gold': 'Oro'
    };
    return labels[type] || type;
  };

  const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.currentPrice * inv.quantity), 0);
  const totalReturn = investments.reduce((sum, inv) => {
    const { totalReturn } = calculateReturn(inv);
    return sum + totalReturn;
  }, 0);
  const overallReturnPercentage = investments.length > 0 
    ? (totalReturn / (totalInvestmentValue - totalReturn)) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalInvestmentValue)}
            </div>
            <p className="text-sm text-muted-foreground">Valor Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}
            </div>
            <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className={`text-2xl font-bold flex items-center ${overallReturnPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              {overallReturnPercentage >= 0 ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              {overallReturnPercentage >= 0 ? '+' : ''}{overallReturnPercentage.toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground">Rentabilidad</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Mis Inversiones</CardTitle>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary" onClick={onAddInvestment}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inversión
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment) => {
              const { totalReturn, returnPercentage } = calculateReturn(investment);
              return (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{investment.name}</div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={getInvestmentTypeColor(investment.type)}
                        >
                          {getInvestmentTypeLabel(investment.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {investment.quantity} unidades
                        </span>
                      </div>
                    </div>
                  </div>
                  
                   <div className="text-right space-y-1">
                     <div className="font-semibold text-foreground">
                       {formatCurrency(investment.currentPrice * investment.quantity)}
                     </div>
                     <div className={`text-sm flex items-center justify-end ${
                       returnPercentage >= 0 ? 'text-success' : 'text-destructive'
                     }`}>
                       {returnPercentage >= 0 ? (
                         <TrendingUp className="w-3 h-3 mr-1" />
                       ) : (
                         <TrendingDown className="w-3 h-3 mr-1" />
                       )}
                       {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                       <span className="ml-2">
                         ({returnPercentage >= 0 ? '+' : ''}{formatCurrency(totalReturn)})
                       </span>
                     </div>
                   </div>
                   
                   <div className="flex items-center space-x-1 ml-4">
                     <Button
                       size="sm"
                       variant="ghost"
                       onClick={() => onEditInvestment(investment)}
                       className="h-8 w-8 p-0"
                     >
                       <Edit className="w-4 h-4" />
                     </Button>
                     <Button
                       size="sm"
                       variant="ghost"
                       onClick={() => onDeleteInvestment(investment.id)}
                       className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};