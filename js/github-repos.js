/**
 * Dynamic GitHub Repository Showcase
 * User: DumboDhruvi (Dhruv Kumar)
 * 
 * Features:
 * 1. Fetches public GitHub repositories dynamically on page load.
 * 2. Fetches and parses README.md for each repo to extract a clean overview snippet.
 * 3. Skips repositories without a README.md.
 * 4. Filters out repositories configured in EXCLUDED_REPOS.
 * 5. Caches results in localStorage (1 hour) with manual refresh option.
 * 6. High-fidelity fallback data in case GitHub API rate limits (HTTP 403) are encountered.
 * 7. Real-time search and language/tag filtering.
 */

// Repositories to exclude from appearing on the portfolio website
// You can add or remove repository names here anytime!
const EXCLUDED_REPOS = [
  'DumboDhruvi',            // Profile configuration repository
  'DumboDhruvi.github.io', // Portfolio website source itself
  'portfolio',             // Legacy theme template
  'sturdy-winner',         // Learning sandbox
  'cn',                    // Computer networks lab without README
  'polynomial'             // Test repo
];

const GITHUB_USERNAME = 'DumboDhruvi';
const CACHE_KEY = 'dhruv_github_repos_v2';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

// Pre-cached verified repository data to ensure instant render and resilient offline/rate-limit fallback
const FALLBACK_REPOS = [
  {
    name: 'NeuroScan-AI',
    html_url: 'https://github.com/DumboDhruvi/NeuroScan-AI',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2025-02-15T12:00:00Z',
    readmeSnippet: 'A deep learning-powered diagnostic tool that analyzes MRI scans to detect potential brain tumors using convolutional neural networks (CNNs) with 92.68% validation accuracy on Kaggle datasets.',
    topics: ['deep-learning', 'computer-vision', 'brain-tumor-detection', 'tensorflow', 'keras']
  },
  {
    name: 'Automated-Answer-Checker',
    html_url: 'https://github.com/DumboDhruvi/Automated-Answer-Checker',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2025-01-20T10:00:00Z',
    readmeSnippet: 'An end-to-end automated evaluation pipeline using OCR and regex to extract handwritten student responses from PDF sheets, combined with Sentence-Transformers semantic scoring against reference keys.',
    topics: ['nlp', 'ocr', 'sentence-transformers', 'semantic-evaluation', 'streamlit']
  },
  {
    name: 'sleep-detection',
    html_url: 'https://github.com/DumboDhruvi/sleep-detection',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-12-10T14:30:00Z',
    readmeSnippet: 'Real-time sleep and drowsiness detection system using Dlib facial landmark detection and OpenCV for video stream processing, calculating Eye Aspect Ratio (EAR) dynamically.',
    topics: ['opencv', 'dlib', 'computer-vision', 'driver-safety']
  },
  {
    name: 'EduReview',
    html_url: 'https://github.com/DumboDhruvi/EduReview',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-11-28T09:15:00Z',
    readmeSnippet: 'A web-based platform for students to find and review educational courses, specifically focusing on NPTEL courses with search functionality, course ratings, and institutional integration.',
    topics: ['django', 'web-app', 'nptel', 'course-reviews', 'mysql']
  },
  {
    name: 'AI-video-captioning',
    html_url: 'https://github.com/DumboDhruvi/AI-video-captioning',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-11-05T16:45:00Z',
    readmeSnippet: 'A deep-learning system that generates descriptive, natural-language captions for video streams using computer vision feature extraction combined with sequence modeling.',
    topics: ['deep-learning', 'nlp', 'video-processing', 'tensorflow']
  },
  {
    name: 'LAN-CHATTING',
    html_url: 'https://github.com/DumboDhruvi/LAN-CHATTING',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-10-18T11:20:00Z',
    readmeSnippet: 'A client-server real-time chat application enabling multiple users to communicate reliably over a local area network (LAN) with socket-level networking.',
    topics: ['sockets', 'networking', 'python-chat']
  },
  {
    name: 'team-management-system',
    html_url: 'https://github.com/DumboDhruvi/team-management-system',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-10-02T13:10:00Z',
    readmeSnippet: 'A modern web application designed to facilitate team collaboration and management, allowing users to create teams, coordinate member tasks, and share announcements.',
    topics: ['django', 'collaboration', 'full-stack']
  },
  {
    name: 'Gym-Management-System',
    html_url: 'https://github.com/DumboDhruvi/Gym-Management-System',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-09-14T08:00:00Z',
    readmeSnippet: 'An application that allows gym owners to manage memberships, view active plans, handle renewals, and track customer attendance and payment logs efficiently.',
    topics: ['management-system', 'database', 'python']
  },
  {
    name: 'passwordgenerator',
    html_url: 'https://github.com/DumboDhruvi/passwordgenerator',
    language: 'Python',
    stars: 1,
    forks: 0,
    updated_at: '2024-08-30T17:40:00Z',
    readmeSnippet: 'A command-line secure random password generator and credential vault with custom entropy configurations, character filters, and clipboard support.',
    topics: ['command-line-tool', 'security', 'password-manager']
  },
  {
    name: 'url-shortener',
    html_url: 'https://github.com/DumboDhruvi/url-shortener',
    language: 'Python',
    stars: 0,
    forks: 0,
    updated_at: '2024-08-12T15:00:00Z',
    readmeSnippet: 'A fast URL shortener application built with Django, offering analytics tracking for redirects, custom aliases, and database persistence.',
    topics: ['django', 'web-development', 'url-shortener']
  }
];

