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
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 p-4 sm:p-6 flex justify-center">
//             <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden">
//                 <div className="flex flex-col md:flex-row">
//                     {/* Sidebar */}
//                     <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-blue-100 p-4 space-y-4 bg-white">
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
//                                 className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${activeTab === tab ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-blue-50"
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
//                             className="w-full mt-4 bg-gradient-to-r from-red-100 to-blue-200 text-red-700 border border-red-200 hover:shadow-md rounded-xl py-2 font-semibold flex items-center justify-center gap-2"
//                         >
//                             <LogOut className="w-4 h-4" /> Logout
//                         </Button>
//                     </div>

//                     {/* Main Content */}
//                     <div className="w-full md:w-3/4 p-4 sm:p-8 space-y-6">
//                         {activeTab === "profile" && (
//                             <>
//                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                                     <div className="text-xl font-bold text-blue-800 mb-4 sm:mb-0">
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
//                                                 className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
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
//                                                 ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
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
//                                                 ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
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
//                                                 ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
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
//                                                 ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
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
//                                                 ? "border-blue-300 bg-white focus:ring-2 focus:ring-blue-400"
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
//                                 <h2 className="text-xl font-semibold text-blue-700 mb-2">📦 Your Orders</h2>
//                                 <p className="text-gray-500">No orders placed yet.</p>
//                             </div>
//                         )}

//                         {activeTab === "addresses" && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-blue-700 mb-2">🏠 Saved Addresses</h2>
//                                 <p className="text-gray-500">You haven't added any address yet.</p>
//                             </div>
//                         )}

