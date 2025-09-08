import type { Investment, Transaction } from "@/types/finance";

export const sampleTransactions: Transaction[] = [
  // JULIO 2025
  // Ingresos
  {
    id: "1",
    amount: 3500,
    type: 'income',
    category: 'Salario',
    description: 'Salario mensual julio',
    date: '2025-07-01',
    tags: ['trabajo', 'mensual']
  },
  {
    id: "2",
    amount: 250,
    type: 'income',
    category: 'Freelance',
    description: 'Proyecto web para cliente',
    date: '2025-07-15',
    tags: ['freelance', 'programación']
  },
  
  // Gastos
  {
    id: "3",
    amount: -1200,
    type: 'expense',
    category: 'Vivienda',
    description: 'Alquiler julio',
    date: '2025-07-01',
    tags: ['alquiler', 'fijo']
  },
  {
    id: "4",
    amount: -350,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compra mensual supermercado',
    date: '2025-07-02',
    tags: ['supermercado', 'comida']
  },
  {
    id: "5",
    amount: -85,
    type: 'expense',
    category: 'Servicios',
    description: 'Factura electricidad',
    date: '2025-07-05',
    tags: ['electricidad', 'servicios']
  },
  {
    id: "6",
    amount: -45,
    type: 'expense',
    category: 'Servicios',
    description: 'Internet y móvil',
    date: '2025-07-10',
    tags: ['internet', 'móvil']
  },
  {
    id: "7",
    amount: -120,
    type: 'expense',
    category: 'Entretenimiento',
    description: 'Cena con amigos',
    date: '2025-07-12',
    tags: ['restaurante', 'social']
  },
  {
    id: "8",
    amount: -80,
    type: 'expense',
    category: 'Transporte',
    description: 'Gasolina',
    date: '2025-07-18',
    tags: ['coche', 'combustible']
  },
  {
    id: "9",
    amount: -200,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compras varias supermercado',
    date: '2025-07-20',
    tags: ['supermercado', 'comida']
  },
  {
    id: "10",
    amount: -150,
    type: 'expense',
    category: 'Entretenimiento',
    description: 'Cinema y ocio',
    date: '2025-07-25',
    tags: ['cine', 'ocio']
  },

  // AGOSTO 2025
  // Ingresos
  {
    id: "11",
    amount: 3500,
    type: 'income',
    category: 'Salario',
    description: 'Salario mensual agosto',
    date: '2025-08-01',
    tags: ['trabajo', 'mensual']
  },
  {
    id: "12",
    amount: 400,
    type: 'income',
    category: 'Freelance',
    description: 'Consultoría técnica',
    date: '2025-08-10',
    tags: ['freelance', 'consultoría']
  },
  {
    id: "13",
    amount: 150,
    type: 'income',
    category: 'Otros',
    description: 'Venta productos usados',
    date: '2025-08-22',
    tags: ['venta', 'extra']
  },

  // Gastos
  {
    id: "14",
    amount: -1200,
    type: 'expense',
    category: 'Vivienda',
    description: 'Alquiler agosto',
    date: '2025-08-01',
    tags: ['alquiler', 'fijo']
  },
  {
    id: "15",
    amount: -380,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compra mensual supermercado',
    date: '2025-08-03',
    tags: ['supermercado', 'comida']
  },
  {
    id: "16",
    amount: -95,
    type: 'expense',
    category: 'Servicios',
    description: 'Factura electricidad',
    date: '2025-08-05',
    tags: ['electricidad', 'servicios']
  },
  {
    id: "17",
    amount: -45,
    type: 'expense',
    category: 'Servicios',
    description: 'Internet y móvil',
    date: '2025-08-10',
    tags: ['internet', 'móvil']
  },
  {
    id: "18",
    amount: -600,
    type: 'expense',
    category: 'Vacaciones',
    description: 'Viaje de verano',
    date: '2025-08-15',
    tags: ['vacaciones', 'viaje']
  },
  {
    id: "19",
    amount: -90,
    type: 'expense',
    category: 'Transporte',
    description: 'Gasolina y peajes',
    date: '2025-08-16',
    tags: ['coche', 'combustible']
  },
  {
    id: "20",
    amount: -250,
    type: 'expense',
    category: 'Alimentación',
    description: 'Restaurantes en vacaciones',
    date: '2025-08-17',
    tags: ['restaurante', 'vacaciones']
  },
  {
    id: "21",
    amount: -180,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compras varias agosto',
    date: '2025-08-25',
    tags: ['supermercado', 'comida']
  },
  {
    id: "22",
    amount: -75,
    type: 'expense',
    category: 'Salud',
    description: 'Farmacia y medicinas',
    date: '2025-08-28',
    tags: ['farmacia', 'salud']
  },

  // SEPTIEMBRE 2025
  // Ingresos
  {
    id: "23",
    amount: 3500,
    type: 'income',
    category: 'Salario',
    description: 'Salario mensual septiembre',
    date: '2025-09-01',
    tags: ['trabajo', 'mensual']
  },
  {
    id: "24",
    amount: 300,
    type: 'income',
    category: 'Freelance',
    description: 'Mantenimiento web',
    date: '2025-09-05',
    tags: ['freelance', 'mantenimiento']
  },

  // Gastos
  {
    id: "25",
    amount: -1200,
    type: 'expense',
    category: 'Vivienda',
    description: 'Alquiler septiembre',
    date: '2025-09-01',
    tags: ['alquiler', 'fijo']
  },
  {
    id: "26",
    amount: -320,
    type: 'expense',
    category: 'Alimentación',
    description: 'Compra mensual supermercado',
    date: '2025-09-02',
    tags: ['supermercado', 'comida']
  },
  {
    id: "27",
    amount: -78,
    type: 'expense',
    category: 'Servicios',
    description: 'Factura electricidad',
    date: '2025-09-05',
    tags: ['electricidad', 'servicios']
  },
  {
    id: "28",
    amount: -45,
    type: 'expense',
    category: 'Servicios',
    description: 'Internet y móvil',
    date: '2025-09-08',
    tags: ['internet', 'móvil']
  },
];

export const sampleInvestments: Investment[] = [
  {
    id: "inv1",
    name: "BBVA",
    type: 'stocks',
    amount: 1000,
    purchasePrice: 8.50,
    currentPrice: 9.20,
    quantity: 117.65,
    date: '2025-07-10',
  },
  {
    id: "inv2",
    name: "S&P 500 ETF",
    type: 'etf',
    amount: 2000,
    purchasePrice: 420.00,
    currentPrice: 445.30,
    quantity: 4.76,
    date: '2025-08-05',
  },
  {
    id: "inv3",
    name: "Bitcoin",
    type: 'crypto',
    amount: 500,
    purchasePrice: 65000.00,
    currentPrice: 68500.00,
    quantity: 0.0077,
    date: '2025-08-20',
  }
];
