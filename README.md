# SmarterMCP - Operational Active Monitor with Conditioned Power

> Enterprise-grade AI agent that thinks, observes, analyzes and acts only under SPEC + PRD authorization

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-compatible-green.svg)](https://n8n.io)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io)

## 🏆 Stats
[![GitHub stars](https://img.shields.io/github/stars/SmarterCL/smartermcp?style=social)](https://github.com/SmarterCL/smartermcp)
[![GitHub forks](https://img.shields.io/github/forks/SmarterCL/smartermcp?style=social)](https://github.com/SmarterCL/smartermcp)
[![GitHub watchers](https://img.shields.io/github/watchers/SmarterCL/smartermcp?style=social)](https://github.com/SmarterCL/smartermcp)

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

## 🚀 Inicio Rápido

### Para Usuarios

1. **Inicio de Sesión**: Visita [rut.smarterbot.store/login](https://rut.smarterbot.store/login)
2. **Autenticación**: Inicia sesión con Google OAuth
3. **Verificación de Identidad**: Ingresa RUT chileno y número de teléfono
4. **Verificación SMS**: Ingresa código de 6 dígitos
5. **Comenzar a Usar**: Accede a tus workflows de n8n vía MCP

## 🏭 SmarterMCP funciona sobre un dominio operativo
que actúa como:

- motor de ventas
- motor contable
- motor de pagos
- punto único de ejecución y control

no es un "backend más".
no es un login.
no es un SaaS genérico.

es la capa que gobierna el negocio en producción.

### Qué significa "dominio operativo" (para que no haya dudas)

Un dominio operativo es un dominio web que:

- está conectado a un ERP real (Odoo)
- procesa ventas reales
- registra contabilidad real
- ejecuta pagos reales
- expone APIs operativas (no demo)

### Ejemplos válidos:

- empresa.cl
- tienda.empresa.cl

SmarterMCP es un plano de control acoplado a ERP.
No es una herramienta general. Opera solo con stack empresarial activo.

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

## 📦 Deployment & Commercial Model

SmarterMCP is a control plane.
It governs how agents, services, and actions are authorized and executed.

It can be deployed on VPS, cloud, or hybrid environments.
The deployment model does not change the contract, rules, or behavior of the system.

When reading this project, you might wonder:

"Do I install this myself?"
"Is this a SaaS?"
"Is it a dev tool or a managed service?"

The answer is simple:

SmarterMCP supports three usage models.

Mode A — Self-hosted (Your own VPS)

Designed for technical companies and integrators.

Runs on your own VPS or infrastructure

Connects to your own Odoo v19 instance

You govern your own agents, rules, and execution

Full control over data, logic, and operations

Value: maximum control
Typical users: enterprises, system integrators, technical teams

Mode B — Managed (Smarter Cloud)

Designed for non-technical businesses.

Smarter provides and operates the MCP

Rules, runtime, and updates are managed by us

The client connects Odoo / ERP / APIs

Includes SLA, support, and subscription billing

Value: operate without technical complexity
Typical users: businesses, operations teams, decision-makers

Mode C — Hybrid (Federated Control Plane)

Designed for scalable, multi-entity operations (2026-ready).

Central MCP operated by Smarter

Distributed services (client VPS, Odoo, n8n, external APIs)

Shared rules and governance

Federated execution across environments

Value: scalable, sellable, replicable
Typical users: platforms, multi-brand companies, advanced deployments

📌 Key Principle

Odoo, n8n, and external systems are service providers.
They do not command the system.

SmarterMCP defines the rules.
Execution happens only under SPEC and PRD authorization.

## 📦 Modelo de Despliegue y Comercial

SmarterMCP es un plano de control.
Gobierna cómo los agentes, servicios y acciones son autorizados y ejecutados.

Puede desplegarse en VPS, cloud o entornos híbridos.
El modelo de despliegue no cambia el contrato, las reglas ni el comportamiento del sistema.

Al leer este proyecto, es normal preguntarse:

"¿Esto lo instalo yo?"
"¿Es un SaaS?"
"¿Es una herramienta de desarrollo o un servicio gestionado?"

La respuesta es simple:

SmarterMCP tiene tres modos de uso.

Modo A — Autohospedado (VPS propio)

Pensado para empresas técnicas e integradores.

Corre en tu propio VPS o infraestructura

Se conecta a tu instancia de Odoo v19

Tú gobiernas tus agentes, reglas y ejecución

Control total de datos y operaciones

Valor: control total
Uso típico: empresas, integradores, equipos técnicos

Modo B — Gestionado (Cloud Smarter)

Pensado para empresas no técnicas.

Smarter provee y opera el MCP

Reglas, runtime y actualizaciones gestionadas

El cliente conecta Odoo / ERP / APIs

Incluye SLA, soporte y pago mensual

Valor: operar sin complejidad técnica
Uso típico: negocio, operaciones, dirección

Modo C — Híbrido (Plano de control federado)

Pensado para operaciones escalables y multi-entidad.

MCP central operado por Smarter

Servicios distribuidos (VPS del cliente, Odoo, n8n, APIs externas)

Reglas comunes

Ejecución federada entre entornos

Valor: escalable, vendible, replicable
Uso típico: plataformas, grupos empresariales, despliegues avanzados

Principio clave

Odoo, n8n y los sistemas externos no mandan.
Son proveedores de servicio.

SmarterMCP define las reglas.
La ejecución solo ocurre bajo autorización SPEC + PRD.

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

## SmarterOS API - Enterprise API with MCP Integration

La API central de SmarterOS: Plataforma gobernada con FastAPI-MCP, Qwen LLM y OpenRouter para empresas chilenas.

[https://github.com/SmarterCL/api.smarterbot.cl](https://github.com/SmarterCL/api.smarterbot.cl)

---

Made with ❤️ by [SmarterOS](https://smarterbot.store)

[Website](https://smarterbot.store) • [GitHub](https://github.com/SmarterCL) • [Docs](https://smarterbot.store/docs)