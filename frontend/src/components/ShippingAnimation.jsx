import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Package,
    label: "Order Confirmed",
    description: "Your order has been placed",
  },
  {
    icon: Package,
    label: "Processing",
    description: "Preparing your project kit",
  },
  {
    icon: Truck,
    label: "Shipped",
    description: "On the way to you",
  },
];

export function ShippingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Step Progress */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                    ${
                      isActive
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    }
                    ${isCurrent ? "scale-110 animate-pulse" : ""}
                  `}
                >
                  {isActive && index < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>

                <div className="mt-3 text-center">
                  <div
                    className={`font-medium text-sm ${
                      isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isActive ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚚 Truck Animation with Road */}
      <div className="mt-12 relative overflow-hidden h-20 rounded-md">
        {/* Truck moving left to right */}
        <motion.div
          className="absolute"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
          animate={{
            left: ["-20%", "100%"],
          }}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <Truck className="h-10 w-10 text-yellow-400" />
        </motion.div>

        {/* Road dashed line */}
        <motion.div
          className="absolute bottom-3 left-0 right-0 h-0.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, black, black 10px, transparent 10px, transparent 20px)",
          }}
          animate={{
            backgroundPosition: ["0px", "40px"],
          }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
}
