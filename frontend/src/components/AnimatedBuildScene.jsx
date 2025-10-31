import React from "react";
import { motion } from "framer-motion";

export default function AnimatedBuildScene() {
  return (
<div className="relative w-full h-[85vh] md:h-[90vh] sm:h-screen bg-050810 overflow-hidden flex items-center justify-center">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a1f2e,#000)]">
        <div className="absolute inset-0 bg-[linear-gradient(#0f2335_1px,transparent_1px),linear-gradient(90deg,#0f2335_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main SVG Animation */}
      <svg
        viewBox="0 0 1400 800"
        xmlns="http://www.w3.org/2000/svg"
       className="relative w-full h-auto max-w-[95vw] max-h-[95vh] mx-auto">
        {/* ========== LAPTOP WITH CODE ========== */}
        
        {/* Laptop Base */}
        <motion.rect
          x="50"
          y="380"
          width="280"
          height="18"
          rx="8"
          fill="#2a2a2a"
          stroke="#444"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Laptop Screen */}
        <motion.rect
          x="70"
          y="180"
          width="240"
          height="200"
          rx="6"
          fill="#1a1a1a"
          stroke="#444"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Screen Display Area */}
        <motion.rect
          x="82"
          y="192"
          width="216"
          height="176"
          rx="3"
          fill="#0d1117"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        />

        {/* Code Lines - Typing Effect */}
        {[
          { y: 210, code: "// IoT Sensor Control", color: "#6a737d" },
          { y: 225, code: "#include <Adafruit_Sensor.h>", color: "#ff79c6" },
          { y: 240, code: "#define TEMP_PIN A0", color: "#f1fa8c" },
          { y: 255, code: "#define LED_PIN 13", color: "#f1fa8c" },
          { y: 270, code: "", color: "#000" },
          { y: 285, code: "void setup() {", color: "#50fa7b" },
          { y: 300, code: "  pinMode(LED_PIN, OUTPUT);", color: "#8be9fd" },
          { y: 315, code: "  Serial.begin(9600);", color: "#8be9fd" },
          { y: 330, code: "}", color: "#50fa7b" },
          { y: 345, code: "if(temp > 30) digitalWrite(13,1);", color: "#ffb86c" },
        ].map((line, i) => (
          <motion.text
            key={`code-${i}`}
            x="92"
            y={line.y}
            fill={line.color}
            fontSize="9"
            fontFamily="monospace"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15, duration: 0.3 }}
          >
            {line.code}
          </motion.text>
        ))}

        {/* Cursor Blink */}
        <motion.rect
          x="265"
          y="337"
          width="6"
          height="12"
          fill="#8be9fd"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Laptop Label */}
        <motion.text
          x="190"
          y="165"
          fill="#00ffff"
          fontSize="11"
          textAnchor="middle"
          opacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5 }}
        >
          Development IDE
        </motion.text>

        {/* USB Cable from Laptop */}
        <motion.path
          d="M 330 290 Q 380 290 430 350"
          stroke="#8be9fd"
          strokeWidth="4"
          strokeDasharray="10,5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        />

        {/* ========== CODE UPLOAD ANIMATION ========== */}
        
        {/* Data Packets Flowing */}
        {[...Array(5)].map((_, i) => (
          <motion.g key={`data-packet-${i}`}>
            <motion.circle
              cx="0"
              cy="0"
              r="5"
              fill="#8be9fd"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 2.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <animateMotion
                dur="2s"
                begin={`${2.5 + i * 0.4}s`}
                repeatCount="indefinite"
                path="M 330 290 Q 380 290 430 350"
              />
            </motion.circle>
            {/* Binary data visualization */}
            <motion.text
              fontSize="6"
              fill="#8be9fd"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                delay: 2.5 + i * 0.4,
                repeat: Infinity,
              }}
            >
              <animateMotion
                dur="2s"
                begin={`${2.5 + i * 0.4}s`}
                repeatCount="indefinite"
                path="M 330 290 Q 380 290 430 350"
              />
              101
            </motion.text>
          </motion.g>
        ))}

        {/* Upload Progress Text */}
        <motion.text
          x="380"
          y="270"
          fill="#50fa7b"
          fontSize="10"
          textAnchor="middle"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 3, delay: 2.5, repeat: Infinity }}
        >
          Uploading...
        </motion.text>

        {/* ========== ARDUINO BOARD (CENTER) ========== */}
        
        {/* Arduino PCB */}
        <motion.rect
          x="420"
          y="340"
          width="180"
          height="110"
          rx="8"
          fill="#006699"
          stroke="#00a0cc"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />

        {/* Arduino USB Port */}
        <motion.rect
          x="413"
          y="375"
          width="22"
          height="35"
          rx="3"
          fill="#c0c0c0"
          stroke="#888"
          strokeWidth="2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5 }}
        />

        {/* ATmega328P Chip */}
        <motion.rect
          x="465"
          y="370"
          width="90"
          height="50"
          rx="4"
          fill="#1a1a1a"
          stroke="#00ffff"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8 }}
        />

        {/* Chip Label */}
        <text x="510" y="400" fill="#00ffff" fontSize="10" textAnchor="middle" fontWeight="bold">
          ATmega328P
        </text>

        {/* Pin Headers - Left Side */}
        {[...Array(10)].map((_, i) => (
          <motion.rect
            key={`pin-left-${i}`}
            x="415"
            y={345 + i * 10}
            width="10"
            height="6"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2 + i * 0.04 }}
          />
        ))}

        {/* Pin Headers - Right Side */}
        {[...Array(10)].map((_, i) => (
          <motion.rect
            key={`pin-right-${i}`}
            x="595"
            y={345 + i * 10}
            width="10"
            height="6"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2 + i * 0.04 }}
          />
        ))}

        {/* Power LED - Blinking */}
        <motion.circle
          cx="580"
          cy="360"
          r="5"
          fill="#00ff00"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ delay: 2.5, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Power LED Glow */}
        <motion.circle
          cx="580"
          cy="360"
          r="10"
          fill="#00ff00"
          opacity="0.3"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 3 }}
        />

        {/* Arduino Label */}
        <text x="510" y="438" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">
          Arduino UNO
        </text>

        {/* ========== BREADBOARD ========== */}
        
        <motion.rect
          x="420"
          y="480"
          width="180"
          height="80"
          rx="4"
          fill="#f5f5dc"
          stroke="#d4b896"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        />

        {/* Breadboard Holes */}
        {[...Array(12)].map((_, row) => (
          <React.Fragment key={`row-${row}`}>
            {[...Array(10)].map((_, col) => (
              <motion.circle
                key={`hole-${row}-${col}`}
                cx={435 + col * 16}
                cy={495 + row * 6}
                r="1.5"
                fill="#333"
                opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.8 + (row * 10 + col) * 0.005 }}
              />
            ))}
          </React.Fragment>
        ))}

        {/* ========== SENSOR CONNECTIONS FROM ARDUINO ========== */}

        {/* Connection Lines to Sensors */}
        {/* To Ultrasonic Sensor */}
        <motion.path
          d="M 510 340 L 510 280 Q 510 260 530 260 L 750 260"
          stroke="#ff4444"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6,3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
        />

        {/* To Temperature Sensor */}
        <motion.path
          d="M 540 340 L 540 300 Q 540 280 560 280 L 750 280"
          stroke="#ffaa00"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6,3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 3.2 }}
        />

        {/* Ground Wire */}
       
