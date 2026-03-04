import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Tag,
  Menu,
  MessageSquare,
  ChevronDown,
  X,
  Plus,
  Grid3X3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  isSubmenuItem?: boolean;
  isCollapsed?: boolean;
  end?: boolean;
  badge?: number;
}

interface SidebarSubmenuProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  badge?: number;
}

interface OverviewData {
  totalCafes: number;
  activePromotions: number;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  valid_until: string;
  cafe_id: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  user_name: string;
}

interface Cafe {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  reviews?: Review[];
}

interface CafeRequest {
  id: number;
  name: string;
  status: string;
  // Add other relevant fields as needed
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  path,
  isSubmenuItem = false,
  isCollapsed = false,
  end = false,
  badge,
}) => {
  return (
    <li>
      <NavLink
        to={path}
        end={end}
        className={({ isActive }) =>
          `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${
            isSubmenuItem
              ? "ml-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 hover:translate-x-1"
              : isActive
              ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200 scale-105"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:translate-x-1"
          }`
        }
        title={isCollapsed ? title : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span
          className={`${
            isSubmenuItem ? "mr-3" : "mr-4"
          } transition-all duration-300 flex-shrink-0 relative z-10 ${
            isCollapsed ? "group-hover:scale-110" : ""
          }`}
        >
          {icon}
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 truncate relative z-10">{title}</span>
            {badge && badge > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full min-w-[20px] text-center">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </>
        )}

        <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
      </NavLink>
    </li>
  );
};

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  icon,
  title,
  children,
  isCollapsed = false,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const childrenArray = React.Children.toArray(children);
  const isChildActive = childrenArray.some((child) => {
    if (React.isValidElement(child) && child.props.path) {
      return (
        location.pathname === child.props.path ||
        location.pathname.startsWith(`${child.props.path}/`)
      );
    }
    return false;
  });

  React.useEffect(() => {
    if (isChildActive && !isCollapsed) {
      setIsOpen(true);
    }
  }, [isChildActive, isCollapsed]);

  React.useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  if (isCollapsed) {
    return (
      <li>
        <div className="relative group">
          <button
            className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
              isChildActive
                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
            title={title}
          >
            <span className="transition-all duration-300 flex-shrink-0 group-hover:scale-110">
              {icon}
            </span>
            {badge && badge > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </button>

          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:translate-x-1">
            <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap relative">
              {title}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden hover:translate-x-1 ${
          isChildActive
            ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200"
            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="mr-4 transition-all duration-300 flex-shrink-0 relative z-10">
          {icon}
        </span>
        <span className="flex-1 text-left truncate relative z-10">{title}</span>

        <div className="flex items-center space-x-2 relative z-10">
          {badge && badge > 0 && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full min-w-[20px] text-center">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
          <div
            className={`transition-all duration-500 ${
              isOpen ? "rotate-180 scale-110" : "group-hover:scale-110"
            }`}
          >
            <ChevronDown size={16} className="text-current opacity-70" />
          </div>
        </div>

        <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 pl-6 relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 to-transparent" />
          {children}
        </ul>
      </div>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [overviewData, setOverviewData] = useState<OverviewData>({
    totalCafes: 0,
    activePromotions: 0,
  });
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch overview and pending requests data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch cafes
        const cafeResponse = await fetch(
          "http://localhost/cafeind_api/api/get_cafes.php"
        );
        
        if (!cafeResponse.ok) {
          throw new Error(`HTTP error! Status: ${cafeResponse.status}`);
        }
        
        const cafeResult: ApiResponse<Cafe[]> = await cafeResponse.json();
        
        if (!cafeResult.success) {
          throw new Error(cafeResult.message || "Failed to fetch cafes");
        }

        const cafes = cafeResult.data;
        const today = new Date();
        
        let totalActivePromotions = 0;
        
        // Calculate active promotions
        for (const cafe of cafes) {
          try {
            const promoResponse = await fetch(
              `http://localhost/cafeind_api/api/get_promotions.php?cafe_id=${cafe.id}`
            );
            
            if (promoResponse.ok) {
              const promoResult: ApiResponse<Promotion[]> = await promoResponse.json();
              if (promoResult.success) {
                const activePromos = promoResult.data.filter((promo: Promotion) => 
                  new Date(promo.valid_until) >= today
                );
                totalActivePromotions += activePromos.length;
              }
            }
          } catch (error) {
            console.error(`Error fetching promos for cafe ${cafe.id}:`, error);
          }
        }

        // Fetch pending cafe requests
        const requestResponse = await fetch(
          "http://localhost/cafeind_api/api/get_cafe_requests.php"
        );

        if (!requestResponse.ok) {
          throw new Error(`HTTP error! Status: ${requestResponse.status}`);
        }

        const requestResult: ApiResponse<CafeRequest[]> = await requestResponse.json();

        if (!requestResult.success) {
          throw new Error(requestResult.message || "Failed to fetch cafe requests");
        }

        const pendingCount = requestResult.data.filter(
          (request) => request.status === "pending"
        ).length;

        setOverviewData({
          totalCafes: cafes.length,
          activePromotions: totalActivePromotions,
        });
        setPendingRequests(pendingCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isCollapsed) {
      setIsHovered(false);
    }
  };

  const sidebarWidth = isMobile
    ? "w-80"
    : isCollapsed && !isHovered
    ? "w-20"
    : "w-72";

  return (
    <>
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 lg:hidden transition-all duration-300 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={toggleSidebar}
          className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Coffee size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Caféind
          </h1>
        </div>
        <div className="w-10" />
      </div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full ${sidebarWidth} bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-500 ease-out transform shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex flex-col h-full relative">
          <div
            className={`px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 ${
              isMobile ? "pt-4" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              {(!isCollapsed || isHovered) && (
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-200">
                    <Coffee size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Caféind
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                      Admin Dashboard
                    </p>
                  </div>
                </div>
              )}
              {isCollapsed && !isHovered && (
                <div className="flex justify-center w-full">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-200">
                    <Coffee size={24} className="text-white" />
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <button
                    onClick={toggleCollapse}
                    className="p-2 text-gray-400 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 hover:scale-105 shadow-sm"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {isCollapsed && !isHovered ? (
                      <ChevronRight size={18} />
                    ) : (
                      <ChevronLeft size={18} />
                    )}
                  </button>
                )}
                {isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-400 rounded-xl hover:bg-white hover:text-red-500 transition-all duration-200 hover:scale-105"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex-1 px-4 py-6 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {(!isCollapsed || isHovered) && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                {loading ? (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Coffee size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Total Cafes</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        {overviewData.totalCafes}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Tag size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Active Promos</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {overviewData.activePromotions}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <nav>
              <ul className="space-y-2">
                <SidebarItem
                  icon={<LayoutDashboard size={18} />}
                  title="Dashboard"
                  path="/admin"
                  isCollapsed={isCollapsed && !isHovered}
                  end
                />
                <SidebarSubmenu
                  icon={<Coffee size={18} />}
                  title="Cafes"
                  isCollapsed={isCollapsed && !isHovered}
                  badge={pendingRequests}
                >
                  <SidebarItem
                    icon={<Grid3X3 size={16} />}
                    title="All Cafes"
                    path="/admin/cafes"
                    isSubmenuItem={true}
                    isCollapsed={isCollapsed && !isHovered}
                  />
                  <SidebarItem
                    icon={<Plus size={16} />}
                    title="Add New Cafe"
                    path="/admin/add-cafe"
                    isSubmenuItem={true}
                    isCollapsed={isCollapsed && !isHovered}
                  />
                  <SidebarItem
                    icon={<Users size={16} />}
                    title="Cafe Requests"
                    path="/admin/cafe-requests"
                    isSubmenuItem={true}
                    isCollapsed={isCollapsed && !isHovered}
                    badge={pendingRequests}
                  />
                </SidebarSubmenu>
                <SidebarItem
                  icon={<Menu size={18} />}
                  title="Menu Items"
                  path="/admin/menu"
                  isCollapsed={isCollapsed && !isHovered}
                />
                <SidebarItem
                  icon={<Tag size={18} />}
                  title="Promotions"
                  path="/admin/promotions"
                  isCollapsed={isCollapsed && !isHovered}
                />
                <SidebarItem
                  icon={<MessageSquare size={18} />}
                  title="Reviews"
                  path="/admin/reviews"
                  isCollapsed={isCollapsed && !isHovered}
                />
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            {!isCollapsed || isHovered ? (
              <div className="flex items-center p-4 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Administrator
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:translate-x-1">
                    <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap relative">
                      {user?.email}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;