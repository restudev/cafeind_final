// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Menu, 
//   User, 
//   Bell, 
//   Settings, 
//   LogOut, 
//   Moon, 
//   Sun, 
//   ChevronDown, 
//   Search 
// } from 'lucide-react';
// import { useAuth } from '../../../contexts/AuthContext';

// interface AdminHeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
//   darkMode: boolean;
//   toggleDarkMode: () => void;
// }

// const AdminHeader: React.FC<AdminHeaderProps> = ({ 
//   sidebarOpen, 
//   setSidebarOpen,
//   darkMode,
//   toggleDarkMode
// }) => {
//   const { user, logout } = useAuth();
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <header className="sticky top-0 z-30 flex bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
//       {/* Left: Hamburger button */}
//       <button
//         className="text-gray-500 hover:text-gray-600 lg:hidden px-4"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <Menu size={24} />
//       </button>

//       {/* Middle: Search */}
//       <div className="flex-grow flex items-center px-4 lg:px-8">
//         <div className="relative max-w-[400px] w-full mx-auto lg:mx-0">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search size={18} className="text-gray-400" />
//           </div>
//           <input 
//             type="search" 
//             className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
//                      bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
//                      dark:border-gray-600 dark:text-white" 
//             placeholder="Search in admin..." 
//           />
//         </div>
//       </div>

//       {/* Right: Header items */}
//       <div className="flex items-center space-x-3 px-4">
//         {/* Dark mode toggle */}
//         <button
//           className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 
//                    dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700"
//           onClick={toggleDarkMode}
//           aria-label="Toggle dark mode"
//         >
//           {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//         </button>

//         {/* Notifications dropdown */}
//         <div className="relative">
//           <button
//             className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100
//                       dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700"
//             onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
//           >
//             <Bell size={20} />
//             <span className="absolute top-1 right-1 inline-flex items-center justify-center h-4 w-4 text-xs 
//                           font-bold text-white bg-red-500 rounded-full">
//               3
//             </span>
//           </button>

//           {/* Notifications dropdown panel */}
//           {notificationDropdownOpen && (
//             <div 
//               className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 
//                         border border-gray-200 dark:border-gray-700 z-10"
//             >
//               <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                 <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</p>
//               </div>
//               <div className="max-h-60 overflow-y-auto">
//                 {/* Notification items */}
//                 {[1, 2, 3].map((item) => (
//                   <a 
//                     key={item}
//                     href="#"
//                     className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
//                   >
//                     <div className="flex-shrink-0">
//                       <img 
//                         src={`https://images.pexels.com/photos/6969/89${item}8-pexels-photo-6969${item}8/free-photo-of-coffee-beans-in-white-ceramic-cup.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`} 
//                         alt="User avatar" 
//                         className="w-10 h-10 rounded-full"
//                       />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         New review
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         A new review was added to Cafe #{item}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                         10 min ago
//                       </p>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//               <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
//                 <a 
//                   href="#" 
//                   className="block text-sm text-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
//                 >
//                   View all notifications
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User dropdown */}
//         <div className="relative">
//           <button
//             className="flex items-center space-x-2 hover:text-blue-600"
//             onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//           >
//             <img 
//               src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
//               alt="User avatar" 
//               className="w-8 h-8 rounded-full"
//             />
//             <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
//               {user?.name || 'Admin User'}
//             </span>
//             <ChevronDown size={16} className="text-gray-500" />
//           </button>

//           {/* User dropdown panel */}
//           {userDropdownOpen && (
//             <div 
//               className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 
//                         border border-gray-200 dark:border-gray-700 z-10"
//             >
//               <Link 
//                 to="/admin/profile"
//                 className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
//                           hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <User size={16} className="mr-2" />
//                 Your Profile
//               </Link>
//               <Link 
//                 to="/admin/settings"
//                 className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
//                           hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <Settings size={16} className="mr-2" />
//                 Settings
//               </Link>
//               <button 
//                 onClick={handleLogout}
//                 className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
//                           hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <LogOut size={16} className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;