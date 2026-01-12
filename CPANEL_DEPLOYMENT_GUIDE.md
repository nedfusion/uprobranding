# cPanel Deployment Guide for UPRO Platform

## Files Prepared for Deployment

A zip file named `upro-cpanel-deployment.zip` has been created in your project root directory containing all necessary files for deployment.

## What's Included

The zip file contains:
- `index.html` - Main application file
- `assets/` - All CSS and JavaScript bundles
- `favicon.ico` - Website favicon
- `Logo-removebg-preview (1).png` - Logo file
- `site.webmanifest` - PWA manifest file
- `sw.js` - Service worker for PWA functionality
- `.htaccess` - Server configuration for routing and optimization

## Deployment Steps

### 1. Access Your cPanel
- Log in to your cPanel account
- Navigate to the File Manager

### 2. Choose Deployment Location
- For main domain: Navigate to `public_html/`
- For subdomain: Navigate to the subdomain's root folder
- For subdirectory: Create/navigate to your desired folder

### 3. Upload Files

**Option A: Upload Zip File**
1. Click "Upload" in File Manager
2. Upload `upro-cpanel-deployment.zip`
3. Right-click the zip file and select "Extract"
4. Move all files from the `dist/` folder to your web root
5. Delete the empty `dist/` folder and zip file

**Option B: Upload Individual Files**
1. Extract the zip file on your computer
2. Upload all contents from the `dist/` folder to your web root
3. Ensure `.htaccess` file is uploaded (enable "Show Hidden Files" in File Manager)

### 4. Set Correct Permissions
Recommended permissions:
- Folders: 755
- Files: 644
- `.htaccess`: 644

### 5. Configure Environment Variables

**Important:** You need to update your environment variables for production.

Since this is a React app, environment variables are embedded during build. You'll need to:

1. In your project source, update `.env` file with production values:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```

2. Rebuild the project:
   ```bash
   npm run build
   ```

3. Re-create the zip file and upload again

### 6. Verify .htaccess Configuration

The `.htaccess` file includes:
- URL rewriting for React Router (SPA support)
- Gzip compression for better performance
- Browser caching rules
- Security headers

Ensure your server has `mod_rewrite` enabled (most cPanel servers have it by default).

### 7. Test Your Deployment

1. Visit your domain in a browser
2. Test navigation between pages
3. Test the login/register functionality
4. Verify all static assets load correctly

## Common Issues and Solutions

### Issue: Pages return 404 on refresh
**Solution:** Ensure `.htaccess` file is present and `mod_rewrite` is enabled.

### Issue: Assets not loading
**Solution:**
- Check file permissions
- Verify all files uploaded correctly
- Clear browser cache

### Issue: Blank page or errors
**Solution:**
- Check browser console for errors
- Ensure environment variables are correctly set
- Verify Supabase credentials are correct

### Issue: Routing not working
**Solution:**
- Confirm `.htaccess` file is in the web root
- Check Apache has AllowOverride enabled

## Performance Optimization

The deployment includes:
- Minified CSS and JavaScript
- Gzip compression via `.htaccess`
- Browser caching headers
- Optimized asset delivery

## Security Considerations

The `.htaccess` file includes:
- X-Content-Type-Options header
- X-Frame-Options header
- X-XSS-Protection header

**Additional Recommendations:**
1. Use HTTPS (SSL certificate) - Available free via cPanel/Let's Encrypt
2. Keep Supabase credentials secure
3. Regularly update dependencies

## Support

For issues related to:
- cPanel: Contact your hosting provider
- Supabase: Check Supabase documentation
- Application bugs: Review application logs

## Next Steps After Deployment

1. Enable SSL certificate (HTTPS)
2. Set up custom domain (if needed)
3. Configure email settings
4. Set up backups
5. Monitor application performance

---

**Note:** This is a Single Page Application (SPA) that requires proper server configuration for client-side routing to work correctly. The `.htaccess` file handles this automatically on Apache servers.
