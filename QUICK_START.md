# 📱 Quick Start - Access STOCKR on Your Phone

## 🚀 Easiest Way (3 Steps)

### 1. Start all services for network access
```bash
make run-network
```

### 2. Get your local IP address
```bash
make get-ip
```
You'll see something like: `192.168.1.100`

### 3. Open on your phone
1. Make sure your phone is on the **same WiFi** as your computer
2. Open browser on phone
3. Go to: `http://YOUR_IP:4200`
   - Example: `http://192.168.1.100:4200`

**That's it!** 🎉

---

## ☁️ Want a Public URL? (Access from Anywhere)

### Option 1: Railway (Recommended - Easiest)
1. Sign up at https://railway.app
2. Connect your GitHub repo
3. Add 3 services (Python, Backend, Frontend)
4. Set environment variables
5. Get public URL

**See `HOSTING.md` for detailed Railway setup.**

### Option 2: Render
1. Sign up at https://render.com
2. Create web services for Python & Backend
3. Create static site for Frontend
4. Get public URLs

---

## 🛠️ Manual Start (If Makefile doesn't work)

### Terminal 1: Python Service
```bash
make run
```

### Terminal 2: Backend
```bash
make run-backend
```

### Terminal 3: Frontend
```bash
cd frontend
npm start -- --host 0.0.0.0
```

### Then on your phone:
- Open browser
- Go to: `http://YOUR_LOCAL_IP:4200`
- Get IP with: `make get-ip`

---

## ❓ Troubleshooting

**Phone can't connect?**
- ✅ Same WiFi network?
- ✅ Firewall blocking ports?
- ✅ Correct IP address?

**Get IP manually:**
- Mac: `ipconfig getifaddr en0`
- Linux: `hostname -I`
- Windows: `ipconfig` (look for IPv4)

**Need help?** Check `HOSTING.md` for detailed instructions.