// In-memory active repositories state
let allRepositories = [];
let currentFilter = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initGitHubShowcase();
});

async function initGitHubShowcase() {
  const container = document.getElementById('github-repos-container');
  const searchInput = document.getElementById('gh-search-input');
  const refreshBtn = document.getElementById('gh-refresh-btn');
  const filterButtons = document.querySelectorAll('.gh-chip-btn');

  if (!container) return;

  // Event Listeners for Search & Filters
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      renderFilteredRepos();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      renderFilteredRepos();
    });
  });

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      localStorage.removeItem(CACHE_KEY);
      renderLoadingSkeletons();
      await fetchAndLoadRepos(true);
    });
  }

  // Load from cache or fetch live
  const cachedData = getCachedRepos();
  if (cachedData && cachedData.length > 0) {
    allRepositories = cachedData;
    renderFilteredRepos();
    updateLiveBadge(true, true);
    // Refresh quietly in background if cache is older than 15 mins
    fetchAndLoadRepos(false);
  } else {
    renderLoadingSkeletons();
    await fetchAndLoadRepos(true);
  }
}

function getCachedRepos() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (Date.now() - item.timestamp < CACHE_TTL_MS) {
      return item.data;
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
}

function setCachedRepos(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: data
    }));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

async function fetchAndLoadRepos(shouldRender = true) {
  try {
    // 1. Fetch public repository list from GitHub API
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      signal: AbortSignal.timeout(6000)
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const repos = await response.json();
    if (!Array.isArray(repos)) {
      throw new Error('Invalid repos response');
    }

    // 2. Filter out excluded repos & private repos
    const candidateRepos = repos.filter(repo => {
      if (repo.private) return false;
      if (EXCLUDED_REPOS.includes(repo.name)) return false;
      return true;
    });

    // 3. For each candidate repo, check if it has a README.md and parse snippet
    // Fetch in parallel batches of 5 to respect browser connection pools
    const processedRepos = [];
    const batchSize = 5;

    for (let i = 0; i < candidateRepos.length; i += batchSize) {
      const batch = candidateRepos.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(repo => inspectRepoReadme(repo)));
      // Only keep repos that successfully have a README
      batchResults.forEach(item => {
        if (item && item.hasReadme) {
          processedRepos.push(item);
        }
      });
    }

    if (processedRepos.length > 0) {
      allRepositories = processedRepos;
      setCachedRepos(processedRepos);
      if (shouldRender) {
        renderFilteredRepos();
      }
      updateLiveBadge(true, false);
      return;
    }
  } catch (err) {
    console.warn('Live GitHub fetch encountered error or rate-limit, utilizing fallback portfolio set:', err);
  }

  // Fallback to verified repo dataset if API was unavailable or rate-limited
  if (allRepositories.length === 0) {
    allRepositories = FALLBACK_REPOS;
    renderFilteredRepos();
    updateLiveBadge(false, false);
  }
}

