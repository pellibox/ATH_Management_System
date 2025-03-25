
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 animate-fade-in">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">ATH Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          La piattaforma completa per la gestione di club sportivi, accademie di tennis e centri multi-sport
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="bg-ath-blue hover:bg-ath-blue-dark text-white px-6 py-3 text-lg"
          >
            Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            onClick={() => navigate("/programs")} 
            variant="outline" 
            className="border-gray-300 text-gray-700 px-6 py-3 text-lg"
          >
            Esplora Programmi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
