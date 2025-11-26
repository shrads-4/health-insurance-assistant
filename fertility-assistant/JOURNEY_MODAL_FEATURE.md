# New Journey Modal Feature

## Overview
The New Journey Modal is a feature that appears when users first visit the fertility journey timeline page after logging in. It prompts them to add a new step to their fertility treatment journey.

## Features

### Modal Behavior
- **Appears once per login session**: Uses `sessionStorage` to track if the modal has been shown
- **Non-intrusive**: Clicking outside the modal closes it without saving
- **Session-based tracking**: Each login session gets one modal appearance per user

### Form Fields
All fields are mandatory:

1. **Treatment Type** (Dropdown)
   - Consultation (👩‍⚕️)
   - Testing (🔬)
   - Medication (💊)
   - IVF Treatment (🧬)
   - Procedures (🏥)
   - IUI (💉)

2. **Status** (Radio buttons)
   - Planned
   - Completed
   - Postponed

3. **Date** (Date picker)
   - Required field

4. **Total Cost** ($)
   - Required numeric field
   - Minimum value: 0

5. **Insurance Paid** ($)
   - Required numeric field
   - Minimum value: 0

6. **Your Cost** (Auto-calculated display)
   - Automatically calculated: Total Cost - Insurance Paid
   - Displayed in red to highlight patient responsibility

### Design
- **Color Scheme**: Matches the timeline page (green/sage palette)
  - Primary green: `#ADC178`
  - Secondary green: `#8FA05F`
  - Light green: `#E8F0D8`
  - Very light green: `#F8FBF4`
- **Responsive**: Works on mobile, tablet, and desktop
- **Validation**: Real-time error checking with clear error messages

## File Structure

### Components
- **`components/NewJourneyModal.js`**: Main modal component
- **`styles/NewJourneyModal.module.css`**: Styling for the modal

### Hooks
- **`lib/useNewJourneyModalSession.js`**: Custom hook for session tracking

### API
- **`pages/api/journey-entry.js`**: Backend API endpoint for saving entries

### Updated Files
- **`components/Timeline.js`**: Integrated modal and session tracking
- **`context/AuthContext.js`**: Provides user authentication context
- **`lib/auth.js`**: Contains authentication utilities

## Data Flow

### 1. User Logs In
- Auth context tracks the user
- Session storage is cleared for this user

### 2. User Navigates to Timeline Page
- `useNewJourneyModalSession` hook checks if modal has been shown
- If not shown, modal opens automatically
- Modal is marked as "should show" until user closes it

### 3. User Fills Out Form
- Form validates all required fields
- Auto-calculates "Your Cost" as user enters insurance paid amount
- Form prevents submission if validation fails

### 4. User Submits Form
- Data is saved to localStorage (client-side backup)
- Data is sent to API endpoint to save in Firestore
- Modal marks itself as "shown" in sessionStorage
- Modal closes
- Loading state prevents duplicate submissions

### 5. Data Storage

#### localStorage (Client-side Backup)
```javascript
localStorage.getItem('newJourneyEntries') 
// Returns array of journey entries
```

#### Firestore (Server-side)
```
users/{uid}/journeyEntries/{docId}
```

Stored data includes:
- `treatmentType`: Type of treatment
- `status`: Planned/Completed/Postponed
- `date`: Date of treatment
- `totalCost`: Total cost as number
- `insurancePaid`: Insurance payment as number
- `trueCost`: Calculated patient cost
- `createdAt`: Server timestamp

## Component Props

### NewJourneyModal
```javascript
<NewJourneyModal
  isOpen={boolean}           // Controls visibility
  onClose={function}         // Called when modal closes (outside click)
  onSubmit={function}        // Called with validated form data
  isSaving={boolean}         // Shows loading state
/>
```

### useNewJourneyModalSession Hook
```javascript
const {
  shouldShowModal,    // boolean - True if modal should be shown
  markModalAsShown,   // function - Mark modal as shown for this session
  isLoading           // boolean - True while checking session state
} = useNewJourneyModalSession();
```

## Validation Rules

- **All fields required**: User must fill all fields before submitting
- **Cost fields numeric**: Must be valid numbers >= 0
- **Date required**: Must select a valid date
- **Treatment type required**: Must select from dropdown
- **Status required**: Must select one radio option

## Error Handling

- **Validation errors**: Shown inline next to field, updated in real-time
- **API errors**: Logged to console, data still saved locally
- **Network errors**: Handled gracefully, user-facing alert shown
- **Auth errors**: Handled by auth context

## Usage Example

To retrieve saved journey entries:

```javascript
// From localStorage
const entries = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');

// From Firestore (requires backend query)
// Entries are stored at: users/{uid}/journeyEntries/{docId}
```

## Future Enhancements

When you're ready to use this data to update the timeline page:

1. **Fetch entries**: Query Firestore for the user's journey entries
2. **Transform data**: Convert API format to timeline event format
3. **Merge with existing**: Combine new entries with existing timeline events
4. **Update UI**: Display new entries in the timeline visualization

Example transformation:
```javascript
const timelineEvent = {
  id: journeyEntry.id,
  date: journeyEntry.date,
  type: journeyEntry.treatmentType,
  status: journeyEntry.status,
  title: getTitleFromType(journeyEntry.treatmentType),
  description: 'Added by user',
  costs: {
    totalCost: journeyEntry.totalCost,
    insurancePaid: journeyEntry.insurancePaid,
    patientPaid: journeyEntry.trueCost
  },
  // ... other required fields
};
```

## Session Management

The modal uses `sessionStorage` which:
- **Persists during page refreshes**: Same tab maintains state
- **Clears on tab close**: New tab/window starts fresh
- **Per-tab storage**: Each browser tab has its own session
- **Cleared on logout**: AuthContext resets session when user logs out

Key: `newJourneyModal_{uid}_shown`

Example:
```
newJourneyModal_abc123xyz_shown = "true"
```

## Accessibility Considerations

- Form uses semantic HTML elements
- Labels properly associated with inputs
- Error messages are readable and descriptive
- Color contrast meets WCAG standards
- Focus states are visible
- Modal is keyboard navigable

## Testing Checklist

- [ ] Modal appears only once per login session
- [ ] Modal closes on outside click without saving
- [ ] Form validation prevents submission without all fields
- [ ] Auto-calculation of "Your Cost" works correctly
- [ ] Data saves to localStorage
- [ ] Data sends to API endpoint
- [ ] Confirmation button is disabled while saving
- [ ] Works on mobile devices
- [ ] Works on different screen sizes
- [ ] Cross-browser compatibility
