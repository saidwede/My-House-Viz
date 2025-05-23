import { Property } from "../types/property";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

const PropertyCard = ({ property, onSelect }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type: Property["type"]) => {
    const labels = {
      apartment: "Appartement",
      house: "Maison",
      studio: "Studio",
      loft: "Loft",
    };
    return labels[type];
  };

  const getEnergyClassColor = (energyClass: string) => {
    const colors = {
      A: "bg-green-500",
      B: "bg-green-400",
      C: "bg-yellow-400",
      D: "bg-orange-400",
      E: "bg-orange-500",
      F: "bg-red-400",
      G: "bg-red-500",
    };
    return colors[energyClass as keyof typeof colors] || "bg-gray-400";
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onSelect?.(property)}
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {getTypeLabel(property.type)}
          </Badge>
          <div
            className={`w-6 h-6 rounded ${getEnergyClassColor(
              property.energyClass
            )} flex items-center justify-center text-white text-xs font-bold`}
          >
            {property.energyClass}
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-blue-600 hover:bg-blue-700">
            {formatPrice(property.price)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.location.city}, {property.location.department}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>{property.surface} m²</span>
          <span>
            {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
          </span>
          <span>{Math.round(property.price / property.surface)} €/m²</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {property.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.features.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
