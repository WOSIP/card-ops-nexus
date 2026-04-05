# Plan: Add Operator Management to POS Identity Popup

Add a button and management interface within the POS Identity popup to allow linking or unlinking operators to the terminal.

## 1. Context Update (`src/context/ManagementContext.tsx`)
- Add `unlinkOperatorFromPos` function to handle removing bidirectional links between operators and POS terminals.
- Update the `ManagementContextType` and `ManagementProvider`.

## 2. POS Identity Popup Enhancement (`src/components/management/pos/POSIdentityDialog.tsx`)
- Add a new section "Assigned Personnel" to display the currently linked operator.
- Implement an "Unlink" button (if an operator is assigned) and a "Link Operator" button.
- Add props `onLink` and `onUnlink` to handle these actions from the parent component.

## 3. Manager Integration (`src/components/management/POSManager.tsx`)
- Implement `handleUnlink` to call the context's unlink function and show a toast notification.
- Pass `handleUnlink` and a trigger for `setIsLinkOpen(true)` to the `POSIdentityDialog`.

## 4. Link Dialog Refinement (`src/components/management/LinkOperatorPOSDialog.tsx`)
- Ensure the dialog correctly reflects that it's linking to the specific POS passed as `sourceItem`.

## Verification
- Verify that the POS Identity popup now shows the current operator.
- Verify that clicking "Unlink" removes the operator from the POS and vice versa.
- Verify that clicking "Link Operator" opens the assignment dialog.
- Ensure all search and filter functionalities remain intact.
