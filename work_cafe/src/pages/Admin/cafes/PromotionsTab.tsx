import React from "react";
import { Tag, Plus, Trash2, Coffee, Wifi } from "lucide-react";
import { Cafe, Promo, validIcons } from "../../../types/cafe";
import { 
  isValidDateString, 
  formatDisplayDate, 
  formatDateForInput, 
  getTodayDate,
  formatDateForAPI
} from "../../../utils/dateUtils";

interface PromotionsTabProps {
  cafeData: Cafe;
  addPromotion: () => void;
  updatePromotion: (id: string | number, field: keyof Promo, value: string) => void;
  removePromotion: (id: string | number) => void;
}

const PromotionsTab: React.FC<PromotionsTabProps> = ({
  cafeData,
  addPromotion,
  updatePromotion,
  removePromotion,
}) => {
  const today = getTodayDate();

  const handleDateChange = (promoId: string | number, value: string) => {
    // Always store dates in YYYY-MM-DD format internally
    if (value && isValidDateString(value)) {
      updatePromotion(promoId, "valid_until", value);
    } else if (value === "") {
      updatePromotion(promoId, "valid_until", "");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Promotions</h3>
        <button
          onClick={addPromotion}
          type="button"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Promotion
        </button>
      </div>

      {cafeData.promo && cafeData.promo.length > 0 ? (
        <div className="space-y-6">
          {cafeData.promo.map((promo) => (
            <div
              key={promo.id}
              className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg"
            >
              <button
                type="button"
                onClick={() => removePromotion(promo.id)}
                className="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
                title="Remove promotion"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={promo.title}
                    onChange={(e) => updatePromotion(promo.id, "title", e.target.value)}
                    placeholder="Promotion title"
                    className="block w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white placeholder-opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={promo.description}
                    onChange={(e) => updatePromotion(promo.id, "description", e.target.value)}
                    rows={3}
                    placeholder="Describe the promotion details"
                    className="block w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white placeholder-opacity-70"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(promo.valid_until)}
                      onChange={(e) => handleDateChange(promo.id, e.target.value)}
                      min={today}
                      className="block w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white [color-scheme:dark]"
                    />
                    <div className="text-xs text-white text-opacity-80 mt-2 space-y-1">
                      <p>Display: {formatDisplayDate(promo.valid_until)}</p>
                      <p>API Format: {formatDateForAPI(promo.valid_until)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Icon
                    </label>
                    <div className="flex gap-3">
                      {validIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => updatePromotion(promo.id, "icon", icon)}
                          className={`p-3 rounded-lg transition-colors ${
                            promo.icon === icon
                              ? "bg-white bg-opacity-30"
                              : "bg-white bg-opacity-10 hover:bg-opacity-20"
                          }`}
                          title={`Select ${icon} icon`}
                        >
                          {icon === "coffee" && <Coffee className="h-5 w-5 text-white" />}
                          {icon === "book" && <Tag className="h-5 w-5 text-white" />}
                          {icon === "laptop" && <Wifi className="h-5 w-5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No promotions</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add promotions to attract customers
          </p>
        </div>
      )}
    </div>
  );
};

export default PromotionsTab;