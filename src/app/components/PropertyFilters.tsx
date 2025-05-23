import { useState } from "react";
import { PropertyFilters as Filters, Property } from "../types/property";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";

interface PropertyFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const PropertyFilters = ({
  onFiltersChange,
  totalCount,
  filteredCount,
}: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({});
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [surfaceRange, setSurfaceRange] = useState([0, 200]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setPriceRange([0, 1000000]);
    setSurfaceRange([0, 200]);
    onFiltersChange(emptyFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-right text-gray-600">
        {filteredCount} / {totalCount} biens
      </div>

      {/* Recherche par ville */}
      <div className="space-y-2">
        <Label htmlFor="search">Ville ou département</Label>
        <Input
          id="search"
          placeholder="Ex: Paris, Lyon, Rhône..."
          value={filters.searchQuery || ""}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>

      {/* Type de bien */}
      <div className="space-y-2">
        <Label>Type de bien</Label>
        <Select
          value={filters.type || "all"}
          onValueChange={(value) =>
            updateFilters({
              type: value === "all" ? undefined : (value as Property["type"]),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="house">Maison</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="loft">Loft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Nombre de pièces */}
      <div className="space-y-2">
        <Label>Nombre de pièces minimum</Label>
        <Select
          value={filters.rooms?.toString() || "any"}
          onValueChange={(value) =>
            updateFilters({
              rooms: value === "any" ? undefined : parseInt(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Indifférent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Indifférent</SelectItem>
            <SelectItem value="1">1 pièce</SelectItem>
            <SelectItem value="2">2 pièces</SelectItem>
            <SelectItem value="3">3 pièces</SelectItem>
            <SelectItem value="4">4 pièces</SelectItem>
            <SelectItem value="5">5 pièces et +</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prix */}
      <div className="space-y-3">
        <Label>Prix</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value);
              updateFilters({
                priceMin: value[0],
                priceMax: value[1] === 1000000 ? undefined : value[1],
              });
            }}
            max={1000000}
            min={0}
            step={10000}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>
            {priceRange[1] === 1000000 ? "1M€+" : formatPrice(priceRange[1])}
          </span>
        </div>
      </div>

      {/* Surface */}
      <div className="space-y-3">
        <Label>Surface (m²)</Label>
        <div className="px-2">
          <Slider
            value={surfaceRange}
            onValueChange={(value) => {
              setSurfaceRange(value);
              updateFilters({
                surfaceMin: value[0],
                surfaceMax: value[1] === 200 ? undefined : value[1],
              });
            }}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{surfaceRange[0]} m²</span>
          <span>
            {surfaceRange[1] === 200 ? "200m²+" : `${surfaceRange[1]} m²`}
          </span>
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Effacer les filtres
      </Button>
    </div>
  );
};

export default PropertyFilters;
