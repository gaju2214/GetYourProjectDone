const { sequelize, Category, Subcategory, Project } = require("../models");
const slugify = require("slugify");

const generateSlug = (name) =>
  name.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/-+/g, "-");

const uniqueProjectSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  let counter = 1;
  const original = slug;
  while (await Project.findOne({ where: { slug } })) {
    slug = `${original}-${counter}`;
    counter++;
  }
  return slug;
};

const ensureCategory = async (name) => {
  const slug = generateSlug(name);
  const [category] = await Category.findOrCreate({ where: { slug }, defaults: { name, slug } });
  return category;
};

const ensureSubcategory = async (name, categoryId) => {
  const slug = generateSlug(name);
  const [subcategory] = await Subcategory.findOrCreate({
    where: { slug, categoryId },
    defaults: { name, slug, categoryId },
  });
  return subcategory;
};

const ensureProject = async (data) => {
  const existing = await Project.findOne({ where: { title: data.title, subcategoryId: data.subcategoryId } });
  if (existing) return existing;
  const slug = await uniqueProjectSlug(data.title);
  return Project.create({ ...data, slug });
};

const seed = async () => {
  try {
    console.log("Syncing database...");
    await sequelize.sync();

    console.log("Seeding DIY Project Kit category...");
    const diyCategory = await ensureCategory("DIY Project Kit");
    const diySub = await ensureSubcategory("Starter Kits", diyCategory.id);

    await ensureProject({
      title: "Home Automation DIY Kit",
      description: "Build a smart home automation system controlling lights and appliances via a mobile app.",
      price: 1499,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600",
      subcategoryId: diySub.id,
      components: ["ESP32", "Relay Module", "Sensors", "Wires", "Breadboard"],
      details: "Step-by-step guide with wiring diagrams, source code, and mobile app APK.",
      review: "Great beginner project, easy to follow instructions.",
      difficulty: "Beginner",
    });

    await ensureProject({
      title: "Weather Monitoring DIY Kit",
      description: "Track temperature, humidity, and air quality with a live dashboard.",
      price: 1299,
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600",
      subcategoryId: diySub.id,
      components: ["Arduino", "DHT11 Sensor", "OLED Display", "Wires"],
      details: "Includes full build guide, circuit diagram, and Arduino source code.",
      review: "Well documented and fun to build.",
      difficulty: "Intermediate",
    });

    console.log("Seeding Engineering Kit category...");
    const engCategory = await ensureCategory("Engineering Kit");
    const engSub = await ensureSubcategory("IoT Kits", engCategory.id);

    await ensureProject({
      title: "Industrial IoT Monitoring Kit",
      description: "Professional-grade kit for monitoring industrial equipment using IoT sensors and cloud dashboards.",
      price: 3999,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
      subcategoryId: engSub.id,
      components: ["ESP32", "RFID", "Bluetooth Module", "Industrial Sensors", "Enclosure"],
      details: "Complete build kit with blueprints, full source code repository, and expert support.",
      review: "Solid engineering-grade documentation and components.",
      difficulty: "Advanced",
    });

    await ensureProject({
      title: "Smart Robotics Engineering Kit",
      description: "Build an autonomous robot with obstacle avoidance and remote control using Raspberry Pi.",
      price: 4599,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
      subcategoryId: engSub.id,
      components: ["Raspberry Pi", "Motor Driver", "Ultrasonic Sensors", "Chassis", "IoT Module"],
      details: "Full engineering documentation, block diagrams, and source code repository included.",
      review: "Advanced kit, great for final year projects.",
      difficulty: "Advanced",
    });

    console.log("Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
