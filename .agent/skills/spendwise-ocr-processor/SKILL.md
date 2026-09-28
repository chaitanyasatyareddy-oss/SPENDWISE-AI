---
name: spendwise-ocr-processor
description: Provides logic and test utilities for processing receipts, invoices, and UPI payment screenshots using Gemini API multimodal prompts.
triggers:
  - process receipt
  - parse screenshot
  - UPI extraction
  - OCR configuration
---

# Mission Statement
Standardize extraction of structured financial transactions from unstructured image payloads (receipts, bill images, UPI payment screenshots from Google Pay, PhonePe, Paytm), mapping payloads accurately to transaction JSON structures.

# Processing Rules
1. Extract standard structured fields: `merchant_name`, `total_amount`, `tax_amount`, `discount_amount`, `transaction_date`, `payment_method`, `reference_number`, and `line_items`.
2. Infer expense classification dynamically from standard categories: Food, Shopping, Transport, Bills, Entertainment, Healthcare, Education, Travel, Subscription, Groceries, Other.
3. Classify transaction expenditure into `Need`, `Want`, or `Unclear` with a short analytical justification string.
4. Output JSON payloads strictly conforming to the system API contract without markdown wrapping or commentary.

# Error Handling Logic
- If image resolution is insufficient or corrupted, return standard error JSON: `{"error": "IMAGE_UNREADABLE", "message": "We could not read this image. Please upload a clearer photo."}`.
- If duplicate reference number is identified, set flag `possible_duplicate: true`.
