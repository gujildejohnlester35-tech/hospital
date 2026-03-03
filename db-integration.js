// Database Integration Helper Functions
// This file bridges the existing script.js with the new IndexedDB database

// Wait for database to be ready
let dbReady = false;
const waitForDB = () => {
    return new Promise((resolve) => {
        const checkDB = setInterval(() => {
            if (window.db && window.db.db) {
                clearInterval(checkDB);
                dbReady = true;
                resolve();
            }
        }, 100);
    });
};

// ==================== USER MANAGEMENT FUNCTIONS ====================

// Replace getRegisteredUsers with database version
async function getRegisteredUsersDB() {
    await waitForDB();
    try {
        const users = await db.getAllUsers();
        // Convert to old format for compatibility
        const usersObj = {};
        users.forEach(user => {
            usersObj[user.username] = {
                password: user.password,
                role: user.role
            };
        });
        return usersObj;
    } catch (error) {
        console.error('Error getting users:', error);
        return {};
    }
}

// Register new user in database
async function registerUserDB(username, password, role, email = null) {
    await waitForDB();
    try {
        const user = await db.addUser({
            username: username,
            password: password,
            role: role,
            email: email || `${username}@hospital.com`
        });
        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

// Authenticate user with database
async function authenticateUserDB(username, password, role) {
    await waitForDB();
    try {
        const user = await db.authenticateUser(username, password);
        if (user && user.role === role) {
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}

// Get all users for admin panel
async function getAllUsersDB() {
    await waitForDB();
    try {
        return await db.getAllUsers();
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
}

// Update user information
async function updateUserDB(username, updates) {
    await waitForDB();
    try {
        return await db.updateUser(username, updates);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Delete user
async function deleteUserDB(username) {
    await waitForDB();
    try {
        return await db.deleteUser(username);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// ==================== PATIENT MANAGEMENT FUNCTIONS ====================

// Get all patients from database
async function getAllPatientsDB() {
    await waitForDB();
    try {
        return await db.getAllPatients();
    } catch (error) {
        console.error('Error getting patients:', error);
        return [];
    }
}

// Add patient to database
async function addPatientDB(patientData) {
    await waitForDB();
    try {
        return await db.addPatient(patientData);
    } catch (error) {
        console.error('Error adding patient:', error);
        throw error;
    }
}

// Get single patient
async function getPatientDB(patientId) {
    await waitForDB();
    try {
        return await db.getPatient(patientId);
    } catch (error) {
        console.error('Error getting patient:', error);
        return null;
    }
}

// Update patient
async function updatePatientDB(patientId, updates) {
    await waitForDB();
    try {
        return await db.updatePatient(patientId, updates);
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
}

// Delete patient
async function deletePatientDB(patientId) {
    await waitForDB();
    try {
        return await db.deletePatient(patientId);
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error;
    }
}

// Search patients
async function searchPatientsDB(searchTerm) {
    await waitForDB();
    try {
        return await db.searchPatientsByName(searchTerm);
    } catch (error) {
        console.error('Error searching patients:', error);
        return [];
    }
}

// Get patients by ESI level
async function getPatientsByESIDB(esiLevel) {
    await waitForDB();
    try {
        return await db.getPatientsByESI(esiLevel);
    } catch (error) {
        console.error('Error getting patients by ESI:', error);
        return [];
    }
}

// Get patients by room
async function getPatientsByRoomDB(room) {
    await waitForDB();
    try {
        return await db.getPatientsByRoom(room);
    } catch (error) {
        console.error('Error getting patients by room:', error);
        return [];
    }
}

// ==================== ROOM MANAGEMENT FUNCTIONS ====================

// Get all rooms
async function getAllRoomsDB() {
    await waitForDB();
    try {
        return await db.getAllRooms();
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}

// Add room
async function addRoomDB(roomData) {
    await waitForDB();
    try {
        return await db.addRoom(roomData);
    } catch (error) {
        console.error('Error adding room:', error);
        throw error;
    }
}

// Update room
async function updateRoomDB(roomNumber, updates) {
    await waitForDB();
    try {
        return await db.updateRoom(roomNumber, updates);
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
}

// ==================== SCHEDULE MANAGEMENT FUNCTIONS ====================

// Get all schedules
async function getAllSchedulesDB() {
    await waitForDB();
    try {
        return await db.getAllSchedules();
    } catch (error) {
        console.error('Error getting schedules:', error);
        return [];
    }
}

// Add schedule
async function addScheduleDB(scheduleData) {
    await waitForDB();
    try {
        return await db.addSchedule(scheduleData);
    } catch (error) {
        console.error('Error adding schedule:', error);
        throw error;
    }
}

// ==================== DATA MIGRATION & BACKUP ====================

// Migrate data from localStorage to IndexedDB
async function migrateToDatabase() {
    await waitForDB();
    try {
        await db.migrateFromLocalStorage();
        alert('Data migration completed successfully!\n\nAll your data has been moved to the database.');
        return true;
    } catch (error) {
        console.error('Migration error:', error);
        alert('Error during migration: ' + error.message);
        return false;
    }
}

// Export database to JSON file
async function exportDatabase() {
    await waitForDB();
    try {
        const data = await db.exportToJSON();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hospital_database_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Database exported successfully!');
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting database: ' + error.message);
    }
}

// Import database from JSON file
async function importDatabase(file) {
    await waitForDB();
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                const success = await db.importFromJSON(jsonData);
                if (success) {
                    alert('Database imported successfully!');
                    location.reload(); // Reload to show new data
                } else {
                    alert('Error importing database');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    } catch (error) {
        console.error('Import error:', error);
        alert('Error importing database: ' + error.message);
    }
}

// Clear all database data
async function clearDatabaseData() {
    await waitForDB();
    if (confirm('⚠️ WARNING: This will delete ALL data from the database!\n\nAre you absolutely sure?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            try {
                await db.clearAllData();
                alert('All data has been cleared from the database.');
                location.reload();
            } catch (error) {
                console.error('Clear error:', error);
                alert('Error clearing database: ' + error.message);
            }
        }
    }
}

// ==================== STATISTICS & REPORTS ====================

// Get database statistics
async function getDatabaseStats() {
    await waitForDB();
    try {
        const users = await db.getAllUsers();
        const patients = await db.getAllPatients();
        const rooms = await db.getAllRooms();
        const schedules = await db.getAllSchedules();

        return {
            totalUsers: users.length,
            totalPatients: patients.length,
            totalRooms: rooms.length,
            totalSchedules: schedules.length,
            usersByRole: {
                owner: users.filter(u => u.role === 'owner').length,
                doctor: users.filter(u => u.role === 'doctor').length,
                staff: users.filter(u => u.role === 'staff').length,
                patient: users.filter(u => u.role === 'patient').length
            },
            patientsByESI: {
                'ESI-1': patients.filter(p => p.esiLevel === 'ESI-1').length,
                'ESI-2': patients.filter(p => p.esiLevel === 'ESI-2').length,
                'ESI-3': patients.filter(p => p.esiLevel === 'ESI-3').length,
                'ESI-4': patients.filter(p => p.esiLevel === 'ESI-4').length,
                'ESI-5': patients.filter(p => p.esiLevel === 'ESI-5').length
            }
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return null;
    }
}

// Show database statistics modal
async function showDatabaseStats() {
    const stats = await getDatabaseStats();
    if (!stats) {
        alert('Error loading statistics');
        return;
    }

    const message = `
📊 DATABASE STATISTICS

👥 Users: ${stats.totalUsers}
   - Owners: ${stats.usersByRole.owner}
   - Doctors: ${stats.usersByRole.doctor}
   - Staff: ${stats.usersByRole.staff}
   - Patients: ${stats.usersByRole.patient}

🏥 Patients: ${stats.totalPatients}
   - ESI-1: ${stats.patientsByESI['ESI-1']}
   - ESI-2: ${stats.patientsByESI['ESI-2']}
   - ESI-3: ${stats.patientsByESI['ESI-3']}
   - ESI-4: ${stats.patientsByESI['ESI-4']}
   - ESI-5: ${stats.patientsByESI['ESI-5']}

🏠 Rooms: ${stats.totalRooms}
📅 Schedules: ${stats.totalSchedules}
    `;

    alert(message);
}

// Initialize default admin user if no users exist
async function initializeDefaultUsers() {
    await waitForDB();
    try {
        const users = await db.getAllUsers();
        if (users.length === 0) {
            // Create default users
            await db.addUser({
                username: 'owner',
                password: 'owner123',
                role: 'owner',
                email: 'owner@hospital.com',
                fullName: 'Hospital Owner'
            });
            await db.addUser({
                username: 'admin',
                password: 'admin123',
                role: 'doctor',
                email: 'admin@hospital.com',
                fullName: 'System Administrator'
            });
            await db.addUser({
                username: 'doctor',
                password: 'pass123',
                role: 'doctor',
                email: 'doctor@hospital.com',
                fullName: 'Dr. Smith'
            });
            await db.addUser({
                username: 'staff',
                password: 'pass123',
                role: 'staff',
                email: 'staff@hospital.com',
                fullName: 'Nurse Johnson'
            });
            console.log('Default users created including owner account');
        }
    } catch (error) {
        console.error('Error initializing default users:', error);
    }
}

// Auto-initialize when page loads
window.addEventListener('load', async () => {
    await waitForDB();
    await initializeDefaultUsers();
    console.log('Database integration ready');
});
