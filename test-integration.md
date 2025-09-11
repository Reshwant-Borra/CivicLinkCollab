# Integration Test Guide

## Testing the Waitlist to App Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the application** in your browser at `http://localhost:5173`

3. **Test the waitlist flow**:
   - You should see the CivicLink landing page
   - Scroll down to the waitlist form
   - Fill out the form with test data:
     - Email: test@example.com
     - Phone: (555) 123-4567
     - ZIP Code: 12345
     - Language: English
     - Check the organizer checkbox if desired
   - Click "Join the Waitlist"
   - You should see a success toast message
   - After 2 seconds, you should be automatically redirected to `/app`

4. **Test the direct app access**:
   - Click the "Try the App" button on the landing page
   - You should be redirected to `/app` which shows the main CivicLink dashboard

5. **Test navigation**:
   - Use the bottom navigation to explore different sections
   - Test all the main features:
     - Deadlines
     - Fact Check
     - Language Support
     - Help
     - Organizer Portal
     - Ambassador Toolkit

## Expected Behavior

- ✅ Landing page loads with waitlist form
- ✅ Waitlist form submits successfully
- ✅ Automatic redirect to app after waitlist submission
- ✅ Direct app access via "Try the App" button
- ✅ All navigation works properly
- ✅ All pages load without errors
- ✅ Responsive design works on mobile and desktop

## Troubleshooting

If you encounter issues:

1. **Check console errors** in browser developer tools
2. **Verify all dependencies** are installed: `npm install`
3. **Check TypeScript compilation**: `npx tsc --noEmit`
4. **Restart the development server** if needed
5. **Clear browser cache** and refresh

## Backend Integration

If you want to test the full backend integration:

1. **Start the backend server**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Update API endpoints** in the frontend if needed
3. **Test the waitlist submission** with real Supabase integration
