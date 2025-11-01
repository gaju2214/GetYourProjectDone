import React from "react";
import { motion } from "framer-motion";

export default function AnimatedBuildScene() {
  return (
    <div className="relative w-full h-auto md:h-[90vh] bg-050810 overflow-hidden flex items-center justify-center">
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
        <motion.path
          d="M 510 340 L 510 400"
          stroke="#666"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
        />

        {/* LARGE EMPTY SPACE - 120px gap */}

        {/* ULTRASONIC SENSOR - CENTER-LEFT (After Large Gap) */}



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
