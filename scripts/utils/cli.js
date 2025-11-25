/**
 * Shared CLI utilities for script argument parsing and common helpers
 */

import readline from 'readline';

/**
 * Parse command-line arguments
 * Supports: --key=value, --flag, --no-flag, -y
 * @returns {Object} Parsed arguments object
 */
export function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (const arg of args) {
    if (arg.startsWith('--no-')) {
      // Handle --no-flag syntax (sets flag to false)
      parsed[arg.slice(5)] = false;
    } else if (arg.startsWith('--')) {
      // Handle --key=value or --flag syntax
      const eqIndex = arg.indexOf('=');
      if (eqIndex !== -1) {
        const key = arg.slice(2, eqIndex);
        const value = arg.slice(eqIndex + 1);
        parsed[key] = value;
      } else {
        parsed[arg.slice(2)] = true;
      }
    } else if (arg === '-y') {
      // Shorthand for --yes
      parsed.yes = true;
    }
  }
  
  return parsed;
}

/**
 * Check if running in non-interactive mode (has CLI args)
 * @returns {boolean} True if CLI args were provided
 */
export function hasArgs() {
  return process.argv.length > 2;
}

/**
 * Create readline interface for interactive prompts
 * @returns {readline.Interface} Readline interface
 */
export function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompt user for input (interactive mode)
 * @param {readline.Interface} rl - Readline interface
 * @param {string} query - Question to ask
 * @returns {Promise<string>} User's response
 */
export function question(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Convert kebab-case or path to PascalCase
 * @param {string} str - Input string (e.g., "user-card" or "ui/accordion")
 * @returns {string} PascalCase string (e.g., "UserCard" or "Accordion")
 */
export function toPascalCase(str) {
  // Get the last part of the path (e.g., "accordion" from "ui/accordion")
  const name = str.includes('/') ? str.split('/').pop() : str;
  // Convert kebab-case to PascalCase
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
}

/**
 * Convert string to kebab-case
 * Handles PascalCase, camelCase, spaces, and underscores
 * @param {string} str - Input string (e.g., "InvalidName", "userCard", "my_component")
 * @returns {string} kebab-case string (e.g., "invalid-name", "user-card", "my-component")
 */
export function toKebabCase(str) {
  return str
    // Insert hyphen before uppercase letters (handles PascalCase/camelCase)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Insert hyphen between consecutive uppercase and lowercase (e.g., "XMLParser" -> "XML-Parser")
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Convert to lowercase
    .toLowerCase()
    // Remove any duplicate hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
}

/**
 * Validate kebab-case name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid kebab-case
 */
export function validateKebabCase(name) {
  const kebabRegex = /^[a-z][a-z0-9-]*$/;
  return kebabRegex.test(name);
}

/**
 * Get validation error message for kebab-case
 * @param {string} type - Type of item (e.g., "Page", "Component")
 * @returns {string} Error message
 */
export function getKebabCaseError(type) {
  return `${type} name must be kebab-case (lowercase, hyphens only, e.g., "user-profile")`;
}

