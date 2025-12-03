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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="Get Your Project Done"
                width={200}
                height={45}
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!otpSent ? (
              // Phone + Password/OTP options
              <>
                <div>
                  <Label htmlFor="phone">Contact Number</Label>
                  <div className="flex mt-2">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
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
                      className="rounded-l-none text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handlePasswordLogin}
                  disabled={loading || phoneNumber.length !== 10 || !password}
                >
                  {loading ? "Logging in..." : "Login with Password"}
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-sm text-gray-500 font-medium">OR</span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  className="w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
                  onClick={handleSendOtp}
                  disabled={loading || phoneNumber.length !== 10}
                >
                  {loading ? "Sending..." : "OTP"}
                </Button>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">New to our platform?</p>
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              // OTP Verification
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="text-center text-2xl tracking-widest"
                    maxLength="6"
                    autoFocus
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
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
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white/80 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            🔒 Your data is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
