# Sprint Change Proposal: Revert to GPT-4 Phonetic AI

**Date:** 2025-11-29
**Author:** John (PM Agent)
**Requestor:** BIP
**Change Scope:** Moderate

---

## 1. Issue Summary

### Problem Statement

The deterministic phonetic rule engine (Story 3.13) cannot adequately handle the complexity of Norwegian pronunciation optimization. While the rule-based approach offers zero API costs and sub-millisecond execution, user testing has demonstrated that the limited 6-rule system produces inferior pronunciation results compared to AI-based analysis.

### Context

- **Story 3.13** replaced GPT-4 with a 6-rule deterministic engine (Silent D, ND→NN, RD→R, OG→Å, Acronyms, Numbers)
- **User testing** confirmed AI produces better pronunciation results
- **Trade-off accepted**: Cost (~$0.03/call) and latency (1-3s) are necessary for quality
- **Core value proposition**: Norwegian pronunciation optimization is THE differentiator

### Evidence

- Rule engine limited to 6 patterns - cannot handle contextual nuances
- GPT-4 understands Norwegian language comprehensively
- User explicitly validated: "Too many rules, we need AI to consider the variables. I have tested that and got better results."

---

## 2. Impact Analysis

### Epic Impact

| Epic | Impact Level | Description |
|------|--------------|-------------|
| **Epic 3** | Low | Story 3.3 already specifies GPT-4 approach - aligns with reversion |

### Story Impact

| Story | Status | Action Required |
|-------|--------|-----------------|
| **3.3** (GPT-4 Optimizer) | review | Re-activate - this is the target approach |
| **3.13** (Rule Engine) | review | Mark as SUPERSEDED/INACTIVE - preserve code for future use |
| **3.4** (Phonetic Diff Viewer) | completed | No changes - UI preserved |

### Artifact Conflicts

| Artifact | Current State | Required Change |
|----------|---------------|-----------------|
| **ADR-006** (Architecture) | States GPT-4 should be used | **No change needed** - reverting TO this decision |
| **optimizer.ts** | Uses rule-engine.ts | Revert to GPT-4 API calls |
| **rule-engine.ts** | Active | Mark as inactive (preserve code) |
| **number-converter.ts** | Active | Mark as inactive (preserve code) |

### Technical Impact

| Component | Change |
|-----------|--------|
| `src/lib/phonetic/optimizer.ts` | Restore GPT-4 API integration |
| `src/lib/phonetic/rule-engine.ts` | Add deprecation header, keep code |
| `src/lib/phonetic/number-converter.ts` | Add deprecation header, keep code |
| `src/app/api/lyrics/optimize/route.ts` | Restore 5-second timeout (was reduced to 500ms) |
| Environment | Ensure OPENAI_API_KEY is configured |

---

## 3. Recommended Approach

### Decision: Direct Adjustment

Revert phonetic optimizer to GPT-4-based approach (Story 3.3) while preserving rule engine code for potential future improvement.

### Rationale

1. **Architecture Alignment**: ADR-006 already mandates GPT-4 for pronunciation optimization
2. **Quality Priority**: Core value proposition requires best possible pronunciation
3. **Acceptable Trade-offs**: User accepts cost and latency for quality
4. **Code Preservation**: Rule engine kept for future hybrid approach potential

### Effort Estimate

- **Development**: Small (1-2 hours)
- **Testing**: Small (30 minutes)
- **Risk**: Low - reverting to previously working approach

---

## 4. Detailed Change Proposals

### 4.1 Story Status Update

**Story: 3-13-implement-deterministic-phonetic-rule-engine.md**

```
OLD:
Status: review

NEW:
Status: superseded

## Superseded Notice
**Date:** 2025-11-29
**Reason:** User testing validated that GPT-4 AI produces superior pronunciation results compared to the 6-rule deterministic approach. The rule engine code is preserved for potential future enhancement but is currently inactive.
**Active Approach:** Story 3.3 (GPT-4 Phonetic Optimizer)
```

### 4.2 Code Changes

**File: src/lib/phonetic/optimizer.ts**

```
OLD:
import { applyAllRules, type TransformationResult } from './rule-engine'
...
// Uses deterministic rule engine

NEW:
import OpenAI from 'openai'
import { phoneticCache, preservedWords } from './rules'
...
// Uses GPT-4 API for phonetic optimization (as per ADR-006)
```

**File: src/lib/phonetic/rule-engine.ts**

```
ADD AT TOP:
/**
 * @deprecated INACTIVE - This rule engine has been superseded by GPT-4-based optimization.
 * Kept for potential future hybrid approach.
 *
 * Superseded: 2025-11-29
 * Reason: User testing showed GPT-4 produces better pronunciation results
 * See: Story 3.3 for active implementation
 */
```

**File: src/lib/phonetic/number-converter.ts**

```
ADD AT TOP:
/**
 * @deprecated INACTIVE - Part of superseded rule engine.
 * Kept for potential future use.
 *
 * Superseded: 2025-11-29
 */
```

**File: src/app/api/lyrics/optimize/route.ts**

```
OLD:
// 500ms timeout (optimized for rule engine)

NEW:
// 5000ms timeout (required for GPT-4 API latency)
```

### 4.3 Architecture Documentation

**No changes required** - ADR-006 already specifies GPT-4:

> **ADR-006: Norwegian Pronunciation Optimization via GPT-4**
>
> Decision: Use GPT-4 to analyze Norwegian lyrics and suggest phonetic spellings before sending to Suno.
>
> Rationale:
> - GPT-4 understands Norwegian language nuances
> - Can apply phonetic rules validated by founder (80k listener expertise)
> - Visual diff preview shows before/after changes

---

## 5. Implementation Handoff

### Change Scope Classification

**Moderate** - Requires code reversion and story status updates

### Handoff Recipients

| Role | Responsibility |
|------|----------------|
| **Developer** | Revert optimizer.ts to GPT-4, add deprecation headers |
| **SM** | Update story statuses in sprint tracking |

### Success Criteria

1. [ ] `optimizer.ts` uses GPT-4 API instead of rule engine
2. [ ] Rule engine files have deprecation headers (code preserved)
3. [ ] Story 3.13 marked as superseded
4. [ ] API timeout restored to 5 seconds
5. [ ] Phonetic diff viewer continues to work (UI unchanged)
6. [ ] Build passes with no TypeScript errors

### Implementation Tasks

1. **Revert optimizer.ts**
   - Restore OpenAI import and GPT-4 API calls
   - Re-implement phonetic cache checking before API calls
   - Keep PhoneticChange interface (unchanged)

2. **Mark rule engine as inactive**
   - Add @deprecated JSDoc to rule-engine.ts
   - Add @deprecated JSDoc to number-converter.ts
   - Keep all code intact

3. **Update API route**
   - Restore 5-second timeout in optimize/route.ts

4. **Update story status**
   - Mark Story 3.13 as superseded with explanation

---

## 6. Approval

### Proposal Status

- [ ] **Approved** - Proceed with implementation
- [ ] **Revise** - Changes needed (specify below)
- [ ] **Rejected** - Do not proceed

### Notes



---

_Generated by Correct Course Workflow_
_Date: 2025-11-29_
_Project: ibe160 (Musikkfabrikken)_
