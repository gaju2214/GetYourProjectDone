// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false); // for profile fetch and submit
//   const [error, setError] = useState(null); // store fetch error (e.g. not logged in)
//   const navigate = useNavigate();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${backendUrl}/api/auth/profile`, {
//           withCredentials: true,
//         });
//         setProfile(res.data);
//         setFormData({
//           name: res.data.name || '',
//           phoneNumber: res.data.phoneNumber || '',
//           password: '',
//         });
//         setError(null);
//       } catch (err) {
//         console.error('Profile fetch failed:', err);
//         setError('You must be logged in to view your profile.');
//         setProfile(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [backendUrl]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.put(`${backendUrl}/api/auth/profile`, formData, {
//         withCredentials: true,
//       });
//       alert('Profile updated!');
//       setEditMode(false);
//       window.location.reload();
//     } catch (err) {
//       console.error('Update failed:', err);
//       alert('Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
//       navigate('/auth/login');
//     } catch (err) {
//       console.error('Logout failed:', err);
//       alert('Logout failed, please try again.');
//     }
//   };

//   // Show loader while fetching or submitting
//   if (loading) {
//     return (
//       <div className="text-center mt-10">
//         <div className="loader border-4 border-blue-500 border-t-transparent border-solid rounded-full w-12 h-12 animate-spin mx-auto"></div>
//         <p className="mt-2 text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   // If error (e.g. not logged in), show login prompt and button
//   if (error) {
//     return (
//       <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded text-center">
//         <p className="mb-4 text-red-600 font-semibold">{error}</p>
//         <button
//           onClick={() => navigate('/auth/login')}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   if (!profile) {
//     // Profile is null but no error? Just show loading text as fallback
//     return <div className="text-center mt-10">Loading profile...</div>;
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
//       <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

//       {!editMode ? (
//         <div>
//           <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
//           <p><strong>Email:</strong> {profile.email}</p>
//           <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
//           <p><strong>Provider:</strong> {profile.provider}</p>

//           <div className="mt-6 flex justify-between">
//             <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
//               Edit Profile
//             </button>
//             <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
//               Logout
//             </button>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block mb-1">Name</label>
//             <input name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1">Phone Number</label>
//             <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1">New Password (optional)</label>
//             <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
//           </div>

//           <div className="flex justify-between">
//             <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
//             <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
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
} from "lucide-react";
import { Button } from "../components/ui/Botton";

export default function Account() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  // form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("female");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch profile from backend instead of localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/auth/profile`);
        const u = res.data;
        setUser(u);
        const [f, l] = u.name?.split(" ") || ["", ""];
        setFirstName(f);
        setLastName(l);
        setEmail(u.email || "");
        setPhone(u.phoneNumber || "");
        setDob(u.dob || "");
        setGender(u.gender || "female");
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

  const handleSave = async () => {
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
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    const [f, l] = user.name?.split(" ") || ["", ""];
    setFirstName(f);
    setLastName(l);
    setEmail(user.email || "");
    setPhone(user.phoneNumber || "");
    setDob(user.dob || "");
    setGender(user.gender || "female");
    setIsEditing(false);
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
            {activeTab === "profile" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xl font-bold text-orange-700 mb-4 sm:mb-0">
                    Hello, {firstName}!
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-300 hover:bg-blue-400 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSave}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-400 flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">First Name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                        isEditing
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
                      readOnly={!isEditing}
                      className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                        isEditing
                          ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                          : "bg-gray-100 border-transparent"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex gap-1 items-center">
                      <Mail className="w-4 h-4 text-blue-400" /> Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                        isEditing
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
                      readOnly={!isEditing}
                      className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                        isEditing
                          ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                          : "bg-gray-100 border-transparent"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex gap-1 items-center">
                      <Calendar className="w-4 h-4 text-blue-400" /> DOB
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      readOnly={!isEditing}
                      className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${
                        isEditing
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
                            disabled={!isEditing}
                          />
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">
                  📦 Your Orders
                </h2>
                <p className="text-gray-500">No orders placed yet.</p>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">
                  🏠 Saved Addresses
                </h2>
                <p className="text-gray-500">
                  You haven't added any address yet.
                </p>
              </div>
            )}

            {activeTab === "faq" && (
              <div>
                <h2 className="text-xl font-semibold text-orange-600 mb-2">
                  ❓ Frequently Asked Questions
                </h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>How do I change my password?</li>
                  <li>Where can I track my orders?</li>
                  <li>How to reach student support?</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
