import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../components/ui/Botton"; // Corrected import path

const SCALE_FACTOR = 1;

const networkData = [
  // Central Hub
  {
    id: "getyourprojectdone",
    label: "Get Your Project Done",
    x: 400,
    y: 300,
    category: "hub",
    color: "#dc2626",
    size: 25,
    connections: [
      "electronics",
      "mechanical",
      "electrical",
      "software",
      "civil",
      "mechatronics",
      "support",
      "documentation",
      "video-tutorials",
      "components",
    ],
  },
  // Central Hub
  {
    id: "getyourprojectdone",
    label: "Get Your Project Done",
    x: 400,
    y: 300,
    category: "hub",
    color: "#dc2626",
    size: 25,
    connections: [
      "electronics",
      "mechanical",
      "electrical",
      "software",
      "civil",
      "mechatronics",
    ],
  },

  // Main Categories
  {
    id: "electronics",
    label: "Electronics",
    x: 200,
    y: 150,
    category: "main",
    color: "#3b82f6",
    size: 18,
    connections: ["iot", "embedded", "automation", "power-electronics"],
  },
  {
    id: "mechanical",
    label: "Mechanical",
    x: 600,
    y: 150,
    category: "main",
    color: "#ef4444",
    size: 18,
    connections: ["cad", "manufacturing", "robotics-mech", "thermal"],
  },
  {
    id: "electrical",
    label: "Electrical",
    x: 150,
    y: 450,
    category: "main",
    color: "#f59e0b",
    size: 18,
    connections: [
      "power-systems",
      "control-systems",
      "circuits",
      "instrumentation",
    ],
  },
  {
    id: "software",
    label: "Software",
    x: 650,
    y: 450,
    category: "main",
    color: "#8b5cf6",
    size: 18,
    connections: ["web-dev", "mobile-apps", "ai-ml", "data-science"],
  },
  {
    id: "civil",
    label: "Civil",
    x: 100,
    y: 300,
    category: "main",
    color: "#10b981",
    size: 18,
    connections: [
      "structural",
      "environmental",
      "transportation",
      "geotechnical",
    ],
  },
  {
    id: "mechatronics",
    label: "Mechatronics",
    x: 700,
    y: 300,
    category: "main",
    color: "#f97316",
    size: 18,
    connections: [
      "robotics-mecha",
      "automation-mecha",
      "smart-systems",
      "control-eng",
    ],
  },

  // Electronics Subcategories
  {
    id: "iot",
    label: "IoT Projects",
    x: 80,
    y: 80,
    category: "sub",
    color: "#60a5fa",
    size: 12,
    connections: ["smart-home", "weather-station", "asset-tracking"],
  },
  {
    id: "embedded",
    label: "Embedded Systems",
    x: 320,
    y: 80,
    category: "sub",
    color: "#60a5fa",
    size: 12,
    connections: ["microcontroller", "fpga", "realtime"],
  },
  {
    id: "automation",
    label: "Automation",
    x: 120,
    y: 220,
    category: "sub",
    color: "#60a5fa",
    size: 12,
    connections: ["home-auto", "industrial-control"],
  },
  {
    id: "power-electronics",
    label: "Power Electronics",
    x: 280,
    y: 220,
    category: "sub",
    color: "#60a5fa",
    size: 12,
    connections: ["inverters", "battery-mgmt", "solar"],
  },

  // Mechanical Subcategories
  {
    id: "cad",
    label: "CAD Design",
    x: 520,
    y: 80,
    category: "sub",
    color: "#f87171",
    size: 12,
    connections: ["3d-modeling", "assembly"],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    x: 680,
    y: 80,
    category: "sub",
    color: "#f87171",
    size: 12,
    connections: ["cnc", "3d-printing"],
  },
  {
    id: "robotics-mech",
    label: "Robotics",
    x: 520,
    y: 220,
    category: "sub",
    color: "#f87171",
    size: 12,
    connections: ["robot-arms", "mobile-robots"],
  },
  {
    id: "thermal",
    label: "Thermal Systems",
    x: 680,
    y: 220,
    category: "sub",
    color: "#f87171",
    size: 12,
    connections: ["heat-exchangers", "cooling"],
  },

  // Software Subcategories
  {
    id: "web-dev",
    label: "Web Development",
    x: 580,
    y: 520,
    category: "sub",
    color: "#a78bfa",
    size: 12,
    connections: ["fullstack", "ecommerce"],
  },
  {
    id: "mobile-apps",
    label: "Mobile Apps",
    x: 720,
    y: 520,
    category: "sub",
    color: "#a78bfa",
    size: 12,
    connections: ["android", "ios"],
  },
  {
    id: "ai-ml",
    label: "AI/ML",
    x: 580,
    y: 380,
    category: "sub",
    color: "#a78bfa",
    size: 12,
    connections: ["computer-vision", "nlp"],
  },
  {
    id: "data-science",
    label: "Data Science",
    x: 720,
    y: 380,
    category: "sub",
    color: "#a78bfa",
    size: 12,
    connections: ["analytics", "visualization"],
  },

  // Services & Features
  {
    id: "support",
    label: "24/7 Support",
    x: 400,
    y: 150,
    category: "service",
    color: "#06b6d4",
    size: 14,
    connections: ["getyourprojectdone"],
  },
  {
    id: "documentation",
    label: "Documentation",
    x: 300,
    y: 350,
    category: "service",
    color: "#06b6d4",
    size: 14,
    connections: ["getyourprojectdone"],
  },
  {
    id: "video-tutorials",
    label: "Video Tutorials",
    x: 500,
    y: 350,
    category: "service",
    color: "#06b6d4",
    size: 14,
    connections: ["getyourprojectdone"],
  },
  {
    id: "components",
    label: "Premium Components",
    x: 400,
    y: 450,
    category: "service",
    color: "#06b6d4",
    size: 14,
    connections: ["getyourprojectdone"],
  },

  // Leaf nodes (specific projects/tools)
  {
    id: "smart-home",
    label: "Smart Home",
    x: 50,
    y: 30,
    category: "leaf",
    color: "#94a3b8",
    size: 8,
    connections: [],
  },
  {
    id: "weather-station",
    label: "Weather Station",
    x: 110,
    y: 30,
    category: "leaf",
    color: "#94a3b8",
    size: 8,
    connections: [],
  },
  {
    id: "microcontroller",
    label: "Microcontroller",
    x: 290,
    y: 30,
    category: "leaf",
    color: "#94a3b8",
    size: 8,
    connections: [],
  },
  {
    id: "fpga",
    label: "FPGA",
    x: 350,
    y: 30,
    category: "leaf",
    color: "#94a3b8",
    size: 8,
    connections: [],
  },
];

