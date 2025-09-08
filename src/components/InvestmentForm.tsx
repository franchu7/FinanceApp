import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Investment } from "@/types/finance";

interface InvestmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (investment: Omit<Investment, 'id'>) => void;
  investment?: Investment;
}

export const InvestmentForm = ({ open, onClose, onSubmit, investment }: InvestmentFormProps) => {
  const [formData, setFormData] = useState({
    name: investment?.name || '',
    type: investment?.type || 'stocks' as Investment['type'],
    amount: investment?.amount.toString() || '',
    purchasePrice: investment?.purchasePrice.toString() || '',
    currentPrice: investment?.currentPrice.toString() || '',
    quantity: investment?.quantity.toString() || '',
    date: investment?.date || new Date().toISOString().split('T')[0]
  });

  const investmentTypes: { value: Investment['type']; label: string }[] = [
    { value: 'stocks', label: 'Acciones' },
    { value: 'etf', label: 'ETF' },
    { value: 'crypto', label: 'Criptomonedas' },
    { value: 'bonds', label: 'Bonos' },
    { value: 'gold', label: 'Oro' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.amount || !formData.purchasePrice || !formData.currentPrice || !formData.quantity) return;

    onSubmit({
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
      quantity: parseFloat(formData.quantity),
      date: formData.date
    });

    // Reset form
    setFormData({
      name: '',
      type: 'stocks',
      amount: '',
      purchasePrice: '',
      currentPrice: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {investment ? 'Editar Inversión' : 'Nueva Inversión'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Apple Inc."
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Investment['type']) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              step="0.001"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="purchasePrice">Precio de Compra (€)</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="currentPrice">Precio Actual (€)</Label>
            <Input
              id="currentPrice"
              type="number"
              step="0.01"
              value={formData.currentPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Inversión Total (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Fecha de Compra</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {investment ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};