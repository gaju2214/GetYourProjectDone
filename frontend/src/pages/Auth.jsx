// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { Button } from "../components/ui/Botton";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/Card";
// import { Input } from "../components/ui/Input";
// import { Label } from "../components/ui/Label";
// import { Separator } from "../components/ui/Separator";
// import { ArrowLeft, Smartphone, Mail } from "lucide-react";
// import api from "../api";

// export default function LoginPage() {
//   const [method, setMethod] = useState("email");

//   // Email/password states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Phone OTP states
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Email login handler
//   const handleEmailLogin = async () => {
//     if (!email || !password) {
//       alert("Please fill in both fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await api.post("/api/auth/login", {
//         email,
//         password,
//       });

//       const user = res.data?.user || res.data;
//       localStorage.setItem("user", JSON.stringify(user));

//       alert("Login successful!");
//       navigate("/account", { replace: true });
//       window.location.reload();
//     } catch (err) {
//       alert("Login failed: " + (err.response?.data?.message || "Server error"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTP handlers
//   const handleSendOtp = () => {
//     if (phoneNumber.length !== 10) {
//       alert("Enter a valid 10-digit mobile number");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setOtpSent(true);
//       setLoading(false);
//       alert("OTP sent to your mobile number");
//     }, 1500);
//   };

//   const handleVerifyOtp = () => {
//     if (otp.length !== 6) {
//       alert("Enter a valid 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       alert("Login successful!");
//       navigate("/");
//     }, 1500);
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="shadow-xl">
//           <CardHeader className="text-center">
//             <div className="flex justify-center mb-4">
//               <img
//                 src="/logo.png"
//                 alt="Get Your Project Done"
//                 width={200}
//                 height={45}
//                 className="h-12 w-auto"
//               />
//             </div>
//             <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
//             <p className="text-gray-600">Sign in to your account</p>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Switcher */}
//             <div className="flex rounded-lg bg-gray-100 p-1">
//               <button
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${method === "email"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 onClick={() => setMethod("email")}
//               >
//                 Email
//               </button>
//               <button
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${method === "phone"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 onClick={() => setMethod("phone")}
//               >
//                 Phone
//               </button>
//               <button
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${method === "google"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 onClick={() => setMethod("google")}
//               >
//                 Google
//               </button>
//             </div>

//             {/* Email Login */}
//             {method === "email" && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   className="w-full bg-red-600 hover:bg-red-700 text-white"
//                   onClick={handleEmailLogin}
//                   disabled={loading}
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             )}

//             {/* Phone Login */}
//             {method === "phone" && (
//               <div className="space-y-4">
//                 {!otpSent ? (
//                   <>
//                     <div>
//                       <Label htmlFor="phone">Mobile Number</Label>
//                       <div className="flex mt-1">
//                         <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
//                           +91
//                         </span>
//                         <Input
//                           id="phone"
//                           type="tel"
//                           placeholder="Enter 10-digit mobile number"
//                           value={phoneNumber}
//                           onChange={(e) =>
//                             setPhoneNumber(
//                               e.target.value.replace(/\D/g, "").slice(0, 10)
//                             )
//                           }
//                           className="rounded-l-none border-solid bg-white"
//                         />
//                       </div>
//                     </div>
//                     <Button
//                       className="w-full bg-red-600 hover:bg-red-700 text-white"
//                       onClick={handleSendOtp}
//                       disabled={loading || phoneNumber.length !== 10}
//                     >
//                       {loading ? "Sending OTP..." : "Send OTP"}
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div>
//                       <Label htmlFor="otp">Enter OTP</Label>
//                       <Input
//                         id="otp"
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) =>
//                           setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                         }
//                         className="text-center text-lg tracking-widest"
//                       />
//                       <p className="text-sm text-gray-600 mt-2">
//                         OTP sent to +91 {phoneNumber}
//                       </p>
//                     </div>
//                     <Button
//                       className="w-full bg-red-600 hover:bg-red-700 text-white"
//                       onClick={handleVerifyOtp}
//                       disabled={loading || otp.length !== 6}
//                     >
//                       {loading ? "Verifying..." : "Verify OTP"}
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       className="w-full"
//                       onClick={() => setOtpSent(false)}
//                     >
//                       Change Mobile Number
//                     </Button>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Google Login */}
//             {method === "google" && (
//               <div className="space-y-4">
//                 <Button
//                   className="w-full bg-transparent flex"
//                   variant="outline"
//                   onClick={handleGoogleLogin}
//                 >
//                   <svg className="w-20 h-8 mr-2" viewBox="-15 -3 24 29">
//                     <path
//                       fill="#4681dfff"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="#EA4335"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   <span className="mt-1 text-lg">Continue with Google</span>
//                 </Button>
//                 <p className="text-xs text-gray-600 text-center">
//                   By continuing with Google, you agree to our Terms of Service and Privacy Policy
//                 </p>
//               </div>
//             )}