//                         {activeTab === "faq" && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-blue-700 mb-2">❓ Frequently Asked Questions</h2>
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
      'processing': 'bg-blue-100 text-blue-900',
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
    setAddress(user.address || "");
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
    } catch (e) { }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 p-4 space-y-2 bg-white shrink-0">
            <div className="pb-3 border-b border-gray-100 mb-3 px-2">
              <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">My Account</h2>
            </div>

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
                className={`flex items-center gap-3 p-2.5 rounded cursor-pointer transition-all duration-150 text-xs font-bold ${activeTab === tab
                    ? "bg-blue-50 text-[#003e8b] border-l-4 border-[#003e8b] rounded-l-none pl-3.5"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#003e8b]"
                  }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab ? "text-[#003e8b]" : "text-gray-400"}`} />
                {label}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 mt-4">
              <Button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 p-6 sm:p-8 space-y-6 min-h-[500px]">
            {/* Profile Section */}
            {activeTab === "profile" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-800">
                      👋 Hello, {firstName}!
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Manage your personal settings and profile info</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    {!isEditingProfile ? (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-[#003e8b] hover:bg-[#002e66] text-white flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-sm cursor-pointer border-0 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-sm cursor-pointer border-0 transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={handleCancelProfile}
                          className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs cursor-pointer transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500">First Name</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingProfile
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">Last Name</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingProfile
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 flex gap-1 items-center">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingProfile
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 flex gap-1 items-center">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingProfile
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>

                    {/* DOB & Gender */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 flex gap-1 items-center">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        readOnly={!isEditingProfile}
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingProfile
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500">Gender</label>
                      <div className="mt-3 space-x-6">
                        {["male", "female"].map((g) => (
                          <label key={g} className="inline-flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <input
                              type="radio"
                              value={g}
                              name="gender"
                              checked={gender === g}
                              onChange={() => setGender(g)}
                              disabled={!isEditingProfile}
                              className="accent-[#003e8b]"
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

            {/* Orders Section */}
            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-800">
                      Your Orders
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Track and manage your order history</p>
                  </div>
                  <button
                    onClick={handleRefreshOrders}
                    disabled={ordersLoading}
                    className="px-4 py-2 bg-[#003e8b] hover:bg-[#002e66] text-white rounded font-bold text-xs cursor-pointer border-0 transition-colors disabled:opacity-50"
                  >
                    {ordersLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {ordersLoading && (
                  <div className="bg-gray-50 border border-gray-100 p-8 rounded text-center">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#003e8b] mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Loading your orders...</p>
                  </div>
                )}

                {ordersError && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded text-center mb-4">
                    <p className="text-xs text-red-600 mb-2">Error: {ordersError}</p>
                    <button
                      onClick={handleRefreshOrders}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs border-0 cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="bg-gray-50 border border-gray-100 p-8 rounded text-center">
                    <p className="text-xs text-gray-500 font-bold">No orders found.</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Your order history will appear here once you make a purchase.
                    </p>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                          <div>
                            <h3 className="font-bold text-sm text-gray-800">
                              Order #{order.orderId || order.id}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Ordered on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 justify-between w-full sm:w-auto">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getStatusColor(order.status)}`}>
                              {order.status || 'PENDING'}
                            </span>
                            <span className="text-base font-extrabold text-[#003e8b]">
                              ₹{order.totalAmount || 0}
                            </span>
                          </div>
                        </div>

                        {/* Order Summary details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
                          <div className="space-y-1">
                            <p><span className="font-semibold text-gray-700">Customer:</span> {order.customerName}</p>
                            <p><span className="font-semibold text-gray-700">Mobile:</span> {order.mobile}</p>
                            <p><span className="font-semibold text-gray-700">Total Items:</span> {order.quantity}</p>
                          </div>
                          <div className="space-y-1">
                            <p><span className="font-semibold text-gray-700">Payment Status:</span> {order.paymentStatus || 'Pending'}</p>
                            <p><span className="font-semibold text-gray-700">Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.OrderItems && order.OrderItems.length > 0 && (
                          <div className="bg-gray-50 border border-gray-100 rounded p-3 mb-4 space-y-2">
                            {order.OrderItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                  {item.Project?.image && (
                                    <img
                                      src={item.Project.image}
                                      alt={item.Project.title}
                                      className="w-10 h-10 rounded border object-contain bg-white shrink-0"
                                    />
                                  )}
                                  <div>
                                    <p className="font-bold text-gray-800 truncate max-w-[200px] sm:max-w-md">
                                      {item.Project?.title || 'Project Kit'}
                                    </p>
                                    <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                                  </div>
                                </div>
                                <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Order Actions */}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-3.5 py-1.5 text-xs text-[#003e8b] border border-[#003e8b] hover:bg-blue-50 font-bold rounded cursor-pointer transition-colors bg-white"
                          >
                            View Details
                          </button>
                          {order.status === 'delivered' && (
                            <button className="px-3.5 py-1.5 text-xs bg-[#003e8b] text-white hover:bg-[#002e66] font-bold rounded cursor-pointer border-0 transition-colors">
                              Reorder
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => setCancelOrderModal(order)}
                              className="px-3.5 py-1.5 text-xs bg-red-600 text-white hover:bg-red-700 font-bold rounded cursor-pointer border-0 transition-colors"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-800">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Update your shipping and destination address</p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    {!isEditingAddress ? (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="bg-[#003e8b] hover:bg-[#002e66] text-white flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-sm cursor-pointer border-0 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Address
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveAddress}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs shadow-sm cursor-pointer border-0 transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={handleCancelAddress}
                          className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs cursor-pointer transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Address Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Local Address */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 flex gap-1 items-center">
                        <Home className="w-3.5 h-3.5 text-gray-400" /> Local Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        readOnly={!isEditingAddress}
                        rows={3}
                        placeholder="House/Plot No, Street, Locality, Landmarks..."
                        className={`w-full px-3 py-2 rounded border text-xs mt-1 resize-none transition-all ${isEditingAddress
                            ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                            : "bg-gray-100 border-transparent text-gray-700"
                          }`}
                      />
                    </div>

                    {/* Other fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 flex gap-1 items-center">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> City
                        </label>
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingAddress
                              ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                              : "bg-gray-100 border-transparent text-gray-700"
                            }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Pincode</label>
                        <input
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingAddress
                              ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                              : "bg-gray-100 border-transparent text-gray-700"
                            }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">State</label>
                        <input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingAddress
                              ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                              : "bg-gray-100 border-transparent text-gray-700"
                            }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Country</label>
                        <input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          readOnly={!isEditingAddress}
                          className={`w-full px-3 py-2 rounded border text-xs mt-1 transition-all ${isEditingAddress
                              ? "border-gray-300 bg-white focus:border-[#003e8b] outline-none"
                              : "bg-gray-100 border-transparent text-gray-700"
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
                <h2 className="text-lg font-extrabold text-gray-800 border-b border-gray-100 pb-4 mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg space-y-4">
                  <div className="border-b border-gray-150 pb-3">
                    <h3 className="font-bold text-xs text-gray-700 mb-1">How do I change my password?</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">You can change your password by going to the Security section in your account settings.</p>
                  </div>
                  <div className="border-b border-gray-150 pb-3">
                    <h3 className="font-bold text-xs text-gray-700 mb-1">Where can I track my orders?</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Visit the Orders section to view all your past and current orders with tracking information.</p>
                  </div>
                  <div className="border-b border-gray-150 pb-3">
                    <h3 className="font-bold text-xs text-gray-700 mb-1">How to reach student support?</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Click on the Support option in the sidebar to connect with our WhatsApp support team.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-700 mb-1">How do I update my delivery address?</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Go to the Addresses section and click 'Edit Address' to update your delivery information.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security / Password Change */}
            {activeTab === "security" && (
              <>
                <div className="border-b border-gray-100 pb-4 mb-5">
                  <h2 className="text-lg font-extrabold text-gray-800">
                    Security Settings
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Manage and update your login password credentials</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                    {user?.password && user.password.trim() !== '' ? "Change Password" : "Set Password"}
                  </h3>

                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4 text-xs font-semibold text-green-700">
                      {passwordSuccess}
                    </div>
                  )}

                  {/* Error Message */}
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4 text-xs font-semibold text-red-700">
                      {passwordError}
                    </div>
                  )}

                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-[#003e8b] hover:bg-[#002e66] text-white flex items-center gap-1.5 px-5 py-2.5 rounded shadow-sm transition-all text-xs font-bold border-0 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" /> {user?.password && user.password.trim() !== '' ? "Change Password" : "Set Password"}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* Current Password field */}
                      {user?.password && user.password.trim() !== '' && (
                        <div>
                          <Label htmlFor="currentPassword" className="text-xs font-semibold text-gray-500">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter your current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#003e8b]"
                          />
                        </div>
                      )}

                      {/* New Password field */}
                      <div>
                        <Label htmlFor="newPassword" className="text-xs font-semibold text-gray-500">
                          {user?.password && user.password.trim() !== '' ? "New Password" : "Password"}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder={user?.password && user.password.trim() !== '' ? "Enter new password (min 6 characters)" : "Create password (min 6 characters)"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#003e8b]"
                        />
                      </div>

                      {/* Confirm Password field */}
                      <div>
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-500">
                          {user?.password && user.password.trim() !== '' ? "Confirm New Password" : "Confirm Password"}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1 text-xs px-3 py-2 border border-gray-300 rounded focus:border-[#003e8b]"
                        />
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-bold text-xs transition-colors border-0 cursor-pointer disabled:opacity-50"
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
                          className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-250 px-5 py-2 rounded font-bold text-xs transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1c1c1c] text-white p-5 flex justify-between items-center z-10">
              <div>
                <h2 className="text-lg font-bold">Order #{selectedOrderDetails.orderId || selectedOrderDetails.id}</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(selectedOrderDetails.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Order Status */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</h3>
                <span className={`px-3 py-1 rounded text-xs font-bold tracking-wide uppercase ${getStatusColor(selectedOrderDetails.status)}`}>
                  {selectedOrderDetails.status || 'PENDING'}
                </span>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tracking Timeline</h3>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-3 pt-2">
                  {/* Step 1: Confirmed */}
                  <div className="flex flex-col items-center min-w-[70px] flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${['confirmed', 'shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}>
                      ✓
                    </div>
                    <p className="text-[10px] font-bold mt-2 text-center text-gray-800">Confirmed</p>
                  </div>

                  {/* Connector Line 1 */}
                  <div className={`flex-1 h-0.5 mb-5 ${['shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                    }`}></div>

                  {/* Step 2: Pickup */}
                  <div className="flex flex-col items-center min-w-[70px] flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${['shipped', 'in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}>
                      📦
                    </div>
                    <p className="text-[10px] font-bold mt-2 text-center text-gray-800">Pickup</p>
                  </div>

                  {/* Connector Line 2 */}
                  <div className={`flex-1 h-0.5 mb-5 ${['in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                    }`}></div>

                  {/* Step 3: In Transit */}
                  <div className="flex flex-col items-center min-w-[70px] flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${['in_transit', 'delivered'].includes(selectedOrderDetails.status?.toLowerCase())
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}>
                      🚚
                    </div>
                    <p className="text-[10px] font-bold mt-2 text-center text-gray-800">In Transit</p>
                  </div>

                  {/* Connector Line 3 */}
                  <div className={`flex-1 h-0.5 mb-5 ${selectedOrderDetails.status?.toLowerCase() === 'delivered'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                    }`}></div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center min-w-[70px] flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${selectedOrderDetails.status?.toLowerCase() === 'delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                      }`}>
                      ✓
                    </div>
                    <p className="text-[10px] font-bold mt-2 text-center text-gray-800">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items Ordered</h3>
                <div className="space-y-2 border border-gray-100 rounded overflow-hidden">
                  {selectedOrderDetails.OrderItems && selectedOrderDetails.OrderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-100 last:border-b-0 text-xs">
                      <p className="font-bold text-gray-800">{item.Project?.title || 'Product Kit'}</p>
                      <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</h3>
                <div className="bg-gray-50 p-4 rounded text-xs text-gray-700 leading-relaxed border border-gray-100">
                  <p className="font-medium">
                    {[selectedOrderDetails.address, selectedOrderDetails.city, selectedOrderDetails.state, selectedOrderDetails.pincode, selectedOrderDetails.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="text-xs text-gray-400">Payment status: {selectedOrderDetails.paymentStatus || 'Unknown'}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-gray-500">Total Paid:</span>
                  <span className="text-xl font-extrabold text-[#003e8b]">₹{selectedOrderDetails.totalAmount || 0}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-2 border-t">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedOrderDetails.status === 'delivered' && (
                <button className="px-4 py-2 bg-[#003e8b] text-white rounded text-xs font-bold hover:bg-[#002e66] transition-colors border-0 cursor-pointer">
                  Reorder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-red-600 text-white p-5 flex justify-between items-center">
              <h2 className="text-base font-bold">Cancel Order Request</h2>
              <button
                onClick={() => {
                  setCancelOrderModal(null);
                  setCancelReason("");
                }}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="pb-3 border-b border-gray-100 text-xs">
                <h3 className="font-bold text-gray-800">Order #{cancelOrderModal.orderId || cancelOrderModal.id}</h3>
                <p className="text-gray-500 mt-1">Amount to be refunded: <span className="font-extrabold text-[#003e8b]">₹{cancelOrderModal.totalAmount || 0}</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please describe why you wish to cancel this order..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:border-[#003e8b] outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded">
                <p className="text-[10px] text-blue-700 leading-relaxed font-semibold">
                  ℹ️ If the order has not been dispatched, your refund will be automatically processed back to the source account in 5-7 business days.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-2 border-t">
              <button
                onClick={() => {
                  setCancelOrderModal(null);
                  setCancelReason("");
                }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 cursor-pointer"
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
                    await api.post(`/api/orders/${cancelOrderModal.id}/cancel`, {
                      reason: cancelReason
                    });

                    alert("Order cancellation request submitted successfully!");
                    setCancelOrderModal(null);
                    setCancelReason("");
                    handleRefreshOrders();
                  } catch (error) {
                    console.error("Error cancelling order:", error);
                    alert("Failed to cancel order. Please try again.");
                  } finally {
                    setCancelSubmitting(false);
                  }
                }}
                disabled={cancelSubmitting || !cancelReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelSubmitting ? "Submitting..." : "Submit Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}