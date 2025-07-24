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
} from "lucide-react";
import { Button } from "../components/ui/Botton";

export default function Account() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("female");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/login");

        setUser(storedUser);
        const [f, l] = storedUser.name?.split(" ") || ["", ""];
        setFirstName(f);
        setLastName(l);
        setEmail(storedUser.email || "");
        setPhone(storedUser.phone || "");
        setDob(storedUser.dob || "");
        setGender(storedUser.gender || "female");
    }, [navigate]);

    const handleSave = async () => {
        const updatedUser = {
            ...user,
            name: `${firstName} ${lastName}`.trim(),
            email,
            phone,
            dob,
            gender,
        };

        try {
            const response = await axios.put("/api/user/profile", updatedUser);
            localStorage.setItem("user", JSON.stringify(response.data));
            setUser(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    const handleCancel = () => {
        const [f, l] = user.name?.split(" ") || ["", ""];
        setFirstName(f);
        setLastName(l);
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setDob(user.dob || "");
        setGender(user.gender || "female");
        setIsEditing(false);
    };

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
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium ${activeTab === tab ? "bg-orange-100 text-orange-700" : "text-gray-700 hover:bg-blue-50"
                                    }`}
                            >
                                <Icon className="w-4 h-4 text-blue-400" /> {label}
                            </div>
                        ))}
                        <Button
                            onClick={() => {
                                localStorage.removeItem("user");
                                navigate("/login");
                            }}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-600">First Name</label>
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            readOnly={!isEditing}
                                            className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
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
                                            className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
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
                                            className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
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
                                            className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
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
                                            className={`w-full px-4 py-2 rounded-md border text-sm mt-1 ${isEditing
                                                ? "border-orange-300 bg-white focus:ring-2 focus:ring-orange-400"
                                                : "bg-gray-100 border-transparent"
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Gender</label>
                                        <div className="mt-2 space-x-6">
                                            {['male', 'female'].map((g) => (
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
                                <h2 className="text-xl font-semibold text-orange-600 mb-2">📦 Your Orders</h2>
                                <p className="text-gray-500">No orders placed yet.</p>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div>
                                <h2 className="text-xl font-semibold text-orange-600 mb-2">🏠 Saved Addresses</h2>
                                <p className="text-gray-500">You haven't added any address yet.</p>
                            </div>
                        )}

                        {activeTab === "faq" && (
                            <div>
                                <h2 className="text-xl font-semibold text-orange-600 mb-2">❓ Frequently Asked Questions</h2>
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
