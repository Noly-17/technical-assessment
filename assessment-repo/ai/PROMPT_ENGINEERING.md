# Prompt Engineering Approach

## Overview

This document outlines our approach to prompt engineering for the customer feedback analysis system using Anthropic's Claude API. Effective prompt design is crucial for extracting structured information from unstructured customer feedback.

## Core Principles

1. **Clarity and Structure**: Prompts explicitly define the expected output format to ensure consistent results
2. **Specific Instructions**: Detailed guidelines help Claude categorize feedback accurately
3. **Output Formatting**: JSON structure ensures easy parsing and consistent results
4. **Edge Case Handling**: Prompts designed to handle variations in feedback tone, length, and complexity

## Current Prompt Design

Our production prompt follows this structure:

```
Analyze the following customer feedback text. Identify the category, sentiment, priority level, and extract action items.
Then generate an appropriate response template.

Customer Feedback:
"""
${feedbackText}
"""

Provide your analysis as JSON with the following structure:
```json
{
  "category": "bug_report" | "feature_request" | "support_inquiry" | "general_feedback",
  "sentiment": "positive" | "neutral" | "negative",
  "priority": "low" | "medium" | "high" | "critical",
  "actionItems": ["specific action item 1", "specific action item 2", ...],
  "summary": "A one-sentence summary of the feedback",
  "responseTemplate": "An appropriate customer service response template"
}
```

Rules for Analysis:
1. Category should be one of: bug_report, feature_request, support_inquiry, general_feedback
2. Sentiment should be one of: positive, neutral, negative
3. Priority should be one of: low, medium, high, critical
4. Action items should be specific, actionable tasks based on the feedback
5. The response template should be professional, empathetic, and address the customer's concerns

Output ONLY the JSON response, nothing else before or after.
```

## Prompt Evolution

### Initial Version

```
Analyze this customer feedback: "${feedbackText}"
What category is it? (bug, feature request, support, or general)
What is the sentiment? (positive, neutral, negative)
What is the priority? (low, medium, high)
What actions should we take?
```

**Issues**:
- Inconsistent output format made parsing difficult
- Categories weren't precisely defined
- Often generated additional explanatory text instead of just structured data

### Intermediate Version

```
Analyze this customer feedback and provide your response in JSON format:

"${feedbackText}"

{
  "category": "bug_report" | "feature_request" | "support_inquiry" | "general_feedback",
  "sentiment": "positive" | "neutral" | "negative",
  "priority": "low" | "medium" | "high"
}
```

**Improvements**:
- Added JSON structure for consistent parsing
- Better defined categories
- Still missed some complex cases and didn't capture action items

### Current Version

The current version includes:
- Detailed definition of expected JSON structure
- Clear rules for categorization
- Expanded priority levels to include "critical"
- Added extraction of specific action items
- Added response template generation
- Triple quotes around feedback to handle multiline text
- Explicit instruction to output only JSON

## Edge Case Handling

Our prompt handles several edge cases:

1. **Mixed Feedback**: Feedback containing multiple categories is handled by identifying the primary issue
2. **Ambiguous Priority**: Clear guidelines for priority classification
3. **Multilingual Feedback**: Model capabilities allow processing non-English feedback
4. **Long or Complex Feedback**: Triple quotes ensure proper handling of multiline text

## Future Improvements

1. **Few-shot Learning**: Add examples of correctly analyzed feedback for even better accuracy
2. **Category Refinement**: Further breakdown of categories for more specific analysis
3. **Custom Persona**: Define a more specific system prompt for better alignment with company values
4. **Feedback Context**: Include user history or product information for more personalized analysis

## Performance Metrics

We track the following metrics to evaluate prompt effectiveness:

1. **Classification Accuracy**: Comparing predicted vs. expected categories
2. **Priority Alignment**: Ensuring high-urgency issues are correctly flagged
3. **Action Item Relevance**: Measuring specificity and relevance of extracted action items
4. **Template Appropriateness**: Evaluating if response templates properly address the feedback

## Conclusion

Effective prompt engineering has been crucial to extracting structured, actionable insights from unstructured customer feedback. Our iterative approach has significantly improved the quality and consistency of the analysis. 