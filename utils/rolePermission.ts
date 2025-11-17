import { getModuleAllowedRoles as getModuleAllowedRolesFromConstants } from "@/constants/modules";

/**
 * Check if user has permission to access a module based on allowed roles
 */
export function hasRolePermission(
  userRoles: string[] | null | undefined,
  allowedRoles: string[] | undefined
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No restriction
  }

  if (!userRoles || userRoles.length === 0) {
    return false; // No roles assigned
  }

  const normalizedUserRoles = userRoles.map((role) => role.toLowerCase());
  return allowedRoles.some((allowedRole) =>
    normalizedUserRoles.includes(allowedRole.toLowerCase())
  );
}

/**
 * Get module allowed roles from module ID
 * This function uses the shared module definitions from constants/modules.ts
 */
export function getModuleAllowedRoles(moduleId: string): string[] | undefined {
  return getModuleAllowedRolesFromConstants(moduleId);
}

