# Car Listing Website — Implementation 

## Overview
A website where an admin can list cars for sale with full details,
so buyers can view all the information they need without having
to ask questions directly.

## Scale
Small-scale project, intended for around 25-30 users. Built with
simplicity in mind.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 

## User Roles

### Root User
- One root user account
- Can create and edit Admin user accounts

### Admin User
- Can add, edit, and delete car listings

### Visitor (no account required)
- Can browse all car listings
- Can search and filter listings
- Cannot post, edit, or delete anything

## MVP Scope (Minimum Viable Product)

### In scope for MVP
- Browse all car listings
- Search and filter listings (by make, price range, fuel type,
  transmission, battery, year, etc.)
- View a single car's full details, including multiple images
  (10+ per car)
- Admin login and CRUD (create/read/update/delete) on listings
- Root user can create/edit Admin accounts

## Database
PostgreSQL is the database used in this project.

## Notes
This document will be updated as the project progresses.