// A map for quick node lookups by ID, created once.
const nodeMap = new Map(networkData.map((node) => [node.id, node]));

export default function EngiProNetwork({ isOpen, onClose }) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Memoize the highlighted elements to avoid recalculating on every render
  const highlighted = useMemo(() => {
    if (!hoveredNodeId) return null;

    const highlightedNodes = new Set([hoveredNodeId]);
    const highlightedConnections = new Set();

    const mainNode = nodeMap.get(hoveredNodeId);
    if (mainNode) {
      // Highlight direct connections
      mainNode.connections.forEach((connId) => {
        highlightedNodes.add(connId);
        highlightedConnections.add(`${mainNode.id}-${connId}`);
      });
    }

    // Highlight reverse connections (nodes that connect TO the hovered node)
    networkData.forEach((node) => {
      if (node.connections.includes(hoveredNodeId)) {
        highlightedNodes.add(node.id);
        highlightedConnections.add(`${node.id}-${hoveredNodeId}`);
      }
    });

    return { nodes: highlightedNodes, connections: highlightedConnections };
  }, [hoveredNodeId]);

  // Framer Motion animation variants
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/logo.png"
                    alt="Get Your Project Done"
                    width={200}
                    height={45}
                    className="h-12 w-auto"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">Project Ecosystem</h2>
                    <p className="text-red-100 mt-1">
                      Explore our comprehensive engineering education platform
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Network Visualization using SVG */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-orange-50">
              <motion.svg
                viewBox="0 0 800 600"
                className="w-full h-[400px] border rounded-lg bg-white shadow-inner"
                variants={svgVariants}
                initial="hidden"
                animate="visible"
                onMouseLeave={() => setHoveredNodeId(null)} // Reset on leaving the SVG area
              >
                {/* Draw Connections (Lines) */}
                <g className="connections">
                  {networkData.map((node) =>
                    node.connections.map((connectionId) => {
                      const targetNode = nodeMap.get(connectionId);
                      if (!targetNode) return null;
                      const connectionKey = `${node.id}-${connectionId}`;
                      const isHighlighted =
                        highlighted?.connections.has(connectionKey);

                      return (
                        <motion.line
                          key={connectionKey}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="rgba(148, 163, 184, 0.8)"
                          variants={itemVariants}
                          animate={{
                            opacity: highlighted
                              ? isHighlighted
                                ? 1
                                : 0.1
                              : 0.5,
                            strokeWidth: isHighlighted ? 1.5 : 0.5,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })
                  )}
                </g>

                {/* Draw Nodes and Labels */}
                <g className="nodes">
                  {networkData.map((node) => {
                    const isHighlighted = highlighted?.nodes.has(node.id);
                    const isHovered = hoveredNodeId === node.id;
                    const scaledSize = node.size * SCALE_FACTOR;

                    return (
                      <motion.g
                        key={node.id}
                        variants={itemVariants}
                        onHoverStart={() => setHoveredNodeId(node.id)}
                        onClick={() => console.log(`Clicked on ${node.label}`)}
                        style={{ cursor: "pointer" }}
                        animate={{
                          scale: isHovered ? 1.2 : isHighlighted ? 1.05 : 1,
                          opacity: highlighted ? (isHighlighted ? 1 : 0.2) : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        {node.category === "hub" && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={scaledSize}
                            fill={node.color}
                            style={{
                              filter: `drop-shadow(0 0 8px ${node.color})`,
                            }}
                          />
                        )}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={scaledSize}
                          fill={node.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                        <text
                          x={node.x}
                          y={node.y + scaledSize + 10}
                          textAnchor="middle"
                          fill="#1f2937"
                           fontSize={
                            (node.category === "hub"
                              ? 18
                              : node.category === "main"
                              ? 14
                              : 11) * SCALE_FACTOR
                          }
                          fontWeight="500"
                          fontFamily="Inter, sans-serif"
                          style={{ pointerEvents: "none" }}
                        >
                          {node.label}
                        </text>
                      </motion.g>
                    );
                  })}
                </g>
              </motion.svg>
            </div>

            {/* Updated and more accurate Legend */}
            <div className="p-6 bg-gray-50 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">
                Network Legend
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#dc2626" }}
                  ></div>
                  <span>Main Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: "#06b6d4" }}
                  ></div>
                  <span>Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></div>
                  <span>Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: "#60a5fa" }}
                  ></div>
                  <span>Sub-Categories</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                Hover over any node to highlight its direct connections.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
