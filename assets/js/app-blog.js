import { getPosts } from './api.js';

function getLanguage() {
    return window.location.pathname.includes('/en/') ? 'en' : 'cs';
}

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('blog-posts');
    if (postsContainer) {
        const lang = getLanguage();
        try {
            const posts = await getPosts();
            renderPosts(posts, postsContainer, lang);
        } catch (error) {
            console.error(error);
            postsContainer.innerHTML = '<p>Nepodařilo se načíst příspěvky.</p>';
        }
    }
});

function renderPosts(posts, container, lang) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>Žádné příspěvky k zobrazení.</p>';
        return;
    }

    const postsHTML = posts.map((post) => {
        const title = lang === 'en' ? post.title_en || post.title_cs : post.title_cs;
        const summary = lang === 'en' ? post.summary_en || post.summary_cs : post.summary_cs;
        const imageUrl = post.imageUrl || 'https://via.placeholder.com/400x250';

        return `
            <div class="blog-post">
                <img src="${imageUrl}" alt="${title}" class="blog-post-image">
                <div class="blog-post-content">
                    <h3><a href="post.html?id=${post.id}">${title}</a></h3>
                    <p>${summary}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Přečíst více</a>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = postsHTML;
}
