import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const user = res.data?.user || res.data; // adjust based on your backend
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/");

    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200 hover:text-orange-700 transition-all duration-300 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

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
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <p className="text-gray-600">
              Sign in with your email and password
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>

            <Separator />

            <div className="text-center text-sm text-gray-600">
              <p>Don’t have an account?</p>
              <Link to="/auth/register" className="text-orange-600 hover:underline">
                Register Now
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white/80 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            🔒 Your credentials are safe and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
