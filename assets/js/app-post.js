import { getPost } from './api.js';

function getLanguage() {
    return window.location.pathname.includes('/en/') ? 'en' : 'cs';
}

document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('post-content');
    if (postContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const lang = getLanguage();

        if (postId) {
            try {
                const post = await getPost(postId);
                renderPost(post, postContainer, lang);
            } catch (error) {
                console.error(error);
                postContainer.innerHTML = '<p>Nepodařilo se načíst příspěvek.</p>';
            }
        }
    }
});

function renderPost(post, container, lang) {
    if (!post) {
        container.innerHTML = '<p>Příspěvek nebyl nalezen.</p>';
        return;
    }

    const title = lang === 'en' ? post.title_en || post.title_cs : post.title_cs;
    const content = lang === 'en' ? post.content_en || post.content_cs : post.content_cs;
    const summary = lang === 'en' ? post.summary_en || post.summary_cs : post.summary_cs;
    const imageUrl = post.imageUrl;

    container.innerHTML = `
        <article class="blog-post-full">
            <header>
                <h1>${title}</h1>
                <p class="post-summary">${summary}</p>
            </header>
            ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="post-image">` : ''}
            <div class="post-body">${content}</div>
        </article>
    `;
}
