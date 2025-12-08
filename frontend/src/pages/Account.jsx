// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//     User,
//     PackageCheck,
//     MapPin,
//     HelpCircle,
//     LogOut,
//     Phone,
//     Mail,
//     Calendar,
//     Pencil,
//     Save,
//     XCircle,
// } from "lucide-react";
// import { Button } from "../components/ui/Botton";

// export default function Account() {
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState("profile");
//     const [isEditing, setIsEditing] = useState(false);
//     const [user, setUser] = useState(null);

//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [dob, setDob] = useState("");
//     const [gender, setGender] = useState("female");

//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem("user"));
//         if (!storedUser) return navigate("/login");

//         setUser(storedUser);
//         const [f, l] = storedUser.name?.split(" ") || ["", ""];
//         setFirstName(f);
//         setLastName(l);
//         setEmail(storedUser.email || "");
//         setPhone(storedUser.phone || "");
//         setDob(storedUser.dob || "");
//         setGender(storedUser.gender || "female");
//     }, [navigate]);

//     const handleSave = async () => {
//         const updatedUser = {
//             ...user,
//             name: `${firstName} ${lastName}`.trim(),
//             email,
//             phone,
//             dob,
//             gender,
//         };

//         try {
//             const response = await axios.put("/api/user/profile", updatedUser);
//             localStorage.setItem("user", JSON.stringify(response.data));
//             setUser(response.data);
//             setIsEditing(false);
//             alert("Profile updated successfully!");
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update profile.");
//         }
//     };

//     const handleCancel = () => {
//         const [f, l] = user.name?.split(" ") || ["", ""];
//         setFirstName(f);
//         setLastName(l);
//         setEmail(user.email || "");
//         setPhone(user.phone || "");
//         setDob(user.dob || "");
//         setGender(user.gender || "female");
//         setIsEditing(false);
//     };

//     if (!user) return null;

//     const sidebarItems = [
//         { tab: "profile", label: "Profile", icon: User },
//         { tab: "orders", label: "Orders", icon: PackageCheck },
//         { tab: "addresses", label: "Addresses", icon: MapPin },
//         { tab: "faq", label: "FAQ", icon: HelpCircle },
//         { tab: "support", label: "Support", icon: Phone },
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 p-4 sm:p-6 flex justify-center">
//             <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden">
//                 <div className="flex flex-col md:flex-row">
//                     {/* Sidebar */}
//                     <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-orange-100 p-4 space-y-4 bg-white">
//                         {sidebarItems.map(({ tab, label, icon: Icon }) => (
//                             <div
//                                 key={tab}
//                                 onClick={() =>
//                                     tab === "support"
//                                         ? window.open(
//                                             "https://wa.me/917030023573?text=Hi%20Support%2C%20I%20need%20help",
//                                             "_blank"
//                                         )
//                                         : setActiveTab(tab)
//                                 }
//                                 className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${activeTab === tab ? "bg-orange-100 text-orange-700" : "text-gray-700 hover:bg-blue-50"
//                                     }`}
//                             >
//                                 <Icon className="w-4 h-4 text-blue-400" /> {label}
//                             </div>
//                         ))}
//                         <Button
//                             onClick={() => {
//                                 localStorage.removeItem("user");
//                                 navigate("/login");
//                             }}
//                             className="w-full mt-4 bg-gradient-to-r from-red-100 to-orange-200 text-red-700 border border-red-200 hover:shadow-md rounded-xl py-2 font-semibold flex items-center justify-center gap-2"
//                         >
//                             <LogOut className="w-4 h-4" /> Logout
//                         </Button>
//                     </div>

