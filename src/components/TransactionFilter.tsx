import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TransactionFilters } from "@/types/finance";
import { Filter, RotateCcw, X } from "lucide-react";

interface TransactionFilterProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  availableCategories: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export const TransactionFilter = ({ 
  filters, 
  onFiltersChange, 
  availableCategories, 
  isOpen, 
  onToggle 
}: TransactionFilterProps) => {
  const updateFilter = <K extends keyof TransactionFilters>(
    key: K, 
    value: TransactionFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      type: 'all',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: null,
      amountMax: null,
      searchText: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.type !== 'all' ||
           filters.category !== '' ||
           filters.dateFrom !== '' ||
           filters.dateTo !== '' ||
           filters.amountMin !== null ||
           filters.amountMax !== null ||
           filters.searchText !== '';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.category !== '') count++;
    if (filters.dateFrom !== '' || filters.dateTo !== '') count++;
    if (filters.amountMin !== null || filters.amountMax !== null) count++;
    if (filters.searchText !== '') count++;
    return count;
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggle}
          className={hasActiveFilters() ? "bg-primary/10 border-primary" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-2 h-5">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Text */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar descripción</Label>
                <Input
                  id="search"
                  placeholder="Buscar transacciones..."
                  value={filters.searchText}
                  onChange={(e) => updateFilter('searchText', e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label>Tipo de transacción</Label>
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => updateFilter('type', value as 'all' | 'income' | 'expense')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Ingresos</SelectItem>
                    <SelectItem value="expense">Gastos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select 
                  value={filters.category || 'all'} 
                  onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Fecha desde</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label htmlFor="dateTo">Fecha hasta</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                />
              </div>

              {/* Amount Min */}
              <div className="space-y-2">
                <Label htmlFor="amountMin">Importe mínimo (€)</Label>
                <Input
                  id="amountMin"
                  type="number"
                  placeholder="0"
                  value={filters.amountMin || ''}
                  onChange={(e) => updateFilter('amountMin', e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              {/* Amount Max */}
              <div className="space-y-2">
                <Label htmlFor="amountMax">Importe máximo (€)</Label>
                <Input
                  id="amountMax"
                  type="number"
                  placeholder="Sin límite"
                  value={filters.amountMax || ''}
                  onChange={(e) => updateFilter('amountMax', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Filtros activos:</span>
                  {filters.type !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Tipo: {filters.type === 'income' ? 'Ingresos' : 'Gastos'}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => updateFilter('type', 'all')}
                      />
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Categoría: {filters.category}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => updateFilter('category', '')}
                      />
                    </Badge>
                  )}
                  {filters.searchText && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Buscar: "{filters.searchText}"
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => updateFilter('searchText', '')}
                      />
                    </Badge>
                  )}
                  {(filters.dateFrom || filters.dateTo) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Fechas: {filters.dateFrom || '...'} - {filters.dateTo || '...'}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => {
                          updateFilter('dateFrom', '');
                          updateFilter('dateTo', '');
                        }}
                      />
                    </Badge>
                  )}
                  {(filters.amountMin !== null || filters.amountMax !== null) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Importe: {filters.amountMin || '0'}€ - {filters.amountMax || '∞'}€
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => {
                          updateFilter('amountMin', null);
                          updateFilter('amountMax', null);
                        }}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
