# SmarterMCP - Operational Active Monitor with Conditioned Power

> Enterprise-grade AI agent that thinks, observes, analyzes and acts only under SPEC + PRD authorization

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-compatible-green.svg)](https://n8n.io)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io)

## 🎯 What is SmarterMCP?

SmarterMCP is an **operational active monitor with conditioned power**. It is NOT an "AGI libre" but rather a **controlled AI agent** that:

- 🧠 **Thinks, observes, and analyzes** everything that is declared
- 🎯 **Only acts when PRD + SPEC authorize it**
- ⚖️ **Operates under contract** - executes only approved actions

### How It Behaves

**Observes simultaneously:**
- Screens, flows, metrics, scrapping, values, states

**Analyzes continuously:**
- Sales, payments, responses, deviations, opportunities

**Proposes or executes according to rule:**
- If SPEC says "propose" → proposes and waits
- If SPEC says "execute" → executes and registers

**Never improvises. Never gets "excited".**

### Clear Example (QR / Survey)

There's an active QR code
Nobody responds
It's not that MCP "sleeps" - the SPEC didn't define action for this event.

If SPEC says:
- "if no response → notify" → it does
- "if no response → execute action X" → it does
- If says nothing → nothing happens

This is **control, not limitation**.

### What AGI Means Here

AGI in your model is not consciousness - it's **General Capability Under Contract**.

- 🌐 **Understands any language**
- 🧠 **Reasons across any domain**
- 🔧 **Can create containers, test, discard**
- ✅ **But only launches what's approved in PRD**

It has the car keys,
but doesn't drive without orders.

### Odoo + Turbo MCP

**Odoo:**
- Dashboard
- Registry
- Visibility

**MCP:**
- Law
- Coordination
- Decision

Odoo doesn't command.
MCP doesn't display.
Each in its place.

### Conclusion

SmarterMCP doesn't "do what it wants".
It does **everything it should do**.

This makes it:
- ✅ **Reliable**
- ✅ **Regulable**
- ✅ **Sellable**
- ✅ **Scalable** to hardware and robotics after

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

- ✅ **Operational Monitor** - Active observation of all declared elements
- ✅ **Conditioned Power** - Acts only when SPEC + PRD authorize
- ✅ **Real-time Analysis** - Continuous evaluation of sales, payments, responses
- ✅ **n8n Integration** - Execute workflows under contract
- ✅ **MCP Protocol** - Standard compliance with control
- ✅ **Event-Driven** - Responds to defined events only
- ✅ **Secure Storage** - Supabase Vault for approved operations

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
# Important: Configure SPEC and PRD rules before running

# Run dev
npm run dev

# Build
npm run build

# Test (under controlled conditions)
npm test
```

### Development Principles

When developing for SmarterMCP, remember:

- **Contract-First**: Every feature must be defined in SPEC + PRD first
- **Controlled Execution**: No autonomous behavior, only rule-based actions
- **Event-Driven**: Responds only to declared events
- **Secure by Design**: All operations under authorization control

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