// ========== SEALED CARDBOARD BOX (RIGHT SIDE) ==========
<motion.g
  initial={{ opacity: 0, x: 100, y: 20 }}
  animate={{ opacity: 1, x: 0, y: 0 }}
  transition={{ delay: 4.8, duration: 0.8 }}
>
  {/* Main Box Body - Sealed Cardboard */}
  <rect x="1120" y="180" width="160" height="120" rx="3" 
    fill="#D2B48C" stroke="#A0522D" strokeWidth="2.5" />
  
  {/* Box Top Face - Fully Sealed */}
  <motion.polygon
    points="1120,180 1280,180 1270,160 1130,160"
    fill="#E5D3B8" stroke="#A0522D" strokeWidth="2"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ delay: 5 }}
  />
  
  {/* Box Side Face - Sealed */}
  <motion.polygon
    points="1280,180 1280,300 1270,320 1270,200"
    fill="#C19A6B" stroke="#A0522D" strokeWidth="2"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ delay: 5.1 }}
  />
  
  {/* Top Tape Seal - Horizontal */}
  <motion.rect x="1135" y="165" width="130" height="8" rx="2" 
    fill="#DEB887" stroke="#DAA520" strokeWidth="1.5"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 5.2, duration: 0.5 }}
  />
  
  {/* Top Tape Seal - Vertical */}
  <motion.rect x="1265" y="175" width="8" height="30" rx="2" 
    fill="#DEB887" stroke="#DAA520" strokeWidth="1.5"
    initial={{ scaleY: 0 }}
    animate={{ scaleY: 1 }}
    tape={{ delay: 5.3, duration: 0.5 }}
  />
  
  {/* Bottom Tape Seal */}
  <motion.rect x="1140" y="295" width="120" height="6" rx="1" 
    fill="#F5DEB3" stroke="#DAA520" strokeWidth="1"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 5.4, duration: 0.5 }}
  />
  
  {/* Cardboard Texture Lines */}
  {[...Array(10)].map((_, i) => (
    <motion.line
      key={`texture-${i}`}
      x1="1125" y1={185 + i * 10}
      x2="1275" y2={185 + i * 10}
      stroke="#B8860B" strokeWidth="0.5" opacity="0.7"
      initial={{ x1: 1120, x2: 1280 }}
      animate={{ x1: 1125, x2: 1275 }}
      transition={{ delay: 5.2 + i * 0.05 }}
    />
  ))}
  
  {/* Box Edge Creases - Reinforced */}
  <motion.line x1="1120" y1="210" x2="1120" y2="280" 
    stroke="#A0522D" strokeWidth="2.5" 
    initial={{ y2: 210 }} animate={{ y2: 280 }} transition={{ delay: 5.1 }} />
  <motion.line x1="1280" y1="210" x2="1280" y2="280" 
    stroke="#A0522D" strokeWidth="2.5" 
    initial={{ y2: 210 }} animate={{ y2: 280 }} transition={{ delay: 5.1 }} />
  
  {/* Sealed Flaps - Bottom View */}
  <motion.rect x="1135" y="300" width="20" height="5" rx="1" 
    fill="#D2B48C" stroke="#A0522D" strokeWidth="1"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 5.4 }}
  />
  <motion.rect x="1255" y="300" width="20" height="5" rx="1" 
    fill="#D2B48C" stroke="#A0522D" strokeWidth="1"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 5.4 }}
  />

  {/* Shipping Labels & Symbols */}
  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 5.5 }}>
    {/* Fragile Sticker */}
    <ellipse cx="1165" cy="205" rx="18" ry="12" 
      fill="#FF6B6B" stroke="#CC5252" strokeWidth="1.5" />
    <text x="1165" y="210" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">
      ⚠️
    </text>
    <text x="1165" y="222" fill="#fff" fontSize="6" textAnchor="middle">
      FRAGILE
    </text>
    
    {/* Handle with Care Sticker */}
    <rect x="1220" y="195" width="35" height="18" rx="2" 
      fill="#4ECDC4" stroke="#26A69A" strokeWidth="1" />
    <text x="1237" y="205" fill="#fff" fontSize="7" textAnchor="middle">
      CARE
    </text>
    <text x="1237" y="212" fill="#fff" fontSize="7" textAnchor="middle">
      HANDLE
    </text>
    
    {/* This Way Up Arrows */}
   
    
    {/* Barcode Label */}
    <rect x="1135" y="250" width="50" height="12" rx="2" 
      fill="#000" opacity="0.9" />
    {[...Array(8)].map((_, i) => (
      <motion.rect
        key={`barcode-${i}`}
        x={1137 + i * 6} y="252" width="1" height={3 + Math.random() * 6}
        fill="#fff"
        animate={{ y: [252, 252 + Math.random() * 3, 252] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}
    
    {/* DIY Electronics Kit Label */}
    <rect x="1200" y="280" width="60" height="16" rx="2" 
      fill="#FFAA00" stroke="#CC8800" strokeWidth="1.5" />
    <text x="1230" y="290" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
      DIY KIT
    </text>
    <text x="1230" y="298" fill="#fff" fontSize="6" textAnchor="middle">
      Electronics
    </text>
    
    {/* Made in India Tag */}
    <motion.rect x="1255" y="230" width="30" height="12" rx="1" 
      fill="#00BFFF" stroke="#0080C0" strokeWidth="1"
      animate={{ rotate: [0, -2, 2, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay: 6.5 }}
    >
      <text x="1270" y="240" fill="#fff" fontSize="7" textAnchor="middle">
        🇮🇳
      </text>
      <text x="1270" y="248" fill="#fff" fontSize="5" textAnchor="middle">
        MADE IN
      </text>
      <text x="1270" y="255" fill="#fff" fontSize="5" textAnchor="middle">
        INDIA
      </text>
    </motion.rect>
  </motion.g>

  {/* Box Shadow */}
  <motion.ellipse
    cx="1130" cy="330" rx="175" ry="12"
    fill="#000" opacity="0.25"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 5.1, duration: 0.5 }}
  />
</motion.g>

// ========== COMPONENTS WITH LARGE GAPS (SPREAD OUT) ==========
<motion.g
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 5.2, duration: 0.8 }}
>
  {/* Extended Platform for Large Gaps */}
  <rect x="1900" y="420" width="500" height="15" rx="5" 
    fill="#6A6A6A" stroke="#888" strokeWidth="2.5" />
  
  {/* Shadow under platform */}
  <ellipse cx="1250" cy="435" rx="520" ry="8" 
    fill="#000" opacity="0.2" />

  {/* ARDUINO UNO - FAR LEFT (Large Gap Start) */}
  <motion.g
    initial={{ scale: 0, x: -60 }}
    animate={{ scale: 1.5, x: 0 }}
    transition={{ delay: 5.4, duration: 0.7 }}
  >
    {/* Arduino PCB - Even Larger */}
  
    
    {/* Power LED */}
    <motion.circle cx="1110" cy="480" r="7" 
      fill="#00FF00" stroke="#006600" strokeWidth="2"
      animate={{ scale: [1, 2, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 6 }}
    />
    <motion.circle cx="1110" cy="480" r="18" 
      fill="#00FF00" opacity="0.15"
      animate={{ scale: [1, 1.4, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 6 }}
    />
    
    {/* Pin Headers */}
   
  </motion.g>

  {/* LARGE EMPTY SPACE - 120px gap */}

  {/* ULTRASONIC SENSOR - CENTER-LEFT (After Large Gap) */}
  <motion.g
    initial={{ x: -80, opacity: 0, y: 30 }}
    animate={{ x: 0, opacity: 1, y: 0 }}
    transition={{ delay: 5.7, duration: 0.7 }}
  >
    <rect x="1170" y="450" width="100" height="80" rx="8" 
      fill="#1E90FF" stroke="#104E8B" strokeWidth="4" />
    
    {/* Ultrasonic Eyes */}
    <motion.circle cx="1200" cy="500" r="15" 
      fill="#000" stroke="#333" strokeWidth="3"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 6.8 }}
    />
    <motion.circle cx="1245" cy="500" r="15" 
      fill="#000" stroke="#333" strokeWidth="3"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
    />
    
    {/* Sensor Pins */}
    {[...Array(4)].map((_, i) => (
      <motion.rect
        key={`pin-${i}`}
        x={1175 + i * 25} y="525" width="8" height="18" 
        fill="#666" stroke="#888" strokeWidth="1.5"
        animate={{ y: [525, 515, 525] }}
        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
      />
    ))}
    
    <text x="1215" y="575" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">
      HC-SR04 ULTRASONIC
    </text>
    <text x="1215" y="595" fill="#fff" fontSize="9" textAnchor="middle">
      Distance Measurement
    </text>
    
    {/* Enhanced Distance Waves */}
    {[...Array(4)].map((_, i) => (
      <motion.path
        key={`wave-${i}`}
        d={`M 1270 ${490 + i * 8} Q 1330 ${490 + i * 8 - 20} 1390 ${490 + i * 8}`}
        stroke="#00FFFF" strokeWidth="3" fill="none" strokeLinecap="round"
        opacity="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 2, delay: 7.2 + i * 0.4, repeat: Infinity }}
      />
    ))}
  </motion.g>

  {/* HUGE EMPTY SPACE - 150px gap */}

  {/* TEMPERATURE SENSOR - FAR RIGHT CENTER */}
  <motion.g
    initial={{ x: 100, opacity: 0, y: -30 }}
    animate={{ x: 0, opacity: 1, y: 0 }}
    transition={{ delay: 5.9, duration: 0.7 }}
  >
    <rect x="1400" y="480" width="70" height="60" rx="5" 
      fill="#FF6347" stroke="#CC4F3A" strokeWidth="3" />
    
    {/* Temperature Element */}
    <motion.circle cx="1435" cy="510" r="12" 
      fill="#FF4500" stroke="#CC3700" strokeWidth="3"
      animate={{ scale: [1, 1.25, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 7.1 }}
    />
    
    {/* Temperature Bar */}
    <motion.rect x="1428" y="515" width="14" height="20" rx="3" 
      fill="#fff" stroke="#fff" strokeWidth="2"
      animate={{ 
        height: [20, 35, 28, 20],
        y: [515, 500, 507, 515]
      }}
      transition={{ duration: 3, repeat: Infinity, delay: 7.5 }}
    />
    
    {/* Sensor Pins */}
    {[...Array(3)].map((_, i) => (
      <motion.rect
        key={`temp-pin-${i}`}
        x={1403 + i * 23} y="540" width="6" height="15" 
        fill="#666" stroke="#888" strokeWidth="1.5"
        animate={{ y: [540, 525, 540] }}
        transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
      />
    ))}
    
    <text x="1435" y="610" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">
      DHT11 SENSOR
    </text>
    <text x="1435" y="630" fill="#fff" fontSize="9" textAnchor="middle">
      Temperature + Humidity
    </text>
    
    {/* Enhanced Heat Waves */}
    {[...Array(4)].map((_, i) => (
      <motion.path
        key={`heat-${i}`}
        
      />
    ))}
  </motion.g>

  {/* EXTRA LARGE EMPTY SPACE - 200px gap */}

  {/* SERVO MOTOR - FAR RIGHT BOTTOM */}
  <motion.g
    initial={{ y: -40, opacity: 0, x: 50 }}
    animate={{ y: 0, opacity: 1, x: 0 }}
    transition={{ delay: 6.1, duration: 0.7 }}
  >
    
    {/* Servo Gear */}
   
    
    {/* Servo Horn */}
    
    
    {/* Servo Pins */}
    {[...Array(3)].map((_, i) => (
      <motion.rect
        key={`servo-pin-${i}`}
        x={1553 + i * 19} y="575" width="8" height="12" 
        fill="#666" stroke="#888" strokeWidth="2"
        animate={{ x: [1553 + i * 19, 1553 + i * 19 + 3, 1553 + i * 19] }}
        transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
      />
    ))}
    
   
  </motion.g>

  {/* JUMPER WIRES - Much Longer to Bridge Large Gaps */}
 
  {/* PASSIVE COMPONENTS - Spread Out with Large Gaps */}
  <motion.g
    initial={{ scale: 0, x: 80 }}
    animate={{ scale: 1.6, x: 0 }}
    transition={{ delay: 6.2, duration: 0.7 }}
  >
    {/* Resistor 1 - Far Left */}
    <motion.g animate={{ x: [0, 10, -10, 0], y: [0, -5, 5, 0] }} 
      transition={{ duration: 4, repeat: Infinity, delay: 7.5 }}>
      <rect x="980" y="580" width="40" height="12" rx="6" 
        fill="#8B4513" stroke="#A0522D" strokeWidth="2" />
      <motion.rect x="987" y="586" width="26" height="4" rx="2" 
        fill="#000" opacity="0.4"
        animate={{ width: [26, 32, 26] }}
        transition={{ duration: 2, repeat: Infinity, delay: 7.8 }}
      />
      <text x="1000" y="610" fill="#8B4513" fontSize="10" textAnchor="middle">
        1kΩ Resistor
      </text>
    </motion.g>

    {/* HUGE GAP - 180px */}

    {/* LED Array - Center Right */}
    <motion.g animate={{ rotate: [0, 5, -5, 0] }} 
      transition={{ duration: 3, repeat: Infinity, delay: 8 }}>
      <motion.circle cx="1280" cy="585" r="8" 
        fill="#FF4444" stroke="#CC0000" strokeWidth="3"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 8.2 }}
      />
      <motion.circle cx="1280" cy="385" r="3" fill="#FF9999" 
        animate={{ scale: [1, 4, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 8.5 }}
      />
      <text x="1280" y="610" fill="#FF4444" fontSize="10" textAnchor="middle">
        High Brightness LED
      </text>
    </motion.g>

    {/* EXTRA LARGE GAP - 200px */}

    {/* Capacitor Bank - Far Right */}
  

    {/* Transistor - Bottom Right */}
    
  </motion.g>

  {/* BUZZER - Isolated Bottom Right */}
  <motion.g
    initial={{ scale: 0, y: 40, x: 80 }}
    animate={{ scale: 1.4, y: 0, x: 0 }}
    transition={{ delay: 6.4, duration: 0.7 }}
  >
  
   
  
    
  </motion.g>

  {/* ULTRA LARGE GAPS FILLED WITH POSITION INDICATORS */}
  {/* Left Section Label */}
  <motion.text x="1000" y="700" fill="#00FFFF" fontSize="12" textAnchor="middle" fontWeight="bold">
    CORE PROCESSING
  </motion.text>
  
  {/* Center Section Label - After Large Gap */}
  <motion.text x="1320" y="700" fill="#1E90FF" fontSize="12" textAnchor="middle" fontWeight="bold">
    SENSING MODULES
  </motion.text>
  
  {/* Right Section Label - After Huge Gap */}
 
  {/* Connection Lines Between Distant Components */}
  
  {/* Floating Labels for Spacing */}
  
</motion.g>


        {/* Power Wire (5V) */}
        
        {/* ========== ULTRASONIC SENSOR (HC-SR04) ========== */}
        
        <motion.g
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.8, duration: 0.8 }}
        >
          {/* Sensor Body */}
          <rect x="750" y="230" width="100" height="70" rx="5" fill="#1e90ff" stroke="#1c86ee" strokeWidth="2" />
          
          {/* Ultrasonic Transmitters (Eyes) */}
          <circle cx="775" cy="260" r="15" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
          <circle cx="825" cy="260" r="15" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
          
          {/* Sensor Pins */}
          <rect x="760" y="295" width="10" height="20" fill="#666" />
          <rect x="785" y="295" width="10" height="20" fill="#666" />
          <rect x="810" y="295" width="10" height="20" fill="#666" />
          <rect x="835" y="295" width="10" height="20" fill="#666" />
          
          {/* Label */}
          <text x="800" y="288" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
            HC-SR04
          </text>

          {/* Ultrasonic Waves Animation */}
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`wave-${i}`}
              d="M 850 260 Q 900 260 920 260"
              stroke="#00ffff"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1],
                opacity: [0.6, 0],
                x: [0, 80]
              }}
              transition={{
                duration: 1.5,
                delay: 5 + i * 0.3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.g>

        {/* Sensor Signal Label */}
        <motion.text
          x="900"
          y="250"
          fill="#1e90ff"
          fontSize="10"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 5 }}
        >
          Distance: 15cm
        </motion.text>

        {/* ========== TEMPERATURE SENSOR (LM35) ========== */}
        
        <motion.g
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4, duration: 0.8 }}
        >
          {/* Sensor Body */}
          <rect x="750" y="340" width="80" height="60" rx="4" fill="#1a1a1a" stroke="#ff6600" strokeWidth="2" />
          
          {/* Sensor Element */}
          <circle cx="790" cy="370" r="18" fill="#ff6600" opacity="0.3" />
          <circle cx="790" cy="370" r="12" fill="#ff3300" />
          
          {/* Temperature Icon */}
          <motion.rect
            x="785"
            y="360"
            width="10"
            height="20"
            rx="2"
            fill="#fff"
            animate={{ 
              height: [20, 25, 20],
              y: [360, 355, 360]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 5 }}
          />
          
          {/* Sensor Pins */}
          <rect x="760" y="395" width="8" height="20" fill="#666" />
          <rect x="786" y="395" width="8" height="20" fill="#666" />
          <rect x="812" y="395" width="8" height="20" fill="#666" />
          
          {/* Label */}
          <text x="790" y="390" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
            LM35
          </text>

          {/* Heat Waves */}
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`heat-${i}`}
              d="M 790 350 Q 795 340 790 330"
              stroke="#ff6600"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
              animate={{
                y: [-20, -40],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                delay: 5.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.g>

        {/* Temperature Reading */}
        <motion.text
          x="900"
          y="370"
          fill="#ff6600"
          fontSize="10"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 5.5 }}
        >
          Temp: 32°C
        </motion.text>

        {/* ========== SIGNAL PROCESSING ANIMATION ========== */}
        
        {/* Signal from Ultrasonic to Arduino */}
        {[...Array(4)].map((_, i) => (
          <motion.circle
            key={`signal-ultra-${i}`}
            cx="0"
            cy="0"
            r="4"
            fill="#1e90ff"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <animateMotion
              dur="1.5s"
              begin={`${6 + i * 0.5}s`}
              repeatCount="indefinite"
              path="M 750 260 L 530 260 Q 510 260 510 280 L 510 340"
            />
          </motion.circle>
        ))}

        {/* Signal from Temperature to Arduino */}
        {[...Array(4)].map((_, i) => (
          <motion.circle
            key={`signal-temp-${i}`}
            cx="0"
            cy="0"
            r="4"
            fill="#ff6600"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: 6.5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <animateMotion
              dur="1.5s"
              begin={`${6.5 + i * 0.5}s`}
              repeatCount="indefinite"
              path="M 750 280 L 560 280 Q 540 280 540 300 L 540 340"
            />
          </motion.circle>
        ))}

        {/* ========== OUTPUT: LED/LIGHT BULB ========== */}
        
        {/* Wire from Arduino to Light */}
        <motion.path
          d="M 600 395 L 900 395 Q 920 395 920 415 L 920 500"
          stroke="#ffff00"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 4 }}
        />

        {/* Control Signal to Light */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={`signal-led-${i}`}
            cx="0"
            cy="0"
            r="5"
            fill="#ffff00"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: 7 + i * 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <animateMotion
              dur="2s"
              begin={`${7 + i * 0.6}s`}
              repeatCount="indefinite"
              path="M 600 395 L 900 395 Q 920 395 920 415 L 920 500"
            />
          </motion.circle>
        ))}

        {/* Light Bulb Base */}
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 0.8 }}
        >
          {/* Bulb Socket */}
          <rect x="900" y="500" width="40" height="30" rx="3" fill="#888" stroke="#666" strokeWidth="2" />
          
          {/* Socket Threads */}
          {[...Array(4)].map((_, i) => (
            <line
              key={`thread-${i}`}
              x1="905"
              y1={505 + i * 6}
              x2="935"
              y2={505 + i * 6}
              stroke="#555"
              strokeWidth="1.5"
            />
          ))}

          {/* Bulb Glass */}
          <motion.ellipse
            cx="920"
            cy="470"
            rx="35"
            ry="45"
            fill="url(#bulb-gradient)"
            stroke="#ffd700"
            strokeWidth="2"
            animate={{
              fill: ["rgba(255, 255, 200, 0.3)", "rgba(255, 255, 100, 0.8)", "rgba(255, 255, 200, 0.3)"]
            }}
            transition={{ duration: 2, delay: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Filament */}
          <motion.path
            d="M 915 485 Q 920 475 925 485"
            stroke="#ff8800"
            strokeWidth="2"
            fill="none"
            animate={{
              stroke: ["#ff8800", "#ffff00", "#ff8800"],
              strokeWidth: [2, 3, 2]
            }}
            transition={{ duration: 2, delay: 8, repeat: Infinity }}
          />

          {/* Light Glow Effect */}
          <motion.circle
            cx="920"
            cy="470"
            r="50"
            fill="#ffff00"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{ duration: 2, delay: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.circle
            cx="920"
            cy="470"
            r="70"
            fill="#ffff00"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              scale: [0.8, 1.5, 0.8]
            }}
            transition={{ duration: 2, delay: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Light Rays */}
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={`ray-${i}`}
              x1="920"
              y1="470"
              x2={920 + Math.cos((i * Math.PI) / 4) * 80}
              y2={470 + Math.sin((i * Math.PI) / 4) * 80}
              stroke="#ffff00"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 2, 
                delay: 8 + i * 0.1, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.g>

        {/* Status Indicator */}
        <motion.text
          x="920"
          y="560"
          fill="#50fa7b"
          fontSize="12"
          textAnchor="middle"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ delay: 8, duration: 1 }}
        >
          LIGHT ON
        </motion.text>

        {/* ========== DATA FLOW LABELS ========== */}
        
        <motion.text
          x="380"
          y="320"
          fill="#8be9fd"
          fontSize="10"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2.5 }}
        >
          USB Upload
        </motion.text>

        <motion.text
          x="650"
          y="250"
          fill="#ff4444"
          fontSize="9"
          opacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 3.5 }}
        >
          Trigger Pin
        </motion.text>

        <motion.text
          x="650"
          y="270"
          fill="#ffaa00"
          fontSize="9"
          opacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 3.5 }}
        >
          Analog In
        </motion.text>

        <motion.text
          x="750"
          y="410"
          fill="#ffff00"
          fontSize="10"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 4.5 }}
        >
          Digital Out (PWM)
        </motion.text>

        {/* ========== SYSTEM FLOW DIAGRAM ========== */}
        
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 9 }}
        >
          {/* Flow Arrows */}
          <path d="M 190 390 L 190 450 L 420 450" stroke="#00ffff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" opacity="0.4" />
          <path d="M 800 330 L 650 330 L 650 340" stroke="#00ffff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" opacity="0.4" />
          <path d="M 800 370 L 720 370 L 720 340" stroke="#00ffff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" opacity="0.4" />
          <path d="M 600 395 L 700 395" stroke="#00ffff" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" opacity="0.4" />

          {/* Flow Labels */}
          <text x="300" y="465" fill="#00ffff" fontSize="8" opacity="0.5">Code Upload</text>
          <text x="680" y="325" fill="#00ffff" fontSize="8" opacity="0.5">Sensor Data</text>
          <text x="740" y="390" fill="#00ffff" fontSize="8" opacity="0.5">Control Signal</text>
        </motion.g>

        {/* Arrow Marker Definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#00ffff" />
          </marker>
          
          <linearGradient id="bulb-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffacd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* ========== BLUEPRINT CORNER MARKERS ========== */}
        
        {[[30, 60], [1370, 60], [30, 740], [1370, 740]].map(([x, y], i) => (
          <motion.g
            key={`marker-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <line x1={x} y1={y - 20} x2={x} y2={y + 20} stroke="#00ffff" strokeWidth="1.5" />
            <line x1={x - 20} y1={y} x2={x + 20} y2={y} stroke="#00ffff" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="3" fill="#00ffff" />
          </motion.g>
        ))}

        {/* Project Title */}
        <motion.text
          x="700"
          y="70"
          fill="#ffae00ff"
          fontSize="50"
          textAnchor="middle"
          fontWeight="bold"
          opacity="0.8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
Premium Engineering <br /> Project Solutions
        </motion.text>

        {/* System Status */}
        <motion.text
          x="700"
          y="750"
          fill="#50fa7b"
          fontSize="13"
          textAnchor="middle"
          fontWeight="bold"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.7] }}
          transition={{ delay: 9, duration: 2 }}
        >
        </motion.text>

        {/* ========== SCANNING LINE EFFECT ========== */}
        
        <motion.line
          x1="30"
          y1="400"
          x2="1370"
          y2="400"
          stroke="#00ffff"
          strokeWidth="1"
          opacity="0.15"
          animate={{ y1: [60, 740], y2: [60, 740] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
        />
<linearGradient id="box-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
  <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
</linearGradient>

      </svg>

      {/* Ambient Glow Effects */}
      <div className="absolute w-96 h-96 rounded-full blur-3xl bg-cyan-500/5 top-1/4 left-1/4"></div>
      <div className="absolute w-80 h-80 rounded-full blur-3xl bg-yellow-500/10 top-1/3 right-1/4"></div>
      <div className="absolute w-64 h-64 rounded-full blur-3xl bg-blue-500/5 bottom-1/4 left-1/2"></div>
    </div>
  );
}
