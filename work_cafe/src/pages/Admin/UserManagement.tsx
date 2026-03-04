// import React, { useState, useEffect } from 'react';
// import { 
//   User, 
//   Search, 
//   Plus, 
//   MoreHorizontal, 
//   Edit, 
//   Trash, 
//   Lock, 
//   Mail, 
//   Clock, 
//   Filter,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';

// interface UserData {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'editor' | 'user';
//   status: 'active' | 'inactive' | 'pending';
//   lastLogin: string;
//   avatar: string;
//   createdAt: string;
// }

// const UserManagement: React.FC = () => {
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState<string>('');
//   const [filterStatus, setFilterStatus] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<string | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

//   // Load users data
//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       const mockUsers: UserData[] = [
//         {
//           id: '1',
//           name: 'Admin User',
//           email: 'admin@cafeind.com',
//           role: 'admin',
//           status: 'active',
//           lastLogin: '2023-05-26T08:30:00Z',
//           avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-01-15T00:00:00Z'
//         },
//         {
//           id: '2',
//           name: 'John Doe',
//           email: 'john@example.com',
//           role: 'editor',
//           status: 'active',
//           lastLogin: '2023-05-25T14:20:00Z',
//           avatar: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-02-10T00:00:00Z'
//         },
//         {
//           id: '3',
//           name: 'Sarah Smith',
//           email: 'sarah@example.com',
//           role: 'user',
//           status: 'active',
//           lastLogin: '2023-05-24T09:15:00Z',
//           avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-02-22T00:00:00Z'
//         },
//         {
//           id: '4',
//           name: 'Michael Johnson',
//           email: 'michael@example.com',
//           role: 'user',
//           status: 'inactive',
//           lastLogin: '2023-05-10T18:45:00Z',
//           avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-03-05T00:00:00Z'
//         },
//         {
//           id: '5',
//           name: 'Emma Wilson',
//           email: 'emma@example.com',
//           role: 'editor',
//           status: 'active',
//           lastLogin: '2023-05-26T11:30:00Z',
//           avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-03-20T00:00:00Z'
//         },
//         {
//           id: '6',
//           name: 'David Brown',
//           email: 'david@example.com',
//           role: 'user',
//           status: 'pending',
//           lastLogin: '',
//           avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-05-25T00:00:00Z'
//         },
//         {
//           id: '7',
//           name: 'Lisa Chen',
//           email: 'lisa@example.com',
//           role: 'user',
//           status: 'active',
//           lastLogin: '2023-05-26T07:50:00Z',
//           avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-04-12T00:00:00Z'
//         },
//         {
//           id: '8',
//           name: 'Robert Miller',
//           email: 'robert@example.com',
//           role: 'user',
//           status: 'inactive',
//           lastLogin: '2023-04-30T16:20:00Z',
//           avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//           createdAt: '2023-04-18T00:00:00Z'
//         }
//       ];
      
//       setUsers(mockUsers);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Filter users based on search term, role, and status
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
//     const matchesRole = filterRole === '' || user.role === filterRole;
//     const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   // Format date string
//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'Never';
    
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };

//   // Handle deleting a user
//   const handleDeleteClick = (id: string) => {
//     setUserToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = () => {
//     // In a real app, this would make an API call to delete the user
//     console.log(`Deleting user with ID: ${userToDelete}`);
    
//     // Update local state to remove the user
//     setUsers(users.filter(user => user.id !== userToDelete));
    
//     setShowDeleteModal(false);
//     setUserToDelete(null);
//   };

//   // Toggle dropdown menu
//   const toggleDropdown = (id: string) => {
//     if (dropdownOpen === id) {
//       setDropdownOpen(null);
//     } else {
//       setDropdownOpen(id);
//     }
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilterRole('');
//     setFilterStatus('');
//   };

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
//         <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
//           <div className="flex-1">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="Search users by name or email"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <select
//               value={filterRole}
//               onChange={(e) => setFilterRole(e.target.value)}
//               className="block py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               <option value="">All Roles</option>
//               <option value="admin">Admin</option>
//               <option value="editor">Editor</option>
//               <option value="user">User</option>
//             </select>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="block py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             >
//               <option value="">All Statuses</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>
            
