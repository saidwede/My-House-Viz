import { useState, useMemo } from "react";
import { Property, PropertyFilters } from "../types/property";
import { mockProperties } from "../data/mockData";
import PropertyMap from "../components/PropertyMap";
import PropertyList from "../components/PropertyList";
import PropertyFiltersComponent from "../components/PropertyFilters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { MapPin, ChevronUp, ChevronDown } from "lucide-react";

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState<
    Property | undefined
  >();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesCity = property.location.city
          .toLowerCase()
          .includes(query);
        const matchesDepartment = property.location.department
          .toLowerCase()
          .includes(query);
        const matchesTitle = property.title.toLowerCase().includes(query);
        if (!matchesCity && !matchesDepartment && !matchesTitle) {
          return false;
        }
      }

      // Type filter
      if (filters.type && property.type !== filters.type) {
        return false;
      }

      // Rooms filter
      if (filters.rooms && property.rooms < filters.rooms) {
        return false;
      }

      // Price filters
      if (filters.priceMin && property.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && property.price > filters.priceMax) {
        return false;
      }

      // Surface filters
      if (filters.surfaceMin && property.surface < filters.surfaceMin) {
        return false;
      }
      if (filters.surfaceMax && property.surface > filters.surfaceMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Immobilier France
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Trouvez votre bien idéal
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column - Filters + List */}
        <div className="w-1/3 border-r flex flex-col overflow-hidden">
          {/* Filters section */}
          <Collapsible
            className="border-b bg-white px-4 py-2 flex-shrink-0"
            open={isFiltersOpen}
            onOpenChange={setIsFiltersOpen}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filtres</h2>
              <CollapsibleTrigger className="p-1 hover:bg-gray-100 rounded">
                {isFiltersOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-2">
              <PropertyFiltersComponent
                onFiltersChange={setFilters}
                totalCount={mockProperties.length}
                filteredCount={filteredProperties.length}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Property list */}
          <div className="flex-1 overflow-hidden">
            <PropertyList
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        </div>

        {/* Map section */}
        <div className="w-2/3 h-full max-h-screen">
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
