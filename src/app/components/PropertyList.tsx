import { Property } from "../types/property";
import PropertyCard from "./PropertyCard";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface PropertyListProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property;
}

const PropertyList = ({
  properties,
  onPropertySelect,
  selectedProperty,
}: PropertyListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-semibold mb-2">
          {properties.length} bien{properties.length > 1 ? "s" : ""} trouvé
          {properties.length > 1 ? "s" : ""}
        </h2>
        <p className="text-sm text-gray-600">
          Cliquez sur un bien pour le localiser sur la carte
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun bien trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className={`transition-all duration-200 ${
                  selectedProperty?.id === property.id
                    ? "ring-2 ring-blue-500 ring-offset-2 transform scale-[1.02]"
                    : ""
                }`}
              >
                <PropertyCard property={property} onSelect={onPropertySelect} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertyList;
