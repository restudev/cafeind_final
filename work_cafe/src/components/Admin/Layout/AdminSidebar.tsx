// import React from 'react';
// import { NavLink, Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Coffee, 
//   Users, 
//   MessageSquare, 
//   Tag, 
//   Settings, 
//   X,
//   Briefcase 
// } from 'lucide-react';
// import { useAuth } from '../../../contexts/AuthContext';

// interface AdminSidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
//   const { user } = useAuth();

//   return (
//     <div
//       className={`lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 
//                 transition-all duration-300 ease-in-out
//                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//     >
//       <div className="flex justify-between items-center px-6 py-4 h-16 border-b border-gray-200 dark:border-gray-700">
//         <Link to="/admin" className="flex items-center">
//           <Briefcase size={24} className="text-blue-600 mr-2" />
//           <span className="text-lg font-bold text-gray-900 dark:text-white">CafeInd Admin</span>
//         </Link>
//         <button
//           className="text-gray-500 hover:text-gray-600 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <X size={24} />
//         </button>
//       </div>

//       <div className="py-4">
//         {/* Admin info */}
//         <div className="px-6 py-3 mb-6">
//           <div className="flex items-center">
//             <img
//               src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
//               alt="Admin avatar"
//               className="w-10 h-10 rounded-full mr-3"
//             />
//             <div>
//               <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 {user?.role === 'admin' ? 'Administrator' : user?.role === 'manager' ? 'Manager' : 'Editor'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="px-4 space-y-1">
//           <NavLink
//             to="/admin"
//             end
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <LayoutDashboard size={20} className="mr-3" />
//             Dashboard
//           </NavLink>

//           <NavLink
//             to="/admin/cafes"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <Coffee size={20} className="mr-3" />
//             Cafe Management
//           </NavLink>

//           <NavLink
//             to="/admin/users"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <Users size={20} className="mr-3" />
//             User Management
//           </NavLink>

//           <NavLink
//             to="/admin/reviews"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <MessageSquare size={20} className="mr-3" />
//             Review Management
//           </NavLink>

//           <NavLink
//             to="/admin/promotions"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <Tag size={20} className="mr-3" />
//             Promotions
//           </NavLink>

//           <NavLink
//             to="/admin/settings"
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg 
//               ${isActive
//                 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
//                 : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
//               }`
//             }
//           >
//             <Settings size={20} className="mr-3" />
//             Settings
//           </NavLink>
//         </nav>
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="text-xs text-gray-500 dark:text-gray-400">
//             CafeInd Admin v2.1
//           </div>
//           <a 
//             href="/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             View Website
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;