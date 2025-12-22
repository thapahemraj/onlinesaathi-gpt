# Online Saathi

<p align="center">
  <img src="client/public/assets/logo.svg" height="128">
  <h1 align="center">Online Saathi - AI Chat Application</h1>
</p>

A modern AI chat application that supports multiple AI models and providers.

## ✨ Features

- 🤖 **Multi AI Model Support**: OpenAI, Anthropic Claude, Google, Azure, and more
- 💬 **Real-time Chat**: Seamless conversation experience
- 🎨 **Modern UI**: Clean and responsive design
- 🔒 **Secure**: User authentication and data protection
- 📱 **Responsive**: Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/thapahemraj/onlinesaathi-gpt.git
cd onlinesaathi-gpt
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3080`

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run backend:dev` | Start only backend in dev mode |
| `npm run frontend:dev` | Start only frontend in dev mode |

## 🔧 Configuration

Edit the `.env` file to configure:
- MongoDB connection
- AI API keys (OpenAI, Anthropic, etc.)
- Authentication settings
- Server port

## 📁 Project Structure

```
onlinesaathi-gpt/
├── api/          # Backend server
├── client/       # Frontend React app
├── packages/     # Shared packages
├── config/       # Configuration scripts
└── docker-compose.yml
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Online Saathi** - Your AI companion for intelligent conversations.
