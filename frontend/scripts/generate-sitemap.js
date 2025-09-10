import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';
import path from 'path';

(async () => {
  const hostname = 'https://www.getyourprojectdone.in';

  // Static routes
  const urls = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/categories', changefreq: 'weekly', priority: 0.8 },
    { url: '/projects', changefreq: 'daily', priority: 0.9 },
    { url: '/auth', changefreq: 'monthly', priority: 0.5 },
    { url: '/cart', changefreq: 'monthly', priority: 0.5 },
  ];

  // Add categories
  const categories = [
  'Electronics',
  'Computer',
  'Electrical',
  'Robotics',
  'Mechanical',
  'IoT',
  ];

  categories.forEach((category) => {
    urls.push({
      url: `/category/${category.toLowerCase()}`,
      changefreq: 'weekly',
      priority: 0.6,
    });
  });
try {
    const backendUrl = process.env.VITE_BACKEND_URL || 'https://master.getyourprojectdone.in';

    // You can add dynamic fetching here if needed
    const response = await fetch(`${backendUrl}/api/projects`);
    const projects = await response.json();
    projects.forEach(project => {
      urls.push({
        url: `/project/${project.slug}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: project.updatedAt
      });
    });
  } catch (error) {
    console.warn('Could not fetch dynamic content, using static sitemap only');
  }

  // Create sitemap stream
  const sitemapStream = new SitemapStream({ hostname });

  // Write URLs
  urls.forEach((u) => sitemapStream.write(u));

  // End stream
  sitemapStream.end();

  // Convert to XML
  const sitemapXML = await streamToPromise(sitemapStream).then((sm) =>
    sm.toString()
  );

  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save sitemap.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXML);

   console.log('✅ Sitemap generated successfully!');
  console.log(`🌐 Will be accessible at: ${hostname}/sitemap.xml`);
})();
