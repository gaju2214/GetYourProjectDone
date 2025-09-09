import pkg from 'sitemap';
import fs from 'fs';
import path from 'path';

const { createSitemap } = pkg;

const hostname = 'https://www.getyourprojectdone.in';

// Static routes
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/categories', changefreq: 'weekly', priority: 0.8 },
  { url: '/projects', changefreq: 'daily', priority: 0.9 },
  { url: '/auth', changefreq: 'monthly', priority: 0.5 },
  { url: '/cart', changefreq: 'monthly', priority: 0.5 },
];

// Add your engineering categories
const categories = [
  'Electronics',
  'Software',
  'Mechanical',
  'Electrical',
  'Civil',
  'Mechatronics',
];

categories.forEach((category) => {
  urls.push({
    url: `/category/${category.toLowerCase()}`,
    changefreq: 'weekly',
    priority: 0.6,
  });
});

// Create sitemap
const sitemap = createSitemap({
  hostname,
  urls,
});

// Resolve public directory (no import.meta.url needed)
const publicDir = path.join(process.cwd(), 'public');

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap.xml
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap.toString());

console.log('✅ Sitemap generated successfully!');