//             <button
//               onClick={resetFilters}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
//             >
//               <Filter size={16} className="mr-2" />
//               Reset
//             </button>
            
//             <button
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               <Plus size={16} className="mr-2" />
//               Add User
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
//                   User
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
//                   Role
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
//                   Last Login
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
//                   Created At
//                 </th>
//                 <th scope="col" className="relative px-6 py-3">
//                   <span className="sr-only">Actions</span>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//               {loading ? (
//                 // Skeleton loading
//                 [...Array(5)].map((_, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//                         <div className="ml-4">
//                           <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
//                           <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right">
//                       <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded ml-auto"></div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 currentUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
//                             <Mail size={12} className="mr-1" /> {user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.role === 'admin' 
//                           ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
//                           : user.role === 'editor'
//                           ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//                           : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//                       }`}>
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         user.status === 'active' 
//                           ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
//                           : user.status === 'inactive'
//                           ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
//                           : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
//                       }`}>
//                         {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                       <div className="flex items-center">
//                         <Clock size={14} className="mr-1" />
//                         {formatDate(user.lastLogin)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                       {formatDate(user.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="relative">
//                         <button
//                           onClick={() => toggleDropdown(user.id)}
//                           className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
//                         >
//                           <MoreHorizontal size={20} />
//                         </button>
                        
//                         {dropdownOpen === user.id && (
//                           <>
//                             <div 
//                               className="fixed inset-0 z-10"
//                               onClick={() => setDropdownOpen(null)}
//                             ></div>
//                             <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600">
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
//                                 onClick={() => console.log(`Edit user ${user.id}`)}
//                               >
//                                 <Edit size={16} className="inline mr-2" />
//                                 Edit
//                               </button>
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
//                                 onClick={() => console.log(`Reset password for user ${user.id}`)}
//                               >
//                                 <Lock size={16} className="inline mr-2" />
//                                 Reset Password
//                               </button>
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
//                                 onClick={() => handleDeleteClick(user.id)}
//                               >
//                                 <Trash size={16} className="inline mr-2" />
//                                 Delete
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
//                 currentPage === 1 
//                   ? 'opacity-50 cursor-not-allowed' 
//                   : 'hover:bg-gray-50'
//               } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
//                 currentPage === totalPages 
//                   ? 'opacity-50 cursor-not-allowed' 
//                   : 'hover:bg-gray-50'
//               } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600`}
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700 dark:text-gray-300">
//                 Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//                 <span className="font-medium">
//                   {Math.min(indexOfLastItem, filteredUsers.length)}
//                 </span>{' '}
//                 of <span className="font-medium">{filteredUsers.length}</span> users
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
//                     currentPage === 1 
//                       ? 'opacity-50 cursor-not-allowed' 
//                       : 'hover:bg-gray-50'
//                   } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600`}
//                 >
//                   <span className="sr-only">Previous</span>
//                   <ChevronLeft size={16} />
//                 </button>
                
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border ${
//                       currentPage === i + 1
//                         ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
//                     } text-sm font-medium`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
                
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
//                     currentPage === totalPages 
//                       ? 'opacity-50 cursor-not-allowed' 
//                       : 'hover:bg-gray-50'
//                   } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600`}
//                 >
//                   <span className="sr-only">Next</span>
//                   <ChevronRight size={16} />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete User Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed z-50 inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
//             </div>

//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900">
//                     <Trash size={20} className="text-red-600 dark:text-red-400" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete User</h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Are you sure you want to delete this user? All of their data will be permanently removed.
//                         This action cannot be undone.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-700">
//                 <button 
//                   type="button" 
//                   onClick={handleDeleteConfirm}
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   Delete
//                 </button>
//                 <button 
//                   type="button" 
//                   onClick={() => setShowDeleteModal(false)}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;