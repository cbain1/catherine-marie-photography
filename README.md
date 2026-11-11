# catherine marie photography

Static version of www.catherinemariephotos.com, built to be hosted for free on GitHub Pages instead of Squarespace. Plain HTML, CSS, and a little JavaScript; no build step, no frameworks.

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | Home page (hero photo) |
| `portfolio/index.html` | Grid of all 23 galleries |
| `portfolio/<gallery>/index.html` | One page per gallery, with a click-to-enlarge lightbox |
| `videography/index.html` | Wedding and sorority event videos (YouTube and Vidflow embeds) |
| `about/index.html` | About page |
| `contact/index.html` | Inquiry form (see "Contact form" below) |
| `404.html` | "Page not found" page |
| `assets/css/style.css` | All styling (colors and fonts are set at the top) |
| `assets/js/site.js` | Mobile menu, gallery lightbox, contact form |
| `images/` | All photos (filled in by the download script) |
| `tools/download_images.R` | Downloads every photo from Squarespace into `images/` |
| `tools/image_manifest.csv` | The list of photos the script downloads (749 gallery photos plus covers, logo, hero, and about photo) |
| `sitemap.xml`, `.nojekyll` | Housekeeping for search engines and GitHub Pages |

Page addresses match the old Squarespace ones (for example `/portfolio/carlytucker`), so existing links keep working.

## Step 1: Download the photos (do this while Squarespace is still active)

The pages point to photos in `images/`, which starts out empty. From the top of this folder:

```
Rscript tools/download_images.R
```

It downloads about 800 images at 1500 px wide (roughly 200 to 300 MB; web quality, not the originals). If anything fails, run it again; it skips files it already has. Open `index.html` in a browser afterwards to check that everything shows up.

## Step 2: Put the site on GitHub

1. Create a free GitHub account if you do not have one.
2. Create a new **public** repository (GitHub Pages is free for public repos). Any name works, for example `photo_website`.
3. Upload this folder. Because there are many images, [GitHub Desktop](https://desktop.github.com) is easier than the web uploader: File > Add Local Repository > choose this folder > "create a repository" > Publish repository (uncheck "Keep this code private").
   From a terminal instead:
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/photo_website.git
   git push -u origin main
   ```
4. In the repository on GitHub: **Settings > Pages > Build and deployment**, set Source to "Deploy from a branch", Branch to `main`, folder `/ (root)`, and Save.
5. After a minute or two the site is live at `https://<your-username>.github.io/photo_website/`. Click around and confirm it looks right before touching the domain.

## Step 3: Point catherinemariephotos.com at GitHub

1. In the repository: **Settings > Pages > Custom domain**, enter `www.catherinemariephotos.com` and Save. (This adds a `CNAME` file to the repo; that is expected.)
2. Where your domain's DNS is managed (Squarespace Domains if you bought the domain through Squarespace), remove the existing Squarespace records for the root domain and `www`, then add:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-username>.github.io` |

3. Wait for DNS to update (minutes to a few hours). Once GitHub shows the domain check as successful, tick **Enforce HTTPS** in Settings > Pages.
4. Optional but recommended: verify the domain under your GitHub account's **Settings > Pages** so nobody else can claim it.

## Step 4: Cancel the Squarespace website plan

Only after the new site is live on your domain. Important: cancelling the **website** subscription is separate from the **domain**. If the domain is registered through Squarespace, keep that domain registration active (or transfer it to another registrar such as Cloudflare or Porkbun) so the address does not lapse.

## Contact form

GitHub Pages cannot send email on its own. Right now the form opens the visitor's email app with their answers filled in, addressed to catherinemariephoto@gmail.com. To have submissions arrive in your inbox directly instead:

1. Make a free account at [formspree.io](https://formspree.io) and create a form.
2. Copy its form ID (the end of the endpoint, e.g. `https://formspree.io/f/xyzabcd` gives `xyzabcd`).
3. Paste it into `assets/js/site.js` on the line `var FORMSPREE_ID = "";`.

## Editing the site later

- **Text**: open the page's `index.html` in any text editor and change the words between the tags.
- **Add a photo to a gallery**: put the file in `images/portfolio/<gallery>/` and copy one of the existing `<a class="g-item" ...>` lines in that gallery's `index.html`, changing the file name in both places.
- **New gallery**: copy an existing gallery folder (e.g. `portfolio/emily/`), rename it, update the title, photo lines, and previous/next links, then add a card for it on `portfolio/index.html` and a line in `sitemap.xml`.
- **Colors and fonts**: the variables at the top of `assets/css/style.css`.

Commit and push (or "Push origin" in GitHub Desktop) and the live site updates within a minute or two.

## Notes

- Fonts: Squarespace used Adobe Caslon Pro and LTC Bodoni 175 through Adobe Fonts, which require a license. This site uses the free Google Fonts Libre Caslon Text and Bodoni Moda, which look very close.
- The Squarespace shopping cart was not carried over (there were no products).
