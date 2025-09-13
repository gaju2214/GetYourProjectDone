// import React, { useState } from "react";
// import api from "../api";

// const BillingFormPopup = ({ isPopupOpen, setIsPopupOpen, profile }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     phoneNumber: profile?.phoneNumber || "",
//     email: profile?.email || "",
//     name: profile?.name || "",
//     lastname: profile?.lastname || "",
//     address: profile?.address || "",
//     city: profile?.city || "",
//     pincode: profile?.pincode || "",
//     state: profile?.state || "",
//     country: "India" || "",
//   });
//   const [errors, setErrors] = useState({});

//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setCurrentStep(1);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!formData.phoneNumber.trim()) {
//         newErrors.phoneNumber = "Phone number is required";
//       } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s+/g, ""))) {
//         newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
//       }
//     }

//     if (step === 2) {
//       if (!formData.email.trim()) {
//         newErrors.email = "Email is required";
//       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         newErrors.email = "Please enter a valid email address";
//       }

//       if (!formData.name.trim()) {
//         newErrors.name = "First name is required";
//       }
//       if (!formData.lastname.trim()) {
//         newErrors.lastname = "Last nane is required";
//       }
//     }

//     if (step === 3) {
//       if (!formData.address.trim()) {
//         newErrors.address = "Address is required";
//       }
//       if (!formData.city.trim()) {
//         newErrors.city = "City is required";
//       }
//       if (!formData.pincode.trim()) {
//         newErrors.pincode = "Pincode is required";
//       }
//       if (!formData.state.trim()) {
//         newErrors.state = "State is required";
//       }
//       if (!formData.country.trim()) {
//         newErrors.country = "Country is required";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       if (currentStep < 3) {
//         setCurrentStep(currentStep + 1);
//       }
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateStep(3)) {
//       try {
//         await api.put(`/api/auth/profile`, formData, {
//           withCredentials: true,
//         });
//         alert("Profile updated!");

//         window.location.reload();
//       } catch (err) {
//         console.error("Update failed:", err);
//         alert("Update failed");
//       }
//       closePopup();
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Step 1: Phone Number
//             </h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.phoneNumber ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter your phone number"
//               />
//               {errors.phoneNumber && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.phoneNumber}
//                 </p>
//               )}
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Step 2: Email & Name
//             </h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.name ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter Your Full Name"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="lastname"
//                   value={formData.lastname}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.name ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Enter Your Last Name"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Step 3: Billing Address
//             </h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address *
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.address ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter your address"
//               />
//               {errors.address && (
//                 <p className="text-red-500 text-sm mt-1">{errors.address}</p>
//               )}
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.city ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="City"
//                 />
//                 {errors.city && (
//                   <p className="text-red-500 text-sm mt-1">{errors.city}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Pincode *
//                 </label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.pincode ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Pincode"
//                 />
//                 {errors.pincode && (
//                   <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
//                 )}
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   State *
//                 </label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.state ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="State"
//                 />
//                 {errors.state && (
//                   <p className="text-red-500 text-sm mt-1">{errors.state}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Country *
//                 </label>
//                 <input
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.country ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Country"
//                 />
//                 {errors.country && (
//                   <p className="text-red-500 text-sm mt-1">{errors.country}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       {isPopupOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Billing Information
//               </h2>
//               <button
//                 onClick={closePopup}
//                 className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Progress Indicator */}
//             <div className="px-6 py-4 border-b">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">
//                   Step {currentStep} of 3
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   {Math.round((currentStep / 3) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${(currentStep / 3) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Form Content */}
//             <div className="p-6">{renderStep()}</div>

//             {/* Footer Buttons */}
//             <div className="flex items-center justify-between p-6 border-t bg-gray-50">
//               <button
//                 onClick={prevStep}
//                 disabled={currentStep === 1}
//                 className={`px-4 py-2 rounded-md font-medium ${
//                   currentStep === 1
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 Previous
//               </button>

//               {currentStep < 3 ? (
//                 <button
//                   onClick={nextStep}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmit}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
//                 >
//                   Submit
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default BillingFormPopup;





import React, { useState } from "react";
import api from "../api";

const BillingFormPopup = ({ isPopupOpen, setIsPopupOpen, profile, onProfileUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: profile?.phoneNumber || "",
    email: profile?.email || "",
    name: profile?.name || "",
    lastname: profile?.lastname || "",
    address: profile?.address || "",
    city: profile?.city || "",
    pincode: profile?.pincode || "",
    state: profile?.state || "",
    country: profile?.country || "India",
  });
  const [errors, setErrors] = useState({});

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s+/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
    }
    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.name.trim()) {
        newErrors.name = "First name is required";
      }
      if (!formData.lastname.trim()) {
        newErrors.lastname = "Last name is required";
      }
    }
    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      try {
        const res = await api.put(`/api/auth/profile`, formData, { withCredentials: true });
        alert("Profile updated!");
        onProfileUpdate(res.data); // update parent state
      } catch (err) {
        console.error("Update failed:", err);
        alert("Update failed");
      }
      closePopup();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Phone Number</h3>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Email & Name</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last Name"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Billing Address</h3>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your address"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="City"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Pincode"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="State"
              />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Country"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    isPopupOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Billing Information</h2>
            <button onClick={closePopup} className="text-gray-600 text-2xl">
              ×
            </button>
          </div>

          {/* Progress */}
          <div className="px-4 py-2 border-b">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4">{renderStep()}</div>

          {/* Footer */}
          <div className="flex justify-between p-4 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default BillingFormPopup;
