// Spacing System - 8px Base Unit
export const SPACING = {
  // Base Units
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  
  // Section Spacing
  section: '48px',
  sectionLg: '64px',
  
  // Component Specific
  cardPadding: '16px',
  cardPaddingLg: '20px',
  buttonPaddingX: '20px',
  buttonPaddingXLg: '24px',
  buttonHeight: '48px',
  buttonHeightSm: '44px',
  
  // Grid Gaps
  cardGap: '24px',
  sectionGap: '32px',
  sectionGapLg: '48px',
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

// Grid System
export const GRID = {
  mobile: {
    columns: 1,
    padding: '16px',
  },
  tablet: {
    columns: 2,
    padding: '24px',
    gap: '24px',
  },
  desktop: {
    columns: 3,
    padding: '32px',
    gap: '24px',
    maxWidth: '1200px',
  },
};