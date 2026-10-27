# Anton Sumollo, portfolio

Personal site built with Next.js and Tailwind CSS.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where to edit

| What | File |
| --- | --- |
| Name, bio, roles, links, tools, experience | `src/site.config.ts` |
| Projects | `content/projects/*.md` |
| Gear page | `src/gear.config.ts` |
| Extra facts for the Ask assistant | `content/about.md` |
| Colors and fonts | `src/app/globals.css` |

### Add a project

1. Copy `content/projects/_template.md` to a new file, for example `content/projects/resume-parser.md`. The file name becomes the URL (`/projects/resume-parser`).
2. Fill in the frontmatter and write the case study below it.
3. Optional: put a cover image in `public/projects/` and set `cover: /projects/your-image.png`.

Projects are sorted by `date`, newest first. Files starting with `_` are drafts and stay hidden. Delete the three `sample-project-*.md` files once you have your own.

### Photo and resume

- Photo: add `public/profile.jpg` and set `photo: "/profile.jpg"` in `src/site.config.ts`.
- Resume: add `public/resume.pdf`.

### GitHub activity

The graph pulls your public contribution count once a day. `src/data/github-snapshot.json` is a fallback used only if that request fails. Set `github.show` to `false` to hide the section.

### Ask about me

The chat answers only from your config, your project files and `content/about.md`. It works with any OpenAI-compatible API. Add these environment variables (locally in `.env.local`, or in your host's settings):

```
LLM_API_KEY=your-key
LLM_MODEL=model-name
LLM_BASE_URL=https://api.openai.com/v1   # optional, change for another provider
```

Without them, the chat shows the offline message from `site.config.ts`. Set `assistant.enabled` to `false` to remove the button.

## Deploy

Push the repo to GitHub, import it at vercel.com, and add the environment variables above. Then update `seo.url` in `src/site.config.ts` to your domain.
