const { sequelize, Author, Blog, Comment, BlogLike } = require("../models");
const slugify = require("slugify");

const seed = async () => {
  try {
    console.log("🌱 Syncing database...");
    await sequelize.sync({ alter: true });

    console.log("🧹 Cleaning existing blog tables...");
    await Comment.destroy({ where: {} });
    await BlogLike.destroy({ where: {} });
    await Blog.destroy({ where: {} });
    await Author.destroy({ where: {} });

    console.log("✍️ Seeding authors...");
    const author1 = await Author.create({
      name: "Er. Amit Sharma",
      designation: "Embedded Systems Engineer",
      bio: "Amit has 8+ years of experience designing embedded solutions, wireless IoT nodes, and custom microcontroller boards. He specializes in low-power firmware development.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      socialLinks: {
        linkedin: "https://linkedin.com/in/amit-sharma-dummy",
        twitter: "https://twitter.com/amit_iot_dummy"
      }
    });

    const author2 = await Author.create({
      name: "Dr. Rachel Green",
      designation: "Senior Hardware Architect",
      bio: "Rachel holds a PhD in Microelectronics and is a seasoned PCB layout professional. She regularly publishes tutorials on high-speed routing, signal integrity, and EMI shielding.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      socialLinks: {
        linkedin: "https://linkedin.com/in/rachel-green-dummy",
        twitter: "https://twitter.com/rachel_pcb_dummy"
      }
    });

    const author3 = await Author.create({
      name: "Prof. Rajesh Patel",
      designation: "Robotics Professor",
      bio: "Prof. Patel leads the Robotics Research Group at a premier technical institute. He is a prominent open-source contributor to the ROS (Robot Operating System) ecosystem.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      socialLinks: {
        linkedin: "https://linkedin.com/in/rajesh-patel-dummy",
        twitter: "https://twitter.com/rajesh_ros_dummy"
      }
    });

    console.log("📚 Seeding blog posts...");

    // Blog 1: Top 5 Microcontrollers for IoT Projects in 2026
    const blog1Title = "Top 5 Microcontrollers for IoT Projects in 2026";
    const blog1Slug = slugify(blog1Title, { lower: true, strict: true });
    await Blog.create({
      title: blog1Title,
      slug: blog1Slug,
      category: "IoT & Wireless",
      excerpt: "An in-depth comparison of ESP32, Raspberry Pi Pico W, STM32, Arduino Nano IoT, and Particle Boron for smart systems.",
      featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
      authorId: author1.id,
      publishedAt: new Date("2026-08-05T00:00:00Z"),
      readTime: "6 min read",
      tags: ["IoT", "Microcontrollers", "ESP32", "Arduino"],
      status: "published",
      isFeatured: true,
      tableOfContents: [
        { id: "intro", text: "Introduction to 2026 IoT Hardware" },
        { id: "esp32s3", text: "1. Espressif ESP32-S3" },
        { id: "picow", text: "2. Raspberry Pi Pico W" },
        { id: "comparison", text: "Hardware Specs Comparison Table" },
        { id: "code", text: "Connecting ESP32 to Wi-Fi" }
      ],
      keyTakeaways: [
        "Select the ESP32-S3 for applications requiring Wi-Fi 5/Bluetooth LE and Edge AI acceleration.",
        "Choose the Raspberry Pi Pico W for educational projects and custom hardware interface emulation via PIO blocks.",
        "Ensure secure boot is enabled on production IoT nodes to prevent firmware theft."
      ],
      content: [
        {
          type: "heading",
          level: 2,
          text: "Introduction to 2026 IoT Hardware"
        },
        {
          type: "paragraph",
          text: "Selecting the right microcontroller is the critical foundation of any Internet of Things (IoT) project. In 2026, the microcontroller landscape has matured with highly integrated System-on-Chip (SoC) designs offering dual-core processing, hardware-accelerated encryption, and ultra-low power sleep states. Here, we analyze the top choices for engineers."
        },
        {
          type: "heading",
          level: 2,
          text: "1. Espressif ESP32-S3"
        },
        {
          type: "paragraph",
          text: "The ESP32-S3 is a powerful dual-core XTensa LX7 MCU running at up to 240 MHz. It has built-in Wi-Fi 4 and Bluetooth 5 (LE) radio interfaces, alongside vector instructions for neural network computing. This makes it the industry standard for smart home hubs, camera streams, and localized Edge AI workloads."
        },
        {
          type: "callout",
          variant: "tip",
          title: "DEVELOPER TIP",
          text: "Always enable flash encryption and secure boot on the ESP32-S3 to protect your network credentials and prevent reverse-engineering of firmware in production."
        },
        {
          type: "heading",
          level: 2,
          text: "2. Raspberry Pi Pico W"
        },
        {
          type: "paragraph",
          text: "Powered by the custom RP2040 chip and paired with an Infineon CYW43439 wireless transceiver, the Raspberry Pi Pico W offers exceptional documentation, dual ARM Cortex-M0+ cores, and Programmable I/O (PIO) state machines. The PIO block allows you to emulate custom protocols (like WS2812B LEDs or custom screen interfaces) without taxing the main CPU cores."
        },
        {
          type: "heading",
          level: 2,
          text: "Hardware Specs Comparison Table"
        },
        {
          type: "table",
          headers: ["MCU Name", "Cores", "Clock Speed", "Connectivity", "Primary Use Case"],
          rows: [
            ["ESP32-S3", "Dual XTensa LX7", "240 MHz", "Wi-Fi + BLE", "Edge AI & Smart Home"],
            ["RP2040 (Pico W)", "Dual Cortex-M0+", "133 MHz", "Wi-Fi + BLE", "Prototypes & PIO Emulation"],
            ["STM32WB55", "Dual Cortex-M4/M0+", "64 MHz", "BLE + Zigbee", "Industrial Mesh Networks"],
            ["Arduino Nano IoT", "SAMD21 + NINA", "48 MHz", "Wi-Fi + BLE", "Simple Cloud Logging"]
          ]
        },
        {
          type: "heading",
          level: 2,
          text: "Connecting ESP32 to Wi-Fi"
        },
        {
          type: "paragraph",
          text: "The following code illustrates how to establish a robust local Wi-Fi connection using ESP32's native library in C++ / Arduino IDE:"
        },
        {
          type: "code",
          language: "cpp",
          code: `#include <WiFi.h>

const char* ssid = "Your_SSID";
const char* password = "Your_Password";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n✅ Wi-Fi Connected successfully!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Connection validation logic...
}`
        }
      ]
    });

    // Blog 2: Step-by-Step Guide to Designing Your First Custom PCB
    const blog2Title = "Step-by-Step Guide to Designing Your First Custom PCB";
    const blog2Slug = slugify(blog2Title, { lower: true, strict: true });
    await Blog.create({
      title: blog2Title,
      slug: blog2Slug,
      category: "Hardware Design",
      excerpt: "From schematic capture to PCB layout, routing rules, and generating gerber files for fabrication. Everything you need to know.",
      featuredImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200",
      authorId: author2.id,
      publishedAt: new Date("2026-07-28T00:00:00Z"),
      readTime: "8 min read",
      tags: ["PCB", "Hardware Design", "EasyEDA", "Electronics"],
      status: "published",
      isFeatured: false,
      tableOfContents: [
        { id: "schematic", text: "1. Schematic Capture & Symbol Placement" },
        { id: "layout", text: "2. Board Layout and Component Positioning" },
        { id: "routing", text: "3. Routing Rules & Trace Widths" },
        { id: "gerber", text: "4. DRC and Generating Gerber Files" }
      ],
      keyTakeaways: [
        "Place decoupling capacitors as close to chip power pins as possible.",
        "Keep high-frequency signal traces short and direct to reduce electromagnetic interference (EMI).",
        "Always run a Design Rule Check (DRC) matching the board fabricator's rules before export."
      ],
      content: [
        {
          type: "heading",
          level: 2,
          text: "1. Schematic Capture & Symbol Placement"
        },
        {
          type: "paragraph",
          text: "Before laying out copper tracks on a physical board, you must create a logical map of your circuit. In schematic capture, you select symbols for microcontrollers, resistors, and capacitors, and connect them with netlines. The schematic does not represent physical sizes, but maps electrical connections precisely."
        },
        {
          type: "heading",
          level: 2,
          text: "2. Board Layout and Component Positioning"
        },
        {
          type: "paragraph",
          text: "Once the schematic is compiled, you import the netlist into the board layout editor. Here, components are represented by physical footprints. Place components strategically: decoupling capacitors must sit close to IC supply pins, while power regulation circuits should be clustered to restrict heat dissipation zones."
        },
        {
          type: "callout",
          variant: "tip",
          title: "PCB LAYOUT TIP",
          text: "Keep decoupling capacitors within 1-2mm of power pins. Leaving long leads creates parasitic inductance that diminishes the capacitor's ability to filter high-frequency noise."
        },
        {
          type: "heading",
          level: 2,
          text: "3. Routing Rules & Trace Widths"
        },
        {
          type: "paragraph",
          text: "Routing connects the components using copper traces. Trace width is directly proportional to current rating. Standard signal traces can be 6-10 mil (0.15-0.25 mm) wide, but power rails and ground return tracks must be thicker to handle current spikes and prevent thermal damage."
        },
        {
          type: "heading",
          level: 2,
          text: "4. DRC and Generating Gerber Files"
        },
        {
          type: "paragraph",
          text: "Before submitting files to manufacturing houses, you must execute a Design Rule Check (DRC). The DRC scans your board layout for minimum track gaps, trace collisions, and via sizing. Finally, export Gerber files, NC drill files, and pick-and-place lists for professional assembly."
        }
      ]
    });

    // Blog 3: Why ROS is Essential for Modern Robotics Projects
    const blog3Title = "Why ROS is Essential for Modern Robotics Projects";
    const blog3Slug = slugify(blog3Title, { lower: true, strict: true });
    await Blog.create({
      title: blog3Title,
      slug: blog3Slug,
      category: "Robotics",
      excerpt: "Discover the power of Robot Operating System (ROS) and how it simplifies node communication, sensor interfacing, and path planning.",
      featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200",
      authorId: author3.id,
      publishedAt: new Date("2026-07-15T00:00:00Z"),
      readTime: "7 min read",
      tags: ["Robotics", "ROS", "Python", "Sensors"],
      status: "published",
      isFeatured: false,
      tableOfContents: [
        { id: "rosintro", text: "Understanding the ROS Architecture" },
        { id: "nodes", text: "Nodes, Publishers, and Subscribers" },
        { id: "codeexample", text: "Python ROS2 Node Code Example" }
      ],
      keyTakeaways: [
        "ROS is a middleware framework, not a standalone operating system, running on top of Linux.",
        "It coordinates hardware nodes through a publish/subscribe communication pattern.",
        "ROS allows quick integration of advanced path planning libraries like Nav2."
      ],
      content: [
        {
          type: "heading",
          level: 2,
          text: "Understanding the ROS Architecture"
        },
        {
          type: "paragraph",
          text: "The Robot Operating System (ROS) is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that simplify the task of creating complex and robust robotic behavior across a wide variety of robotic platforms. Instead of writing low-level drivers for motors, lidar, and cameras, ROS provides standardized driver nodes."
        },
        {
          type: "heading",
          level: 2,
          text: "Nodes, Publishers, and Subscribers"
        },
        {
          type: "paragraph",
          text: "ROS uses a decentralized node architecture. Each software process (e.g., sensor driver, path planner, wheel controller) represents a single Node. Nodes communicate with each other by passing messages over Topics using a publisher-subscriber model."
        },
        {
          type: "heading",
          level: 2,
          text: "Python ROS2 Node Code Example"
        },
        {
          type: "paragraph",
          text: "The following script demonstrates how to define a basic talker node in Python that publishes a message every second:"
        },
        {
          type: "code",
          language: "python",
          code: `import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 1.0  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello Robotics World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()`
        }
      ]
    });

    console.log("🎉 Seeding complete! Database synced with 3 authors and 3 initial blogs.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
