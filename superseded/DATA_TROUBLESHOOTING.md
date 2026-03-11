# Dashboard Data Troubleshooting

## If you can't see data after generating:

### 1. Check Data Mode Toggle
- Make sure it's set to **"Historical"** (not "Live")
- Live mode only shows data from today's date
- Historical mode shows data from all time periods

### 2. Check Time Period Filter
- Try selecting **"All Time"** to see all generated data
- Period filters (This Month, Last Month, etc.) only show data within those date ranges
- Generated demo data is spread over the last 6 months

### 3. Verify Data Was Generated
- Check the browser console for any errors when clicking "Generate 100 Demo Records"
- You should see a success message
- If you see an error, check:
  - You're logged in to the dashboard (have the admin token cookie)
  - The client_id matches your environment variable

### 4. Refresh the Page
- After generating data, refresh the dashboard page (F5 or Cmd+R)
- The dashboard doesn't auto-refresh after data generation

### 5. Check Database
If data still doesn't show, verify in Supabase:
```sql
SELECT COUNT(*) FROM responses_v3 WHERE client_id = 'YOUR_CLIENT_ID';
SELECT COUNT(*) FROM employees WHERE client_id = 'YOUR_CLIENT_ID';
SELECT COUNT(*) FROM tokens WHERE client_id = 'YOUR_CLIENT_ID';
```

### 6. Common Issues

**Issue: Data generated but not showing**
- **Solution**: Check the time period filter - demo data is spread over 6 months
- Set filter to "All Time" or "Last 6 Months"

**Issue: "Generate 100 Demo Records" button not working**
- **Solution**: Make sure you're logged in with the admin token
- Check browser console for errors
- The button requires authentication

**Issue: QR Code not appearing**
- **Solution**: Look for a blue/navy card below the filter controls
- Click "Generate QR Code" button
- Make sure JavaScript is enabled

## Quick Test
1. Set time period to "All Time"
2. Set data mode to "Historical"
3. Click "Generate 100 Demo Records"
4. Wait for success message
5. Refresh the page (F5)
6. Data should appear!




