# 🔍 BookSeats Debugging Guide

## ❌ Problem: "No seats on webpage"

### ✅ Step 1: Check Backend Status
Open browser console (F12) → Network tab
Look for: `GET http://localhost:5000/api/movies/get-show/...`

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "tmdbId": 12345,
  "time": "10:00 AM",
  "seats": [
    { "seatNumber": "A1", "isBooked": false, "bookedBy": null },
    { "seatNumber": "A2", "isBooked": false, "bookedBy": null }
    ... (80 total seats)
  ],
  "tiketPrice": 250,
  "city": "Nashik"
}
```

---

### ✅ Step 2: Check Console Logs
Open browser console (F12) → Console tab

Should see:
```
📍 BookSeats Component Loaded
ID: 12345 TIME: 10:00 AM
🔗 Fetching from: http://localhost:5000/api/movies/get-show/12345/10:00%20AM
✅ Backend Seats Data: {...}
📊 Total Seats: 80
```

---

### ✅ Step 3: Check URL
Make sure URL is correct:
```
http://localhost:3001/book-seat/12345/10:00%20AM
```

NOT:
```
http://localhost:3001/book-seats/12345/10:00%20AM  ❌ (wrong 's')
```

---

### ✅ Step 4: Backend Logs
Check backend terminal output. Should show:

```
GET /api/movies/get-show/12345/10:00 AM
✅ New show created with seats!
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Backend returns 404
```
Error: Request failed with status code 404
```
**Fix:**
- Make sure backend is running on port 5000
- Check if Movie ID (tmdbId) is a number in the database

### Issue 2: "Cannot read property 'map' of undefined"
```
Cannot read properties of undefined (reading 'map')
```
**Fix:**
- dbShow?.seats is null/undefined
- Check if backend is returning seats array
- Add validation: {dbShow?.seats?.map(...)}

### Issue 3: MovieID not passing correctly
```
ID: undefined TIME: 10:00 AM
```
**Fix:**
- Check URL has tmdbMovie.id (not _id)
- Verify route path: `/book-seat/:id/:time`

---

## 🔧 Quick Fixes to Try

### Fix 1: Restart Everything
```powershell
# Terminal 1: Kill backend (Ctrl+C), then restart
cd c:\newProjectsAdvance\bookShow\backend
node server.js

# Terminal 2: Kill frontend (Ctrl+C), then restart
cd c:\newProjectsAdvance\bookShow\frontend
npm start
```

### Fix 2: Clear Browser Cache
- Press: `Ctrl + Shift + Delete`
- Select "All time"
- Clear cache
- Reload page

### Fix 3: Check .env File
Ensure backend `.env` has:
```
MONGO_URI=mongodb://localhost:27017/showsDB
PORT=5000
TMDB_API_KEY=343c4e72fdbdbce57214c533e473c30e
```

---

## 📊 Test Endpoint Directly

### Using Postman/Browser:

**1. First create a movie:**
```
GET http://localhost:5000/api/movies/sync-from-frontend
```

**2. Then test get-show endpoint:**
```
GET http://localhost:5000/api/movies/get-show/550988/10:00
(Replace 550988 with actual tmdbId from database)
```

Should return seats data.

---

## ✅ Final Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB running and connected
- [ ] Frontend running on port 3001
- [ ] At least one movie in database (run sync from Home page)
- [ ] Navigating to URL: http://localhost:3001/book-seat/ID/TIME
- [ ] Console logs show "✅ Backend Seats Data"
- [ ] 80 seats visible in grid (A1-H10)
- [ ] Can click seats and they highlight
- [ ] Total price updates correctly

---

If still not working, check:
1. Backend console for errors
2. Browser console (F12) for JS errors
3. Network tab (F12) for API response status
4. MongoDB for data existence
