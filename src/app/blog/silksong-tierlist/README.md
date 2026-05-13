# Blog Post Template

Copy this folder to `src/app/blog/<post-slug>` when starting a post.

```sh
cp -R .blog-post-template src/app/blog/my-post-slug
```

Then update:

- `layout.tsx`: `title`, `description`, `slug`, and optional social preview image.
- `page.mdx`: `article` fields and the post body.
- `public/blog/<post-slug>/`: optional public images used by metadata or direct URLs.

Optional lines already included in the template:

- `image` / `imageAlt` in `layout.tsx`: social preview image metadata.
- `readingMinutes` in `page.mdx`: shown next to the date.
- `tags` in `page.mdx`: shown under the title and used by blog filtering.
- `italicizedPhrases` in `page.mdx`: italicizes matching words or phrases in rendered titles/descriptions while keeping the plain text values unchanged for metadata and feeds.
- `series` in `page.mdx`: connects the post to `src/lib/series.ts`.
- `archived` in `page.mdx`: hides the post from the main blog list and shows the archived notice.
- `references` in `page.mdx`: renders a references section after the article body.

Local post images can live beside `page.mdx` and be imported:

```mdx
import cover from './cover.png'

<Image src={cover} alt="Description of the image" loading="eager" />
```

Use `caption` when useful:

```mdx
<Image src={cover} alt="Description of the image" caption="Optional caption" />
```

Optional `article` fields supported by `ArticleLayout`:

```js
readingMinutes: 1,
tags: ['tag'],
italicizedPhrases: ['Title of Work'],
series: { slug: 'series-identifier', part: 1 },
archived: true,
references: refs,
```

For references, add a `references.json` file next to `page.mdx`, import it, and set `references: refs`.
