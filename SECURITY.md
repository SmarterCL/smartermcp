# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### How to Report

Email security issues to: **security@smarterbot.cl**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity

### Severity Levels

- **Critical**: Fix within 24 hours
- **High**: Fix within 7 days
- **Medium**: Fix within 30 days
- **Low**: Fix in next release

## Security Measures

### Authentication

- OAuth 2.0 with Google
- Chilean RUT validation (Módulo 11)
- SMS 2FA verification
- Token-based access

### Data Protection

- HTTPS only
- Encrypted storage (Supabase Vault)
- httpOnly cookies
- CORS configured
- Rate limiting

### Infrastructure

- Cloudflare protection
- DDoS mitigation
- SSL/TLS certificates
- Regular security audits

### Compliance

- GDPR ready
- Chilean Law 19.628 (data protection)
- SOC 2 Type II (in progress)

## Best Practices

### For Users

1. Keep credentials secure
2. Enable 2FA
3. Use strong passwords
4. Log out after use
5. Report suspicious activity

### For Developers

1. Never commit secrets
2. Use environment variables
3. Validate all inputs
4. Keep dependencies updated
5. Follow OWASP guidelines

## Vulnerability Disclosure

We follow **Coordinated Vulnerability Disclosure**:

1. Report received
2. Vulnerability confirmed
3. Fix developed
4. Fix deployed
5. Public disclosure (after 90 days)

## Security Updates

Subscribe to security updates:

- GitHub Watch (Releases only)
- Email: security-updates@smarterbot.cl
- RSS: https://smarterbot.store/security.rss

## Hall of Fame

We acknowledge security researchers who responsibly disclose vulnerabilities.

---

Last updated: December 2025
