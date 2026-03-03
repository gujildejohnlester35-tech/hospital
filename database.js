// IndexedDB Database Manager for Patient Management System
// This provides a robust database solution for storing patients and users

class DatabaseManager {
    constructor() {
        this.dbName = 'PatientManagementDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            // Setup database schema
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create Users object store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'username' });
                    userStore.createIndex('role', 'role', { unique: false });
                    userStore.createIndex('email', 'email', { unique: true });
                    console.log('Users object store created');
                }

                // Create Patients object store
                if (!db.objectStoreNames.contains('patients')) {
                    const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
                    patientStore.createIndex('name', 'name', { unique: false });
                    patientStore.createIndex('esiLevel', 'esiLevel', { unique: false });
                    patientStore.createIndex('room', 'room', { unique: false });
                    patientStore.createIndex('createdBy', 'createdBy', { unique: false });
                    patientStore.createIndex('dateAdmitted', 'time', { unique: false });
                    console.log('Patients object store created');
                }

                // Create Rooms object store
                if (!db.objectStoreNames.contains('rooms')) {
                    const roomStore = db.createObjectStore('rooms', { keyPath: 'number' });
                    roomStore.createIndex('type', 'type', { unique: false });
                    console.log('Rooms object store created');
                }

                // Create Schedules object store
                if (!db.objectStoreNames.contains('schedules')) {
                    const scheduleStore = db.createObjectStore('schedules', { keyPath: 'id', autoIncrement: true });
                    scheduleStore.createIndex('date', 'date', { unique: false });
                    scheduleStore.createIndex('staff', 'staff', { unique: false });
                    console.log('Schedules object store created');
                }
            };
        });
    }

    // ==================== USER OPERATIONS ====================

    // Add a new user
    async addUser(userData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            
            const user = {
                username: userData.username,
                password: userData.password, // In production, this should be hashed
                role: userData.role,
                email: userData.email || `${userData.username}@hospital.com`,
                fullName: userData.fullName || userData.username,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true
            };

            const request = store.add(user);

            request.onsuccess = () => {
                console.log('User added successfully:', userData.username);
                resolve(user);
            };

            request.onerror = () => {
                console.error('Error adding user:', request.error);
                reject(request.error);
            };
        });
    }

    // Get user by username
    async getUser(username) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(username);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all users
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update user
    async updateUser(username, updates) {
        return new Promise(async (resolve, reject) => {
            const user = await this.getUser(username);
            if (!user) {
                reject(new Error('User not found'));
                return;
            }

            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            
            const updatedUser = { ...user, ...updates };
            const request = store.put(updatedUser);

            request.onsuccess = () => {
                console.log('User updated successfully:', username);
                resolve(updatedUser);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete user
    async deleteUser(username) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.delete(username);

            request.onsuccess = () => {
                console.log('User deleted successfully:', username);
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Authenticate user
    async authenticateUser(username, password) {
        const user = await this.getUser(username);
        if (user && user.password === password && user.isActive) {
            // Update last login
            await this.updateUser(username, { lastLogin: new Date().toISOString() });
            return user;
        }
        return null;
    }

    // ==================== PATIENT OPERATIONS ====================

    // Add a new patient
    async addPatient(patientData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readwrite');
            const store = transaction.objectStore('patients');
            
            const patient = {
                ...patientData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const request = store.add(patient);

            request.onsuccess = () => {
                console.log('Patient added successfully:', patientData.id);
                resolve(patient);
            };

            request.onerror = () => {
                console.error('Error adding patient:', request.error);
                reject(request.error);
            };
        });
    }

    // Get patient by ID
    async getPatient(patientId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readonly');
            const store = transaction.objectStore('patients');
            const request = store.get(patientId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all patients
    async getAllPatients() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readonly');
            const store = transaction.objectStore('patients');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update patient
    async updatePatient(patientId, updates) {
        return new Promise(async (resolve, reject) => {
            const patient = await this.getPatient(patientId);
            if (!patient) {
                reject(new Error('Patient not found'));
                return;
            }

            const transaction = this.db.transaction(['patients'], 'readwrite');
            const store = transaction.objectStore('patients');
            
            const updatedPatient = { 
                ...patient, 
                ...updates,
                updatedAt: new Date().toISOString()
            };
            const request = store.put(updatedPatient);

            request.onsuccess = () => {
                console.log('Patient updated successfully:', patientId);
                resolve(updatedPatient);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete patient
    async deletePatient(patientId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readwrite');
            const store = transaction.objectStore('patients');
            const request = store.delete(patientId);

            request.onsuccess = () => {
                console.log('Patient deleted successfully:', patientId);
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Search patients by name
    async searchPatientsByName(searchTerm) {
        const allPatients = await this.getAllPatients();
        return allPatients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Get patients by ESI level
    async getPatientsByESI(esiLevel) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readonly');
            const store = transaction.objectStore('patients');
            const index = store.index('esiLevel');
            const request = index.getAll(esiLevel);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get patients by room
    async getPatientsByRoom(room) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['patients'], 'readonly');
            const store = transaction.objectStore('patients');
            const index = store.index('room');
            const request = index.getAll(room);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ==================== ROOM OPERATIONS ====================

    // Add room
    async addRoom(roomData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['rooms'], 'readwrite');
            const store = transaction.objectStore('rooms');
            const request = store.add(roomData);

            request.onsuccess = () => {
                resolve(roomData);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all rooms
    async getAllRooms() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['rooms'], 'readonly');
            const store = transaction.objectStore('rooms');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update room
    async updateRoom(roomNumber, updates) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.db.transaction(['rooms'], 'readwrite');
            const store = transaction.objectStore('rooms');
            const getRequest = store.get(roomNumber);

            getRequest.onsuccess = () => {
                const room = getRequest.result;
                if (!room) {
                    reject(new Error('Room not found'));
                    return;
                }

                const updatedRoom = { ...room, ...updates };
                const putRequest = store.put(updatedRoom);

                putRequest.onsuccess = () => {
                    resolve(updatedRoom);
                };

                putRequest.onerror = () => {
                    reject(putRequest.error);
                };
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    // ==================== SCHEDULE OPERATIONS ====================

    // Add schedule
    async addSchedule(scheduleData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['schedules'], 'readwrite');
            const store = transaction.objectStore('schedules');
            const request = store.add(scheduleData);

            request.onsuccess = () => {
                resolve({ ...scheduleData, id: request.result });
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all schedules
    async getAllSchedules() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['schedules'], 'readonly');
            const store = transaction.objectStore('schedules');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ==================== MIGRATION FROM LOCALSTORAGE ====================

    // Migrate existing localStorage data to IndexedDB
    async migrateFromLocalStorage() {
        console.log('Starting migration from localStorage to IndexedDB...');

        try {
            // Migrate users
            const usersData = localStorage.getItem('registeredUsers');
            if (usersData) {
                const users = JSON.parse(usersData);
                for (const [username, userData] of Object.entries(users)) {
                    try {
                        await this.addUser({
                            username: username,
                            password: userData.password,
                            role: userData.role
                        });
                    } catch (error) {
                        console.log('User already exists or error:', username);
                    }
                }
                console.log('Users migrated successfully');
            }

            // Migrate patients
            const patientsData = localStorage.getItem('patients');
            if (patientsData) {
                const patients = JSON.parse(patientsData);
                for (const patient of patients) {
                    try {
                        await this.addPatient(patient);
                    } catch (error) {
                        console.log('Patient already exists or error:', patient.id);
                    }
                }
                console.log('Patients migrated successfully');
            }

            // Migrate rooms
            const roomsData = localStorage.getItem('rooms');
            if (roomsData) {
                const rooms = JSON.parse(roomsData);
                for (const room of rooms) {
                    try {
                        await this.addRoom(room);
                    } catch (error) {
                        console.log('Room already exists or error:', room.number);
                    }
                }
                console.log('Rooms migrated successfully');
            }

            // Migrate schedules
            const schedulesData = localStorage.getItem('erSchedules');
            if (schedulesData) {
                const schedules = JSON.parse(schedulesData);
                for (const schedule of schedules) {
                    try {
                        await this.addSchedule(schedule);
                    } catch (error) {
                        console.log('Schedule already exists or error');
                    }
                }
                console.log('Schedules migrated successfully');
            }

            console.log('Migration completed successfully!');
        } catch (error) {
            console.error('Migration error:', error);
        }
    }

    // Export database to JSON (for backup)
    async exportToJSON() {
        const data = {
            users: await this.getAllUsers(),
            patients: await this.getAllPatients(),
            rooms: await this.getAllRooms(),
            schedules: await this.getAllSchedules(),
            exportDate: new Date().toISOString()
        };
        return data;
    }

    // Import database from JSON (for restore)
    async importFromJSON(jsonData) {
        try {
            // Import users
            if (jsonData.users) {
                for (const user of jsonData.users) {
                    try {
                        await this.addUser(user);
                    } catch (error) {
                        console.log('User import error:', user.username);
                    }
                }
            }

            // Import patients
            if (jsonData.patients) {
                for (const patient of jsonData.patients) {
                    try {
                        await this.addPatient(patient);
                    } catch (error) {
                        console.log('Patient import error:', patient.id);
                    }
                }
            }

            // Import rooms
            if (jsonData.rooms) {
                for (const room of jsonData.rooms) {
                    try {
                        await this.addRoom(room);
                    } catch (error) {
                        console.log('Room import error:', room.number);
                    }
                }
            }

            // Import schedules
            if (jsonData.schedules) {
                for (const schedule of jsonData.schedules) {
                    try {
                        await this.addSchedule(schedule);
                    } catch (error) {
                        console.log('Schedule import error');
                    }
                }
            }

            console.log('Import completed successfully!');
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    // Clear all data (use with caution!)
    async clearAllData() {
        const stores = ['users', 'patients', 'rooms', 'schedules'];
        for (const storeName of stores) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        console.log('All data cleared');
    }
}

// Create global database instance
const db = new DatabaseManager();

// Initialize database when script loads
db.init().then(() => {
    console.log('Database initialized and ready');
    // Optionally migrate data from localStorage
    // db.migrateFromLocalStorage();
}).catch(error => {
    console.error('Failed to initialize database:', error);
});
