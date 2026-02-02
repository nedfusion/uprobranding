# UPRO cPanel Deployment Guide

## Prerequisites
- Active cPanel hosting account
- File Manager or FTP access
- Your domain pointed to the hosting server

## Deployment Steps

### Step 1: Upload Files
1. Log in to your cPanel account
2. Navigate to **File Manager**
3. Go to the `public_html` folder (or your domain's root directory)
4. Upload the `upro-dist-cpanel.zip` file
5. Extract the zip file
6. Move all contents from the `dist` folder to your `public_html` directory

### Step 2: Configure Environment Variables

The application requires the following environment variables to be set in your hosting environment:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Since this is a static build, environment variables are baked into the JavaScript bundle at build time. You need to:

1. Add your Supabase credentials to the `.env` file in the project root
2. Rebuild the project locally with `npm run build`
3. Re-upload the new dist files to cPanel

### Step 3: Set Up URL Rewriting

The `.htaccess` file is already included in the dist folder and handles:
- React Router redirects (all routes point to index.html)
- GZIP compression for faster loading
- Browser caching for static assets

**If the .htaccess file is not working:**
1. Check that `mod_rewrite` is enabled in cPanel (Apache)
2. Ensure `.htaccess` files are allowed in your hosting configuration
3. Contact your hosting provider if needed

### Step 4: Database Configuration

Your application uses Supabase as the database. Make sure:

1. Your Supabase project is set up and running
2. All migrations have been applied
3. Row Level Security (RLS) policies are properly configured
4. The Supabase URL and anon key are correctly set in your build

### Step 5: Test Your Deployment

1. Visit your domain in a browser
2. Test the following:
   - Homepage loads correctly
   - About page is accessible
   - Login/Registration works
   - Service search functionality
   - Image uploads (if applicable)
   - Database connectivity

### Step 6: SSL Certificate (Recommended)

1. In cPanel, go to **SSL/TLS Status**
2. Enable AutoSSL or install a Let's Encrypt certificate
3. Force HTTPS by adding this to the top of your .htaccess:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## File Structure in public_html

After deployment, your structure should look like:
```
public_html/
├── .htaccess
├── index.html
├── favicon.ico
├── site.webmanifest
├── sw.js
├── Logo-removebg-preview (1).png
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

## Troubleshooting

### Routes Not Working (404 Errors)
- Check that `.htaccess` file exists and is readable
- Verify `mod_rewrite` is enabled
- Check file permissions (644 for .htaccess)

### Blank Page / JavaScript Errors
- Check browser console for errors
- Verify all asset files were uploaded
- Check that base URL is correct

### Database Connection Issues
- Verify Supabase credentials in the build
- Check browser console for CORS errors
- Ensure Supabase project is active

### Images Not Loading
- Verify image files are uploaded
- Check file paths in the code
- Ensure proper file permissions (644 for images)

## Performance Optimization

1. **Enable Cloudflare** (if available) for:
   - CDN caching
   - DDoS protection
   - Additional performance boost

2. **Monitor Performance:**
   - Use cPanel's Metrics tools
   - Check resource usage
   - Monitor bandwidth

## Maintenance

- **Regular Backups:** Use cPanel's backup feature
- **Updates:** Rebuild and redeploy when updating the app
- **Monitoring:** Check error logs in cPanel regularly

## Support

For hosting-specific issues, contact your cPanel hosting provider.
For application issues, refer to the main README.md file.

---

**Note:** This is a Single Page Application (SPA) that requires proper URL rewriting to function correctly. The .htaccess file handles this automatically on Apache servers.
