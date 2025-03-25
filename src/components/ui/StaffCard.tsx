
import { Phone, Mail, Calendar } from "lucide-react";

interface StaffCardProps {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  email: string;
  phone: string;
  imageUrl?: string;
  availability: {
    today: boolean;
    nextAvailable?: string;
  };
}

export default function StaffCard({
  id,
  name,
  role,
  specialties,
  email,
  phone,
  imageUrl,
  availability,
}: StaffCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden card-hover">
      <div className="h-24 bg-gradient-to-r from-ath-blue-light to-ath-blue/20 relative">
        <div className="absolute -bottom-10 left-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-20 w-20 rounded-full border-4 border-white shadow-sm object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full border-4 border-white shadow-sm bg-ath-blue text-white flex items-center justify-center text-xl font-bold">
              {getInitials(name)}
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-12 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specialties.map((specialty, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700"
            >
              {specialty}
            </span>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{phone}</span>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-ath-blue mr-2" />
            {availability.today ? (
              <span className="text-sm font-medium text-green-600">Available today</span>
            ) : (
              <span className="text-sm text-gray-600">
                Next available: {availability.nextAvailable}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
