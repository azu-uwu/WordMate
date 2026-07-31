/**
 * Component Loader - Nav
 * 
 * Chịu trách nhiệm load các component HTML dùng chung vào trang.
 * Sử dụng Vanilla JS với fetch() để đọc và inject component.
 * 
 * @module ComponentLoader
 */

// Import bottom-nav.js to call initBottomNav after loading
import { initBottomNav } from './bottom-nav.js';

/**
 * Component configuration
 * Map component HTML files to their target placeholder IDs
 */
const COMPONENT_CONFIG = {
    'header.html': '#header',
    'bottom-nav.html': '#bottom-nav'
};

// Track loaded components to prevent duplicate loading
// Use global flag to persist across module and non-module executions
const loadedComponents = typeof window !== 'undefined' 
    ? (window.__navLoadedComponents || (window.__navLoadedComponents = new Set()))
    : new Set();

/**
 * Get the base path for components relative to the current page
 * Computes path from the script location to frontend/src/components/
 * 
 * @returns {string} Base path to components directory
 */
function getComponentsBasePath() {
    // Get the current script's src attribute
    const currentScript = document.currentScript || (function() {
        // Fallback for older browsers
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    if (currentScript && currentScript.src) {
        // Extract directory path from script src
        // e.g., from "/frontend/src/js/components/nav.js" get "/frontend/src/js/components/"
        const scriptDir = currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1);
        // Navigate up: from js/components/ to src/components/ (up 2 levels)
        const basePath = scriptDir + '../../components/';
        return basePath;
    }
    
    // Fallback: assume standard structure (from pages/profile/)
    return '../../components/';
}

/**
 * Load header.js script dynamically after loading header.html
 * @returns {Promise<void>}
 */
function loadHeaderScript() {
    return new Promise((resolve, reject) => {
        const basePath = getComponentsBasePath();
        const scriptUrl = basePath + '../js/components/header.js';
        
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load header.js from ${scriptUrl}`));
        document.head.appendChild(script);
    });
}

/**
 * Initialize header after loading
 * Note: header.js runs code immediately when loaded, no init function needed
 * @returns {Promise<void>}
 */
async function initHeader() {
    try {
        // Load header.js script (it will execute immediately)
        await loadHeaderScript();
        
        console.log('[ComponentLoader] Header initialized');
    } catch (error) {
        console.error('[ComponentLoader] Failed to initialize header:', error);
    }
}

/**
 * Load a single component HTML file and inject it into the specified placeholder
 * 
 * @param {string} componentPath - Path to the component HTML file (relative to frontend/src/components/)
 * @param {string} placeholderId - CSS selector for the placeholder element
 * @returns {Promise<void>}
 */
async function loadComponent(componentPath, placeholderId) {
    // Skip if already loaded
    if (loadedComponents.has(componentPath)) {
        console.log(`[ComponentLoader] Component already loaded: ${componentPath}, skipping...`);
        return;
    }

    try {
        // Check if placeholder exists
        const placeholder = document.querySelector(placeholderId);
        if (!placeholder) {
            console.warn(`[ComponentLoader] Placeholder not found: ${placeholderId}, skipping...`);
            return;
        }

        // Get base path and construct full URL
        const basePath = getComponentsBasePath();
        const componentUrl = basePath + componentPath;
        
        // Fetch component HTML
        const response = await fetch(componentUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Read HTML content
        const htmlContent = await response.text();
        
        // Inject into placeholder
        placeholder.innerHTML = htmlContent;
        
        console.log(`[ComponentLoader] Successfully loaded: ${componentPath} → ${placeholderId}`);
        
        // Mark as loaded
        loadedComponents.add(componentPath);
        
        // Initialize component after loading
        if (componentPath === 'header.html') {
            await initHeader();
        } else if (componentPath === 'bottom-nav.html') {
            await initBottomNav();
        }
        
    } catch (error) {
        console.error(`[ComponentLoader] Failed to load ${componentPath}:`, error);
        // Không throw error để không ảnh hưởng đến các component khác
    }
}

/**
 * Load all configured components
 * 
 * @returns {Promise<void>}
 */
async function loadAllComponents() {
    console.log('[ComponentLoader] Starting component loading...');
    
    const loadPromises = Object.entries(COMPONENT_CONFIG).map(
        ([componentPath, placeholderId]) => loadComponent(componentPath, placeholderId)
    );
    
    await Promise.all(loadPromises);
    
    console.log('[ComponentLoader] Component loading completed');
}

/**
 * Load a specific component by name
 * Useful for dynamically loading additional components in the future
 * 
 * @param {string} componentName - Name of the component (e.g., 'header', 'bottom-nav')
 * @returns {Promise<void>}
 */
async function loadComponentByName(componentName) {
    const componentMap = {
        'header': 'header.html',
        'bottom-nav': 'bottom-nav.html'
    };
    
    const componentFile = componentMap[componentName];
    if (!componentFile) {
        console.warn(`[ComponentLoader] Unknown component: ${componentName}`);
        return;
    }
    
    const placeholderId = COMPONENT_CONFIG[componentFile];
    await loadComponent(componentFile, placeholderId);
}

// Export functions for module usage (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadComponent,
        loadAllComponents,
        loadComponentByName,
        COMPONENT_CONFIG
    };
}

// Export for ES modules (must be at the end for browser compatibility)
// Pages should explicitly call loadAllComponents() to load components
export { loadComponent, loadAllComponents, loadComponentByName, COMPONENT_CONFIG };
