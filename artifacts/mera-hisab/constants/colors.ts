/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#10233f',
    tint: '#1d63d8',

    // Core surfaces
    background: '#f6f9ff',
    foreground: '#10233f',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#10233f',

    // Primary action color (buttons, links, active states)
    primary: '#1d63d8',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#eaf1ff',
    secondaryForeground: '#1d4fa9',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#eef3fb',
    mutedForeground: '#6d7d96',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#dce9ff',
    accentForeground: '#174caa',

    // Destructive actions (delete, error states)
    destructive: '#d04d55',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#dbe5f4',
    input: '#ccd9ed',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 14,
};

export default colors;
