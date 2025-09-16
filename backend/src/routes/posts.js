import express from 'express';

import { query } from '../db.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

const postFields = [
  'title_cs',
  'summary_cs',
  'content_cs',
  'title_en',
  'summary_en',
  'content_en',
  'image_url',
  'published',
];

function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title_cs: row.title_cs,
    summary_cs: row.summary_cs,
    content_cs: row.content_cs,
    title_en: row.title_en,
    summary_en: row.summary_en,
    content_en: row.content_en,
    imageUrl: row.image_url,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildUpdateSet(post) {
  const updates = [];
  const values = [];
  postFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(post, field)) {
      updates.push(`${field} = $${updates.length + 1}`);
      values.push(post[field]);
    }
  });
  updates.push(`updated_at = NOW()`);
  return { updates, values };
}

router.get('/', optionalAuthenticate, async (req, res) => {
  try {
    const includeDrafts = req.user && req.query.includeDrafts === 'true';
    const params = [];
    let sql = `SELECT id, title_cs, summary_cs, content_cs, title_en, summary_en, content_en, image_url, published, created_at, updated_at FROM posts`;
    if (!includeDrafts) {
      sql += ' WHERE published = true';
    }
    sql += ' ORDER BY created_at DESC';

    const { rows } = await query(sql, params);
    res.json({ posts: rows.map(mapPost) });
  } catch (error) {
    console.error('Failed to fetch posts', error);
    res.status(500).json({ message: 'Nepodařilo se načíst příspěvky.' });
  }
});

router.get('/:id', optionalAuthenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query(
      `SELECT id, title_cs, summary_cs, content_cs, title_en, summary_en, content_en, image_url, published, created_at, updated_at FROM posts WHERE id = $1`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Příspěvek nebyl nalezen.' });
    }

    const post = mapPost(rows[0]);
    if (!post.published && !req.user) {
      return res.status(403).json({ message: 'Příspěvek není publikovaný.' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Failed to fetch post', error);
    res.status(500).json({ message: 'Nepodařilo se načíst příspěvek.' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const post = req.body || {};
  if (!post.title_cs || !post.summary_cs || !post.content_cs) {
    return res.status(400).json({ message: 'Titulek, shrnutí a obsah v češtině jsou povinné.' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO posts (title_cs, summary_cs, content_cs, title_en, summary_en, content_en, image_url, published, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       RETURNING id, title_cs, summary_cs, content_cs, title_en, summary_en, content_en, image_url, published, created_at, updated_at`,
      [
        post.title_cs,
        post.summary_cs,
        post.content_cs,
        post.title_en || null,
        post.summary_en || null,
        post.content_en || null,
        post.imageUrl || null,
        Boolean(post.published),
      ],
    );

    res.status(201).json({ post: mapPost(rows[0]) });
  } catch (error) {
    console.error('Failed to create post', error);
    res.status(500).json({ message: 'Nepodařilo se vytvořit příspěvek.' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const post = req.body || {};

  if (!post.title_cs || !post.summary_cs || !post.content_cs) {
    return res.status(400).json({ message: 'Titulek, shrnutí a obsah v češtině jsou povinné.' });
  }

  const updatePayload = {
    title_cs: post.title_cs,
    summary_cs: post.summary_cs,
    content_cs: post.content_cs,
    title_en: post.title_en || null,
    summary_en: post.summary_en || null,
    content_en: post.content_en || null,
    image_url: post.imageUrl || null,
    published: Boolean(post.published),
  };

  try {
    const { rows: existingRows } = await query('SELECT id FROM posts WHERE id = $1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Příspěvek neexistuje.' });
    }

    const { updates, values } = buildUpdateSet(updatePayload);
    values.push(id);

    const { rows } = await query(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING id, title_cs, summary_cs, content_cs, title_en, summary_en, content_en, image_url, published, created_at, updated_at`,
      values,
    );

    res.json({ post: mapPost(rows[0]) });
  } catch (error) {
    console.error('Failed to update post', error);
    res.status(500).json({ message: 'Nepodařilo se upravit příspěvek.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete post', error);
    res.status(500).json({ message: 'Nepodařilo se smazat příspěvek.' });
  }
});

export default router;
