import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { FinancialMetrics } from "@/components/FinancialMetrics";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { InvestmentOverview } from "@/components/InvestmentOverview";
import { TransactionForm } from "@/components/TransactionForm";
import { InvestmentForm } from "@/components/InvestmentForm";
import type { Transaction, Investment, FinancialSummary } from "@/types/finance";

// Mock data
const mockSummary: FinancialSummary = {
  totalIncome: 3800,
  totalExpenses: 2450,
  netWorth: 45600,
  totalInvestments: 18750,
  savingsRate: 35.5,
  monthlyChange: 2.8
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3500,
    type: 'income',
    category: 'Salario',
    description: 'Salario mensual',
    date: '2024-01-15',
    tags: ['trabajo']
  },
  {
    id: '2',
    amount: -1200,
    type: 'expense',
    category: 'Vivienda',
    description: 'Alquiler apartamento',
    date: '2024-01-01',
    tags: ['fijo']
  },
  {
    id: '3',
    amount: -85,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compra supermercado',
    date: '2024-01-14',
    tags: ['mercadona']
  },
  {
    id: '4',
    amount: -45,
    type: 'expense',
    category: 'Transporte',
    description: 'Gasolina',
    date: '2024-01-13',
    tags: ['combustible']
  },
  {
    id: '5',
    amount: 250,
    type: 'income',
    category: 'Otros',
    description: 'Venta artículos usados',
    date: '2024-01-12',
    tags: ['extra']
  }
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'VWCE - Vanguard FTSE All-World',
    type: 'etf',
    amount: 5000,
    purchasePrice: 95.5,
    currentPrice: 102.3,
    quantity: 52.36,
    date: '2023-08-15'
  },
  {
    id: '2',
    name: 'Apple Inc. (AAPL)',
    type: 'stocks',
    amount: 3000,
    purchasePrice: 150.25,
    currentPrice: 185.64,
    quantity: 19.97,
    date: '2023-09-20'
  },
  {
    id: '3',
    name: 'Bitcoin',
    type: 'crypto',
    amount: 2500,
    purchasePrice: 42000,
    currentPrice: 51200,
    quantity: 0.0595,
    date: '2023-10-10'
  },
  {
    id: '4',
    name: 'Oro físico',
    type: 'gold',
    amount: 1000,
    purchasePrice: 58.5,
    currentPrice: 61.2,
    quantity: 17.09,
    date: '2023-11-05'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  
  // Form state
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [investmentFormOpen, setInvestmentFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();

  // Transaction CRUD operations
  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setTransactionFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleTransactionSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...transactionData, id: editingTransaction.id }
          : t
      ));
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString()
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  // Investment CRUD operations
  const handleAddInvestment = () => {
    setEditingInvestment(undefined);
    setInvestmentFormOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setInvestmentFormOpen(true);
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const handleInvestmentSubmit = (investmentData: Omit<Investment, 'id'>) => {
    if (editingInvestment) {
      // Update existing investment
      setInvestments(prev => prev.map(i => 
        i.id === editingInvestment.id 
          ? { ...investmentData, id: editingInvestment.id }
          : i
      ));
    } else {
      // Add new investment
      const newInvestment: Investment = {
        ...investmentData,
        id: Date.now().toString()
      };
      setInvestments(prev => [newInvestment, ...prev]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Financiero</h2>
              <p className="text-muted-foreground">Resumen completo de tu situación financiera</p>
            </div>
            <FinancialMetrics summary={mockSummary} />
            <ExpenseChart />
            <TransactionList 
              transactions={transactions.slice(0, 5)} 
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Transacciones</h2>
              <p className="text-muted-foreground">Gestiona todos tus ingresos y gastos</p>
            </div>
            <TransactionList 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        );
      case 'investments':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Inversiones</h2>
              <p className="text-muted-foreground">Seguimiento de tu cartera de inversión</p>
            </div>
            <InvestmentOverview 
              investments={investments} 
              onAddInvestment={handleAddInvestment}
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={handleDeleteInvestment}
            />
          </div>
        );
      case 'budgets':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Presupuestos</h2>
              <p className="text-muted-foreground">Define y controla tus límites de gasto</p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <p>Funcionalidad de presupuestos próximamente...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Configuración</h2>
              <p className="text-muted-foreground">Personaliza tu experiencia</p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <p>Panel de configuración próximamente...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      {/* Forms */}
      <TransactionForm
        open={transactionFormOpen}
        onClose={() => {
          setTransactionFormOpen(false);
          setEditingTransaction(undefined);
        }}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction}
      />
      
      <InvestmentForm
        open={investmentFormOpen}
        onClose={() => {
          setInvestmentFormOpen(false);
          setEditingInvestment(undefined);
        }}
        onSubmit={handleInvestmentSubmit}
        investment={editingInvestment}
      />
    </div>
  );
};

export default Index;