const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const axios = require('axios'); // Add this import
const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = new SitemapStream({ 
      hostname: 'https://www.getyourprojectdone.in' 
    });
    
    // Static pages with consistent priorities
    const staticUrls = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/projects', changefreq: 'daily', priority: 0.9 },
      { url: '/categories', changefreq: 'weekly', priority: 0.8 },
      { url: '/auth', changefreq: 'monthly', priority: 0.3 },
      { url: '/cart', changefreq: 'monthly', priority: 0.3 },
      
      // Category pages - fixed URLs to match your routes
      { url: '/categories/electronics', changefreq: 'weekly', priority: 0.7 },
      { url: '/categories/mechanical', changefreq: 'weekly', priority: 0.7 },
      { url: '/categories/electrical', changefreq: 'weekly', priority: 0.7 },
      { url: '/categories/computer', changefreq: 'weekly', priority: 0.7 },
      { url: '/categories/mechatronics', changefreq: 'weekly', priority: 0.7 },
      { url: '/categories/robotics', changefreq: 'weekly', priority: 0.7 },
    ];

    // Add static URLs
    staticUrls.forEach(urlObj => {
      sitemap.write({
        ...urlObj,
        lastmod: new Date().toISOString()
      });
    });

    try {
      // Dynamic project pages - using axios for API calls
      const projectsResponse = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/projects`);
      
      if (projectsResponse.data && projectsResponse.data.length > 0) {
        projectsResponse.data.forEach(project => {
          sitemap.write({
            url: `/project/${project.slug || project.id}`,
            changefreq: 'monthly',
            priority: 0.6,
            lastmod: project.updatedAt ? new Date(project.updatedAt).toISOString() : new Date().toISOString()
          });
        });
      }
    } catch (projectError) {
      console.error('Error fetching projects for sitemap:', projectError.message);
      // Continue without projects if API fails
    }

    try {
      // Dynamic category pages - using axios for API calls  
      const categoriesResponse = await axios.get(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/categories/categoryall`);
      
      if (categoriesResponse.data && categoriesResponse.data.length > 0) {
        categoriesResponse.data.forEach(category => {
          sitemap.write({
            url: `/category/${category.slug || category.name.toLowerCase() || category.id}`,
            changefreq: 'weekly',
            priority: 0.5,
            lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date().toISOString()
          });
        });
      }
    } catch (categoryError) {
      console.error('Error fetching categories for sitemap:', categoryError.message);
      // Continue without dynamic categories if API fails
    }

    sitemap.end();
    const sitemapXML = await streamToPromise(sitemap);
    
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(sitemapXML.toString());
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap generation failed</error>');
  }
});

module.exports = router;
