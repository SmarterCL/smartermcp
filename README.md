# SmarterMCP - Model Context Protocol Integration

> Enterprise-grade MCP server for n8n automation and AI workflows

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-compatible-green.svg)](https://n8n.io)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io)

## 🎯 What is SmarterMCP?

SmarterMCP is a Model Context Protocol (MCP) server that bridges AI assistants with n8n automation workflows. It enables:

- 🔄 Execute n8n workflows from any MCP-compatible AI
- 📊 Real-time workflow status and monitoring
- 🔐 Secure OAuth authentication with Google + RUT validation
- 📱 SMS 2FA verification
- 🇨🇱 Chilean RUT validation (Módulo 11)

## 🚀 Quick Start

### For End Users

1. **Login**: Visit [rut.smarterbot.store/login](https://rut.smarterbot.store/login)
2. **Authenticate**: Sign in with Google OAuth
3. **Verify Identity**: Enter Chilean RUT and phone number
4. **SMS Verification**: Enter 6-digit code
5. **Start Using**: Access your n8n workflows via MCP

### For Developers

```bash
# Install
npm install -g smartermcp

# Configure
smartermcp init

# Start server
smartermcp start
```

## 🔗 Integration

### With Claude Desktop

```json
{
  "mcpServers": {
    "smartermcp": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--streamableHttp",
        "https://n8n.smarterbot.store/mcp-server/http",
        "--header",
        "authorization:Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}
```

### With n8n

1. Enable MCP in n8n settings
2. Create API token
3. Configure webhook: `https://n8n.smarterbot.store/webhook/mcp`
4. Test connection

## 🏗️ Architecture

```
User → OAuth Login (Google)
  ↓
RUT Validation (Módulo 11)
  ↓
SMS 2FA Verification
  ↓
MCP Server ↔ n8n Workflows
  ↓
AI Assistant Access
```

## 📋 Features

- ✅ **OAuth 2.0** - Google authentication
- ✅ **RUT Validation** - Chilean ID verification
- ✅ **SMS 2FA** - Phone verification
- ✅ **n8n Integration** - Execute workflows
- ✅ **MCP Protocol** - Standard compliance
- ✅ **Webhook Support** - Real-time events
- ✅ **Secure Storage** - Supabase Vault

## 🔐 Security

- HTTPS only
- Token-based authentication
- Rate limiting
- CORS configured
- httpOnly cookies
- Environment isolation

See [SECURITY.md](SECURITY.md) for details.

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Configuration](docs/configuration.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🔗 Links

- **Login**: [rut.smarterbot.store/login](https://rut.smarterbot.store/login)
- **Docs**: [smarterbot.store/docs](https://smarterbot.store/docs)
- **Privacy**: [smarterbot.store/privacy](https://smarterbot.store/privacy)
- **Terms**: [smarterbot.store/terms](https://smarterbot.store/terms)
- **Support**: [support@smarterbot.cl](mailto:support@smarterbot.cl)

## 📦 Requirements

- Node.js 18+
- n8n instance (optional)
- Google OAuth credentials
- Supabase account

## 🛠️ Development

```bash
# Clone
git clone https://github.com/smarteros/smartermcp.git
cd smartermcp

# Install
npm install

# Configure
cp .env.example .env

# Run dev
npm run dev

# Build
npm run build

# Test
npm test
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

Proprietary. See [LICENSE](LICENSE) for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/smarteros/smartermcp/issues)
- **Email**: support@smarterbot.cl
- **Docs**: [smarterbot.store/docs](https://smarterbot.store/docs)

## 🎯 Roadmap

- [ ] OAuth2 additional providers
- [ ] Multi-region support
- [ ] Enhanced analytics
- [ ] CLI improvements
- [ ] Plugin system

---

Made with ❤️ by [SmarterOS](https://smarterbot.store)
