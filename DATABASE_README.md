# Patient Management System - Database Documentation

## Overview

This Patient Management System now includes a robust database solution using **IndexedDB**, a powerful browser-based database that provides better performance and reliability compared to localStorage.

## Database Structure

### 1. Users Store
Stores all registered users (doctors, staff, patients)

**Fields:**
- `username` (Primary Key) - Unique username
- `password` - User password (should be hashed in production)
- `role` - User role (doctor, staff, patient)
- `email` - User email address
- `fullName` - Full name of the user
- `createdAt` - Account creation timestamp
- `lastLogin` - Last login timestamp
- `isActive` - Account status (active/inactive)

**Indexes:**
- `role` - For filtering users by role
- `email` - For email lookups

### 2. Patients Store
Stores all patient records with complete medical information

**Fields:**
- `id` (Primary Key) - Unique patient ID
- `name` - Patient name
- `age` - Patient age
- `birthday` - Date of birth
- `religion` - Religious affiliation
- `location` - Patient location/address
- `room` - Assigned room number
- `bed` - Assigned bed number
- `physician` - Attending physician
- `esiLevel` - Emergency Severity Index level
- `time` - Date admitted
- `diagnosis` - Array of diagnoses
- `medications` - Array of medication records
- `labs` - Array of lab results
- `vitals` - Array of vital signs
- `clinicalNotes` - Clinical notes
- `fdar`, `soapiea`, `adpie` - Nursing documentation
- `ebiTriage` - Triage assessments
- `transfer` - Transfer records
- `createdBy` - User who created the record
- `createdByRole` - Role of creator
- `createdAt` - Record creation timestamp
- `updatedAt` - Last update timestamp

**Indexes:**
- `name` - For searching by patient name
- `esiLevel` - For filtering by ESI level
- `room` - For filtering by room
- `createdBy` - For filtering by creator
- `dateAdmitted` - For sorting by admission date

### 3. Rooms Store
Stores hospital room information

**Fields:**
- `number` (Primary Key) - Room number
- `type` - Room type (Emergency Room, ICU, General Ward, etc.)
- `beds` - Number of beds in room
- `occupiedBeds` - Array of occupied bed numbers

**Indexes:**
- `type` - For filtering by room type

### 4. Schedules Store
Stores ER staff schedules

**Fields:**
- `id` (Primary Key, Auto-increment) - Schedule ID
- `date` - Schedule date
- `staff` - Staff member name
- `shift` - Shift information
- Additional schedule details

**Indexes:**
- `date` - For filtering by date
- `staff` - For filtering by staff member

## Features

### 1. Data Migration
- Automatically migrate existing data from localStorage to IndexedDB
- One-click migration process
- Preserves all existing patient and user data

### 2. Backup & Restore
- **Export Database**: Download complete database as JSON file
- **Import Database**: Restore from previous backup
- Includes all users, patients, rooms, and schedules
- Timestamped backup files

### 3. User Management
- View all registered users
- See user details (role, email, last login, status)
- Track user activity

### 4. Statistics & Reports
- Total users by role
- Total patients by ESI level
- Room occupancy statistics
- Schedule overview

### 5. Data Operations
- **Add**: Create new records
- **Read**: Retrieve single or multiple records
- **Update**: Modify existing records
- **Delete**: Remove records
- **Search**: Find records by various criteria

## API Functions

### User Operations

```javascript
// Add new user
await registerUserDB(username, password, role, email);

// Authenticate user
const user = await authenticateUserDB(username, password, role);

// Get all users
const users = await getAllUsersDB();

// Update user
await updateUserDB(username, { fullName: 'New Name' });

// Delete user
await deleteUserDB(username);
```

### Patient Operations

```javascript
// Add patient
await addPatientDB(patientData);

// Get patient
const patient = await getPatientDB(patientId);

// Get all patients
const patients = await getAllPatientsDB();

// Update patient
await updatePatientDB(patientId, { room: '101' });

// Delete patient
await deletePatientDB(patientId);

// Search patients
const results = await searchPatientsDB('John');

// Get by ESI level
const critical = await getPatientsByESIDB('ESI-1');

// Get by room
const roomPatients = await getPatientsByRoomDB('101');
```

