---
layout: inner
title: Blog
permalink: /blog/
---

# Blog

Welcome to my blog, where I share my thoughts on AI, data science, engineering, and more!

{% for post in site.posts %}
- **[{{ post.title }}]({{ post.url }})** - {{ post.date | date: "%B %d, %Y" }}
  - {{ post.excerpt }}
{% endfor %}
