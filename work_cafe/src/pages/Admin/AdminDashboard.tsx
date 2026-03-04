import React, { useState, useEffect } from "react";
import { Coffee, Star, Tag, Users } from "lucide-react";
import StatCard from "../../components/Admin/Dashboard/StatCard";
import RecentReviews from "../../components/Admin/Dashboard/RecentReviews";
import PopularCafes from "../../components/Admin/Dashboard/PopularCafes";
import AreaDistributionChart from "../../components/Admin/Dashboard/AreaDistributionChart";
import AvailablePromotionsCard from "../../components/Admin/Dashboard/AvailablePromotionsCard";
import { UserReview, Cafe, Promo, MenuItem, CafeImage } from "../../types/cafe";

interface CafeApiResponse {
  success: boolean;
  message?: string;
  data: CafeData[];
}

interface CafeData {
  id: string;
  name: string;
  address: string;
  area: string;
  description: string;
  imageUrl: string | null;
  images?: string[];
  priceRange: string;
  noiseLevel: string;
  avgVisitLength: string;
  openingHours?: {
    Weekdays: string;
    Weekends: string;
  };
  featured?: boolean;
  menuLink?: string | null;
  website?: string | null;
  linkMaps?: string | null;
  instagram?: string | null;
  amenities?: string[];
  tags?: string[];
  reviews: UserReview[];
  menu?: RawMenuItem[];
  rating: number;
}

interface PromoApiResponse {
  success: boolean;
  message?: string;
  data: PromoData[];
}

interface PromoData {
  id: string;
  title: string;
  description: string;
  valid_until: string;
  icon?: string;
  discount?: number;
  start_date?: string;
}

interface CafeRequestApiResponse {
  success: boolean;
  message?: string;
  data: CafeRequestData[];
}

interface CafeRequestData {
  id: string;
  name: string;
  status: string;
  submitted_at: string;
  submitter_name: string;
  submitter_email: string;
}

interface Promotion {
  id: number;
  name: string;
  discount: number;
  valid_until: string;
  description?: string;
  start_date?: string;
}

interface RawMenuItem {
  name?: string;
  category?: string;
  priceIDR?: number;
  specialty?: boolean;
}

interface CafeExtended extends CafeData {
  promo: Promotion[];
}

const calculateChange = (thisMonth: number, lastMonth: number): number => {
  if (lastMonth === 0) return thisMonth === 0 ? 0 : 100;
  const change = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(change.toFixed(2));
};

const isDateInMonth = (
  dateStr: string,
  month: number,
  year: number
): boolean => {
  try {
    const d = new Date(dateStr);
    return (
      d.getMonth() === month && d.getFullYear() === year && !isNaN(d.getTime())
    );
  } catch {
    return false;
  }
};