//             <Separator />

//             {/* Conditional footer text */}
//             {method === "email" ? (
//               <div className="text-center text-sm text-gray-600">
//                 <p>Don’t have an account?</p>
//                 <Link
//                   to="/auth/register"
//                   className="text-orange-600 hover:underline"
//                 >
//                   Register Now
//                 </Link>
//               </div>
//             ) : (
//               <div className="text-center text-sm text-gray-600">
//                 <p>New user? Your account is auto-created on first login.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="mt-6 p-4 bg-white/80 rounded-lg text-center">
//           <p className="text-xs text-gray-600">
//             🔒 Your credentials are secure and encrypted.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if coming from Google OAuth (needs OTP verification)
  const googleUserId = searchParams.get('userId');
  const googleName = searchParams.get('name');
  const googleEmail = searchParams.get('email');

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  // Send OTP flow
  const handleSendOtp = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/send-otp", {
        phoneNumber,
        name,
      });

      setUserId(res.data.userId);
      setOtpSent(true);
      alert("OTP sent to your phone number");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP flow
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

      // Save token to localStorage
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

  // Handle Google OTP verification (after Google auth)
  const handleGoogleOtpSend = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      // For Google users, we update their profile with phone and send OTP
      const res = await api.post("/api/auth/send-otp", {
        phoneNumber,
        name: googleName,
        isGoogleUpdate: true,
      });

      setUserId(googleUserId);
      setOtpSent(true);
      alert("OTP sent to your phone number");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // If coming from Google OAuth
  if (googleUserId) {
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
              <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
              <p className="text-gray-600 text-sm">
                Hi {googleName}, please verify your contact number
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="google-phone">Phone Number</Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <Input
                        id="google-phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">
                    Email: {googleEmail}
                  </p>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleGoogleOtpSend}
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              ) : (
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
                    onClick={() => setOtpSent(false)}
                  >
                    Change Phone Number
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-white/80 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              🔒 Your phone number will be verified via OTP for security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normal login with OTP
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
            {/* Only OTP login is active. Google login removed temporarily. */}

            <Separator />

            {/* OTP Login Option */}
            <div className="space-y-4">
              <h3 className="text-center font-semibold text-gray-700">Login with OTP</h3>

              {!otpSent ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex mt-1">
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
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleSendOtp}
                    disabled={loading || !name.trim() || phoneNumber.length !== 10}
                  >
                    {loading ? "Sending..." : "OTP"}
                  </Button>

                  {/* Already have account section */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <Link to="/auth/login">
                    <Button
                      type="button"
                      className="w-full bg-white text-gray-900 border-2 border-gray-400 hover:bg-gray-50"
                    >
                      Already have account?
                    </Button>
                  </Link>
                </>
              ) : (
                <>
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
                    }}
                  >
                    Change Phone Number
                  </Button>
                </>
              )}
            </div>

            <Separator />

            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">✨ New to our platform?</p>
              <p>Your account will be automatically created when you sign in for the first time.</p>
            </div>
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
