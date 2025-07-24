import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Botton";
import { Separator } from "../components/ui/Separator";
import {
    User,
    PackageCheck,
    MapPin,
    HelpCircle,
    LogOut,
    Phone,
    Mail,
    Calendar,
} from "lucide-react";

export default function Account() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("female");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(storedUser);
            const [fName, lName] = storedUser.name?.split(" ") || ["", ""];
            setFirstName(fName);
            setLastName(lName);
            setEmail(storedUser.email || "");
            setPhone(storedUser.phone || "");
            setDob(storedUser.dob || "");
            setGender(storedUser.gender || "female");
        }
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
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 p-6">
            <Card className="w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden animate-fadeIn border border-orange-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-extrabold text-orange-600 flex items-center justify-center gap-2">
                        <User className="w-6 h-6 text-blue-500" />
                        My Account
                    </CardTitle>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {firstName || "User"}!</p>
                </CardHeader>

                <Separator />

                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    {/* Sidebar */}
                    <div className="space-y-4 col-span-1">
                        <div className="rounded-xl border bg-white p-4 space-y-4 shadow-sm border-orange-100">
                            {[
                                { tab: "profile", label: "Profile", icon: User },
                                { tab: "orders", label: "Orders", icon: PackageCheck },
                                { tab: "addresses", label: "Addresses", icon: MapPin },
                                { tab: "faq", label: "FAQ", icon: HelpCircle },
                            ].map(({ tab, label, icon: Icon }) => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${activeTab === tab
                                        ? "bg-orange-100 text-orange-700 font-semibold"
                                        : "text-gray-700 hover:bg-blue-50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 text-blue-400" />
                                    {label.toUpperCase()}
                                </div>
                            ))}

                            <a
                                href="https://wa.me/917030023573?text=Hi%20Support%2C%20I%20need%20help%20with%20my%20account"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                                <Phone className="w-4 h-4" />
                                SUPPORT
                            </a>

                            <Button
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    navigate("/login");
                                }}
                                className="w-full text-red-600 border border-red-500 hover:bg-orange-50 flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                LOGOUT
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-3 space-y-6 transition-all animate-slideUp">
                        {activeTab === "profile" && (
                            <>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">First Name *</label>
                                        <input
                                            className="mt-1 block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 transition"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Last Name *</label>
                                        <input
                                            className="mt-1 block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 transition"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        Email *
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Phone className="w-4 h-4 text-blue-400" />
                                        Mobile Number *
                                    </label>
                                    <input
                                        className="mt-1 block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 transition"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        DOB
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full border border-orange-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 transition"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center gap-6 mt-2">
                                    {["male", "female"].map((g) => (
                                        <label key={g} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={gender === g}
                                                onChange={() => setGender(g)}
                                            />
                                            {g.charAt(0).toUpperCase() + g.slice(1)}
                                        </label>
                                    ))}
                                </div>

                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                                    onClick={handleSave}
                                >
                                    SAVE CHANGES
                                </Button>
                            </>
                        )}

                        {activeTab === "orders" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-orange-600">📦 Your Orders</h2>
                                <p className="text-gray-500">You haven't placed any orders yet.</p>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-orange-600">🏠 Saved Addresses</h2>
                                <p className="text-gray-500">No address found. Add one during checkout.</p>
                            </div>
                        )}

                        {activeTab === "faq" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-orange-600">❓ Frequently Asked Questions</h2>
                                <ul className="text-gray-600 list-disc ml-4 space-y-2">
                                    <li>How do I change my password?</li>
                                    <li>How do I cancel an order?</li>
                                    <li>How to reach customer support?</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
