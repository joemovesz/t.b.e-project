# T.B.E Bazuri — Content Website

A professional content website where only authorized administrators can publish videos, images, and news. Users can browse, like, and comment on content.

## 🔑 Admin Access

Only one email is authorized as admin:
```
tebangenebazuri@gmail.com
```

Log in at `admin-login.html` with this email to access the admin dashboard and create/edit posts.

## 📁 Project Structure

```
T.B.E bazuri project/
├── index.html           # Homepage — public post feed with search & filter
├── admin-login.html     # Admin login (email-gated)
├── admin-dashboard.html # Admin dashboard — manage posts
├── create-post.html     # Create / edit post form
├── post-detail.html     # Individual post page — likes, views, Giscus comments
├── 404.html             # Custom not-found page
├── README.md            # This file
├── credential.txt       # API credentials (GitHub token, Giscus config)
├── css/
│   └── style.css        # Custom styling (Tailwind + custom)
└── js/
    ├── app.js           # Shared logic: posts, likes, views, auth, dates
    ├── home.js          # Homepage: render, search, filter
    ├── admin.js         # Admin dashboard: render, delete
    └── toast.js         # Toast notifications
```

## 🚀 Quick Start

1. Open `index.html` in your browser — no build step or server required.
2. To publish content, go to `admin-login.html` and sign in with `tebangenebazuri@gmail.com`.
3. Create posts via the admin dashboard.

## 🛠 Tech Stack

- HTML5, CSS3 (Tailwind CSS via CDN), Vanilla JavaScript
- `localStorage` for posts, likes, and views (no backend)
- [Giscus](https://giscus.app/) for GitHub Discussions-based comments

## 💬 Giscus / Comments Setup

Comments are powered by GitHub Discussions via Giscus. To activate them:

1. Enable **Discussions** in your GitHub repo settings (`joemovesz/t.b.e-project`).
2. Create a discussions category (e.g., "Comments").
3. Get the **category name** and **category ID**.
4. Edit `post-detail.html` and replace:
   ```html
   data-category="[ENTER CATEGORY NAME HERE]"
   data-category-id="[ENTER CATEGORY ID HERE]"
   ```
   with your actual values.

## 📦 Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages** in your GitHub repo.
3. Set source to the `main` (or `master`) branch, root `/`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## ⚠️ Limitations

- Data is stored in `localStorage` — it persists per browser/device but does not sync across users or devices.
- Like and view counts are per-browser.
- No user registration system — only the admin email can publish content.

## 📄 License

MIT