const isValidDate = (dateStr: string): boolean => {
  return !isNaN(new Date(dateStr).getTime());
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cafes, setCafes] = useState<CafeExtended[]>([]);
  const [allPromos, setAllPromos] = useState<PromoData[]>([]);
  const [cafeRequests, setCafeRequests] = useState<CafeRequestData[]>([]);
  const [recentReviews, setRecentReviews] = useState<
    { id: string; cafeName: string; review: UserReview }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cafes
        const cafeResponse = await fetch(
          "http://localhost/cafeind_api/api/get_cafes.php"
        );
        if (!cafeResponse.ok) {
          throw new Error(`HTTP error! Status: ${cafeResponse.status}`);
        }
        const cafeResult = (await cafeResponse.json()) as CafeApiResponse;
        if (!cafeResult.success) {
          throw new Error(cafeResult.message || "Failed to fetch cafes");
        }

        // Fetch cafe requests
        let cafeRequestsData: CafeRequestData[] = [];
        try {
          const requestsResponse = await fetch(
            "http://localhost/cafeind_api/api/get_cafe_requests.php"
          );
          if (requestsResponse.ok) {
            const requestsResult =
              (await requestsResponse.json()) as CafeRequestApiResponse;
            if (requestsResult.success) {
              cafeRequestsData = requestsResult.data;
            }
          }
        } catch (error) {
          console.error("Error fetching cafe requests:", error);
        }
        setCafeRequests(cafeRequestsData);

        let allPromoData: PromoData[] = [];
        const mappedCafes: CafeExtended[] = await Promise.all(
          cafeResult.data.map(async (cafe: CafeData) => {
            let promoData: Promotion[] = [];
            try {
              const promoResponse = await fetch(
                `http://localhost/cafeind_api/api/get_promotions.php?cafe_id=${cafe.id}`
              );
              if (!promoResponse.ok) {
                throw new Error(`HTTP error! Status: ${promoResponse.status}`);
              }
              const promoResult =
                (await promoResponse.json()) as PromoApiResponse;
              if (promoResult.success) {
                promoData = promoResult.data.map((promo: PromoData) => ({
                  id: parseInt(promo.id),
                  name: promo.title,
                  discount: promo.discount || 0,
                  valid_until: promo.valid_until,
                  description: promo.description || "",
                  start_date: promo.start_date || new Date().toISOString(),
                }));
                allPromoData = [...allPromoData, ...promoResult.data];
              }
            } catch (error) {
              console.error(
                `Error fetching promos for cafe ${cafe.id}:`,
                error
              );
            }

            return {
              ...cafe,
              promo: promoData,
              imageUrl: cafe.imageUrl || null,
              images: cafe.images || [],
              openingHours: cafe.openingHours || { Weekdays: "", Weekends: "" },
              featured: cafe.featured || false,
              menuLink: cafe.menuLink || null,
              website: cafe.website || null,
              linkMaps: cafe.linkMaps || null,
              instagram: cafe.instagram || null,
              amenities: cafe.amenities || [],
              tags: cafe.tags || [],
              reviews: Array.isArray(cafe.reviews) ? cafe.reviews : [],
              menu: ((cafe.menu as RawMenuItem[]) || []).map(
                (item: RawMenuItem): MenuItem => ({
                  name: item.name || "",
                  category: item.category || "Unknown",
                  priceIDR: item.priceIDR || 0,
                  specialty: item.specialty || false,
                })
              ),
              rating: cafe.rating || 0,
            };
          })
        );

        setCafes(mappedCafes);
        setAllPromos(allPromoData);

        // Process reviews with validation
        const reviews = mappedCafes
          .flatMap((cafe) =>
            (Array.isArray(cafe.reviews) ? cafe.reviews : [])
              .filter((review) => {
                // Validate review data
                const isValid =
                  review &&
                  typeof review === "object" &&
                  "date" in review &&
                  isValidDate(review.date) &&
                  "user" in review &&
                  "comment" in review;
                if (!isValid) {
                  console.warn(`Invalid review for cafe ${cafe.name}:`, review);
                }
                return isValid;
              })
              .map((review) => ({
                id: `${cafe.id}-${review.user || "anonymous"}-${review.date}`,
                cafeName: cafe.name,
                review,
              }))
          )
          .sort((a, b) => {
            try {
              return (
                new Date(b.review.date).getTime() -
                new Date(a.review.date).getTime()
              );
            } catch {
              console.warn(
                `Invalid date in review:`,
                a.review.date,
                b.review.date
              );
              return 0;
            }
          });

        console.log("Processed reviews:", reviews); // Debug log

        setRecentReviews(reviews.slice(0, 5));

        if (
          reviews.length === 0 &&
          mappedCafes.some((cafe) => cafe.reviews.length > 0)
        ) {
          console.error(
            "No valid reviews found despite cafe reviews existing. Check review data format."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setCafes([]);
        setAllPromos([]);
        setRecentReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  // Calculate new cafes this month based on promotion start_date
  const cafesThisMonth = cafes.filter((cafe) =>
    cafe.promo.some((promo) =>
      promo.start_date
        ? isDateInMonth(promo.start_date, thisMonth, thisYear)
        : false
    )
  ).length;

  // Calculate new cafes last month based on promotion start_date
  const cafesLastMonth = cafes.filter((cafe) =>
    cafe.promo.some((promo) =>
      promo.start_date
        ? isDateInMonth(promo.start_date, lastMonth, lastYear)
        : false
    )
  ).length;

  const reviewsThisMonth = cafes.reduce((acc, cafe) => {
    return (
      acc +
      (Array.isArray(cafe.reviews) ? cafe.reviews : []).filter((review) => {
        return (
          isValidDate(review.date) &&
          isDateInMonth(review.date, thisMonth, thisYear)
        );
      }).length
    );
  }, 0);

  const reviewsLastMonth = cafes.reduce((acc, cafe) => {
    return (
      acc +
      (Array.isArray(cafe.reviews) ? cafe.reviews : []).filter((review) => {
        return (
          isValidDate(review.date) &&
          isDateInMonth(review.date, lastMonth, lastYear)
        );
      }).length
    );
  }, 0);

  const promotionsThisMonth = cafes.reduce((acc, cafe) => {
    return (
      acc +
      cafe.promo.filter((promo) => new Date(promo.valid_until) >= today).length
    );
  }, 0);

  const promotionsLastMonth = cafes.reduce((acc, cafe) => {
    return (
      acc +
      cafe.promo.filter(
        (promo) =>
          new Date(promo.valid_until) >= today &&
          isDateInMonth(promo.valid_until, lastMonth, lastYear)
      ).length
    );
  }, 0);

  // Calculate cafe requests stats
  const pendingRequestsThisMonth = cafeRequests.filter(
    (request) =>
      request.status === "pending" &&
      isDateInMonth(request.submitted_at, thisMonth, thisYear)
  ).length;

  const pendingRequestsLastMonth = cafeRequests.filter(
    (request) =>
      request.status === "pending" &&
      isDateInMonth(request.submitted_at, lastMonth, lastYear)
  ).length;

  const totalPendingRequests = cafeRequests.filter(
    (request) => request.status === "pending"
  ).length;

  const stats = {
    totalCafes: cafes.length,
    cafesThisMonth,
    cafesLastMonth,
    reviewsThisMonth,
    reviewsLastMonth,
    promotionsThisMonth,
    promotionsLastMonth,
    pendingRequestsThisMonth,
    pendingRequestsLastMonth,
    totalPendingRequests,
  };

  const promotionsData = cafes.map((cafe) => ({
    cafeName: cafe.name,
    promotions: (cafe.promo || [])
      .filter((promo) => new Date(promo.valid_until) >= today)
      .map((promo) => ({
        id: promo.id,
        name: promo.name,
        discount: promo.discount,
        valid_until: promo.valid_until,
        description: promo.description || "",
      })),
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your cafe management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cafes"
          value={stats.totalCafes.toString()}
          icon={<Coffee size={24} className="text-blue-600" />}
          change={calculateChange(stats.cafesThisMonth, stats.cafesLastMonth)}
          changeText="from last month"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Reviews"
          value={stats.reviewsThisMonth.toString()}
          icon={<Star size={24} className="text-amber-600" />}
          change={calculateChange(
            stats.reviewsThisMonth,
            stats.reviewsLastMonth
          )}
          changeText="from last month"
          iconBgColor="bg-amber-100"
        />
        <StatCard
          title="Active Promotions"
          value={stats.promotionsThisMonth.toString()}
          icon={<Tag size={24} className="text-purple-600" />}
          change={calculateChange(
            stats.promotionsThisMonth,
            stats.promotionsLastMonth
          )}
          changeText="from last month"
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Pending Requests"
          value={stats.totalPendingRequests.toString()}
          icon={<Users size={24} className="text-orange-600" />}
          change={calculateChange(
            stats.pendingRequestsThisMonth,
            stats.pendingRequestsLastMonth
          )}
          changeText="from last month"
          iconBgColor="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AvailablePromotionsCard data={promotionsData} />
        <AreaDistributionChart
          data={cafes.reduce((acc, cafe) => {
            const existing = acc.find((item) => item.area === cafe.area);
            if (existing) {
              existing.count += 1;
            } else {
              acc.push({ area: cafe.area, count: 1 });
            }
            return acc;
          }, [] as { area: string; count: number }[])}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentReviews reviews={recentReviews} />
        <PopularCafes
          cafes={cafes
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(
              (cafe): Cafe => ({
                id: cafe.id,
                name: cafe.name,
                address: cafe.address,
                area: cafe.area,
                description: cafe.description,
                imageUrl: cafe.imageUrl || "",
                images: (cafe.images || []).map(
                  (url, index): CafeImage => ({
                    id: index + 1,
                    image_url: url,
                    is_primary: index === 0,
                  })
                ),
                priceRange: parseFloat(cafe.priceRange) || 0,
                noiseLevel:
                  (cafe.noiseLevel as "Quiet" | "Moderate" | "Loud") ||
                  "Moderate",
                avgVisitLength: cafe.avgVisitLength,
                openingHours: cafe.openingHours || {
                  Weekdays: "",
                  Weekends: "",
                },
                featured: cafe.featured || false,
                menuLink: cafe.menuLink || null,
                website: cafe.website || null,
                linkMaps: cafe.linkMaps || null,
                instagram: cafe.instagram || null,
                amenities: cafe.amenities || [],
                tags: cafe.tags || [],
                reviews: cafe.reviews || [],
                menu: ((cafe.menu as RawMenuItem[]) || []).map(
                  (item: RawMenuItem): MenuItem => ({
                    name: item.name || "",
                    category: item.category || "Unknown",
                    priceIDR: item.priceIDR || 0,
                    specialty: item.specialty || false,
                  })
                ),
                promo: cafe.promo.map(
                  (promo): Promo => ({
                    id: promo.id,
                    title: promo.name,
                    description: promo.description || "",
                    valid_until: promo.valid_until,
                    start_date: promo.start_date || new Date().toISOString(),
                    icon:
                      (allPromos.find(
                        (p: PromoData) => p.id === promo.id.toString()
                      )?.icon as "coffee" | "book" | "laptop" | undefined) ||
                      "coffee",
                  })
                ),
                rating: cafe.rating || 0,
              })
            )}
        />
      </div>
    </div>
  );
};

export default Dashboard;
