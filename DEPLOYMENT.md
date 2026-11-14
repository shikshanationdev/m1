# M1 website: deployment guide

Repository: https://github.com/shikshanationdev/m1 (public, branch `main`)
Stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Node.js **20.9 or newer** (22 LTS recommended)

The site is one page that is fully pre-rendered at build time. It has no database and no server code, so it can run either way:

| Option | What runs | Use it when |
|---|---|---|
| **A. Node.js app** | `npm run build` then `npm start` (Next.js server) | Hostinger Business/Cloud "Node.js Apps", Hostinger VPS, AWS EC2 |
| **B. Static files** | `npm run build:static` → upload the `out/` folder | Any plain web hosting (Hostinger shared/Premium, AWS S3 + CloudFront) |

Both give the same website.

---

## Environment variables (all optional for launch)

Set these in the hosting panel, or in `.env.local` on a server. They are read **at build time**, so rebuild after changing them.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Final public URL, e.g. `https://m1.example.com` (used for link previews on WhatsApp, LinkedIn and others) |
| `NEXT_PUBLIC_M1_REGISTER_ENDPOINT` | HTTPS URL of the registration API (POST, JSON). Until it is set, the form checks the fields but tells visitors that registration isn't connected yet. |
| `NEXT_PUBLIC_M1_PRIVACY_URL` | Published privacy-policy page |

---

## 1. Hostinger

### "This repository is missing a package.json file"

`package.json` is in the repo root on `main`. That message comes from an early scan: the first two commits held only a README, and Hostinger cached that result. Fix:

1. hPanel → the website → **Git / Deployments**: remove the connection and import the repo again (or press **Redeploy / Re-scan**).
2. Make sure the selected repository is `shikshanationdev/m1`, branch `main`, root directory `/` (empty or `./`).

If the plan has **no "Node.js Apps" section** (single/Premium shared hosting), Hostinger can only serve static files. Use option 1B below; it is not an error in the code.

### Build crashes on `globals.css` / "worker exited before connecting"

Next 16 uses Turbopack by default, which runs Tailwind/PostCSS in a separate worker process. Hostinger caps processes per account, so that worker gets killed. `npm run build` therefore runs `next build --webpack`, and `next.config.ts` limits the build to one worker. Keep the build command as `npm run build` (not `next build`). Use `npm ci` so Hostinger installs fresh Linux packages; never upload a `node_modules` or `.next` folder from Windows.

### 1A. Hostinger Node.js App (Business or Cloud plans)

hPanel → **Websites → Add website → Node.js Apps → Import Git repository**

| Setting | Value |
|---|---|
| Repository / branch | `shikshanationdev/m1` / `main` |
| Framework preset | **Next.js** |
| Node.js version | **22.x** (minimum 20.9) |
| Root directory | `./` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Output directory | `.next` (only if the form asks) |
| Environment variables | see the table above |

Then attach the domain and switch on SSL in hPanel. New pushes to `main` redeploy automatically if auto-deploy is turned on.

### 1B. Hostinger static hosting (any plan)

On a computer with Node 20.9+:

```bash
git clone https://github.com/shikshanationdev/m1.git && cd m1
npm ci
npm run build:static        # creates the out/ folder (about 3 MB)
```

hPanel → **Files → File Manager → `public_html`**: delete the default `index.html` / `default.php`, then upload **everything inside `out/`**, including the hidden `.htaccess` file and the `_next` folder. Do not upload the `out` folder itself. `.htaccess` forces HTTPS and adds security and caching headers.

To publish changes later, rebuild and upload `out/` again.

---

## 2. AWS

### 2A. EC2 (same setup as shikshanation.com: Node + PM2 + nginx)

One-time server setup (Ubuntu 22.04/24.04; t3.small is enough):

```bash
# Node via nvm + PM2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc && nvm install 22 && npm i -g pm2

# app
git clone https://github.com/shikshanationdev/m1.git ~/m1 && cd ~/m1
cp .env.example .env.local      # fill in the values, then:
npm ci && npm run build
pm2 start ecosystem.config.js --env production && pm2 save
pm2 startup                     # run the command it prints, so PM2 restarts after a reboot

# nginx + HTTPS
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp deploy/nginx-m1.conf /etc/nginx/sites-available/m1   # edit server_name to the real domain
sudo ln -s /etc/nginx/sites-available/m1 /etc/nginx/sites-enabled/m1
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d m1.example.com -d www.m1.example.com
```

- The app listens on **port 3001**, so it can share an instance with snfrontend (which uses 3000). Change `PORT` in `ecosystem.config.js` and in `deploy/nginx-m1.conf` together.
- Security group: open 80 and 443 to the world. Port 3001 stays closed (nginx proxies to it).
- DNS: an A record for the domain pointing to the instance's Elastic IP.

Manual update: `cd ~/m1 && git pull && npm ci && npm run build && pm2 reload m1-web`

**Automatic deploys (GitHub Actions):** `.github/workflows/deploy-aws-ec2.yml` uses the same SSM + OIDC method as the snfrontend pipeline.
1. In the workflow, set `EC2_INSTANCE_ID` (and `APP_PATH` / `AWS_REGION` if they differ).
2. GitHub repo → Settings → Secrets → Actions → add `AWS_ROLE_ARN`. This can be the IAM role snfrontend already uses, as long as its trust policy allows the `shikshanationdev/m1` repo and it has `ssm:SendCommand` / `ssm:GetCommandInvocation` on the instance.
3. The instance needs the SSM agent and an instance role with `AmazonSSMManagedInstanceCore`.
4. Run it from the Actions tab ("Run workflow"). To deploy on every push, add `push: { branches: [main] }` under `on:`.

### 2B. S3 + CloudFront (static, cheapest, no server)

```bash
npm ci && npm run build:static
aws s3 sync out/ s3://<bucket-name>/ --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

- Private S3 bucket + CloudFront with Origin Access Control. Default root object: `index.html`. Error page 404 → `/404.html`.
- Certificate from ACM in **us-east-1** for the domain, attached to the distribution, with a Route 53 / DNS CNAME to the CloudFront domain.
- `.htaccess` is not used here. Add a CloudFront "response headers policy" (SecurityHeadersPolicy) if you want the security headers.

---

## Checklist after it goes live

- [ ] Site opens on `https://` with a valid certificate (www and non-www)
- [ ] Faculty images and fonts load, and the browser console shows no errors
- [ ] `NEXT_PUBLIC_SITE_URL` is set to the real domain (rebuild afterwards)
- [ ] Registration endpoint connected, or the team knows the form shows "not connected" until it is
- [ ] Before launch, the content team still needs to supply: photography, the passport holder photo, faculty bios, approved Vision/Mission wording, and the privacy-policy URL
