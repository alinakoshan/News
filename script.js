let articles = [];

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('themeSwitch');
  const sortSelect = document.getElementById('sortSelect');
  const searchInput = document.getElementById('searchInput');

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSwitch.checked = savedTheme === 'dark';

  themeSwitch.addEventListener('change', () => {
    const newTheme = themeSwitch.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  fetch('Articles.json')
    .then(res => res.json())
    .then(data => {
      articles = data.articles;
      renderArticles(articles);
      displayMostPopular();
    });

  sortSelect.addEventListener('change', () => {
    const sorted = sortArticles(articles, sortSelect.value);
    renderArticles(sorted);
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
    renderArticles(filtered);
  });
});

function sortArticles(list, method) {
  const sorted = [...list];
  if (method === 'views') {
    sorted.sort((a, b) => b.views - a.views);
  } else {
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return sorted;
}

function renderArticles(articleList) {
  const container = document.getElementById('articlesContainer');
  container.innerHTML = '';
  if (articleList.length === 0) {
    container.innerHTML = `<p>Nothing found.</p>`;
    return;
  }

  articleList.forEach(article => {
    const readingTime = Math.ceil(article.wordCount / 200);
    container.innerHTML += `
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5>${article.title}</h5>
            <small>${formatDate(article.date)} | ${article.category} | ${article.views} views</small>
            <p>${article.content.slice(0, 100)}...</p>
            <p><em>Approximate reading time: ${readingTime} min</em></p>
          </div>
        </div>
      </div>
    `;
  });
}

function displayMostPopular() {
  const most = articles.reduce((a, b) => (a.views > b.views ? a : b));
  const container = document.getElementById('most-popular');
  const readingTime = Math.ceil(most.wordCount / 200);
  container.innerHTML = `
    <h6>${most.title}</h6>
    <p>${formatDate(most.date)} - ${most.views} views</p>
    <p><em>Approximate reading time: ${readingTime} min</em></p>
    <p>${most.content.slice(0, 80)}...</p>
  `;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-En', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
