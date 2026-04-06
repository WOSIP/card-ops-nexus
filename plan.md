## Plan: Enhance Project Management Page

**Objective:** Modify the Project Management page to display a list of projects, enable clicking on a project to show its details in a popup, and suppress the display of "cards" within that popup.

**Key Files:**
- `src/components/management/ProjectManager.tsx`
- `src/components/management/projects/EditProjectDialog.tsx` (or a new component)

**Implementation Steps:**

1.  **Modify `src/components/management/ProjectManager.tsx`:**
    *   Fetch and display a list of projects. (Assuming a data fetching mechanism exists or needs to be added).
    *   Implement state management for the currently selected project and popup visibility.
    *   Add click handlers to project list items to open the project details popup.

2.  **Create/Adapt Project Detail Popup Component:**
    *   **Option A (Adapt):** Modify `src/components/management/projects/EditProjectDialog.tsx` to serve as a display-only popup. Ensure it does not render any "card" related elements.
    *   **Option B (New Component):** Create a new component (e.g., `ProjectDetailPopup.tsx`) for displaying project details. This component will receive project data and explicitly exclude "card" UIs.
    *   The chosen popup component will receive the selected project's data as props.

3.  **Integrate Popup:**
    *   Conditionally render the popup component within `ProjectManager.tsx` based on the popup visibility state.
    *   Ensure the popup correctly suppresses the display of "cards."

4.  **Verification:**
    *   Manually test clicking on projects to confirm the popup appears with the correct details.
    *   Visually inspect the popup to ensure no "cards" are displayed.
    *   Verify that other management sections and POS functionalities remain unaffected.
