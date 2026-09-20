# Dhruv Kumar — Personal Portfolio & Showcase

A modern, responsive personal portfolio website for **Dhruv Kumar**, Graduate Trainee Engineer at Siemens, specializing in Applied AI, Computer Vision, and Enterprise Software Systems.

Live site: [dumbodhruvi.github.io](https://dumbodhruvi.github.io)

---

## Highlights & Features

- **Enterprise & Professional Background**: Highlights career experience at **Siemens Technology & Services** (enterprise physical access-control systems, C#, Angular, TypeScript, agentic AI workflows) and **Scalefull Technologies** (LSTM financial ML).
- **Academic & Research Honors**: Features B.E. in AI & Data Science (CGPA 8.44), GATE DSAI 2025 (AIR 6259), published plant disease CNN research (95.26% accuracy), and LeetCode peak contest rating of 1649 (Top 16%).
- **⚡ Dynamic GitHub Showcase with Live README Extraction**:
  - Automatically fetches all public repositories via the GitHub REST API.
  - Queries `README.md` for each repository to extract a clean, human-readable summary excerpt.
  - Automatically **skips** repositories that do not have a `README.md`.
  - Configurable `EXCLUDED_REPOS` blacklist so internal or unwanted repos never appear.
  - Client-side `localStorage` caching (1 hour) with manual "Refresh" button and resilient fallback data if rate limits are reached.
  - Real-time client-side search and category filtering (Python, AI & ML, Web & Apps).
- **Modern UI & Responsive Design**:
  - Obsidian dark mode default with light mode toggle (persisted across visits).
  - Glassmorphic navigation bar with scroll blur and active section spy.
  - Direct bundled resume download (`assets/Dhruv_Kumar_Resume.pdf`).
  - Interactive copy-to-clipboard email action with toast notification.
  - 100% pure static web (HTML5, CSS3, ES6+ JS) — zero build steps or Ruby/Jekyll dependencies required.

---

## Project Structure

```
├── .nojekyll                 # Ensures GitHub Pages serves static files directly
├── assets/
│   ├── avatar.jpg            # Square avatar
│   ├── profile.jpg           # Profile photo
│   └── Dhruv_Kumar_Resume.pdf# Bundled latest resume PDF
├── css/
│   └── style.css             # Obsidian Slate design system & responsive styling
├── js/
│   ├── app.js                # Core interactions: theme switcher, mobile menu, toast
│   └── github-repos.js       # Dynamic GitHub repo sync & README markdown parser
├── img/                      # Legacy and auxiliary images
├── index.html                # Main portfolio single-page application
└── README.md
```

---

## How to Configure Excluded Repositories

To hide any repository from showing up on the portfolio website:
Open `js/github-repos.js` and add the repository name to `EXCLUDED_REPOS`:

```javascript
const EXCLUDED_REPOS = [
  'DumboDhruvi',
  'DumboDhruvi.github.io',
  'portfolio',
  'sturdy-winner',
  'cn',
  'polynomial',
  'your-repo-to-hide' // <--- add any repo name here
];
```

---

## Local Development

Run any static HTTP server from the root of this repository:

```bash
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080` in your web browser.
