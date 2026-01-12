# Testing Guide: Predefined Q&A Feature

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or similar)

### 2. Select Chef Art Smith's Reunion

1. Open the app in your browser
2. From the vendor dropdown, select **"Chef Art Smith's Reunion"**
3. You should see the tenant selector show this restaurant

### 3. Test Each Predefined Question

Try typing these questions (you can use exact wording or variations):

#### Question 1: Legal Name
**Exact question:** `What is the legal name of the tenant?`

**Variations that work:**
- "legal name of tenant"
- "what is legal name"
- "tenant legal name"

**Expected Answer:**
```
## What is the legal name of the tenant?

The legal name of the tenant is Art Smith Reunion, LLC, 
operating as Chef Art Smith's Reunion restaurant.

Citations:
- Chef Art Smith Lease - Executed May 11, 2020
- Lease Agreement - Pages 1-47
```

#### Question 2: First Lease Year
**Exact question:** `What was the First Lease Year?`

**Variations that work:**
- "first lease year"
- "what was first lease year"
- "when did lease start"

**Expected Answer:**
```
## What was the First Lease Year?

The First Lease Year commenced on May 11, 2020, as indicated 
in the lease execution date. This marks the beginning of the 
initial lease term.

Citations:
- Chef Art Smith Lease - Executed May 11, 2020
- Lease Agreement - Pages 1-47
```

#### Question 3: Tenant Notice Address
**Exact question:** `What is the Tenant Notice Address?`

**Variations that work:**
- "tenant notice address"
- "what is notice address"
- "where to send notices"

**Expected Answer:**
```
## What is the Tenant Notice Address?

The Tenant Notice Address is:

Art Smith Reunion, LLC
Attention: Arthur Smith
600 East Grand Avenue
Chicago, IL 60611

All formal notices, demands, and communications must be sent 
to this address via certified mail, return receipt requested, 
or by recognized overnight courier service.

Citations:
- Chef Art Smith Lease - Executed May 11, 2020
- Lease Agreement - Pages 1-47
```

#### Question 4: Premises Delivery Date
**Exact question:** `When is the Premises delivery date?`

**Variations that work:**
- "premises delivery date"
- "when was premises delivered"
- "delivery date"

**Expected Answer:**
```
## When is the Premises delivery date?

The Premises delivery date was established as May 1, 2020. 
The landlord delivered possession of the premises to the 
tenant on this date, allowing for tenant improvements and 
preparations prior to the lease commencement on May 11, 2020.

Citations:
- Chef Art Smith Lease - Executed May 11, 2020
- Lease Agreement - Pages 1-47
```

## Testing Checklist

- [ ] Application starts without errors
- [ ] Chef Art Smith's Reunion appears in vendor dropdown
- [ ] Question 1 (Legal Name) returns correct answer
- [ ] Question 2 (First Lease Year) returns correct answer
- [ ] Question 3 (Notice Address) returns correct answer
- [ ] Question 4 (Premises Delivery) returns correct answer
- [ ] Variations of questions work (fuzzy matching)
- [ ] Other questions still work (fallback to keyword matching)
- [ ] Citations appear at bottom of each answer

## Testing Edge Cases

### Case Sensitivity
Try questions in different cases:
- ALL CAPS: "WHAT IS THE LEGAL NAME OF THE TENANT?"
- lowercase: "what is the legal name of the tenant?"
- Mixed: "What Is The Legal Name Of The Tenant?"

All should work!

### Partial Matching
Try partial questions:
- "legal name" → should match "What is the legal name of the tenant?"
- "first lease" → should match "What was the First Lease Year?"
- "notice address" → should match "What is the Tenant Notice Address?"

### Other Vendors
Select a different vendor (e.g., "Giordano's Pizza") and verify:
- The predefined questions DON'T trigger for other vendors
- The app still works normally with keyword matching

### Non-Matching Questions
Try questions that don't match any predefined ones:
- "What is the rent amount?"
- "Tell me about revenue"

These should fall back to the regular keyword-based responses.

## Troubleshooting

### Issue: JSON import error
**Solution:** Make sure `chef-art-smith-qa.json` exists in `src/app/lib/`

### Issue: No response when typing questions
**Solution:** 
1. Check browser console for errors
2. Verify "Chef Art Smith's Reunion" is selected
3. Check that the build was successful

### Issue: Wrong answer returned
**Solution:** Check spelling and matching logic in `checkPredefinedQuestions()`

## Success Criteria

✅ All 4 predefined questions return consistent, accurate answers
✅ Fuzzy matching works for question variations  
✅ Citations are displayed
✅ System falls back to keyword matching for non-predefined questions
✅ Other vendors continue to work normally
✅ No console errors or warnings

## Visual Verification

When testing, you should see:
1. Question displayed as a markdown heading (`##`)
2. Answer text with proper formatting
3. Citations section at the bottom
4. Consistent formatting across all responses

## Performance Check

- Responses should be instant (no delay)
- No network requests for predefined questions
- Smooth user experience