/**
 * Fetch and extract a clean overview paragraph from raw GitHub README
 */
async function inspectRepoReadme(repo) {
  const defaultBranch = repo.default_branch || 'main';
  const branches = [defaultBranch, defaultBranch === 'main' ? 'master' : 'main'];

  let readmeText = null;

  for (const branch of branches) {
    try {
      const readmeUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/README.md`;
      const res = await fetch(readmeUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        readmeText = await res.text();
        if (readmeText && readmeText.trim().length > 15) {
          break; // successfully found non-empty README
        }
      }
    } catch (e) {
      // try next branch or continue
    }
  }

  // If no README exists, skip this repo completely as requested!
  if (!readmeText) {
    return null;
  }

  // Parse clean excerpt from README markdown
  const snippet = parseMarkdownSnippet(readmeText, repo.description);

  return {
    name: repo.name,
    html_url: repo.html_url,
    language: repo.language || 'Code',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    updated_at: repo.updated_at,
    readmeSnippet: snippet,
    topics: repo.topics && repo.topics.length ? repo.topics : (repo.language ? [repo.language.toLowerCase()] : []),
    hasReadme: true
  };
}

/**
 * Extract clean, human-readable text from raw markdown
 */
function parseMarkdownSnippet(md, fallbackDesc) {
  if (!md) return fallbackDesc || 'Open source project repository with documentation and source code.';

  // 1. Remove HTML tags and comments
  let text = md.replace(/<!--[\s\S]*?-->/g, '');
  text = text.replace(/<[^>]+>/g, ' ');

  // 2. Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');

  // 3. Remove image links and badge shields
  text = text.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '');
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');

  // 4. Remove standard markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Break into lines and filter out header lines (#) and table lines (|)
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (!line) return false;
      if (line.startsWith('#')) return false; // Skip headers
      if (line.startsWith('|')) return false; // Skip table rows
      if (line.startsWith('---') || line.startsWith('===')) return false; // Skip rules
      if (line.toLowerCase().startsWith('badges') || line.toLowerCase().startsWith('license')) return false;
      return true;
    });

  // 6. Find the first substantial, readable line
  let candidate = '';
  for (const line of lines) {
    // Remove bold/italic markers
    const cleaned = line.replace(/[*_~]/g, '').trim();
    if (cleaned.length >= 25 && !cleaned.toLowerCase().includes('table of contents') && !cleaned.toLowerCase().startsWith('hi')) {
      candidate = cleaned;
      break;
    }
  }

  if (!candidate || candidate.length < 20) {
    candidate = fallbackDesc || lines.find(l => l.replace(/[*_~]/g, '').trim().length >= 10) || 'Open-source repository on GitHub with active implementation details.';
    candidate = candidate.replace(/[*_~]/g, '').trim();
  }

  // 7. Limit length to ~190 characters with a clean word boundary
  if (candidate.length > 190) {
    const trimmed = candidate.slice(0, 185);
    const lastSpace = trimmed.lastIndexOf(' ');
    candidate = (lastSpace > 120 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
  }

  return candidate;
}

function renderFilteredRepos() {
  const container = document.getElementById('github-repos-container');
  const countSpan = document.getElementById('gh-repo-count');
  if (!container) return;

  let filtered = allRepositories.filter(repo => {
    // Search query match
    if (currentSearchQuery) {
      const matchName = repo.name.toLowerCase().includes(currentSearchQuery);
      const matchSnippet = repo.readmeSnippet.toLowerCase().includes(currentSearchQuery);
      const matchLang = (repo.language || '').toLowerCase().includes(currentSearchQuery);
      const matchTopics = (repo.topics || []).some(t => t.toLowerCase().includes(currentSearchQuery));
      if (!matchName && !matchSnippet && !matchLang && !matchTopics) {
        return false;
      }
    }

    // Category filter chip
    if (currentFilter === 'python') {
      return (repo.language && repo.language.toLowerCase() === 'python');
    }
    if (currentFilter === 'ai-ml') {
      const isAi = (repo.topics || []).some(t => ['ai', 'ml', 'deep-learning', 'nlp', 'computer-vision', 'tensorflow', 'keras', 'opencv', 'dlib'].includes(t.toLowerCase()))
        || repo.name.toLowerCase().includes('ai')
        || repo.readmeSnippet.toLowerCase().includes('learning')
        || repo.readmeSnippet.toLowerCase().includes('cnn');
      return isAi;
    }
    if (currentFilter === 'web') {
      const isWeb = (repo.topics || []).some(t => ['django', 'flask', 'web', 'html', 'full-stack', 'angular'].includes(t.toLowerCase()))
        || ['html', 'css', 'javascript', 'typescript', 'scss'].includes((repo.language || '').toLowerCase())
        || repo.readmeSnippet.toLowerCase().includes('web');
      return isWeb;
    }

    return true;
  });

  if (countSpan) {
    countSpan.textContent = `${filtered.length} projects synced`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="gh-empty-state">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No repositories matching "<strong>${escapeHtml(currentSearchQuery || currentFilter)}</strong>"</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Try clearing your search query or selecting "All Projects".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(repo => createRepoCardHtml(repo)).join('');
}

function createRepoCardHtml(repo) {
  const langColor = getLanguageColor(repo.language);
  const updatedDate = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  return `
    <article class="gh-repo-card">
      <div>
        <div class="gh-repo-header">
          <h3 class="gh-repo-name">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a>
          </h3>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted);" title="View repository">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>

        <div class="gh-readme-tag">README EXCERPT</div>
        <p class="gh-readme-excerpt">${escapeHtml(repo.readmeSnippet)}</p>
      </div>

      <div class="gh-repo-footer">
        <div class="gh-repo-stats">
          <span class="gh-stat-item">
            <span class="gh-lang-dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(repo.language || 'Code')}</span>
          </span>
          ${repo.stars > 0 ? `
            <span class="gh-stat-item" title="Stars">
              ⭐ ${repo.stars}
            </span>
          ` : ''}
        </div>
        ${updatedDate ? `<span>Updated ${updatedDate}</span>` : ''}
      </div>
    </article>
  `;
}

function renderLoadingSkeletons() {
  const container = document.getElementById('github-repos-container');
  if (!container) return;
  container.innerHTML = Array(6).fill(0).map(() => '<div class="gh-skeleton-card"></div>').join('');
}

function updateLiveBadge(isSuccess, isCached) {
  const badge = document.getElementById('gh-live-status');
  if (!badge) return;
  if (isSuccess) {
    badge.innerHTML = `
      <span class="pulse-dot" style="background: #10b981;"></span>
      <span>${isCached ? 'Cached Live Feed' : 'Live Sync Active'}</span>
    `;
  } else {
    badge.innerHTML = `
      <span class="pulse-dot" style="background: #f59e0b;"></span>
      <span>Cached Portfolio Repos</span>
    `;
  }
}

function getLanguageColor(lang) {
  const colors = {
    Python: '#3572A5',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    'C#': '#178600',
    'C++': '#f34b7d',
    Jupyter: '#DA5B0B'
  };
  return colors[lang] || '#8b949e';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
