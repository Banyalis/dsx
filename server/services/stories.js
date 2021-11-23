const mysql = require('mysql');
const _ = require('lodash');

const config = require('../../config');
const storage = require('../storage');

const Stories = {
    postsTable: config.blog.postsTable,
    listFields: [
        'id' ,
        'title',
        'slug',
        'custom_excerpt',
        'feature_image',
        'published_at',
        'plaintext'
    ],
    fields: [
        'id' ,
        'title',
        'slug',
        'html',
        'feature_image',
        'published_at',
        'plaintext',
        'meta_title',
        'meta_description',
    ],

    async listPosts({offset, limit, tags, search}) {
        const order = 'created_at DESC';

        const conds = ['posts.status = \'published\''];

        if (tags) {
            conds.push(`tags.name = lower(${storage.escape(tags)})`);
        }

        if (search) {
            search = storage.sanitizeSearch(search);
            conds.push(`(
                posts.title LIKE ${storage.escape(`%${search}%`)} OR
                posts.plaintext LIKE ${storage.escape(`%${search}%`)}
            )`);
        }

        const where = storage.buildWhere(conds);

        const sql = `
            SELECT
                ${this.listFields.map(field => `posts.${field}`).join(',')},
                MIN(tags.name) AS tags
            FROM ${this.postsTable}
                LEFT JOIN posts_tags
                    ON posts.id = posts_tags.post_id
                LEFT JOIN tags
                    ON posts_tags.tag_id = tags.id
            ${where}
            GROUP BY posts.id
            ORDER BY posts.published_at DESC
            LIMIT ${storage.escape(limit)}
            OFFSET ${storage.escape(offset)};
        `;

        return storage.query(sql);
    },

    async hasMorePosts(published_at) {
        const sql = `
            SELECT COUNT(*) as count
            FROM ${this.postsTable}
            WHERE published_at < ${storage.escape(published_at)};
        `;

        const [count] = await storage.query(sql);

        return count.count > 0;
    },

    async getPost({slug}) {
        const sql = `
            SELECT
                ${this.fields.map(field => `posts.${field}`).join(',')},
                MIN(tags.name) AS tags
            FROM ${this.postsTable}
                LEFT JOIN posts_tags
                    ON posts.id = posts_tags.post_id
                LEFT JOIN tags
                    ON posts_tags.tag_id = tags.id
            WHERE
                posts.slug = ${storage.escape(slug)} AND
                posts.status = 'published'
            GROUP BY posts.id;
        `;

        const posts = await storage.query(sql);
        return posts[0] || null;
    },

    async getClosestPosts({date}) {
        const buildQuery = ({isNext}) => `
            SELECT
                posts.id, posts.title, posts.slug, posts.published_at,
                MIN(tags.name) AS tags
            FROM ${this.postsTable}
                LEFT JOIN posts_tags
                    ON posts.id = posts_tags.post_id
                LEFT JOIN tags
                    ON posts_tags.tag_id = tags.id
            WHERE
                posts.status = 'published' AND
                posts.published_at ${isNext ? '>' : '<'} ${storage.escape(date)}
            GROUP BY posts.id
            ORDER BY posts.published_at ${isNext ? 'ASC' : 'DESC'}
            LIMIT 1;
        `;

        const [nextPost] = await storage.query(buildQuery({isNext: true}));
        const [prevPost] = await storage.query(buildQuery({isNext: false}));
        return {
            nextPost,
            prevPost,
        };
    },

    async listTags() {
        const sql = `
            SELECT name, meta_title, meta_description
            FROM tags;
        `;

        return storage.query(sql);
    }
};

module.exports = Stories;
