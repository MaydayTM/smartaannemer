# Known Issues & Future Improvements

**Last Updated:** 2025-11-19
**Phase:** Lead Finder Tool (Phase 6) - MVP Complete

---

## Critical Issues

None - all critical issues have been resolved.

---

## Important - Should Fix Before Production

### 1. Budget Range UX (LeadFinderForm)
**Location:** `features/lead-finder/components/LeadFinderForm.tsx:223-244`

**Issue:** Budget range uses a single slider that only controls maximum value. Minimum is fixed at €10,000.

**Impact:** Users cannot customize their budget range properly (e.g., can't set 20k-40k range).

**Solution:** Implement dual-range slider or two separate input fields for min/max.

---

### 2. Missing Accessibility Attributes (LeadFinderForm)
**Location:** `features/lead-finder/components/LeadFinderForm.tsx` (throughout)

**Issue:** Form fields lack proper ARIA attributes for screen readers:
- Missing `required` attributes
- Missing `aria-required="true"`
- Missing `aria-invalid` for error states
- Missing `aria-describedby` for error messages
- Error messages not properly associated with inputs

**Impact:** Poor accessibility for users with screen readers (WCAG compliance issue).

**Solution:** Add proper ARIA attributes to all form fields and error messages.

**Example Fix:**
```typescript
<input
  id="address"
  type="text"
  required
  aria-required="true"
  aria-invalid={!!errors.address}
  aria-describedby={errors.address ? 'address-error' : undefined}
  value={formData.address || ''}
  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  className="..."
/>
{errors.address && (
  <p id="address-error" role="alert" className="mt-1 text-sm text-red-400">
    {errors.address}
  </p>
)}
```

---

### 3. Missing Contact & Complete Steps (LeadFinderSection)
**Location:** `features/lead-finder/components/LeadFinderSection.tsx:44-45`

**Issue:** Context defines 4 steps ('form' | 'results' | 'contact' | 'complete'), but only 'form' and 'results' have UI components. Clicking "Bewaar mijn resultaten" button navigates to 'contact' step which shows blank screen.

**Impact:** User flow is incomplete - users cannot save their results or see completion confirmation.

**Solution:** Implement ContactForm and CompleteMessage components.

**Temporary Fix:** Add placeholders:
```typescript
{currentStep === 'contact' && (
  <div className="text-center py-8 text-slate-400">
    Contactformulier komt binnenkort.
  </div>
)}
{currentStep === 'complete' && (
  <div className="text-center py-8">
    <h3 className="text-xl font-semibold text-emerald-300">Bedankt!</h3>
    <p className="text-slate-300 mt-2">We nemen zo snel mogelijk contact met je op.</p>
  </div>
)}
```

---

## Nice to Have - Enhancements

### 4. Error Clearing Logic (LeadFinderForm)
**Issue:** When user corrects a field error and resubmits, previous errors remain visible.

**Solution:** Clear individual errors on field change:
```typescript
onChange={(e) => {
  setFormData({ ...formData, address: e.target.value })
  if (errors.address) {
    setErrors({ ...errors, address: undefined })
  }
}}
```

---

### 5. Loading State on Submit Button (LeadFinderForm)
**Issue:** Submit button doesn't show loading state during API call.

**Solution:**
```typescript
<button type="submit" disabled={!canUseCredit || isLoading}>
  {isLoading ? 'Bezig met laden...' : 'Bereken mijn offerte'}
</button>
```

---

### 6. Better API Error Messages (LeadFinderForm)
**Issue:** Generic error message shown for all API failures.

**Solution:** Parse and display specific error from API response:
```typescript
const errorData = await response.json()
setError(errorData.error || 'Er ging iets mis. Probeer het opnieuw.')
```

---

### 7. Missing Component Documentation
**Issue:** Components lack JSDoc comments explaining purpose and usage.

**Impact:** Harder for other developers to understand component behavior.

**Solution:** Add JSDoc to all exported components:
```typescript
/**
 * LeadFinderSection Component
 *
 * Main lead finder tool section with multi-step wizard.
 * Provides context for form state management.
 *
 * Steps: form → results → contact → complete
 *
 * @requires CreditProvider - Must be within CreditProvider
 */
export function LeadFinderSection() {
```

---

### 8. Missing Test Coverage
**Issue:** No unit tests or E2E tests for Lead Finder components.

**Impact:** Harder to catch regressions, refactor safely, or verify functionality.

**Solution:** Add test files:
- `features/lead-finder/components/__tests__/LeadFinderForm.test.tsx`
- `features/lead-finder/components/__tests__/LeadFinderResults.test.tsx`
- `features/lead-finder/context/__tests__/LeadFinderContext.test.tsx`
- `lib/repositories/__tests__/ContractorsRepository.test.ts`
- `lib/repositories/__tests__/LeadsRepository.test.ts`
- `lib/utils/__tests__/pricing.test.ts`

**Test scenarios:**
- Form validation with valid/invalid inputs
- API submission success/failure
- Contractor matching logic
- Price calculation accuracy
- Context state updates
- Credit checking integration

---

### 9. Error Boundary for Lead Finder
**Issue:** No error boundary wrapping LeadFinderSection.

**Solution:** Add Error Boundary component to gracefully handle unexpected errors:
```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <LeadFinderSection />
</ErrorBoundary>
```

---

### 10. Transition Animations
**Issue:** Abrupt transitions between form steps (form → results).

**Solution:** Add fade/slide transitions for better UX using Framer Motion or CSS transitions.

---

## Feature Gaps (Future Phases)

### Contact Form (Phase 7?)
Currently, users can view estimates and contractors but cannot save their information. Need to implement:
- Contact information form component
- Email/phone validation
- Lead submission with contact details
- Success confirmation

### Email Notifications (Phase 8?)
- Send estimate email to user
- Send lead notification to matched contractors
- Email templates in Dutch

### Admin Dashboard (Phase 9?)
- View all leads
- Contractor management
- Credit usage analytics
- Lead status tracking

### Advanced Features (Phase 10?)
- User accounts/authentication
- Save multiple projects
- Compare estimates
- Direct messaging with contractors
- Review system

---

## Database Schema Limitations

### Estimate Breakdown Not Stored
**Current Behavior:** Breakdown is recalculated on every lead retrieval using pricing utility.

**Limitation:** If pricing algorithm changes, historical breakdowns will change.

**Solution (if needed):** Add database columns for storing breakdown values:
- `estimate_breakdown_materials_min/max`
- `estimate_breakdown_labor_min/max`
- `estimate_breakdown_scaffolding_min/max`
- `estimate_breakdown_insulation_min/max`

---

## Performance Optimizations (Not Critical)

### Memoize resetForm Function (LeadFinderContext)
**Location:** `features/lead-finder/context/LeadFinderContext.tsx:51-60`

**Issue:** resetForm function not wrapped in useCallback.

**Solution:**
```typescript
const resetForm = useCallback(() => {
  setFormData(initialFormData)
  setContactInfo({})
  setEstimate(null)
  setMatchedContractors([])
  setSelectedContractor(null)
  setCurrentStep('form')
  setIsLoading(false)
  setError(null)
}, [])
```

---

## Code Quality Improvements

### Remove Unused Imports
All unused imports have been cleaned up.

### Extract Reusable Components
**Suggestion:** Extract ContractorCard from LeadFinderResults for reusability:
```typescript
// features/lead-finder/components/ContractorCard.tsx
export function ContractorCard({ contractor }: { contractor: Contractor }) {
  // Card implementation
}
```

---

## Browser Compatibility

### Tested Browsers
- Chrome/Edge (Chromium) - ✅ Working
- Safari - ⚠️ Not tested
- Firefox - ⚠️ Not tested
- Mobile browsers - ⚠️ Not tested

**Recommendation:** Test on all major browsers before production deployment.

---

## Security Review Needed

### Input Validation
- ✅ Client-side validation with Zod
- ✅ Server-side validation in API route
- ⚠️ Need security audit for SQL injection, XSS, CSRF

### Rate Limiting
- ⚠️ No rate limiting on `/api/leads/submit`
- **Risk:** API abuse, spam submissions
- **Solution:** Implement rate limiting (e.g., max 5 submissions per hour per IP)

### Credit System
- ✅ Session-based credit tracking implemented
- ⚠️ No protection against cookie manipulation
- **Solution:** Add server-side validation with additional security tokens

---

## Deployment Checklist

Before going to production:

- [ ] Fix Important issues (#1-3)
- [ ] Add accessibility attributes (#2)
- [ ] Implement contact & complete steps (#3)
- [ ] Add error boundaries
- [ ] Test on all major browsers
- [ ] Add rate limiting to API
- [ ] Security audit
- [ ] Performance testing
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Configure production environment variables
- [ ] Test email notifications (if implemented)
- [ ] Verify Supabase RLS policies in production

---

## Notes

This document tracks technical debt and future improvements for the Lead Finder Tool. All critical issues have been resolved during development. The MVP is functional and ready for internal testing.

For questions or to prioritize fixes, contact the development team.
