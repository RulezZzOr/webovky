import {
  login,
  logout,
  getCurrentUser,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from './api.js';

function renderAdminPosts(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = '<tr><td colspan="3">Žádné příspěvky</td></tr>';
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <tr>
            <td>${post.title_cs}</td>
            <td>${post.published ? 'Publikováno' : 'Koncept'}</td>
            <td>
                <button class="edit-btn" data-id="${post.id}">Upravit</button>
                <button class="delete-btn" data-id="${post.id}">Smazat</button>
            </td>
        </tr>
      `,
    )
    .join('');
}

function fillFormFromPost(post) {
  document.getElementById('post-id').value = post?.id || '';
  document.getElementById('post-title_cs').value = post?.title_cs || '';
  document.getElementById('post-title_en').value = post?.title_en || '';
  document.getElementById('post-summary_cs').value = post?.summary_cs || '';
  document.getElementById('post-summary_en').value = post?.summary_en || '';
  document.getElementById('post-content_cs').value = post?.content_cs || '';
  document.getElementById('post-content_en').value = post?.content_en || '';
  document.getElementById('post-image-url').value = post?.imageUrl || '';
  document.getElementById('post-published').checked = Boolean(post?.published);
}

function showMessage(target, message, isError = false) {
  if (!target) return;
  target.textContent = message || '';
  target.classList.toggle('error', Boolean(isError));
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-btn');
  const authContainer = document.getElementById('auth-container');
  const adminContent = document.getElementById('admin-content');
  const userEmailSpan = document.getElementById('user-email');
  const postsList = document.getElementById('posts-list');
  const postForm = document.getElementById('post-form');
  const formTitle = document.getElementById('form-title');
  const cancelButton = document.getElementById('cancel-edit');
  const loginMessage = document.getElementById('login-message');
  const postFormMessage = document.getElementById('post-form-message');

  let posts = [];
  let loadingPosts = false;

  async function updateAuthUi() {
    const user = await getCurrentUser();
    if (user) {
      if (authContainer) authContainer.classList.add('hidden');
      if (adminContent) adminContent.classList.remove('hidden');
      if (userEmailSpan) userEmailSpan.textContent = user.email;
      await loadPosts();
    } else {
      if (authContainer) authContainer.classList.remove('hidden');
      if (adminContent) adminContent.classList.add('hidden');
      if (userEmailSpan) userEmailSpan.textContent = '';
      posts = [];
      if (postsList) renderAdminPosts(posts, postsList);
    }
  }

  async function loadPosts() {
    if (!postsList || loadingPosts) return;
    loadingPosts = true;
    showMessage(postFormMessage, '');
    try {
      posts = await getPosts({ includeDrafts: true });
      renderAdminPosts(posts, postsList);
    } catch (error) {
      console.error(error);
      postsList.innerHTML = '<tr><td colspan="3">Nepodařilo se načíst příspěvky.</td></tr>';
    } finally {
      loadingPosts = false;
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      showMessage(loginMessage, '');
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      try {
        await login(email, password);
        loginForm.reset();
        await updateAuthUi();
      } catch (error) {
        console.error(error);
        showMessage(loginMessage, error.message || 'Přihlášení selhalo.', true);
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      logout();
      updateAuthUi();
    });
  }

  if (postForm) {
    postForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      showMessage(postFormMessage, '');
      const id = document.getElementById('post-id').value;

      const post = {
        title_cs: document.getElementById('post-title_cs').value.trim(),
        title_en: document.getElementById('post-title_en').value.trim(),
        summary_cs: document.getElementById('post-summary_cs').value.trim(),
        summary_en: document.getElementById('post-summary_en').value.trim(),
        content_cs: document.getElementById('post-content_cs').value,
        content_en: document.getElementById('post-content_en').value,
        imageUrl: document.getElementById('post-image-url').value.trim(),
        published: document.getElementById('post-published').checked,
      };

      try {
        if (id) {
          await updatePost(id, post);
        } else {
          await createPost(post);
        }
        showMessage(postFormMessage, 'Příspěvek byl uložen.');
        postForm.reset();
        document.getElementById('post-id').value = '';
        formTitle.textContent = 'Nový příspěvek';
        if (cancelButton) {
          cancelButton.style.display = 'none';
        }
        await loadPosts();
      } catch (error) {
        console.error(error);
        showMessage(postFormMessage, error.message || 'Nepodařilo se uložit příspěvek.', true);
      }
    });
  }

  if (postsList) {
    postsList.addEventListener('click', async (event) => {
      const target = event.target;
      if (target.classList.contains('edit-btn')) {
        const id = target.dataset.id;
        try {
          const post = await getPost(id);
          fillFormFromPost(post);
          formTitle.textContent = 'Upravit příspěvek';
          if (cancelButton) {
            cancelButton.style.display = 'inline-block';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error(error);
          showMessage(postFormMessage, error.message || 'Nepodařilo se načíst příspěvek.', true);
        }
      }

      if (target.classList.contains('delete-btn')) {
        const id = target.dataset.id;
        if (confirm('Opravdu chcete smazat tento příspěvek?')) {
          try {
            await deletePost(id);
            await loadPosts();
          } catch (error) {
            console.error(error);
            showMessage(postFormMessage, error.message || 'Nepodařilo se smazat příspěvek.', true);
          }
        }
      }
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      postForm.reset();
      document.getElementById('post-id').value = '';
      formTitle.textContent = 'Nový příspěvek';
      if (cancelButton) {
        cancelButton.style.display = 'none';
      }
      showMessage(postFormMessage, '');
    });
  }

  updateAuthUi();
});
