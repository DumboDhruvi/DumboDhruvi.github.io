# Dhruv Kumar's Portfolio Website

This repository hosts my personal portfolio website, created with Jekyll. The website showcases my projects, blog posts, and professional background. 

## Table of Contents
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Customization](#customization)
- [Site Structure](#site-structure)
- [Deployment](#deployment)

---

## About
This portfolio website is a Jekyll-based static site. It is designed to present my projects and blogs in an organized, visually appealing way. The homepage provides an introduction, with links to my detailed projects and a blog site. The purpose of this site is to showcase my skills in AI and Data Science and share my blog posts on related topics.

## Features
- **Home Page**: Introduction with navigation to Projects and Blog sections.
- **Projects Page**: Dedicated section listing all my projects with detailed descriptions.
- **Blog**: Section for sharing blog posts and insights.
- **Customizable Navigation**: Easily update links in the navigation bar.
- **Responsive Design**: Optimized for mobile and desktop viewing.

## Installation
To set up this website locally, you need to have **Ruby** and **Jekyll** installed.

1. **Clone the repository**:
    ```bash
    git clone https://github.com/DumboDhruvi/portfolio-website.git
    cd portfolio-website
    ```

2. **Install dependencies**:
    Install the required Ruby gems:
    ```bash
    bundle install
    ```

3. **Serve the website**:
    Run Jekyll to serve the website locally:
    ```bash
    bundle exec jekyll serve
    ```
    Visit `http://localhost:4000` in your browser to view the site.

## Customization
Most site configurations can be adjusted in the `_config.yml` file. Here are some common options you may want to update:

- **Site Settings**: Set your name, email, and descriptions.
- **Social Links**: Update your Twitter, GitHub, and LinkedIn handles.
- **Navigation**: Adjust `nav_item` links in `_config.yml` for the pages you want in the header.

## Site Structure
The site has a simple structure:

- **Homepage**: `index.html` - Contains an introduction and links to Projects and Blog.
- **Projects**: `projects/` - Lists all the projects with individual project details.
- **Blog**: `_posts/` - Contains individual blog post markdown files.
- **Config File**: `_config.yml` - Main configuration file where site-wide settings can be adjusted.
  
## Deployment
1. **GitHub Pages**: If you plan to deploy on GitHub Pages, push the code to the `main` branch of your GitHub repository and make sure GitHub Pages is enabled in your repository settings.
2. **Other Hosting Services**: Alternatively, you can deploy the `_site` folder to any static site hosting provider, such as Netlify or Vercel.

## Contributing
Feel free to fork this repository, make improvements, and submit pull requests if you'd like to contribute. Any suggestions to improve functionality or design are welcome!

## License
This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
For any questions or feedback, reach me at `dhruv01112004@gmail.com`.