//                     {/* Main Content */}
//                     <div className="w-full md:w-3/4 p-4 sm:p-8 space-y-6">
//                         {activeTab === "profile" && (
//                             <>
//                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                     <div className="text-xl font-bold text-orange-700 mb-4 sm:mb-0">
//                                         Hello, {firstName}!
//                                     </div>
//                                     {!isEditing ? (
//                                         <button
//                                             onClick={() => setIsEditing(true)}
//                                             className="bg-blue-300 hover:bg-blue-400 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
//                                         >
//                                             <Pencil className="w-4 h-4" /> Edit
//                                         </button>
//                                     ) : (
//                                         <div className="flex flex-col sm:flex-row gap-3">
//                                             <button
//                                                 onClick={handleSave}
//                                                 className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
//                                             >
//                                                 <Save className="w-4 h-4" /> Save
//                                             </button>
//                                             <button
//                                                 onClick={handleCancel}
//                                                 className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all"
//                                             >
//                                                 <XCircle className="w-4 h-4" /> Cancel
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                     <div>
//                                         <label className="text-sm text-gray-600">First Name</label>
//                                         <input
//                                             value={firstName}
//                                             onChange={(e) => setFirstName(e.target.value)}
//                                             readOnly={!isEditing}
//                                             className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
//                                                 ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
//                                                 : "bg-gray-100 border-transparent"
//                                                 }`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-600">Last Name</label>
//                                         <input
//                                             value={lastName}
//                                             onChange={(e) => setLastName(e.target.value)}
//                                             readOnly={!isEditing}
//                                             className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
//                                                 ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
//                                                 : "bg-gray-100 border-transparent"
//                                                 }`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-600 flex gap-1 items-center">
//                                             <Mail className="w-4 h-4 text-blue-400" /> Email
//                                         </label>
//                                         <input
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             readOnly={!isEditing}
//                                             className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
//                                                 ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
//                                                 : "bg-gray-100 border-transparent"
//                                                 }`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-600 flex gap-1 items-center">
//                                             <Phone className="w-4 h-4 text-blue-400" /> Phone
//                                         </label>
//                                         <input
//                                             value={phone}
//                                             onChange={(e) => setPhone(e.target.value)}
//                                             readOnly={!isEditing}
//                                             className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
//                                                 ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
//                                                 : "bg-gray-100 border-transparent"
//                                                 }`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-600 flex gap-1 items-center">
//                                             <Calendar className="w-4 h-4 text-blue-400" /> DOB
//                                         </label>
//                                         <input
//                                             type="date"
//                                             value={dob}
//                                             onChange={(e) => setDob(e.target.value)}
//                                             readOnly={!isEditing}
//                                             className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
//                                                 ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
//                                                 : "bg-gray-100 border-transparent"
//                                                 }`}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-600">Gender</label>
//                                         <div className="mt-2 space-x-6">
//                                             {['male', 'female'].map((g) => (
//                                                 <label key={g} className="inline-flex items-center gap-2">
//                                                     <input
//                                                         type="radio"
//                                                         value={g}
//                                                         name="gender"
//                                                         checked={gender === g}
//                                                         onChange={() => setGender(g)}
//                                                         disabled={!isEditing}
//                                                     />
//                                                     {g.charAt(0).toUpperCase() + g.slice(1)}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         )}

//                         {activeTab === "orders" && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-orange-600 mb-2">📦 Your Orders</h2>
//                                 <p className="text-gray-500">No orders placed yet.</p>
//                             </div>
//                         )}

//                         {activeTab === "addresses" && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-orange-600 mb-2">🏠 Saved Addresses</h2>
//                                 <p className="text-gray-500">You haven't added any address yet.</p>
//                             </div>
//                         )}

//                         {activeTab === "faq" && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-orange-600 mb-2">❓ Frequently Asked Questions</h2>
//                                 <ul className="list-disc pl-5 text-gray-600 space-y-1">
//                                     <li>How do I change my password?</li>
//                                     <li>Where can I track my orders?</li>
//                                     <li>How to reach student support?</li>
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  PackageCheck,
  MapPin,
  HelpCircle,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Pencil,
  Save,
  XCircle,
  Home,
} from "lucide-react";
import { Button } from "../components/ui/Botton";
import api from "../api";
import { Lock } from "lucide-react";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";

