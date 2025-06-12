# 🚀 Qwillo Customer & Leads Management – Build Guide

## 📌 Objective
Create a modern, user-friendly Customers & Leads page where contractors can manage past clients, track leads, create quotes, schedule meetings, and keep notes on customer interactions while maintaining a streamlined workflow for quick or complex projects.

## 🔹 Step 1: Page Layout & Navigation
**📌 Goal:** Keep the interface simple, dynamic, and intuitive, avoiding unnecessary complexity.

### ✅ Main Sections
1️⃣ Customers List (Past clients with completed projects or direct additions)
2️⃣ Leads List (Potential clients with active or pending quotes)

### ✅ Navigation Tabs at the Top
🔹 "Customers" Tab → Displays past clients
🔹 "Leads" Tab → Displays potential clients with pending quotes

### ✅ Search & Filter Functionality for Both Sections
🔹 Search by name, project type, or status
🔹 Filter by status (pending, past project, active lead)

📍 **Outcome:** A clean two-tab layout that allows contractors to quickly switch between managing past clients and tracking leads.

## 🔹 Step 2: Customers List – Features & Components
### 🛠 2.1 Customers List UI & Data Display
✅ Each customer card shows:
- Customer Name
- Profile Photo or Initials
- Quick Data Notes (E.g., "Awesome Client," "Slow to Pay")
- List of Past Projects

✅ Selecting a Customer Expands Full Profile View
- Shows detailed notes & past project history
- Allows contractor to add new notes

### 🛠 2.2 Customer Profile Actions & Buttons
✅ Request Review Button – Sends a review request to the customer
✅ Request Referral Button – Sends a referral request for new leads
✅ Request Share on Social Button – Prompts customer to share a testimonial on social media
✅ Instant Meeting Button – Creates & shares a meeting link immediately
✅ Schedule Meeting Button – Opens the calendar to select a future meeting date
✅ Create Quote Button – Opens the Quote & Project Editor directly (for simple jobs that don't require a meeting first)
✅ Send Email Button – Opens an email composer to contact the customer

📍 **Outcome:** A fully interactive customer management system with easy-to-use action buttons for engagement, follow-ups, and new project creation.

## 🔹 Step 3: Leads List – Features & Components
### 🛠 3.1 Leads List UI & Data Display
✅ Each lead card shows:
- Lead Name & Contact Info
- Current Status ("Pending Quote," "Meeting Scheduled")
- Quick Data Notes (E.g., "High Budget Client")

✅ Selecting a Lead Expands Full Profile View
- Shows detailed notes & project inquiry details
- Allows contractor to update notes or meeting status

### 🛠 3.2 Lead Profile Actions & Buttons
✅ Schedule Meeting Button – Opens the calendar to schedule a future meeting
✅ Instant Meeting Button – Creates & shares a meeting link immediately
✅ Send Email Button – Quickly contact the lead for follow-ups
✅ Create Quote Button – Opens the Quote & Project Editor directly (for quick quoting without a meeting)

📍 **Outcome:** Leads are managed efficiently, allowing quick communication, scheduled meetings, and easy quote creation.

## 🔹 Step 4: Meeting Scheduler Component
📍 Shared Between Customers & Leads

### 🛠 4.1 Meeting Scheduling UI
✅ Opens as a Pop-Up Modal
✅ Select Date & Time
✅ Auto-Syncs with Calendar & Sends Invite to Customer or Lead
✅ Option to Add Meeting Notes

📍 **Outcome:** Contractors can quickly schedule meetings without leaving the page, making follow-ups & engagements seamless.