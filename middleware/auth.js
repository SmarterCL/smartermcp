/**
 * Authentication middleware for SmarterMCP
 * Implements tenant-based authentication and authorization
 */

const jwt = require('jsonwebtoken');

class MCPAuthMiddleware {
  constructor() {
    this.secret = process.env.MCP_JWT_SECRET || 'default_secret_change_me';
    this.algorithm = 'HS256';
  }

  /**
   * Verify JWT token and extract tenant information
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret, { algorithms: [this.algorithm] });
      return {
        valid: true,
        decoded: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Authenticate request using Bearer token
   */
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization header missing or invalid',
        state: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const verification = this.verifyToken(token);

    if (!verification.valid) {
      console.log(`❌ Invalid token: ${verification.error}`);
      return res.status(401).json({
        error: 'Invalid token',
        state: 'UNAUTHORIZED'
      });
    }

    // Attach tenant info to request object
    req.tenant = verification.decoded.tenant;
    req.userId = verification.decoded.userId;
    req.permissions = verification.decoded.permissions || [];

    // Log authenticated access
    console.log(`🔐 Authenticated access for tenant: ${req.tenant}, user: ${req.userId}`);

    next();
  }

  /**
   * Check if user has required permissions
   */
  requirePermissions(requiredPermissions) {
    return (req, res, next) => {
      if (!req.permissions) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          state: 'FORBIDDEN'
        });
      }

      const hasPermission = requiredPermissions.every(permission => 
        req.permissions.includes(permission)
      );

      if (!hasPermission) {
        console.log(`🔒 Insufficient permissions. Required: ${requiredPermissions}, Got: ${req.permissions}`);
        return res.status(403).json({
          error: 'Insufficient permissions',
          state: 'FORBIDDEN'
        });
      }

      next();
    };
  }

  /**
   * Generate JWT token for a tenant/user
   */
  generateToken(tenant, userId, permissions = []) {
    const payload = {
      tenant: tenant,
      userId: userId,
      permissions: permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    };

    return jwt.sign(payload, this.secret, { algorithm: this.algorithm });
  }

  /**
   * Validate tenant access rights
   */
  async validateTenantAccess(tenantName) {
    // In a real implementation, this would check against the database
    // For now, we'll simulate checking if the tenant exists and is active
    
    // This would normally query Supabase to verify tenant status
    console.log(`🔍 Validating access for tenant: ${tenantName}`);
    
    // Simulate checking tenant in database
    // In real implementation: query Supabase tenants table
    return true; // Assume valid for this example
  }
}

module.exports = MCPAuthMiddleware;