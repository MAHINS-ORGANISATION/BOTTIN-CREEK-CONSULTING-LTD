# EAS Build Errors & Solutions

This document lists the errors encountered during the EAS build process and their solutions.

## 1. EAS Credentials Permission Error
**Error:** `Entity not authorized` when running `eas credentials`  
**Description:** Permission denied when trying to access EAS project with wrong account  
**Solution:** Set correct `projectId` in `app.config.js` under `extra.eas.projectId` or run `eas init` with correct account

## 2. Expo Build Properties Plugin Error
**Error:** `PluginError: Failed to resolve plugin for module "expo-build-properties"`  
**Description:** Plugin not found during production build  
**Solution:** Moved `expo-build-properties` from `devDependencies` to `dependencies` in `package.json`

## 3. Path Alias Resolution Error
**Error:** `Unable to resolve module @/contexts/ThemeContext` or `@/components/haptic-tab`  
**Description:** Metro bundler cannot resolve `@/` path aliases during EAS build  
**Solution:** 
- Added `experiments.tsconfigPaths: true` in `app.config.js`
- Set `baseUrl: "."` in `tsconfig.json`
- Created `babel.config.js` with `babel-plugin-module-resolver`
- Moved `babel-plugin-module-resolver` to `dependencies`

## 4. Blog Syntax Error
**Error:** `SyntaxError: 'import' and 'export' may only appear at the top level`  
**Description:** Extraneous code in `blog.tsx` causing syntax error  
**Solution:** Removed hardcoded blog data array that was left after refactoring

## 5. Expo Doctor Warnings
**Error:** Multiple warnings from `expo doctor`  
**Description:** Package version mismatches and configuration issues  
**Solution:** 
- Ran `npx expo install --fix` to update package versions
- Removed `@expo/config-plugins` from dependencies (use `expo/config-plugins` directly)

## 6. NODE_ENV Production Warning
**Error:** Warning about `NODE_ENV=production` in build profile  
**Description:** Informational message about production-only package installation  
**Solution:** Removed `env.NODE_ENV: "production"` from production build profile in `eas.json`

## 7. Version Code Warning
**Error:** `android.versionCode field in app config is ignored when version source is set to remote`  
**Description:** Version code ignored when using remote version source  
**Solution:** 
- Changed `appVersionSource` from `"remote"` to `"local"` in `eas.json`
- Removed `versionCode` from `app.config.js` (or set `autoIncrement: false`)

## 8. Babel Plugin Module Resolver Missing
**Error:** `Cannot find module 'babel-plugin-module-resolver'`  
**Description:** Babel plugin not available during build process  
**Solution:** Moved `babel-plugin-module-resolver` from `devDependencies` to `dependencies` in `package.json`

## Key Takeaways

- **Build-time dependencies:** Plugins and tools used during build must be in `dependencies`, not `devDependencies`
- **Path aliases:** Require multiple configuration layers (TypeScript, Metro, Babel) for EAS builds
- **Version management:** Use `appVersionSource: "local"` for manual version control
- **Package versions:** Always run `expo doctor` and `npx expo install --fix` before building