export default function Account() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [cancelOrderModal, setCancelOrderModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // Password update fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("female");

  // Address fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile (with addresses)
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/auth/profile`);
        const u = res.data;
        console.log('Profile data received:', u);
        setUser(u);

        const [f, l] = u.name?.split(" ") || ["", ""];
        setFirstName(f);
        setLastName(l);
        setEmail("");
        setPhone(u.phoneNumber || "");
        setDob(u.dob || "");
        setGender(u.gender || "female");

        // address fields
        setAddress(u.address || "");
        setCity(u.city || "");
        setPincode(u.pincode || "");
        setState(u.state || "");
        setCountry(u.country || "");

        setError(null);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("You must be logged in to view your profile.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl]);

  // Fetch orders when orders tab is active AND user is loaded
  useEffect(() => {
    if (activeTab === "orders" && user && user.id) {
      console.log('Conditions met - fetching orders for user:', user.userId);
      fetchUserOrders();
    }
  }, [activeTab, user]);

  const fetchUserOrders = async () => {
    if (!user || !user.id) {
      console.error('No user ID available for fetching orders');
      setOrdersError('User ID not available');
      return;
    }

    setOrdersLoading(true);
    setOrdersError(null);
    
    try {
      console.log('Fetching orders for user:', user.id);
      
      // Use dynamic user ID instead of hardcoded 5
      const response = await api.get(`/api/orders/user/${user.id}`);
      
      console.log('Orders response:', response.data);
      console.log('Response status:', response.status);
      
      // Handle both array and object responses
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
      
      if (ordersData.length === 0) {
        console.log('No orders found for user');
      }
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch orders';
      setOrdersError(errorMessage);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Manual refresh function
  const handleRefreshOrders = () => {
    if (user.id) {
      fetchUserOrders();
    } else {
      setOrdersError('Please log in to view orders');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const calculateOrderTotal = (orderItems) => {
    return orderItems?.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0) || 0;
  };

  const handleSaveProfile = async () => {
    const updatedUser = {
      ...user,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phoneNumber: phone,
      dob,
      gender,
    };

    try {
      setLoading(true);
      const res = await api.put(`/api/auth/profile`, updatedUser);
      setUser(res.data);
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    const updatedUser = {
      ...user,
      address,
      city,
      pincode,
      state,
      country,
    };

    try {
      setLoading(true);
      const res = await api.put(`/api/auth/profile`, updatedUser);
      setUser(res.data);
      setIsEditingAddress(false);
      alert("Address updated successfully!");
    } catch (err) {
      console.error("Address update failed:", err);
      alert("Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelProfile = () => {
    if (!user) return;
    const [f, l] = user.name?.split(" ") || ["", ""];
    setFirstName(f);
    setLastName(l);
    setEmail(user.email || "");
    setPhone(user.phoneNumber || "");
    setDob(user.dob || "");
    setGender(user.gender || "female");
    setIsEditingProfile(false);
  };

  const handleCancelAddress = () => {
    if (!user) return;
    setAddress(user.address|| "");
    setCity(user.city || "");
    setPincode(user.pincode || "");
    setState(user.state || "");
    setCountry(user.country || "");
    setIsEditingAddress(false);
  };

  const handleLogout = async () => {
    try {
      await api.post(`/api/auth/logout`, {});
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
    navigate("/auth/login");
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Check if user has existing password (for existing users)
    const hasPassword = user?.password && user.password.trim() !== '';
    
    // For existing users, current password is required
    if (hasPassword && !currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (hasPassword && currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/update-password", {
        currentPassword: hasPassword ? currentPassword : null,
        newPassword,
      });

      setPasswordSuccess("Password " + (hasPassword ? "updated" : "created") + " successfully! You can now login with your password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      // Auto clear success message after 5 seconds
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update password. Please try again.";
      setPasswordError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded text-center">
        <p className="mb-4 text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) return null;

  const sidebarItems = [
    { tab: "profile", label: "Profile", icon: User },
    { tab: "orders", label: "Orders", icon: PackageCheck },
    { tab: "addresses", label: "Addresses", icon: MapPin },
    { tab: "security", label: "Security", icon: Lock },
    { tab: "faq", label: "FAQ", icon: HelpCircle },
    { tab: "support", label: "Support", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-orange-100 p-4 space-y-4 bg-white">
            {sidebarItems.map(({ tab, label, icon: Icon }) => (
              <div
                key={tab}
                onClick={() =>
                  tab === "support"
                    ? window.open(
                        "https://wa.me/917030023573?text=Hi%20Support%2C%20I%20need%20help",
                        "_blank"
                      )
                    : setActiveTab(tab)
                }
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${
                  activeTab === tab
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" /> {label}
              </div>
            ))}
            <Button
              onClick={handleLogout}
              className="w-full mt-4 bg-gradient-to-r from-red-100 to-orange-200 text-red-700 border border-red-200 hover:shadow-md rounded-xl py-2 font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 p-4 sm:p-8 space-y-6">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xl font-bold text-orange-700 mb-4 sm:mb-0">
                    👋 Hello, {firstName}!
                  </div>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-blue-300 hover:bg-blue-400 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={handleCancelProfile}
                        className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="text-sm text-gray-600">First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                          isEditingProfile
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                          isEditingProfile
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div>
                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <Mail className="w-4 h-4 text-blue-400" /> Email
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                          isEditingProfile
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <Phone className="w-4 h-4 text-blue-400" /> Phone
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                          isEditingProfile
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>

                    {/* DOB & Gender */}
                    <div>
                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <Calendar className="w-4 h-4 text-blue-400" /> Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                          isEditingProfile
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Gender</label>
                      <div className="mt-2 space-x-6">
                        {["male", "female"].map((g) => (
                          <label key={g} className="inline-flex items-center gap-2">
                            <input
                              type="radio"
                              value={g}
                              name="gender"
                              checked={gender === g}
                              onChange={() => setGender(g)}
                              disabled={!isEditingProfile}
                            />
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Orders Section - FIXED */}
            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-orange-600">
                    📦 Your Orders
                  </h2>
                  <button 
                    onClick={handleRefreshOrders}
                    disabled={ordersLoading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {ordersLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {/* Debug Info (remove in production) */}
                {/* <div className="mb-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                  <strong>Debug Info:</strong><br/>
                  User ID: {user?.id || 'Not available'}<br/>
                  Orders Count: {orders.length}<br/>
                  Loading: {ordersLoading ? 'Yes' : 'No'}<br/>
                  Error: {ordersError || 'None'}<br/>
                  API URL: {`${backendUrl}/api/orders/user/${user?.id || 'undefined'}`}
                </div> */}

                {ordersLoading && (
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading your orders...</p>
                  </div>
                )}

                {ordersError && (
                  <div className="bg-red-50 p-4 rounded-xl text-center mb-4">
                    <p className="text-red-600 mb-2">Error: {ordersError}</p>
                    <button 
                      onClick={handleRefreshOrders}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <p className="text-gray-500">No orders found.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Your order history will appear here once you make a purchase.
                    </p>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              Order #{order.orderId || order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Customer: {order.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Mobile: {order.mobile}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {order.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {order.status?.toUpperCase() || 'PENDING'}
                            </span>
                            <p className="text-lg font-bold text-orange-600 mt-2">
                              ₹{order.totalAmount || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                              Payment: {order.paymentStatus || 'Unknown'}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.OrderItems && order.OrderItems.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3 text-gray-700">Items:</h4>
                            <div className="space-y-3">
                              {order.OrderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-3 px-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-4">
                                    {item.Project?.image && (
                                      <img 
                                        src={item.Project.image} 
                                        alt={item.Project.title}
                                        className="w-16 h-16 rounded-lg object-cover border"
                                      />
                                    )}
                                    <div>
                                      <p className="font-semibold text-gray-800">
                                        {item.Project?.title || 'Product Name Not Available'}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity} × ₹{item.price}
                                      </p>
                                      {item.Project?.description && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          {item.Project.description.substring(0, 100)}...
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-gray-800">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Shipping Address */}
                        {(order.shippingAddress || order.address || order.city || order.pincode || order.state || order.country) && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-semibold text-gray-700 mb-3">📍 Shipping Address:</h4>
                            <div className="text-sm text-gray-600 space-y-2">
                              {/* Full address line with wrapping */}
                              <div className="whitespace-normal break-words max-w-full bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-gray-700">
                                  {[order.address, order.city, order.state, order.pincode, order.country]
                                    .filter(Boolean)
                                    .join(', ') || order.shippingAddress || 'Address not available'}
                                </p>
                              </div>
                              
                              {/* Detailed breakdown */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {order.address && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500">🏠</span>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">STREET ADDRESS</p>
                                      <p className="font-medium text-gray-800 break-words">{order.address}</p>
                                    </div>
                                  </div>
                                )}
                                {order.city && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500">🏙️</span>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">CITY</p>
                                      <p className="font-medium text-gray-800">{order.city}</p>
                                    </div>
                                  </div>
                                )}
                                {order.state && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500">🗺️</span>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">STATE</p>
                                      <p className="font-medium text-gray-800">{order.state}</p>
                                    </div>
                                  </div>
                                )}
                                {order.pincode && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500">📮</span>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">PINCODE</p>
                                      <p className="font-medium text-gray-800">{order.pincode}</p>
                                    </div>
                                  </div>
                                )}
                                {order.country && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-500">🌍</span>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">COUNTRY</p>
                                      <p className="font-medium text-gray-800">{order.country}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Order Actions */}
                        <div className="border-t pt-4 mt-4 flex justify-end space-x-3">
                          <button 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                          >
                            View Details
                          </button>
                          {order.status === 'delivered' && (
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                              Reorder
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => setCancelOrderModal(order)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Section */}
            {activeTab === "addresses" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4 sm:mb-0">
                    🏠 Delivery Address
                  </h2>
                  {!isEditingAddress ? (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="bg-blue-300 hover:bg-blue-400 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit Address
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSaveAddress}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={handleCancelAddress}
                        className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Local Address - Full width */}
                    <div>
                      <label className="text-sm text-gray-600 flex gap-1 items-center">
                        <Home className="w-4 h-4 text-blue-400" /> Local Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        readOnly={!isEditingAddress}
                        rows={3}
                        placeholder="Enter your house number, street name, locality, landmarks..."
                        className={`w-full px-4 py-2 rounded-md border text-sm mt-1 resize-none ${
                          isEditingAddress
                            ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                            : "bg-gray-100 border-transparent"
                        }`}
                      />
                    </div>

                    {/* Other address fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-600 flex gap-1 items-center">
                          <MapPin className="w-4 h-4 text-blue-400" /> City
                        </label>
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                            isEditingAddress
                              ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                              : "bg-gray-100 border-transparent"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Pincode</label>
                        <input
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                            isEditingAddress
                              ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                              : "bg-gray-100 border-transparent"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">State</label>
                        <input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                            isEditingAddress
                              ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                              : "bg-gray-100 border-transparent"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Country</label>
                        <input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                            isEditingAddress
                              ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                              : "bg-gray-100 border-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <div>
                <h2 className="text-xl font-semibold text-orange-600 mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">How do I change my password?</h3>
                    <p className="text-gray-600 text-sm">You can change your password by going to the Security section in your account settings.</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Where can I track my orders?</h3>
                    <p className="text-gray-600 text-sm">Visit the Orders section to view all your past and current orders with tracking information.</p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">How to reach student support?</h3>
                    <p className="text-gray-600 text-sm">Click on the Support option in the sidebar to connect with our WhatsApp support team.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">How do I update my delivery address?</h3>
                    <p className="text-gray-600 text-sm">Go to the Addresses section and click 'Edit Address' to update your delivery information.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security / Password Change */}
            {activeTab === "security" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4 sm:mb-0">
                    🔒 Security Settings
                  </h2>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    {user?.password && user.password.trim() !== '' ? "Change Password" : "Set Password"}
                  </h3>

                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                      <p className="text-green-700 text-sm font-medium">{passwordSuccess}</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                      <p className="text-red-700 text-sm font-medium">{passwordError}</p>
                    </div>
                  )}

                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition-all"
                    >
                      <Lock className="w-4 h-4" /> {user?.password && user.password.trim() !== '' ? "Change Password" : "Set Password"}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* Current Password field - only for users who already have a password */}
                      {user?.password && user.password.trim() !== '' && (
                        <div>
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      )}

                      {/* New Password field */}
                      <div>
                        <Label htmlFor="newPassword">
                          {user?.password && user.password.trim() !== '' ? "New Password" : "Password"}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder={user?.password && user.password.trim() !== '' ? "Enter your new password (min 6 characters)" : "Create a password (min 6 characters)"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      {/* Confirm Password field */}
                      <div>
                        <Label htmlFor="confirmPassword">
                          {user?.password && user.password.trim() !== '' ? "Confirm New Password" : "Confirm Password"}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={loading}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                        >
                          {loading ? "Processing..." : (user?.password && user.password.trim() !== '' ? "Update Password" : "Set Password")}
                        </button>
                        <button
                          onClick={() => {
                            setIsChangingPassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            setPasswordError("");
                          }}
                          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order #{selectedOrderDetails.orderId || selectedOrderDetails.id}</h2>
                <p className="text-sm text-orange-100">{formatDate(selectedOrderDetails.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Current Status</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrderDetails.status)}`}>
                  {selectedOrderDetails.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Tracking Timeline</h3>
                <div className="flex items-center justify-between gap-2 sm:gap-1 overflow-x-auto pb-4">
                  {/* Step 1: Confirmed */}
                  <div className="flex flex-col items-center min-w-max flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      ['confirmed', 'shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-semibold mt-2 text-center text-gray-800">Confirmed</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Order confirmed</p>
                  </div>

                  {/* Connector Line 1 */}
                  <div className={`flex-1 h-1 mb-8 ${
                    ['shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>

                  {/* Step 2: Pickup */}
                  <div className="flex flex-col items-center min-w-max flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      ['shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      📦
                    </div>
                    <p className="text-xs font-semibold mt-2 text-center text-gray-800">Pickup</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Picked up</p>
                  </div>

                  {/* Connector Line 2 */}
                  <div className={`flex-1 h-1 mb-8 ${
                    ['in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>

                  {/* Step 3: In Transit */}
                  <div className="flex flex-col items-center min-w-max flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      ['in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      🚚
                    </div>
                    <p className="text-xs font-semibold mt-2 text-center text-gray-800">In Transit</p>
                    <p className="text-xs text-gray-500 text-center mt-1">On the way</p>
                  </div>

                  {/* Connector Line 3 */}
                  <div className={`flex-1 h-1 mb-8 ${
                    selectedOrderDetails.status?.toLowerCase() === 'delivered'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center min-w-max flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedOrderDetails.status?.toLowerCase() === 'delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <p className="text-xs font-semibold mt-2 text-center text-gray-800">Delivered</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrderDetails.OrderItems && selectedOrderDetails.OrderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{item.Project?.title || 'Product'}</p>
                      <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <p>
                    {[selectedOrderDetails.address, selectedOrderDetails.city, selectedOrderDetails.state, selectedOrderDetails.pincode, selectedOrderDetails.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">Total Amount:</p>
                  <p className="text-2xl font-bold text-orange-600">₹{selectedOrderDetails.totalAmount || 0}</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">Payment: {selectedOrderDetails.paymentStatus || 'Unknown'}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              {selectedOrderDetails.status === 'delivered' && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">Cancel Order</h2>
              <button
                onClick={() => {
                  setCancelOrderModal(null);
                  setCancelReason("");
                }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Order #{cancelOrderModal.orderId || cancelOrderModal.id}</h3>
                <p className="text-sm text-gray-600 mb-4">Amount: ₹{cancelOrderModal.totalAmount || 0}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Why do you want to cancel this order?
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us the reason for cancellation..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-xs text-blue-700">
                  ℹ️ Your refund will be processed within 5-7 business days if the order hasn't been shipped yet.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t rounded-b-xl">
              <button
                onClick={() => {
                  setCancelOrderModal(null);
                  setCancelReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={async () => {
                  if (!cancelReason.trim()) {
                    alert("Please provide a reason for cancellation");
                    return;
                  }
                  
                  try {
                    setCancelSubmitting(true);
                    // API call to cancel order
                    await api.post(`/api/orders/${cancelOrderModal.id}/cancel`, {
                      reason: cancelReason
                    });
                    
                    alert("Order cancellation request submitted successfully!");
                    setCancelOrderModal(null);
                    setCancelReason("");
                    handleRefreshOrders(); // Refresh orders list
                  } catch (error) {
                    console.error("Error cancelling order:", error);
                    alert("Failed to cancel order. Please try again.");
                  } finally {
                    setCancelSubmitting(false);
                  }
                }}
                disabled={cancelSubmitting || !cancelReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}