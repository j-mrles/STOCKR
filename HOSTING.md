# 📱 Hosting Guide - Access from Your Phone

This guide covers two main options for hosting STOCKR so you can access it from your phone:

1. **Local Network Access** (Free, Fast, Easy)
2. **Cloud Hosting** (Public URL, Works Anywhere)

---

## 🏠 Option 1: Local Network Access (Recommended for Testing)

Access your app from your phone on the same WiFi network. **This is already configured!** Just follow these simple steps:

### Quick Start (Easiest Method)

**Option A: Using Makefile (Recommended)**
```bash
# This automatically detects your IP and starts all services
make run-network
```

**Option B: Using Script**
```bash
# Run the helper script
./start-network.sh
```

**Option C: Manual Start**

1. **Get your local IP:**
   ```bash
   make get-ip
   # Or manually:
   # Mac: ipconfig getifaddr en0
   # Linux: hostname -I
   # Windows: ipconfig
   ```

2. **Start all services:**
   ```bash
   # Terminal 1: Python service
   make run
   
   # Terminal 2: Backend
   make run-backend
   
   # Terminal 3: Frontend
   cd frontend && npm start -- --host 0.0.0.0
   ```

### Access from Phone

1. Make sure your phone is on the **same WiFi network** as your computer
2. Open your phone's browser (Chrome, Safari, etc.)
3. Navigate to: `http://YOUR_LOCAL_IP:4200`
   - Example: `http://192.168.1.100:4200`
   - Replace with the IP shown when you run `make get-ip`

### What's Already Configured?

✅ **CORS** - Backend accepts requests from local network IPs  
✅ **Network Binding** - Services listen on `0.0.0.0` (all network interfaces)  
✅ **Smart API URL** - Frontend automatically detects and uses your local IP  
✅ **Makefile Commands** - Easy one-command startup  

### Troubleshooting

**Can't connect from phone?**
1. ✅ Check both devices are on the same WiFi
2. ✅ Verify firewall allows ports 4200, 5100, 8000
3. ✅ Make sure you're using the correct IP address
4. ✅ Try accessing `http://YOUR_IP:5100/swagger` to test backend

**Firewall (Mac):**
```bash
# Allow incoming connections for development
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/python3
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/share/dotnet/dotnet
```

**Firewall (Windows):**
- Go to Windows Defender Firewall → Allow an app
- Allow Node.js, .NET, and Python through firewall

---

## ☁️ Option 2: Cloud Hosting (Public URL)

Deploy to the cloud and access from anywhere. Here are the best options:

### 🚂 Railway (Recommended - Easiest)

**Why Railway?**
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Supports .NET, Node.js, and Python
- ✅ Public URL included
- ✅ Very easy setup

**Steps:**

1. **Sign up**: https://railway.app
2. **Create a new project** from GitHub
3. **Add services:**
   - **Python Service**: Set root to `/`, command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Backend**: Set root to `/backend`, command: `dotnet run --project src/Stockr.Api --urls http://0.0.0.0:$PORT`
   - **Frontend**: Build command: `npm install && npm run build`, serve from `dist/stockr`

4. **Set environment variables:**
   - `MARKETSTACK_API_KEY`
   - `THENEWSAPI_KEY`
   - `PythonServiceUrl` (use Railway's internal service URL)

5. **Access**: Railway gives you a public URL like `https://your-app.railway.app`

---

### 🎨 Render

**Why Render?**
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Supports all your services

**Steps:**

1. **Sign up**: https://render.com
2. **Create services:**
   - **Web Service** for Python (FastAPI)
   - **Web Service** for .NET Backend
   - **Static Site** for Angular Frontend
3. **Configure each service** with appropriate build/start commands
4. **Set environment variables** for API keys
5. **Access**: Render gives you URLs like `https://your-service.onrender.com`

---

### 🪰 Fly.io

**Why Fly.io?**
- ✅ Great for Docker deployments
- ✅ Global edge network
- ✅ Good free tier

**Steps:**

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Sign up**: `fly auth signup`
3. **Create Dockerfiles** (if not already created)
4. **Deploy**: `fly deploy`

---

### 🌐 Netlify/Vercel (Frontend Only)

For just the frontend:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist/stockr` folder to https://app.netlify.com/drop
   - Or use Netlify CLI: `npm install -g netlify-cli && netlify deploy --prod --dir=dist/stockr`

3. **Deploy to Vercel:**
   - Install Vercel CLI: `npm install -g vercel`
   - Run: `cd frontend && vercel --prod`

**Note:** You'll still need to host the backend and Python service separately.

---

## 🎯 Quick Setup: Local Network Access

I'll help you set up local network access quickly. Run these commands:

```bash
# 1. Get your local IP
export LOCAL_IP=$(ipconfig getifaddr en0 || hostname -I | awk '{print $1}')

# 2. Update and start services (see detailed steps below)
```

---

## 📝 Recommended: Railway Deployment

Railway is the easiest option for full-stack deployment. Here's a detailed guide:

### Railway Setup Steps

1. **Create `railway.json`** (I'll create this for you)
2. **Connect GitHub repo** to Railway
3. **Add three services** (Python, Backend, Frontend)
4. **Configure environment variables**
5. **Deploy and get public URL**

Would you like me to:
- ✅ Create Railway configuration files?
- ✅ Update your code for local network access?
- ✅ Set up both options?

---

## 🔧 Troubleshooting

### Local Network Not Working?

1. **Check firewall**: Allow ports 4200, 5100, 8000
2. **Verify same network**: Phone and computer must be on same WiFi
3. **Check IP address**: Make sure you're using the correct local IP
4. **Try different browser** on your phone

### Cloud Hosting Issues?

1. **Check environment variables** are set correctly
2. **Verify service URLs** are correct (especially internal service communication)
3. **Check logs** in your hosting platform's dashboard
4. **Ensure ports** are configured correctly (some platforms use `$PORT`)

---

## 🎉 Next Steps

1. **For quick testing**: Use local network access
2. **For sharing with others**: Use cloud hosting (Railway recommended)
3. **For production**: Use cloud hosting with custom domain

Tell me which option you'd like to set up, and I'll configure it for you!