### Room Operations

```javascript
// Get all rooms
const rooms = await getAllRoomsDB();

// Add room
await addRoomDB(roomData);

// Update room
await updateRoomDB(roomNumber, { occupiedBeds: ['1', '2'] });
```

### Schedule Operations

```javascript
// Get all schedules
const schedules = await getAllSchedulesDB();

// Add schedule
await addScheduleDB(scheduleData);
```

### Utility Functions

```javascript
// Migrate from localStorage
await migrateToDatabase();

// Export database
await exportDatabase();

// Import database
await importDatabase(file);

// Get statistics
const stats = await getDatabaseStats();

// Show statistics
await showDatabaseStats();

// Clear all data (use with caution!)
await clearDatabaseData();
```

## Usage Guide

### Initial Setup

1. **Open the application** - The database will initialize automatically
2. **Default users** are created if no users exist:
   - Username: `admin`, Password: `admin123`, Role: Doctor
   - Username: `doctor`, Password: `pass123`, Role: Doctor
   - Username: `staff`, Password: `pass123`, Role: Staff

### Migrating Existing Data

If you have existing data in localStorage:

1. Click the **💾 Database** button in the top menu
2. Click **"Migrate Data to Database"**
3. Wait for confirmation
4. Your data is now in the database!

### Creating Backups

1. Click **💾 Database** button
2. Click **"📥 Export Database"**
3. A JSON file will download with all your data
4. Store this file safely

### Restoring from Backup

1. Click **💾 Database** button
2. Click **"📤 Import Database"**
3. Select your backup JSON file
4. Data will be restored

### Viewing Statistics

1. Click **💾 Database** button
2. Click **"View Statistics"**
3. See overview of all data

## Security Considerations

### Current Implementation
- Passwords are stored in plain text
- Data is stored locally in the browser
- No server-side authentication

### Production Recommendations
1. **Hash passwords** using bcrypt or similar
2. **Implement server-side database** (MySQL, PostgreSQL, MongoDB)
3. **Add authentication tokens** (JWT)
4. **Use HTTPS** for all communications
5. **Implement role-based access control**
6. **Add audit logging**
7. **Regular backups** to secure location
8. **Data encryption** for sensitive information

## Browser Compatibility

IndexedDB is supported in:
- ✅ Chrome 24+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Edge 12+
- ✅ Opera 15+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Storage Limits

- **Chrome**: ~60% of available disk space
- **Firefox**: ~50% of available disk space
- **Safari**: 1GB (can request more)
- **Edge**: Similar to Chrome

## Troubleshooting

### Database won't initialize
- Check browser console for errors
- Ensure IndexedDB is enabled in browser settings
- Try clearing browser cache

### Migration fails
- Check if localStorage has data
- Look for console errors
- Try exporting localStorage data first

### Import fails
- Verify JSON file format
- Check file isn't corrupted
- Ensure file is from same system version

### Data not persisting
- Check browser storage settings
- Ensure not in private/incognito mode
- Verify storage quota not exceeded

## File Structure

```
/
├── database.js           # Core database manager class
├── db-integration.js     # Integration helper functions
├── script.js            # Main application logic
├── Index.html           # Main HTML file
├── style.css            # Styles
└── DATABASE_README.md   # This file
```

## Future Enhancements

- [ ] Server-side database integration
- [ ] Password hashing and encryption
- [ ] Advanced search and filtering
- [ ] Data analytics and reporting
- [ ] Automated backups
- [ ] Multi-user synchronization
- [ ] Audit trail and logging
- [ ] Data validation and constraints
- [ ] Performance optimization
- [ ] Mobile app integration

## Support

For issues or questions:
1. Check browser console for errors
2. Review this documentation
3. Check browser compatibility
4. Verify storage permissions

## License

This database system is part of the Patient Management System.
