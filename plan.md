# Plan: Improve POS Terminal CSV Import Functionality

The goal is to enhance the UI/UX of the POS terminal import process, making it more robust, visually appealing, and user-friendly.

## 1. POSManager.tsx Improvements
- Refactor the "Bulk Import" button group for better visibility and UX.
- Consolidate "Download Template" logic if necessary or ensure it's prominently accessible.

## 2. ImportPOSDialog.tsx Overhaul
### Visual Enhancements
- Match the application's glassmorphism theme (replace the dark `#0A0A0B` with `bg-card/30 backdrop-blur-xl`).
- Improve the upload dropzone with smoother animations and better instructions.
- Add a refined parsing state with descriptive status messages.

### Functional Enhancements
- **Project Assignment**: Add a dropdown in the review step to assign all imported terminals to an existing project.
- **Robust Parsing**:
    - Expand header mapping to include more variations (e.g., "HWID" for serial, "Mobile" for phone).
    - Handle quoted fields more reliably.
- **Improved Review Step**:
    - Enhance the validation display (errors/warnings).
    - Allow users to filter the review table by status (All/Valid/Invalid).
    - Add a "Clear Invalid Rows" convenience button.
- **Enhanced Success State**:
    - Show a detailed summary of the import.
    - Add a button to "View Imported" which would filter the main POS list.

## 3. Data Integration
- Ensure the `deploymentTag` and `projectId` (new) are correctly applied to the terminals before calling `onImport`.
- Use `sonner` for consistent toast notifications.

## 4. File Changes
- `src/components/management/pos/ImportPOSDialog.tsx`: Primary overhaul of the import logic and UI.
- `src/components/management/POSManager.tsx`: Update the import button and its container.
