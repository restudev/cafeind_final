import React from "react";
import { UtensilsCrossed, Coffee, Cake, Star, ChefHat } from "lucide-react";
import Button from "../../components/common/Button";
import { MenuItem } from "../../types/cafe";

interface CafeMenuProps {
  menu: MenuItem[];
  menuLink: string | null;
}

const CafeMenu: React.FC<CafeMenuProps> = ({ menu, menuLink }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Coffee & Beverage":
        return <Coffee size={20} className="text-blue-600" />;
      case "Brunch & Meal":
        return <UtensilsCrossed size={20} className="text-blue-600" />;
      case "Bakery & Pastry":
        return <Cake size={20} className="text-blue-600" />;
      default:
        return <ChefHat size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="cafe-menu bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 border border-blue-100">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <UtensilsCrossed size={24} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900">Menu Highlights</h2>
      </div>
      
      {menu && menu.length > 0 ? (
        <>
          {["Coffee & Beverage", "Brunch & Meal", "Bakery & Pastry"].map((category: string) => {
            const categoryItems = menu?.filter((item: MenuItem) => item.category === category) || [];
            
            if (categoryItems.length === 0) {
              return null;
            }
            
            return (
              <div key={category} className="mb-6 last:mb-4">
                <div className="flex items-center mb-3 bg-white bg-opacity-70 rounded-lg p-3 shadow-sm">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold text-blue-600 ml-2">{category}</h3>
                </div>
                
                <div className="bg-white bg-opacity-80 rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryItems.map((item: MenuItem, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 px-3 border border-yellow-100 rounded-lg hover:bg-yellow-50 hover:bg-opacity-50 hover:border-yellow-200 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <span className="text-gray-800 mr-2 font-medium truncate">{item.name}</span>
                          {item.specialty && (
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200 shadow-sm flex-shrink-0">
                              <Star size={10} className="mr-1" />
                              Specialty
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-sm font-medium border">
                            IDR {item.priceIDR.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {menuLink && (
            <div className="mt-6 bg-white bg-opacity-70 rounded-lg p-4">
              <a href={menuLink} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="mt-0 transform hover:scale-105 transition-transform duration-200" fullWidth>
                  View Full Menu
                </Button>
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl p-6 text-center shadow-inner border border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="relative bg-blue-100 p-4 rounded-full shadow-md">
                <UtensilsCrossed size={48} className="text-blue-500" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              No Menu Data Available
            </h3>
            <p className="text-blue-700 mb-6">
              The menu is currently unavailable. Please check back later to see our offerings.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="bg-blue-50 p-2 rounded-full w-fit mx-auto mb-2">
                  <Coffee size={24} className="text-blue-700" />
                </div>
                <p className="text-blue-800 font-medium">Specialty Drinks</p>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="bg-blue-50 p-2 rounded-full w-fit mx-auto mb-2">
                  <UtensilsCrossed size={24} className="text-blue-700" />
                </div>
                <p className="text-blue-800 font-medium">Tasty Food</p>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="bg-blue-50 p-2 rounded-full w-fit mx-auto mb-2">
                  <Cake size={24} className="text-blue-700" />
                </div>
                <p className="text-blue-800 font-medium">Sweet Desserts</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeMenu;