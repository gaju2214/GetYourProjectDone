import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Botton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Separator } from "../components/ui/Separator";
import api from "../api";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Login with password
  const handlePasswordLogin = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!password) {
      alert("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login-phone-password", {
        phoneNumber,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful!");
      navigate("/account", { replace: true });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/send-otp", { phoneNumber });
      setUserId(res.data.userId);
      setOtpSent(true);
      alert("OTP sent to your phone number");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/verify-otp", {
        userId,
        otp,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful!");
      navigate("/account", { replace: true });
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100/50 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl rounded-2xl overflow-hidden p-5 sm:p-6">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-3">
              <img
                src="/logo-kitsindia.png"
                alt="KitsIndia"
                width={170}
                height={38}
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to your secure developer portal</p>
            <div className="w-10 h-1 bg-[#003e8b] mx-auto mt-2.5 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {!otpSent ? (
              // Phone + Password/OTP options
              <>
                <div>
                  <Label htmlFor="phone" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact Number</Label>
                  <div className="flex mt-1 shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#003e8b] focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-200">
                    <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-500 text-xs font-semibold border-r border-gray-200">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="border-0 focus:ring-0 focus:border-0 rounded-l-none text-sm h-10 px-3 w-full outline-none focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</Label>
                  <div className="mt-1 shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#003e8b] focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-200">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-0 focus:ring-0 focus:border-0 text-sm h-10 px-3 w-full outline-none focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold h-10 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer border-0 text-xs uppercase tracking-wider"
                  onClick={handlePasswordLogin}
                  disabled={loading || phoneNumber.length !== 10 || !password}
                >
                  {loading ? "Logging in..." : "Login with Password"}
                </Button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 border-t border-gray-150"></div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">OR</span>
                  <div className="flex-1 border-t border-gray-150"></div>
                </div>

                <Button
                  className="w-full bg-white text-[#003e8b] border border-[#003e8b] hover:bg-blue-50/50 font-bold h-10 rounded-lg shadow-sm transition-all cursor-pointer text-xs uppercase tracking-wider"
                  onClick={handleSendOtp}
                  disabled={loading || phoneNumber.length !== 10}
                >
                  {loading ? "Sending..." : "Login with OTP"}
                </Button>

                <div className="border-t border-gray-150 my-2"></div>

                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">New to our platform?</p>
                  <Link to="/auth" className="block w-full">
                    <button type="button" className="w-full h-10 border border-gray-200 hover:border-[#003e8b] bg-white text-gray-600 hover:text-[#003e8b] hover:bg-blue-50/20 font-bold rounded-lg text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm">
                      Create Account
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              // OTP Verification
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Enter OTP</Label>
                  <div className="mt-1 shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-[#003e8b] focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-200">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="border-0 focus:ring-0 focus:border-0 text-center text-xl tracking-widest h-10 w-full outline-none focus:outline-none"
                      maxLength="6"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <Button
                  className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold h-10 rounded-lg shadow-sm transition-all cursor-pointer border-0 text-xs uppercase tracking-wider"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer h-9 mt-1"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setPassword("");
                  }}
                >
                  ← Change Phone Number
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 p-2.5 bg-white/60 border border-gray-100/50 rounded-xl text-center">
          <p className="text-[10px] text-gray-500">
            🔒 Your data is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
