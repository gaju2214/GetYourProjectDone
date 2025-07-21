const { Project } = require('../models');
const slugify = require('slugify');

(async () => {
  const projects = await Project.findAll();

  for (const project of projects) {
    if (!project.slug) {
      const slug = slugify(project.title, { lower: true, strict: true }) + '-';
      project.slug = slug;
      await project.save();
      console.log(`Updated slug for project ${project.title} => ${slug}`);
    }
  }

  console.log('Slug generation complete.');
})();
