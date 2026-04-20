# CHiQ Desk — Vultr Ubuntu Deployment Guide

## What you need
- Vultr account with an Ubuntu 22.04 server (1 CPU / 1GB RAM is fine to start)
- A domain name pointed to your server IP (or just use the IP directly)
- Your CHiQ Desk code on GitHub

---

## STEP 1 — Create your Vultr server

1. Log in to vultr.com
2. Click **Deploy New Server**
3. Choose:
   - Type: Cloud Compute
   - OS: Ubuntu 22.04 LTS
   - Plan: $6/mo (1 CPU, 1GB RAM) — fine for internal tool
   - Region: Sydney (closest to AU)
4. Click **Deploy Now**
5. Wait ~60 seconds, copy your **server IP**

---

## STEP 2 — Connect to your server

On your local machine, open terminal:

```bash
ssh root@YOUR_SERVER_IP
```

Type `yes` when prompted, enter your Vultr root password.

---

## STEP 3 — Set up the server

```bash
# Update everything
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx (web server)
apt install -y nginx

# Install Git
apt install -y git

# Verify installs
node -v    # should show v20.x
npm -v     # should show 10.x
nginx -v   # should show nginx version
```

---

## STEP 4 — Push your code to GitHub

On your local machine (not the server):

```bash
cd chiq-desk-react

# If you haven't set up git yet:
git init
git add .
git commit -m "initial commit"

# Create a repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/chiq-desk.git
git push -u origin main
```

---

## STEP 5 — Pull code onto server and build

Back on the server:

```bash
# Go to web directory
cd /var/www

# Clone your repo
git clone https://github.com/YOUR_USERNAME/chiq-desk.git
cd chiq-desk

# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `/var/www/chiq-desk/dist` folder — that's your built app.

---

## STEP 6 — Configure Nginx

```bash
# Create Nginx config for CHiQ Desk
nano /etc/nginx/sites-available/chiq-desk
```

Paste this (replace YOUR_SERVER_IP or your domain):

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;   # or yourdomain.com

    root /var/www/chiq-desk/dist;
    index index.html;

    # React Router — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

Save: `Ctrl+X` → `Y` → `Enter`

```bash
# Enable the site
ln -s /etc/nginx/sites-available/chiq-desk /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

Your app is now live at `http://YOUR_SERVER_IP`

---

## STEP 7 — Set up a deploy script (update in 1 command)

```bash
# Create deploy script
nano /var/www/chiq-desk/deploy.sh
```

Paste:

```bash
#!/bin/bash
echo "Pulling latest code..."
cd /var/www/chiq-desk
git pull origin main
echo "Installing dependencies..."
npm install
echo "Building..."
npm run build
echo "Restarting Nginx..."
systemctl reload nginx
echo "Done! CHiQ Desk updated."
```

```bash
# Make it executable
chmod +x /var/www/chiq-desk/deploy.sh
```

**Every time you update the app:**
```bash
ssh root@YOUR_SERVER_IP
/var/www/chiq-desk/deploy.sh
```

That's it. One command to update.

---

## STEP 8 (Optional) — Add a real domain + HTTPS

If you have a domain (e.g. desk.chiq.com):

1. In your domain DNS settings, add an A record: `desk` → `YOUR_SERVER_IP`
2. Wait ~5 min for DNS to propagate
3. On server:

```bash
# Install Certbot (free SSL)
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d desk.chiq.com

# Auto-renew (already set up, just verify)
systemctl status certbot.timer
```

Your app is now at `https://desk.chiq.com` with a padlock.

---

## Troubleshooting

**Nginx won't start:**
```bash
nginx -t          # shows config errors
journalctl -xe    # shows system logs
```

**App shows old version after deploy:**
```bash
# Hard refresh in browser: Ctrl+Shift+R
# Or clear Nginx cache:
systemctl reload nginx
```

**Can't connect to server:**
```bash
# Check firewall — open port 80 and 443
ufw allow 80
ufw allow 443
ufw allow 22
ufw enable
```

**Check what's running:**
```bash
systemctl status nginx
ps aux | grep nginx
```

---

## Summary

| Command | What it does |
|---|---|
| `ssh root@IP` | Connect to server |
| `./deploy.sh` | Update the app |
| `systemctl restart nginx` | Restart web server |
| `nginx -t` | Test Nginx config |
| `npm run build` | Rebuild the app |

---

## Server costs

| Resource | Cost |
|---|---|
| Vultr 1GB server | $6/mo |
| Domain (optional) | ~$15/yr |
| SSL certificate | Free (Let's Encrypt) |
| **Total** | **~$6–7/mo** |
