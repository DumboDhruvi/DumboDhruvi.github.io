---
layout: inner
title: Projects
permalink: /projects/
---

# Projects

Explore some of the key projects I've worked on. Click on a project to learn more about it:

{% for project in site.projects %}
<div class="project-item">
  <h2><a href="{{ project.url }}">{{ project.title }}</a></h2>
  <p>{{ project.description }}</p>
  <p><strong>Technologies:</strong> {{ project.technologies | join: ", " }}</p>
  <a class="github-link" href="{{ project.project_link }}" target="_blank">View Source Code on GitHub</a>
</div>
{% endfor %}

Check back often to see my latest projects!
