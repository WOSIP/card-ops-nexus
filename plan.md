# Dark Theme Implementation Plan

The goal is to transition the entire application to a sophisticated dark template while preserving all existing functionality.

## 1. Global Styles Update
- Modify `src/index.css` to redefine the `:root` variables with a deep dark palette (Zinc-950/900 based).
- Ensure high contrast for text and interactive elements.
- Adjust chart color variables for dark mode compatibility.

## 2. Layout Enhancements
- Update `DashboardLayout.tsx`:
  - Main background to deep dark (`bg-background`).
  - Sidebar and Header to card backgrounds (`bg-card`).
  - Adjust shadows and borders for subtle depth on dark surfaces.
  - Update search input and mobile menu backdrop for dark theme consistency.

## 3. Component Styling Refinement
- **Overview Dashboard**:
  - Update `StatCard` to use subtle tinted backgrounds instead of solid colors.
  - Adjust Recharts colors (axes, grid lines, tooltips) for dark background.
- **Management Modules**:
  - **OperatorManager**: Refactor colored stat cards from solid backgrounds to dark backgrounds with colored top-borders and icons.
  - **UserManager**: Apply similar stat card refinements.
  - **CardManager**: Ensure table row hover states and status badges are optimized for dark theme.
  - **ProjectManager**: Enhance card gradients and progress bar visibility.
  - **POSManager**: Adjust live feed status and terminal card styles.

## 4. Final Polish
- Verify all `sonner` notifications and `dialog` overlays match the new dark theme.
- Ensure responsive mobile menus and popovers are correctly styled.
