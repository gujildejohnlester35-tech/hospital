// Check if page was opened via QR code - MUST BE FIRST!
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('qr');
    
    if (qrId) {
        // Stop all other scripts
        if (window.stop) window.stop();
        
        // Get patient data
        const patientDataStr = localStorage.getItem(qrId);
        
        if (patientDataStr) {
            const patient = JSON.parse(patientDataStr);
            
            // Helper function to format arrays
            const formatArray = (arr, prop) => {
                if (!arr || arr.length === 0) return '<em>None recorded</em>';
                return arr.map(item => {
                    if (typeof item === 'string') return `<li>${item}</li>`;
                    if (prop) return `<li>${item[prop] || JSON.stringify(item)}</li>`;
                    return `<li>${JSON.stringify(item)}</li>`;
                }).join('');
            };
            
            // Format medications
            const formatMedications = (meds) => {
                if (!meds || meds.length === 0) return '<em>No medications recorded</em>';
                return meds.map(med => `
                    <div style="background:#f8f9fa;padding:10px;margin:8px 0;border-radius:6px;border-left:3px solid #667eea">
                        <strong>${med.name || 'Unknown'}</strong> - ${med.dosage || 'N/A'}<br>
                        <small>Route: ${med.route || 'N/A'} | Schedule: ${med.schedule || 'N/A'}</small><br>
                        ${med.evaluation ? `<small>Evaluation: ${med.evaluation}</small>` : ''}
                        ${med.time ? `<br><small>Time: ${new Date(med.time).toLocaleString()}</small>` : ''}
                    </div>
                `).join('');
            };
            
            // Format vitals
            const formatVitals = (vitals) => {
                if (!vitals || vitals.length === 0) return '<em>No vitals recorded</em>';
                return vitals.map(v => `
                    <div style="display:inline-block;background:#f8f9fa;padding:8px 12px;margin:4px;border-radius:6px">
                        <strong>${v.type}:</strong> ${v.value} <small>(${new Date(v.time).toLocaleString()})</small>
                    </div>
                `).join('');
            };
            
            // Replace page with comprehensive patient record
            document.open();
            document.write(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Record - ${patient.id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .section {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .section:last-child { border-bottom: none; }
        .section h2 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid #667eea;
        }
        .info-label {
            font-weight: bold;
            color: #667eea;
            font-size: 13px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 15px;
        }
        .list { list-style: none; }
        .list li {
            background: #f8f9fa;
            padding: 10px;
            margin: 8px 0;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        .buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        button:hover { transform: translateY(-2px); }
        button:active { transform: translateY(0); }
        .timestamp {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        @media print {
            body { background: white; padding: 0; }
            .buttons { display: none; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Patient Medical Record</h1>
            <p>Complete Patient Information & Medical History</p>
        </div>
        
        <div class="content">
            <!-- Basic Information -->
            <div class="section">
                <h2>📋 Basic Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Patient ID</div>
                        <div class="info-value">${patient.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${patient.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Age</div>
                        <div class="info-value">${patient.age} years</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Birthday</div>
                        <div class="info-value">${patient.birthday}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Religion</div>
                        <div class="info-value">${patient.religion}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Location (From)</div>
                        <div class="info-value">${patient.location}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Room</div>
                        <div class="info-value">${patient.room} - Bed ${patient.bed}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">ESI Level</div>
                        <div class="info-value">${patient.esiLevel}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Attending Physician</div>
                        <div class="info-value">${patient.physician}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Date Admitted</div>
                        <div class="info-value">${patient.dateAdmitted}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Added By</div>
                        <div class="info-value">${patient.createdBy} (${patient.createdByRole})</div>
                    </div>
                </div>
            </div>
            
            <!-- Diagnosis -->
            <div class="section">
                <h2>🩺 Diagnosis & Medical History</h2>
                ${patient.diseases ? `<p style="margin-bottom:10px"><strong>Diseases:</strong> ${patient.diseases}</p>` : ''}
                <ul class="list">
                    ${formatArray(patient.diagnosis)}
                </ul>
            </div>
            
            <!-- Medications -->
            <div class="section">
                <h2>💊 Medications</h2>
                ${formatMedications(patient.medications)}
            </div>
            
            <!-- Vitals -->
            <div class="section">
                <h2>❤️ Vital Signs</h2>
                ${formatVitals(patient.vitals)}
            </div>
            
            <!-- Lab Results -->
            <div class="section">
                <h2>🔬 Lab Results</h2>
                <ul class="list">
                    ${formatArray(patient.labs)}
                </ul>
            </div>
            
            <!-- Clinical Notes -->
            ${patient.clinicalNotes ? `
            <div class="section">
                <h2>📝 Clinical Notes</h2>
                <div style="background:#f8f9fa;padding:15px;border-radius:8px;white-space:pre-wrap">${patient.clinicalNotes}</div>
            </div>
            ` : ''}
            
            <!-- EBI Triage -->
            ${patient.ebiTriage && patient.ebiTriage.length > 0 ? `
            <div class="section">
                <h2>🚨 EBI Triage Assessment</h2>
                ${patient.ebiTriage.map(ebi => `
                    <div style="background:#f8f9fa;padding:12px;margin:10px 0;border-radius:8px;border-left:3px solid #ff6b6b">
                        <strong>Chief Complaint:</strong> ${ebi.chiefComplaint || 'N/A'}<br>
                        <strong>Triage Level:</strong> ${ebi.triageLevel || 'N/A'}<br>
                        <strong>Assessment:</strong> ${ebi.assessment || 'N/A'}<br>
                        ${ebi.interventions ? `<strong>Interventions:</strong> ${ebi.interventions}<br>` : ''}
                        <small>Time: ${new Date(ebi.time).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- Transfer Records -->
            ${patient.transfer && patient.transfer.length > 0 ? `
            <div class="section">
                <h2>🚑 Transfer Records</h2>
                ${patient.transfer.map(t => `
                    <div style="background:#f8f9fa;padding:12px;margin:10px 0;border-radius:8px;border-left:3px solid #4bc0c0">
                        <strong>Type:</strong> ${t.type || 'N/A'}<br>
                        <strong>Destination:</strong> ${t.destination || 'N/A'}<br>
                        <strong>Reason:</strong> ${t.reason || 'N/A'}<br>
                        <small>Time: ${new Date(t.time).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="buttons">
                <button onclick="window.print()">🖨️ Print Record</button>
                <button onclick="downloadWord()">📥 Download as Word</button>
                <button onclick="downloadPDF()">📄 Download as PDF</button>
            </div>
            
            <div class="timestamp">
                QR Code Generated: ${patient.qrGeneratedAt || 'N/A'}
            </div>
        </div>
    </div>
    
    <script>
        const patient = ${JSON.stringify(patient)};
        
        function downloadWord() {
            const html = document.documentElement.outerHTML;
            const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Patient_' + patient.id + '_Record.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        function downloadPDF() {
            window.print();
        }
    </script>
</body>
</html>`);
            document.close();
        } else {
            document.open();
            document.write('<div style="text-align:center;padding:50px;font-family:Arial"><h1>❌ QR Code Expired</h1><p>This patient record is no longer available.</p></div>');
            document.close();
        }
        throw new Error('QR mode');
    }
})();

// Login/Signup Management
let loginModal, loginForm, signupForm, mainApp, logoutBtn, userInfo;
let currentUser = null;

// Get or initialize registered users from localStorage
function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    if (!users) {
        // Default demo users
        const defaultUsers = {
            'owner': { password: 'owner123', role: 'owner' },
            'doctor': { password: 'pass123', role: 'doctor' },
            'staff': { password: 'pass123', role: 'staff' },
            'patient': { password: 'pass123', role: 'patient' }
        };
        localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return JSON.parse(users);
}

// FDAR Chart
let fdarChart = null;
function renderFDARChart() {
    const canvas = document.getElementById('fdarChart');
    if (!canvas || currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    const fdar = patient.fdar || [];
    console.debug('renderFDARChart called for patient', patient && patient.id, 'fdar count', fdar.length);
    if (!fdar || fdar.length === 0) {
        if (fdarChart) { fdarChart.destroy(); fdarChart = null; }
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';

    // Aggregate counts per date for each focus
    const dateSet = new Set();
    const focusMap = {}; // focus -> {dateStr: count}
    fdar.forEach(entry => {
        const dateStr = new Date(entry.time).toLocaleDateString();
        dateSet.add(dateStr);
        const focus = (entry.focus || 'General');
        if (!focusMap[focus]) focusMap[focus] = {};
        focusMap[focus][dateStr] = (focusMap[focus][dateStr] || 0) + 1;
    });

    const dates = Array.from(dateSet).sort((a,b) => new Date(a) - new Date(b));
    console.debug('FDAR dates', dates);
    const colorList = ['#667eea','#ff6b6b','#ff9f40','#4bc0c0','#36a2eb','#9966ff','#e7e9ee'];
    const datasets = Object.keys(focusMap).map((focus, idx) => {
        const data = dates.map(d => focusMap[focus][d] || 0);
        const hex = colorList[idx % colorList.length];
        const r = parseInt(hex.substring(1,3),16), g = parseInt(hex.substring(3,5),16), b = parseInt(hex.substring(5,7),16);
        return {
            label: focus,
            data,
            borderColor: hex,
            backgroundColor: `rgba(${r},${g},${b},0.12)`,
            fill: true,
            tension: 0.2,
            spanGaps: true
        };
    });

    const ctx = canvas.getContext('2d');
    console.debug('FDAR datasets', datasets.map(ds => ({label: ds.label, data: ds.data})));
    if (fdarChart) {
        fdarChart.data.labels = dates;
        fdarChart.data.datasets = datasets;
        fdarChart.update();
        return;
    }

    try {
        fdarChart = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Count' }, beginAtZero: true }
            }
        }
    });
    } catch (err) {
        console.error('Error creating FDAR chart', err);
    }
}

// Check if user is already logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
}

// Initialize DOM references and event listeners
function initializeLoginSystem() {
    loginModal = document.getElementById('loginModal');
    loginForm = document.getElementById('loginForm');
    signupForm = document.getElementById('signupForm');
    mainApp = document.getElementById('mainApp');
    logoutBtn = document.getElementById('logoutBtn');
    userInfo = document.getElementById('userInfo');
    
    const toggleAuthBtn = document.getElementById('toggleAuthBtn');
    const toggleText = document.getElementById('toggleText');
    const authTitle = document.getElementById('authTitle');
    
    console.log('Login System Initialized - Form found:', !!loginForm);
    
    if (!loginForm || !signupForm) {
        console.error('Login or signup form not found!');
        return;
    }
    
    // Toggle between signin and signup forms
    if (toggleAuthBtn) {
        toggleAuthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const loginVisible = loginForm.style.display !== 'none';
            
            if (loginVisible) {
                // Switch to signup
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                authTitle.textContent = 'Create New Account';
                toggleText.innerHTML = 'Already have an account? <button type="button" class="toggle-btn" onclick="toggleAuthForm(false)">Sign In</button>';
            } else {
                // Switch to signin
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
                authTitle.textContent = 'Secure Login';
                toggleText.innerHTML = "Don't have an account? <button type=\"button\" class=\"toggle-btn\" onclick=\"toggleAuthForm(true)\">Sign Up</button>";
            }
        });
    }
    
    // Handle Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        
        console.log('Login attempt:', {username, role});
        
        const registeredUsers = getRegisteredUsers();
        const user = registeredUsers[username];
        
        if (user && user.password === password && user.role === role) {
            currentUser = {
                username: username,
                role: role,
                loginTime: new Date().toLocaleString()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('Login successful');
            showMainApp();
            loginForm.reset();
        } else {
            console.log('Login failed - invalid credentials');
            alert('Invalid username, password, or role. Please try again.');
        }
    });
    
    // Handle Signup
    console.log('Setting up signup form listener...');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Signup form submitted');
        
        const username = document.getElementById('signupUsername').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
        const role = document.getElementById('signupRole').value;
        
        console.log('Signup data:', {username, password, confirmPassword, role});
        
        // Validation
        if (!username || !password || !confirmPassword || !role) {
            alert('Please fill in all fields');
            return;
        }
        
        if (username.length < 3) {
            alert('Username must be at least 3 characters long');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        const registeredUsers = getRegisteredUsers();
        console.log('Current users:', Object.keys(registeredUsers));
        
        if (registeredUsers[username]) {
            alert('Username already exists. Please choose a different username.');
            return;
        }
        
        // Register new user
        registeredUsers[username] = {
            password: password,
            role: role
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        console.log('Account created successfully');
        
        alert(`Account created successfully!\n\nUsername: ${username}\nRole: ${role}\n\nYou can now sign in.`);
        
        // Switch back to login
        signupForm.reset();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('authTitle').textContent = 'Secure Login';
        document.getElementById('toggleText').innerHTML = "Don't have an account? <button type=\"button\" class=\"toggle-btn\" onclick=\"toggleAuthForm(true)\">Sign Up</button>";
        });
    }
    
    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                loginModal.style.display = 'flex';
                mainApp.style.display = 'none';
                loginForm.reset();
            }
        });
    }
}

// Toggle between signup and signin forms
function toggleAuthForm(isSignup) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTitle = document.getElementById('authTitle');
    const toggleText = document.getElementById('toggleText');
    
    if (isSignup) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = 'Create New Account';
        toggleText.innerHTML = 'Already have an account? <button type="button" class="toggle-btn" onclick="toggleAuthForm(false)">Sign In</button>';
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.textContent = 'Secure Login';
        toggleText.innerHTML = "Don't have an account? <button type=\"button\" class=\"toggle-btn\" onclick=\"toggleAuthForm(true)\">Sign Up</button>";
    }
}

// Show Main App
function showMainApp() {
    if (loginModal && mainApp) {
        loginModal.style.display = 'none';
        mainApp.style.display = 'block';
        updateUserInfo();
        initializeApp();
    }
}

// Update User Info Display
function updateUserInfo() {
    if (!userInfo || !currentUser) return;
    
    const roleLabel = {
        'owner': '👑 Owner',
        'doctor': '👨‍⚕️ Doctor',
        'staff': '👤 Staff',
        'patient': '🤝 Patient'
    };
    userInfo.textContent = `${roleLabel[currentUser.role]} - ${currentUser.username}`;
    
    // Show/hide database button based on role
    const databaseBtn = document.getElementById('databaseBtn');
    if (databaseBtn) {
        if (hasRole('owner')) {
            databaseBtn.style.display = 'block';
        } else {
            databaseBtn.style.display = 'none';
        }
    }
}

// Check for role-based access
function hasRole(role) {
    return currentUser && currentUser.role === role;
}

function hasAnyRole(roles) {
    return currentUser && roles.includes(currentUser.role);
}

// Check if user is owner
function isOwner() {
    return hasRole('owner');
}
// Initialize app (called after login)
function initializeApp() {
    // Hide add patient button for patients
    const addPatientBtn = document.getElementById('addPatientBtn');
    if (hasRole('patient')) {
        addPatientBtn.style.display = 'none';
    } else {
        addPatientBtn.style.display = 'block';
    }
    
    // Show database button only for owners
    const databaseBtn = document.getElementById('databaseBtn');
    if (databaseBtn) {
        if (hasRole('owner')) {
            databaseBtn.style.display = 'block';
        } else {
            databaseBtn.style.display = 'none';
        }
    }
    
    // Initialize other app features
    displayPatients();
}

// Original code continues below
const modal = document.getElementById('patientModal');
const ehrModal = document.getElementById('ehrModal');
const btn = document.getElementById('addPatientBtn');
const closeBtn = document.querySelector('.close');
const ehrClose = document.getElementById('ehrClose');
const form = document.getElementById('patientForm');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
let themeToggle;

// Patient management
let patients = JSON.parse(localStorage.getItem('patients')) || [];
let filteredPatients = patients;
let currentPatientIndex = null;

// Room management
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];

// Schedule management
let schedules = JSON.parse(localStorage.getItem('erSchedules')) || [];
let scheduleFilter = 'all';

// Initialize default rooms if none exist
function initializeDefaultRooms() {
    if (rooms.length === 0) {
        const defaultRooms = [
            { number: '101', type: 'Emergency Room', beds: 2, occupiedBeds: [] },
            { number: '102', type: 'Emergency Room', beds: 2, occupiedBeds: [] },
            { number: '201', type: 'General Ward', beds: 4, occupiedBeds: [] },
            { number: '202', type: 'General Ward', beds: 4, occupiedBeds: [] },
            { number: '203', type: 'General Ward', beds: 4, occupiedBeds: [] },
            { number: '301', type: 'ICU', beds: 1, occupiedBeds: [] },
            { number: '302', type: 'ICU', beds: 1, occupiedBeds: [] },
            { number: '401', type: 'Private Room', beds: 1, occupiedBeds: [] }
        ];
        rooms = defaultRooms;
        localStorage.setItem('rooms', JSON.stringify(rooms));
    }
}

initializeDefaultRooms();

// Real-time clock function
function updateRealTimeClock() {
    const clockElement = document.getElementById('realTimeClock');
    if (!clockElement) return;
    
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const timeString = now.toLocaleString('en-US', options);
    clockElement.textContent = timeString;
}

// Update clock every second
setInterval(updateRealTimeClock, 1000);
// Initialize clock immediately
updateRealTimeClock();

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Initialize theme on page load
initTheme();

// ESI Level Auto-Detection System
function detectESILevel(symptoms) {
    if (!symptoms) return '';
    
    const symptomsLower = symptoms.toLowerCase();
    
    // ESI-1: Resuscitation (Life-threatening)
    const esi1Keywords = [
        'cardiac arrest', 'not breathing', 'no pulse', 'unresponsive', 'severe trauma',
        'major bleeding', 'stroke symptoms', 'seizure ongoing', 'anaphylaxis',
        'respiratory arrest', 'unconscious', 'coma', 'severe head injury'
    ];
    
    // ESI-2: Emergent (High risk, severe pain/distress)
    const esi2Keywords = [
        'chest pain', 'difficulty breathing', 'severe pain', 'altered mental status',
        'severe bleeding', 'suspected stroke', 'severe burn', 'overdose',
        'severe allergic reaction', 'high fever', 'severe abdominal pain',
        'compound fracture', 'severe asthma', 'heart attack', 'myocardial infarction'
    ];
    
    // ESI-3: Urgent (Moderate symptoms, stable)
    const esi3Keywords = [
        'moderate pain', 'fever', 'vomiting', 'diarrhea', 'headache',
        'back pain', 'abdominal pain', 'urinary problems', 'infection',
        'fracture', 'sprain', 'laceration', 'dehydration', 'flu symptoms',
        'pneumonia', 'asthma', 'diabetes', 'hypertension'
    ];
    
    // ESI-4: Less Urgent (Minor symptoms, no complications)
    const esi4Keywords = [
        'minor pain', 'cold', 'cough', 'sore throat', 'rash',
        'minor injury', 'minor cut', 'bruise', 'minor burn',
        'ear pain', 'minor infection', 'constipation'
    ];
    
    // ESI-5: Non-Urgent (Minor, chronic, or administrative)
    const esi5Keywords = [
        'prescription refill', 'follow up', 'chronic condition', 'routine check',
        'minor complaint', 'no acute symptoms', 'wellness check'
    ];
    
    // Check for ESI-1 (highest priority)
    for (let keyword of esi1Keywords) {
        if (symptomsLower.includes(keyword)) {
            return 'ESI-1';
        }
    }
    
    // Check for ESI-2
    for (let keyword of esi2Keywords) {
        if (symptomsLower.includes(keyword)) {
            return 'ESI-2';
        }
    }
    
    // Check for ESI-3
    for (let keyword of esi3Keywords) {
        if (symptomsLower.includes(keyword)) {
            return 'ESI-3';
        }
    }
    
    // Check for ESI-4
    for (let keyword of esi4Keywords) {
        if (symptomsLower.includes(keyword)) {
            return 'ESI-4';
        }
    }
    
    // Check for ESI-5
    for (let keyword of esi5Keywords) {
        if (symptomsLower.includes(keyword)) {
            return 'ESI-5';
        }
    }
    
    // Default to ESI-3 if no specific match
    return 'ESI-3';
}

function updateESILevelSuggestion() {
    const diseasesInput = document.getElementById('patientDiseases');
    const esiSelect = document.getElementById('patientESI');
    
    if (!diseasesInput || !esiSelect) return;
    
    const symptoms = diseasesInput.value;
    const suggestedESI = detectESILevel(symptoms);
    
    if (suggestedESI && symptoms.trim()) {
        // Auto-select the suggested ESI level
        esiSelect.value = suggestedESI;
        
        // Add visual feedback
        esiSelect.style.borderColor = '#28a745';
        esiSelect.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.2)';
        
        // Show suggestion message
        let suggestionMsg = document.getElementById('esiSuggestion');
        if (!suggestionMsg) {
            suggestionMsg = document.createElement('div');
            suggestionMsg.id = 'esiSuggestion';
            suggestionMsg.style.cssText = 'margin-top: 8px; padding: 10px; background: rgba(40, 167, 69, 0.1); border-left: 3px solid #28a745; border-radius: 4px; font-size: 13px; color: var(--text-color);';
            esiSelect.parentElement.appendChild(suggestionMsg);
        }
        
        const esiLabels = {
            'ESI-1': 'Resuscitation (Life-threatening)',
            'ESI-2': 'Emergent (High risk)',
            'ESI-3': 'Urgent (Moderate)',
            'ESI-4': 'Less Urgent (Minor)',
            'ESI-5': 'Non-Urgent (Routine)'
        };
        
        suggestionMsg.innerHTML = `✓ Suggested ESI Level: <strong>${suggestedESI}</strong> - ${esiLabels[suggestedESI]}`;
        suggestionMsg.style.display = 'block';
        
        // Reset border after 2 seconds
        setTimeout(() => {
            esiSelect.style.borderColor = '';
            esiSelect.style.boxShadow = '';
        }, 2000);
    } else {
        // Remove suggestion if input is empty
        const suggestionMsg = document.getElementById('esiSuggestion');
        if (suggestionMsg) {
            suggestionMsg.style.display = 'none';
        }
    }
}

// Initialize theme on page load
initTheme();

// Check login status on page load
window.addEventListener('load', function() {
    try {
        console.log('Page loaded - initializing application');
        
        // Initialize login system first
        initializeLoginSystem();
        checkLoginStatus();
        
        // Get DOM element references for patient features
        const modal = document.getElementById('patientModal');
        const ehrModal = document.getElementById('ehrModal');
        const btn = document.getElementById('addPatientBtn');
        const closeBtn = document.querySelector('.close');
        const ehrClose = document.getElementById('ehrClose');
        const form = document.getElementById('patientForm');
        const searchBtn = document.getElementById('searchBtn');
        const resetBtn = document.getElementById('resetBtn');
        const searchInput = document.getElementById('searchInput');
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // AHM toggle
        const ahmToggle = document.getElementById('ahmToggle');
        if (ahmToggle) {
            ahmToggle.addEventListener('click', toggleAHM);
            // Load saved AHM state
            const savedAHM = localStorage.getItem('ahmEnabled');
            if (savedAHM === 'true') {
                ahmEnabled = true;
                const ahmStatus = document.getElementById('ahmStatus');
                if (ahmStatus) {
                    ahmStatus.textContent = 'AHM: On';
                    ahmStatus.parentElement.style.background = 'linear-gradient(135deg, #28a745 0%, #20873a 100%)';
                }
            }
        }
        
        // Password toggle for login form
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function(e) {
                e.preventDefault();
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
        
        // Password toggle for signup form
        const toggleSignupPassword = document.getElementById('toggleSignupPassword');
        const signupPasswordInput = document.getElementById('signupPassword');
        if (toggleSignupPassword && signupPasswordInput) {
            toggleSignupPassword.addEventListener('click', function(e) {
                e.preventDefault();
                const type = signupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                signupPasswordInput.setAttribute('type', type);
                toggleSignupPassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
        
        // Password toggle for confirm password
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const confirmPasswordInput = document.getElementById('signupConfirmPassword');
        if (toggleConfirmPassword && confirmPasswordInput) {
            toggleConfirmPassword.addEventListener('click', function(e) {
                e.preventDefault();
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                toggleConfirmPassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
        
        // Tab switching
        const tabButtons = document.querySelectorAll('.ehr-tab-btn');
        if (tabButtons.length > 0) {
            tabButtons.forEach(tabBtn => {
                tabBtn.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');
                    document.querySelectorAll('.ehr-tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.ehr-tab-content').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    const tabElement = document.getElementById(tabName + '-tab');
                    if (tabElement) {
                        tabElement.classList.add('active');
                    }
                });
            });
        }
        
        // Search event listeners
        if (searchBtn) searchBtn.addEventListener('click', searchPatients);
        if (resetBtn) resetBtn.addEventListener('click', resetSearch);
        if (searchInput) {
            searchInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    searchPatients();
                }
            });
        }
        
        // Add Patient button
        if (btn) {
            btn.addEventListener('click', function() {
                if (modal) {
                    modal.style.display = 'block';
                    const patientIdField = document.getElementById('patientId');
                    if (patientIdField) {
                        patientIdField.value = generatePatientId();
                    }
                    // Load available rooms
                    loadAvailableRooms();
                }
            });
        }
        
        // Add ESI auto-detection listener
        const diseasesInput = document.getElementById('patientDiseases');
        if (diseasesInput) {
            diseasesInput.addEventListener('input', function() {
                // Debounce the ESI detection
                clearTimeout(window.esiDetectionTimeout);
                window.esiDetectionTimeout = setTimeout(updateESILevelSuggestion, 500);
            });
        }
        
        // Room selection change handler
        const roomSelect = document.getElementById('patientRoom');
        if (roomSelect) {
            roomSelect.addEventListener('change', function() {
                loadAvailableBeds(this.value);
            });
        }
        
        // Close modal buttons
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                if (modal) modal.style.display = 'none';
            });
        }
        
        if (ehrClose) {
            ehrClose.addEventListener('click', function() {
                if (ehrModal) ehrModal.style.display = 'none';
            });
        }
        
        // EHR Modal Delete Button
        const ehrDeleteBtn = document.getElementById('ehrDeleteBtn');
        if (ehrDeleteBtn) {
            ehrDeleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this patient?')) {
                    patients.splice(currentPatientIndex, 1);
                    localStorage.setItem('patients', JSON.stringify(patients));
                    filteredPatients = patients;
                    if (ehrModal) ehrModal.style.display = 'none';
                    displayPatients();
                }
            });
        }
        
        // EHR Modal Print Button
        const ehrPrintBtn = document.getElementById('ehrPrintBtn');
        if (ehrPrintBtn) {
            ehrPrintBtn.addEventListener('click', function() {
                if (currentPatientIndex !== null && patients[currentPatientIndex]) {
                    printPatientRecord(patients[currentPatientIndex]);
                }
            });
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const patientId = document.getElementById('patientId').value;
                const name = document.getElementById('patientName').value;
                const age = document.getElementById('patientAge').value;
                const birthday = document.getElementById('patientBirthday').value;
                const religion = document.getElementById('patientReligion').value;
                const physician = document.getElementById('patientPhysician').value;
                const location = document.getElementById('patientLocation').value;
                const room = document.getElementById('patientRoom').value;
                const bed = document.getElementById('patientBed').value;
                const time = document.getElementById('patientTime').value;
                const esiLevel = document.getElementById('patientESI').value;
                const diseases = document.getElementById('patientDiseases').value;
                
                if (!room || !bed) {
                    alert('Please select a room and bed');
                    return;
                }
                
                // Mark bed as occupied
                const roomObj = rooms.find(r => r.number === room);
                if (roomObj) {
                    if (!roomObj.occupiedBeds) roomObj.occupiedBeds = [];
                    roomObj.occupiedBeds.push(bed);
                    localStorage.setItem('rooms', JSON.stringify(rooms));
                }
                
                const newPatient = {
                    id: patientId,
                    name: name,
                    age: age,
                    birthday: birthday,
                    religion: religion,
                    physician: physician,
                    location: location,
                    room: room,
                    bed: bed,
                    time: time,
                    esiLevel: esiLevel,
                    diseases: diseases,
                    diagnosis: [],
                    medications: [],
                    labs: [],
                    clinicalNotes: '',
                    createdBy: currentUser ? currentUser.username : 'unknown',
                    createdByRole: currentUser ? currentUser.role : 'unknown',
                    ebiTriage: [],
                    transfers: [],
                    specialEndorsement: []
                };
                
                // Automatically add initial EBI Triage Assessment
                const initialTriage = {
                    chiefComplaint: diseases || 'Initial Assessment',
                    level: esiLevel || 'Level 3 - Urgent',
                    assessment: `Patient admitted to ${room} - ${bed}. Initial triage assessment completed.`,
                    interventions: 'Patient registered and assigned to room. Vital signs to be monitored.',
                    time: new Date().toISOString()
                };
                newPatient.ebiTriage.push(initialTriage);
                
                patients.push(newPatient);
                localStorage.setItem('patients', JSON.stringify(patients));
                filteredPatients = patients;
                
                const timeDisplay = new Date(time).toLocaleString();
                alert(`Patient Added:\nPatient ID: ${patientId}\nName: ${name}\nAge: ${age}\nBirthday: ${birthday}\nReligion: ${religion}\nPhysician: ${physician}\nLocation: ${location}\nRoom: ${room}\nBed: ${bed}\nDate admitted: ${timeDisplay}\nDiseases: ${diseases || 'None'}`);
                form.reset();
                if (modal) modal.style.display = 'none';
                displayPatients();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
            if (ehrModal && event.target === ehrModal) {
                ehrModal.style.display = 'none';
            }
        });
        
        console.log('Application initialization complete');
    } catch (error) {
        console.error('Error during application initialization:', error);
        console.error('Stack trace:', error.stack);
    }
});


// Function to generate unique patient ID
function generatePatientId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `P${timestamp}${random}`.slice(0, 12);
}

// Function to display patients in table
function displayPatients() {
    const cardsGrid = document.getElementById('patientCardsGrid');
    const noPatients = document.getElementById('noPatients');
    
    cardsGrid.innerHTML = '';
    
    // Filter patients based on role
    let patientsToDisplay = filteredPatients;
    if (hasRole('patient')) {
        // Patients can only see their own records
        patientsToDisplay = filteredPatients.filter(p => p.createdBy === currentUser.username);
    }
    
    if (patientsToDisplay.length === 0) {
        noPatients.style.display = 'block';
        cardsGrid.style.display = 'none';
    } else {
        noPatients.style.display = 'none';
        cardsGrid.style.display = 'grid';
        
        patientsToDisplay.forEach((patient, displayIndex) => {
            // Find the actual index in the main patients array
            const actualIndex = patients.findIndex(p => p.id === patient.id);
            
            // Format the time for display
            const timeDisplay = patient.time ? new Date(patient.time).toLocaleString('en-US', {
                weekday: 'short',
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }) : 'N/A';
            
            // Get ESI badge
            const esiLevel = patient.esiLevel || 'N/A';
            let esiBadgeClass = 'esi-badge';
            if (esiLevel.includes('ESI-1')) esiBadgeClass += ' esi-1';
            else if (esiLevel.includes('ESI-2')) esiBadgeClass += ' esi-2';
            else if (esiLevel.includes('ESI-3')) esiBadgeClass += ' esi-3';
            else if (esiLevel.includes('ESI-4')) esiBadgeClass += ' esi-4';
            else if (esiLevel.includes('ESI-5')) esiBadgeClass += ' esi-5';
            
            const esiDisplay = esiLevel !== 'N/A' ? `<span class="${esiBadgeClass}">${esiLevel}</span>` : '<span class="esi-badge" style="background: var(--secondary-gradient);">N/A</span>';
            const addedBy = patient.createdBy || 'Unknown';
            
            const card = document.createElement('div');
            card.className = 'patient-card';
            card.innerHTML = `
                <div class="patient-card-header">
                    <div>
                        <h3>${patient.name}</h3>
                        <p class="patient-id">ID: ${patient.id}</p>
                    </div>
                    ${esiDisplay}
                </div>
                <div class="patient-card-body">
                    <div class="patient-info-row">
                        <span class="info-label">Age:</span>
                        <span class="info-value">${patient.age}</span>
                    </div>
                    <div class="patient-info-row">
                        <span class="info-label">Location:</span>
                        <span class="info-value">${patient.location || 'N/A'}</span>
                    </div>
                    <div class="patient-info-row">
                        <span class="info-label">Room:</span>
                        <span class="info-value">${patient.room || 'N/A'}${patient.bed ? ' - ' + patient.bed : ''}</span>
                    </div>
                    <div class="patient-info-row">
                        <span class="info-label">Admitted:</span>
                        <span class="info-value">${timeDisplay}</span>
                    </div>
                    <div class="patient-info-row">
                        <span class="info-label">Added By:</span>
                        <span class="info-value">👤 ${addedBy}</span>
                    </div>
                </div>
                <div class="patient-card-actions">
                    <button class="view-btn" onclick="openPatientRecord(${actualIndex})">View Record</button>
                    ${!hasRole('patient') ? `<button class="delete-btn" onclick="deletePatient(${actualIndex})">Delete</button>` : ''}
                </div>
            `;
            cardsGrid.appendChild(card);
        });
    }
}

// Function to search patients
function searchPatients() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredPatients = patients;
    } else {
        filteredPatients = patients.filter(patient => {
            return (
                patient.id.toLowerCase().includes(searchTerm) ||
                patient.name.toLowerCase().includes(searchTerm) ||
                (patient.location && patient.location.toLowerCase().includes(searchTerm)) ||
                (patient.room && patient.room.toLowerCase().includes(searchTerm)) ||
                (patient.religion && patient.religion.toLowerCase().includes(searchTerm)) ||
                (patient.physician && patient.physician.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    displayPatients();
}

// Function to reset search
function resetSearch() {
    searchInput.value = '';
    filteredPatients = patients;
    displayPatients();
}

// Function to delete patient
function deletePatient(index) {
    if (confirm('Are you sure you want to delete this patient?')) {
        const patient = patients[index];
        
        // Free up the bed
        if (patient.room && patient.bed) {
            const roomObj = rooms.find(r => r.number === patient.room);
            if (roomObj && roomObj.occupiedBeds) {
                const bedIndex = roomObj.occupiedBeds.indexOf(patient.bed);
                if (bedIndex > -1) {
                    roomObj.occupiedBeds.splice(bedIndex, 1);
                    localStorage.setItem('rooms', JSON.stringify(rooms));
                }
            }
        }
        
        patients.splice(index, 1);
        localStorage.setItem('patients', JSON.stringify(patients));
        filteredPatients = patients;
        displayPatients();
    }
}

// Load patients on page load
displayPatients();

// EHR Functions
function openPatientRecord(index) {
    // Patients can only view their own record
    if (hasRole('patient') && patients[index].username !== currentUser.username) {
        alert('You can only view your own patient record.');
        return;
    }
    
    currentPatientIndex = index;
    const patient = patients[index];
    
    // Initialize EHR data if not exists
    if (!patient.room) patient.room = '';
    if (!patient.birthday) patient.birthday = '';
    if (!patient.religion) patient.religion = '';
    if (!patient.physician) patient.physician = '';
    if (!patient.diagnosis) patient.diagnosis = [];
    if (!patient.medications) patient.medications = [];
    if (!patient.labs) patient.labs = [];
    if (!patient.clinicalNotes) patient.clinicalNotes = '';
    
    // Update EHR header
    document.getElementById('ehrPatientName').textContent = patient.name;
    document.getElementById('ehrPatientId').textContent = 'ID: ' + patient.id;
    
    // Format date admitted
    const dateAdmitted = patient.time ? new Date(patient.time).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) : 'N/A';
    
    // Format added by
    const addedBy = patient.createdBy ? `👤 ${patient.createdBy} (${patient.createdByRole || 'unknown'})` : 'Unknown';
    
    // Update quick info with proper structure
    const quickInfo = document.querySelector('.ehr-quick-info');
    quickInfo.innerHTML = `
        <span data-label="Age"><strong id="ehrAge">${patient.age}</strong></span>
        <span data-label="Birthday"><strong id="ehrBirthday">${patient.birthday || 'N/A'}</strong></span>
        <span data-label="Religion"><strong id="ehrReligion">${patient.religion || 'N/A'}</strong></span>
        <span data-label="Location"><strong id="ehrLocation">${patient.location}</strong></span>
        <span data-label="Room"><strong id="ehrRoom">${patient.room || 'N/A'}</strong></span>
        <span data-label="Attending Physician"><strong id="ehrPhysician">${patient.physician || 'N/A'}</strong></span>
        <span data-label="Date Admitted"><strong id="ehrDateAdmitted">${dateAdmitted}</strong></span>
        <span data-label="Added By"><strong id="ehrAddedBy">${addedBy}</strong></span>
        <span data-label="ESI Level"><strong id="ehrESI">${patient.esiLevel || 'N/A'}</strong></span>
    `;
    
    // Load EHR data
    loadDiagnosisList();
    loadMedicationsList();
    loadLabsList();
    loadNotes();
    // Render vitals chart if present
    renderVitalsChart();
    // Load FDAR entries
    loadFDARList();
    // Render FDAR chart if present
    renderFDARChart();
    // Load SOAPIEa and ADPIE entries
    loadSOAPIEaList();
    loadADPIEList();
    // Load patient history
    loadPatientHistory();
    // Load FDAR quick-insert into clinical notes
    loadFDARIntoNotes();
    // Load Special Endorsement into notes
    loadSpecialEndorsementIntoNotes();
    // Load SOAPIEa into notes
    loadSOAPIEaIntoNotes();
    // Load ADPIE into notes
    loadADPIEIntoNotes();
    // Load EBI Triage
    loadEBITriageList();
    // Load Transfer Records
    loadTransferList();
    
    // Hide edit functionality for patients
    const inputGroups = document.querySelectorAll('.ehr-input-group');
    const editButtons = document.querySelectorAll('.ehr-add-btn, .ehr-save-btn');
    const notesArea = document.getElementById('notesArea');
    
    if (hasRole('patient')) {
        inputGroups.forEach(group => group.style.display = 'none');
        editButtons.forEach(btn => btn.style.display = 'none');
        notesArea.disabled = true;
    } else {
        inputGroups.forEach(group => group.style.display = 'flex');
        editButtons.forEach(btn => btn.style.display = 'block');
        notesArea.disabled = false;
    }
    
    // Show EHR modal
    ehrModal.style.display = 'block';
}

// Print Patient Record Function
function printPatientRecord() {
    if (currentPatientIndex === null) {
        alert('No patient selected');
        return;
    }
    
    const patient = patients[currentPatientIndex];
    
    // Format helper functions
    const formatArray = (arr) => {
        if (!arr || arr.length === 0) return '<em>None recorded</em>';
        return arr.map(item => `<li>${typeof item === 'string' ? item : JSON.stringify(item)}</li>`).join('');
    };
    
    const formatMedications = (meds) => {
        if (!meds || meds.length === 0) return '<em>No medications recorded</em>';
        return meds.map(med => `
            <div style="background:#f8f9fa;padding:12px;margin:8px 0;border-radius:6px;border-left:4px solid #0066cc">
                <strong>${med.name || 'Unknown'}</strong> - ${med.dosage || 'N/A'}<br>
                <small>Route: ${med.route || 'N/A'} | Schedule: ${med.schedule || 'N/A'}</small><br>
                ${med.evaluation ? `<small>Evaluation: ${med.evaluation}</small><br>` : ''}
                ${med.time ? `<small>Time: ${new Date(med.time).toLocaleString()}</small>` : ''}
            </div>
        `).join('');
    };
    
    const formatVitals = (vitals) => {
        if (!vitals || vitals.length === 0) return '<em>No vitals recorded</em>';
        return vitals.map(v => `
            <div style="display:inline-block;background:#f8f9fa;padding:10px 14px;margin:6px;border-radius:6px;border:2px solid #0066cc">
                <strong>${v.type}:</strong> ${v.value} <br><small>${new Date(v.time).toLocaleString()}</small>
            </div>
        `).join('');
    };
    
    // Create printable HTML
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Patient Record - ${patient.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            background: white;
            color: #2c3e50;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 4px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .hospital-name {
            font-size: 32px;
            font-weight: 700;
            color: #0066cc;
            margin-bottom: 5px;
        }
        .subtitle {
            font-size: 16px;
            color: #5a6c7d;
            margin-bottom: 10px;
        }
        .patient-name {
            font-size: 28px;
            font-weight: 700;
            color: #2c3e50;
            margin: 20px 0 10px 0;
        }
        .patient-id {
            font-size: 18px;
            color: #0066cc;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        .section {
            margin: 30px 0;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #0066cc;
        }
        .info-label {
            font-size: 11px;
            color: #5a6c7d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 15px;
            color: #2c3e50;
            font-weight: 600;
        }
        .list {
            list-style: none;
            padding: 0;
        }
        .list li {
            background: #f8f9fa;
            padding: 10px;
            margin: 8px 0;
            border-radius: 6px;
            border-left: 4px solid #0066cc;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #dfe6e9;
            text-align: center;
            font-size: 12px;
            color: #95a5a6;
        }
        @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="hospital-name">MediCare Hospital</div>
        <div class="subtitle">Patient Medical Record</div>
        <div class="patient-name">${patient.name}</div>
        <div class="patient-id">ID: ${patient.id}</div>
    </div>
    
    <!-- Basic Information -->
    <div class="section">
        <div class="section-title">📋 Patient Information</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${patient.age} years</div>
            </div>
            <div class="info-item">
                <div class="info-label">Birthday</div>
                <div class="info-value">${patient.birthday || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Religion</div>
                <div class="info-value">${patient.religion || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${patient.location}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Room & Bed</div>
                <div class="info-value">${patient.room || 'N/A'} - Bed ${patient.bed || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">ESI Level</div>
                <div class="info-value">${patient.esiLevel || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Attending Physician</div>
                <div class="info-value">${patient.physician || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Date Admitted</div>
                <div class="info-value">${patient.time ? new Date(patient.time).toLocaleString() : 'N/A'}</div>
            </div>
        </div>
    </div>
    
    <!-- Diagnosis -->
    <div class="section">
        <div class="section-title">🩺 Diagnosis & Medical History</div>
        ${patient.diseases ? `<p style="margin-bottom:10px"><strong>Diseases:</strong> ${patient.diseases}</p>` : ''}
        <ul class="list">
            ${formatArray(patient.diagnosis)}
        </ul>
    </div>
    
    <!-- Medications -->
    <div class="section">
        <div class="section-title">💊 Medications</div>
        ${formatMedications(patient.medications)}
    </div>
    
    <!-- Vitals -->
    <div class="section">
        <div class="section-title">❤️ Vital Signs</div>
        ${formatVitals(patient.vitals)}
    </div>
    
    <!-- Lab Results -->
    <div class="section">
        <div class="section-title">🔬 Lab Results</div>
        <ul class="list">
            ${formatArray(patient.labs)}
        </ul>
    </div>
    
    <!-- Clinical Notes -->
    ${patient.clinicalNotes ? `
    <div class="section">
        <div class="section-title">📝 Clinical Notes</div>
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;white-space:pre-wrap">${patient.clinicalNotes}</div>
    </div>
    ` : ''}
    
    <div class="footer">
        <p><strong>MediCare Hospital</strong> - Confidential Patient Information</p>
        <p>Printed: ${new Date().toLocaleString()}</p>
        <p>© 2024 MediCare Hospital. All rights reserved.</p>
    </div>
</body>
</html>
    `);
    
    printWindow.document.close();
    
    // Auto print after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Vitals / Chart functions
let hrChart = null;
let tempChart = null;
let bpChart = null;
let rrChart = null;
let o2satChart = null;

function renderVitalsChart() {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    const vitals = patient.vitals || [];

    const noVitalsMsg = document.getElementById('noVitalsMsg');
    
    if (!vitals || vitals.length === 0) {
        // Destroy all charts
        if (hrChart) { hrChart.destroy(); hrChart = null; }
        if (tempChart) { tempChart.destroy(); tempChart = null; }
        if (bpChart) { bpChart.destroy(); bpChart = null; }
        if (rrChart) { rrChart.destroy(); rrChart = null; }
        if (o2satChart) { o2satChart.destroy(); o2satChart = null; }
        
        if (noVitalsMsg) noVitalsMsg.style.display = 'block';
        return;
    }

    if (noVitalsMsg) noVitalsMsg.style.display = 'none';

    // Group vitals by type
    const hrData = vitals.filter(v => v.type === 'HR' || v.type === 'PULSE');
    const tempData = vitals.filter(v => v.type === 'TEMP');
    const bpData = vitals.filter(v => v.type === 'BP');
    const rrData = vitals.filter(v => v.type === 'RR');
    const o2satData = vitals.filter(v => v.type === 'O2SAT');

    // Render each chart
    renderSingleVitalChart('hrChart', hrData, 'HR', 'rgba(255,0,0,0.95)', 'Heart Rate (bpm)', hrChart, (chart) => { hrChart = chart; });
    renderSingleVitalChart('tempChart', tempData, 'TEMP', 'rgba(255,206,86,0.95)', 'Temperature (°C)', tempChart, (chart) => { tempChart = chart; });
    renderSingleVitalChart('bpChart', bpData, 'BP', 'rgba(54,162,235,0.95)', 'Blood Pressure (mmHg)', bpChart, (chart) => { bpChart = chart; });
    renderSingleVitalChart('rrChart', rrData, 'RR', 'rgba(255,159,64,0.95)', 'Respiratory Rate', rrChart, (chart) => { rrChart = chart; });
    renderSingleVitalChart('o2satChart', o2satData, 'O2SAT', 'rgba(102,126,234,0.95)', 'O2 Saturation (%)', o2satChart, (chart) => { o2satChart = chart; });
}

function renderSingleVitalChart(canvasId, data, type, color, label, existingChart, setChart) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Hide canvas if no data
    if (!data || data.length === 0) {
        canvas.style.display = 'none';
        canvas.parentElement.style.display = 'none';
        if (existingChart) {
            existingChart.destroy();
            setChart(null);
        }
        return;
    }

    canvas.style.display = 'block';
    canvas.parentElement.style.display = 'block';

    // Sort data by time
    const sortedData = [...data].sort((a, b) => new Date(a.time) - new Date(b.time));
    
    // Prepare labels and values - show only time for compact view
    const labels = sortedData.map(v => {
        const date = new Date(v.time);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
    const values = sortedData.map(v => {
        // For BP, extract systolic (first number)
        if (type === 'BP' && typeof v.value === 'string') {
            const parts = v.value.split('/');
            return Number(parts[0]);
        }
        // For temperature, extract numeric value
        if (type === 'TEMP') {
            const numValue = parseFloat(String(v.value).replace(/[^0-9.]/g, ''));
            return isNaN(numValue) ? null : numValue;
        }
        return Number(v.value);
    });

    const ctx = canvas.getContext('2d');
    
    // Update existing chart or create new one
    if (existingChart) {
        existingChart.data.labels = labels;
        existingChart.data.datasets[0].data = values;
        existingChart.update();
        return;
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                backgroundColor: color.replace(/0\.95\)/, '0.2)'),
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderWidth: 2,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    titleFont: { size: 11, weight: 'bold' },
                    bodyFont: { size: 10 },
                    padding: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            const date = new Date(sortedData[index].time);
                            return date.toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            });
                        },
                        label: function(context) {
                            let value = context.parsed.y;
                            // For BP, show both systolic and diastolic
                            if (type === 'BP') {
                                const originalValue = sortedData[context.dataIndex].value;
                                return `${originalValue}`;
                            }
                            return `${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        font: { size: 9 },
                        maxTicksLimit: 5
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    beginAtZero: false,
                    ticks: {
                        font: { size: 10, weight: '600' },
                        maxTicksLimit: 4
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        lineWidth: 1
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
    
    setChart(newChart);
}

// Adds sample vitals for preview (not intended for production)
function addSampleVitals() {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.vitals) patient.vitals = [];

    // Generate 6 sample heart-rate like values over past hours
    const now = Date.now();
    const types = ['BP','HR','RR','TEMP','O2SAT'];
    for (let i = 6; i > 0; i--) {
        const timeIso = new Date(now - i * 60 * 60 * 1000).toISOString();
        // BP (systolic/diastolic)
        const systolic = Math.floor(110 + Math.random() * 20);
        const diastolic = Math.floor(70 + Math.random() * 10);
        patient.vitals.push({ type: 'BP', value: `${systolic}/${diastolic}`, time: timeIso });
        // HR
        patient.vitals.push({ type: 'HR', value: Math.floor(60 + Math.random() * 40), time: timeIso });
        // RR
        patient.vitals.push({ type: 'RR', value: Math.floor(12 + Math.random() * 6), time: timeIso });
        // TEMP
        patient.vitals.push({ type: 'TEMP', value: (36 + Math.random() * 1.8).toFixed(1), time: timeIso });
        // O2SAT
        patient.vitals.push({ type: 'O2SAT', value: Math.floor(95 + Math.random() * 4), time: timeIso });
    }
    localStorage.setItem('patients', JSON.stringify(patients));
    renderVitalsChart();
    alert('Sample vitals added for preview.');
}

function addVital() {
    if (currentPatientIndex === null) return;
    const typeEl = document.getElementById('vitalType');
    const valueEl = document.getElementById('vitalValue');
    if (!typeEl || !valueEl) return;
    
    let type = typeEl.value;
    let value = valueEl.value.trim();
    if (value === '') { alert('Please enter a value'); return; }
    
    // Get the selected option text to determine temperature type
    const selectedText = typeEl.options[typeEl.selectedIndex].text;
    
    // Validate BP format (100/60) or numeric
    if (type === 'BP') {
        if (!/^\d+\/\d+$/.test(value)) {
            alert('BP format should be: 100/60 (systolic/diastolic)');
            return;
        }
    } else {
        // Other vitals must be numeric
        const numValue = Number(value);
        if (isNaN(numValue)) { 
            alert('Value must be numeric'); 
            return; 
        }
        
        // For temperature, append the type to the value
        if (type === 'TEMP') {
            if (selectedText.includes('Oral')) value = numValue + ' Oral';
            else if (selectedText.includes('Rectal')) value = numValue + ' Rectal';
            else if (selectedText.includes('Axillary')) value = numValue + ' Axillary';
            else if (selectedText.includes('Tympanic')) value = numValue + ' Tympanic';
            else value = numValue;
        } else {
            value = numValue;
        }
    }
    
    const patient = patients[currentPatientIndex];
    if (!patient.vitals) patient.vitals = [];
    patient.vitals.push({ type, value, time: new Date().toISOString() });
    localStorage.setItem('patients', JSON.stringify(patients));
    valueEl.value = '';
    renderVitalsChart();
}

function addRestQuick() {
    if (currentPatientIndex === null) return;
    const restValue = prompt('Enter REST value (e.g., 8 for 8 hours):');
    if (restValue === null) return;
    
    const numValue = Number(restValue.trim());
    if (isNaN(numValue)) {
        alert('REST value must be numeric');
        return;
    }
    
    const patient = patients[currentPatientIndex];
    if (!patient.vitals) patient.vitals = [];
    patient.vitals.push({ type: 'REST', value: numValue, time: new Date().toISOString() });
    localStorage.setItem('patients', JSON.stringify(patients));
    renderVitalsChart();
    alert('REST entry added: ' + numValue);
}

function resetVitalsGraph() {
    if (currentPatientIndex === null) return;
    if (!confirm('Are you sure you want to clear all vital signs data from the graph? This cannot be undone.')) return;
    
    const patient = patients[currentPatientIndex];
    patient.vitals = [];
    localStorage.setItem('patients', JSON.stringify(patients));
    renderVitalsChart();
    alert('Vital signs graph has been reset.');
}

// EBI Triage functions
function loadEBITriageList() {
    const list = document.getElementById('ebiTriageList');
    const noMsg = document.getElementById('noEBIMsg');
    if (!list) return;
    list.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const arr = patient.ebiTriage || [];
    if (arr.length === 0) { noMsg.style.display = 'block'; return; }
    noMsg.style.display = 'none';
    arr.forEach((e, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        
        // Determine color based on level
        let levelColor = '#6c757d';
        let borderColor = '#6c757d';
        if (e.level.includes('Level 1')) {
            levelColor = '#c9302c';
            borderColor = '#c9302c';
        } else if (e.level.includes('Level 2')) {
            levelColor = '#ec7c26';
            borderColor = '#ec7c26';
        } else if (e.level.includes('Level 3')) {
            levelColor = '#f0ad4e';
            borderColor = '#f0ad4e';
        } else if (e.level.includes('Level 4')) {
            levelColor = '#5cb85c';
            borderColor = '#5cb85c';
        } else if (e.level.includes('Level 5')) {
            levelColor = '#5bc0de';
            borderColor = '#5bc0de';
        }
        
        div.style.borderLeftColor = borderColor;
        div.style.background = `linear-gradient(to right, ${levelColor}08, transparent)`;
        
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700; margin-bottom:6px;">
                    <span style="padding:6px 12px; background:${levelColor}; color:white; border-radius:6px; font-size:12px; font-weight:700; box-shadow: 0 2px 6px ${levelColor}40;">${e.level}</span>
                    <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:8px;">${new Date(e.time).toLocaleString()}</span>
                </div>
                <div><strong>Chief Complaint:</strong> ${e.chiefComplaint}</div>
                <div><strong>Assessment:</strong> ${e.assessment}</div>
                <div><strong>Interventions:</strong> ${e.interventions}</div>
            </div>
            <div style="margin-left:10px"><button class="remove-btn" onclick="removeEBITriage(${idx})">✕</button></div>
        `;
        list.appendChild(div);
    });
}

function addEBITriage() {
    if (currentPatientIndex === null) return;
    const chiefComplaint = document.getElementById('ebiChiefComplaint').value.trim();
    const level = document.getElementById('ebiTriageLevel').value;
    const assessment = document.getElementById('ebiAssessment').value.trim();
    const interventions = document.getElementById('ebiInterventions').value.trim();
    if (!chiefComplaint || !level) { alert('Please provide Chief Complaint and Triage Level.'); return; }
    const entry = { chiefComplaint, level, assessment, interventions, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.ebiTriage) patient.ebiTriage = [];
    patient.ebiTriage.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    clearEBIInputs();
    loadEBITriageList();
}

function clearEBIInputs() {
    document.getElementById('ebiChiefComplaint').value = '';
    document.getElementById('ebiTriageLevel').value = '';
    document.getElementById('ebiAssessment').value = '';
    document.getElementById('ebiInterventions').value = '';
}

function removeEBITriage(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.ebiTriage || !patient.ebiTriage[idx]) return;
    if (!confirm('Delete this EBI Triage entry?')) return;
    patient.ebiTriage.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadEBITriageList();
}

// Transfer Functions
function addTransferRecord() {
    if (currentPatientIndex === null) return;
    
    const transferType = document.getElementById('transferType').value;
    const destination = document.getElementById('transferDestination').value.trim();
    const reason = document.getElementById('transferReason').value.trim();
    const authorizedBy = document.getElementById('transferAuthorizedBy').value.trim();
    const accompaniedBy = document.getElementById('transferAccompaniedBy').value.trim();
    const condition = document.getElementById('transferCondition').value;
    const notes = document.getElementById('transferNotes').value.trim();
    
    if (!destination || !reason) {
        alert('Please enter destination and reason for transfer');
        return;
    }
    
    const patient = patients[currentPatientIndex];
    if (!patient.transfers) {
        patient.transfers = [];
    }
    
    const transferRecord = {
        type: transferType,
        destination: destination,
        reason: reason,
        authorizedBy: authorizedBy || 'Not specified',
        accompaniedBy: accompaniedBy || 'Not specified',
        condition: condition,
        notes: notes,
        timestamp: new Date().toISOString(),
        processedBy: currentUser ? currentUser.username : 'Unknown',
        processedByRole: currentUser ? currentUser.role : 'Unknown'
    };
    
    patient.transfers.push(transferRecord);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear form
    document.getElementById('transferDestination').value = '';
    document.getElementById('transferReason').value = '';
    document.getElementById('transferAuthorizedBy').value = '';
    document.getElementById('transferAccompaniedBy').value = '';
    document.getElementById('transferNotes').value = '';
    document.getElementById('transferType').value = 'Hospital';
    document.getElementById('transferCondition').value = 'Stable';
    
    loadTransferList();
    alert('Transfer record added successfully');
}

function loadTransferList() {
    const list = document.getElementById('transferList');
    if (!list) return;
    
    const patient = patients[currentPatientIndex];
    list.innerHTML = '';
    
    if (!patient.transfers || patient.transfers.length === 0) {
        list.innerHTML = '<p class="empty-message">No transfer records for this patient</p>';
        return;
    }
    
    patient.transfers.forEach((transfer, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        const timestamp = new Date(transfer.timestamp).toLocaleString();
        
        // Color code by transfer type
        let typeColor = '#667eea';
        if (transfer.type === 'ICU') typeColor = '#ff6b6b';
        else if (transfer.type === 'OR') typeColor = '#ff9f43';
        else if (transfer.type === 'Discharge' || transfer.type === 'Home') typeColor = '#26de81';
        
        // Condition badge color
        let conditionColor = '#26de81';
        if (transfer.condition === 'Critical') conditionColor = '#ff3838';
        else if (transfer.condition === 'Serious') conditionColor = '#ff6348';
        else if (transfer.condition === 'Fair') conditionColor = '#ffa502';
        
        div.innerHTML = `
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="padding: 4px 12px; background: ${typeColor}; color: white; border-radius: 6px; font-size: 12px; font-weight: 700;">${transfer.type}</span>
                        <span style="font-weight: 700; font-size: 15px; color: var(--text-color);">${transfer.destination}</span>
                    </div>
                    <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                </div>
                
                <div style="padding: 12px; background: var(--list-bg); border-radius: 8px; border-left: 3px solid ${typeColor}; margin-bottom: 8px;">
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--text-light); font-size: 12px; font-weight: 600;">Reason:</span>
                        <div style="margin-top: 4px; color: var(--text-color);">${transfer.reason}</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                        <div>
                            <span style="color: var(--text-light); font-size: 11px;">Authorized By:</span>
                            <div style="font-weight: 600; color: var(--primary);">${transfer.authorizedBy}</div>
                        </div>
                        <div>
                            <span style="color: var(--text-light); font-size: 11px;">Accompanied By:</span>
                            <div style="font-weight: 600;">${transfer.accompaniedBy}</div>
                        </div>
                        <div>
                            <span style="color: var(--text-light); font-size: 11px;">Patient Condition:</span>
                            <div><span style="padding: 2px 8px; background: ${conditionColor}; color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">${transfer.condition}</span></div>
                        </div>
                    </div>
                    
                    ${transfer.notes ? `
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                            <span style="color: var(--text-light); font-size: 11px; font-weight: 600;">Notes:</span>
                            <div style="margin-top: 4px; font-size: 13px; color: var(--text-color);">${transfer.notes}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div style="font-size: 11px; color: var(--text-lighter);">
                    Processed by: <strong>${transfer.processedBy}</strong> (${transfer.processedByRole})
                </div>
            </div>
            <button onclick="removeTransfer(${idx})" class="remove-btn">✕</button>
        `;
        
        list.appendChild(div);
    });
}

function removeTransfer(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.transfers || !patient.transfers[idx]) return;
    if (!confirm('Delete this transfer record?')) return;
    patient.transfers.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadTransferList();
}

// Sample Data function
function addSampleData() {
    if (!confirm('This will add sample patients with complete medical records. Continue?')) return;
    
    const samplePatients = [
        {
            id: generatePatientId(),
            name: 'John Rodriguez',
            age: 45,
            birthday: '1979-08-15',
            religion: 'Catholic',
            physician: 'Dr. Sarah Johnson',
            location: 'Emergency Room A',
            room: '101',
            bed: 'Bed 1',
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            esiLevel: 'ESI-1',
            diseases: 'Acute coronary syndrome',
            diagnosis: ['Acute coronary syndrome', 'Essential hypertension'],
            medications: ['Aspirin 500mg', 'Atorvastatin 40mg'],
            labs: ['Blood Pressure: 120/80', 'Cholesterol: 180 mg/dL'],
            vitals: [],
            clinicalNotes: 'Patient stable, responding well to treatment.',
            createdBy: currentUser ? currentUser.username : 'Lester',
            createdByRole: currentUser ? currentUser.role : 'doctor'
        },
        {
            id: generatePatientId(),
            name: 'Patricia Williams',
            age: 52,
            birthday: '1972-03-22',
            religion: 'Protestant',
            physician: 'Dr. Michael Chen',
            location: 'General Ward',
            room: '203',
            bed: 'Bed 2',
            time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            esiLevel: 'ESI-3',
            diseases: 'Type 2 Diabetes',
            diagnosis: ['Type 2 Diabetes Mellitus', 'Diabetic neuropathy'],
            medications: ['Metformin 1000mg', 'Insulin glargine'],
            labs: ['HbA1c: 7.2%', 'Fasting glucose: 140 mg/dL'],
            vitals: [],
            clinicalNotes: 'Blood sugar levels improving with medication adjustment.',
            createdBy: currentUser ? currentUser.username : 'Lester',
            createdByRole: currentUser ? currentUser.role : 'doctor'
        }
    ];
    
    // Add sample vitals
    const now = Date.now();
    for (let i = 6; i > 0; i--) {
        const timeIso = new Date(now - i * 60 * 60 * 1000).toISOString();
        samplePatients[0].vitals.push({ type: 'BP', value: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`, time: timeIso });
        samplePatients[0].vitals.push({ type: 'HR', value: 60 + Math.floor(Math.random() * 40), time: timeIso });
        samplePatients[1].vitals.push({ type: 'BP', value: `${120 + Math.floor(Math.random() * 20)}/${75 + Math.floor(Math.random() * 10)}`, time: timeIso });
        samplePatients[1].vitals.push({ type: 'TEMP', value: (36 + Math.random() * 1.5).toFixed(1), time: timeIso });
    }
    
    // Mark beds as occupied for sample patients
    const room101 = rooms.find(r => r.number === '101');
    if (room101) {
        if (!room101.occupiedBeds) room101.occupiedBeds = [];
        if (!room101.occupiedBeds.includes('Bed 1')) room101.occupiedBeds.push('Bed 1');
    }
    
    const room203 = rooms.find(r => r.number === '203');
    if (room203) {
        if (!room203.occupiedBeds) room203.occupiedBeds = [];
        if (!room203.occupiedBeds.includes('Bed 2')) room203.occupiedBeds.push('Bed 2');
    }
    
    localStorage.setItem('rooms', JSON.stringify(rooms));
    patients.push(...samplePatients);
    localStorage.setItem('patients', JSON.stringify(patients));
    filteredPatients = patients;
    displayPatients();
    alert('Sample data added successfully!');
}

// AHM Toggle
let ahmEnabled = false;
function toggleAHM() {
    ahmEnabled = !ahmEnabled;
    const ahmStatus = document.getElementById('ahmStatus');
    if (ahmStatus) {
        ahmStatus.textContent = ahmEnabled ? 'AHM: On' : 'AHM: Off';
        if (ahmEnabled) {
            ahmStatus.parentElement.style.background = 'linear-gradient(135deg, #28a745 0%, #20873a 100%)';
        } else {
            ahmStatus.parentElement.style.background = '';
        }
    }
    localStorage.setItem('ahmEnabled', ahmEnabled);
}

function loadDiagnosisList() {
    const list = document.getElementById('diagnosisList');
    const patient = patients[currentPatientIndex];
    list.innerHTML = '';
    
    if (patient.diagnosis.length === 0) {
        list.innerHTML = '<p class="empty-message">No diagnoses added yet</p>';
    } else {
        patient.diagnosis.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'ehr-item';
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
            div.innerHTML = `
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 600;">${item.text || item}</span>
                        <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                    </div>
                </div>
                <button onclick="removeDiagnosis(${idx})" class="remove-btn">✕</button>
            `;
            list.appendChild(div);
        });
    }
}

function addDiagnosis() {
    const input = document.getElementById('diagnosisInput');
    const value = input.value.trim();
    if (value) {
        const entry = {
            text: value,
            timestamp: new Date().toISOString(),
            addedBy: currentUser ? currentUser.username : 'Unknown'
        };
        patients[currentPatientIndex].diagnosis.push(entry);
        localStorage.setItem('patients', JSON.stringify(patients));
        input.value = '';
        loadDiagnosisList();
    }
}

function removeDiagnosis(idx) {
    patients[currentPatientIndex].diagnosis.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadDiagnosisList();
}

function loadMedicationsList() {
    const list = document.getElementById('medicationsList');
    const patient = patients[currentPatientIndex];
    list.innerHTML = '';
    
    if (patient.medications.length === 0) {
        list.innerHTML = '<p class="empty-message">No medications added yet</p>';
    } else {
        patient.medications.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'ehr-item';
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
            
            // Handle old format (simple text) vs new format (object)
            if (typeof item === 'string' || item.text) {
                const text = item.text || item;
                div.innerHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-weight: 600;">${text}</span>
                            <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                        </div>
                    </div>
                    <button onclick="removeMedication(${idx})" class="remove-btn">✕</button>
                `;
            } else {
                // New format with detailed information
                let detailsHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 700; font-size: 15px; color: var(--primary);">${item.name}</span>
                            <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 6px;">
                            <div><span style="color: var(--text-light); font-size: 12px;">Dosage:</span> <strong>${item.dosage}</strong></div>
                            <div><span style="color: var(--text-light); font-size: 12px;">Route:</span> <strong style="color: var(--primary);">${item.route}</strong></div>
                            ${item.frequency ? `<div><span style="color: var(--text-light); font-size: 12px;">Frequency:</span> <strong>${item.frequency}</strong></div>` : ''}
                        </div>
                `;
                
                // Add IV fluid details if present
                if (item.ivfDetails) {
                    detailsHTML += `
                        <div style="padding: 10px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 6px; border-left: 3px solid var(--primary); margin-top: 8px;">
                            <div style="font-weight: 600; color: var(--primary); margin-bottom: 6px; font-size: 13px;">💧 IV Fluid Calculation</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 6px; font-size: 12px;">
                                <div><span style="color: var(--text-light);">Volume:</span> <strong>${item.ivfDetails.volume}</strong></div>
                                <div><span style="color: var(--text-light);">Duration:</span> <strong>${item.ivfDetails.duration}</strong></div>
                                <div><span style="color: var(--text-light);">Drop Factor:</span> <strong>${item.ivfDetails.dropFactor}</strong></div>
                                <div style="grid-column: span 2;"><span style="color: var(--text-light);">Flow Rate:</span> <strong style="color: var(--primary); font-size: 14px;">${item.ivfDetails.flowRate}</strong> <span style="color: var(--text-lighter);">(${item.ivfDetails.mlPerHour})</span></div>
                            </div>
                        </div>
                    `;
                }
                
                detailsHTML += `
                        <div style="font-size: 11px; color: var(--text-lighter); margin-top: 6px;">Added by: ${item.addedBy || 'Unknown'}</div>
                    </div>
                    <button onclick="removeMedication(${idx})" class="remove-btn">✕</button>
                `;
                
                div.innerHTML = detailsHTML;
            }
            
            list.appendChild(div);
        });
    }
}

// Show/hide IV fluid calculation section based on route selection
document.addEventListener('DOMContentLoaded', function() {
    const medRouteSelect = document.getElementById('medRoute');
    const ivfSection = document.getElementById('ivfSection');
    const ivfVolume = document.getElementById('ivfVolume');
    const ivfDuration = document.getElementById('ivfDuration');
    const ivfDropFactor = document.getElementById('ivfDropFactor');
    
    if (medRouteSelect) {
        medRouteSelect.addEventListener('change', function() {
            if (this.value === 'IVF') {
                ivfSection.style.display = 'block';
            } else {
                ivfSection.style.display = 'none';
                document.getElementById('ivfCalculation').style.display = 'none';
            }
        });
    }
    
    // Calculate IV flow rate when inputs change
    if (ivfVolume && ivfDuration && ivfDropFactor) {
        [ivfVolume, ivfDuration, ivfDropFactor].forEach(input => {
            input.addEventListener('input', calculateIVFlowRate);
        });
    }
});

function calculateIVFlowRate() {
    const volume = parseFloat(document.getElementById('ivfVolume').value);
    const duration = parseFloat(document.getElementById('ivfDuration').value);
    const dropFactor = parseFloat(document.getElementById('ivfDropFactor').value);
    
    if (volume && duration && dropFactor) {
        // Formula: (Volume × Drop Factor) / (Time in minutes)
        const timeInMinutes = duration * 60;
        const gttsPerMin = Math.round((volume * dropFactor) / timeInMinutes);
        const mlPerHour = Math.round(volume / duration);
        
        document.getElementById('ivfGTTs').textContent = gttsPerMin;
        document.getElementById('ivfMLPerHour').textContent = mlPerHour;
        document.getElementById('ivfCalculation').style.display = 'block';
    } else {
        document.getElementById('ivfCalculation').style.display = 'none';
    }
}

function addMedicationRecord() {
    const medName = document.getElementById('medName').value.trim();
    const medDosage = document.getElementById('medDosage').value.trim();
    const medRoute = document.getElementById('medRoute').value;
    const medSchedule = document.getElementById('medSchedule').value;
    const medEvaluation = document.getElementById('medEvaluation').value.trim();
    
    if (!medName || !medDosage) {
        alert('Please enter medication name and dosage');
        return;
    }
    
    const entry = {
        name: medName,
        dosage: medDosage,
        route: medRoute,
        schedule: medSchedule,
        evaluation: medEvaluation,
        timestamp: new Date().toISOString(),
        addedBy: currentUser ? currentUser.username : 'Unknown'
    };
    
    // Add IV fluid calculation if route is IVF
    if (medRoute === 'IVF') {
        const volume = document.getElementById('ivfVolume').value;
        const duration = document.getElementById('ivfDuration').value;
        const dropFactor = document.getElementById('ivfDropFactor').value;
        
        if (volume && duration) {
            const timeInMinutes = duration * 60;
            const gttsPerMin = Math.round((volume * dropFactor) / timeInMinutes);
            const mlPerHour = Math.round(volume / duration);
            
            entry.ivfDetails = {
                volume: volume + ' ml',
                duration: duration + ' hours',
                dropFactor: dropFactor + ' gtts/ml',
                flowRate: gttsPerMin + ' gtts/min',
                mlPerHour: mlPerHour + ' ml/hr'
            };
        }
    }
    
    patients[currentPatientIndex].medications.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear form
    document.getElementById('medName').value = '';
    document.getElementById('medDosage').value = '';
    document.getElementById('medRoute').value = 'Oral';
    document.getElementById('medSchedule').value = '';
    document.getElementById('medEvaluation').value = '';
    document.getElementById('ivfVolume').value = '';
    document.getElementById('ivfDuration').value = '';
    document.getElementById('ivfSection').style.display = 'none';
    document.getElementById('ivfCalculation').style.display = 'none';
    
    loadMedicationsList();
}

function loadMedicationsList() {
    const list = document.getElementById('medicationsList');
    const patient = patients[currentPatientIndex];
    list.innerHTML = '';
    
    if (patient.medications.length === 0) {
        list.innerHTML = '<p class="empty-message">No medications added yet</p>';
    } else {
        patient.medications.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'ehr-item';
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
            
            // Handle old format (simple text) vs new format (object)
            if (typeof item === 'string' || item.text) {
                const text = item.text || item;
                div.innerHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-weight: 600;">${text}</span>
                            <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                        </div>
                    </div>
                    <button onclick="removeMedication(${idx})" class="remove-btn">✕</button>
                `;
            } else {
                // New format with detailed information
                let detailsHTML = `
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 700; font-size: 15px; color: var(--primary);">${item.name}</span>
                            <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 6px;">
                            <div><span style="color: var(--text-light); font-size: 12px;">Dosage:</span> <strong>${item.dosage}</strong></div>
                            <div><span style="color: var(--text-light); font-size: 12px;">Route:</span> <strong style="color: var(--primary);">${item.route}</strong></div>
                            ${item.frequency ? `<div><span style="color: var(--text-light); font-size: 12px;">Frequency:</span> <strong>${item.frequency}</strong></div>` : ''}
                        </div>
                `;
                
                // Add IV fluid details if present
                if (item.ivfDetails) {
                    detailsHTML += `
                        <div style="padding: 10px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 6px; border-left: 3px solid var(--primary); margin-top: 8px;">
                            <div style="font-weight: 600; color: var(--primary); margin-bottom: 6px; font-size: 13px;">💧 IV Fluid Calculation</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 6px; font-size: 12px;">
                                <div><span style="color: var(--text-light);">Volume:</span> <strong>${item.ivfDetails.volume}</strong></div>
                                <div><span style="color: var(--text-light);">Duration:</span> <strong>${item.ivfDetails.duration}</strong></div>
                                <div><span style="color: var(--text-light);">Drop Factor:</span> <strong>${item.ivfDetails.dropFactor}</strong></div>
                                <div style="grid-column: span 2;"><span style="color: var(--text-light);">Flow Rate:</span> <strong style="color: var(--primary); font-size: 14px;">${item.ivfDetails.flowRate}</strong> <span style="color: var(--text-lighter);">(${item.ivfDetails.mlPerHour})</span></div>
                            </div>
                        </div>
                    `;
                }
                
                detailsHTML += `
                        <div style="font-size: 11px; color: var(--text-lighter); margin-top: 6px;">Added by: ${item.addedBy || 'Unknown'}</div>
                    </div>
                    <button onclick="removeMedication(${idx})" class="remove-btn">✕</button>
                `;
                
                div.innerHTML = detailsHTML;
            }
            
            list.appendChild(div);
        });
    }
}

function addMedication() {
    const input = document.getElementById('medicationInput');
    const value = input.value.trim();
    if (value) {
        const entry = {
            text: value,
            timestamp: new Date().toISOString(),
            addedBy: currentUser ? currentUser.username : 'Unknown'
        };
        patients[currentPatientIndex].medications.push(entry);
        localStorage.setItem('patients', JSON.stringify(patients));
        input.value = '';
        loadMedicationsList();
    }
}

function removeMedication(idx) {
    patients[currentPatientIndex].medications.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadMedicationsList();
}

function loadLabsList() {
    const list = document.getElementById('labsList');
    const patient = patients[currentPatientIndex];
    list.innerHTML = '';
    
    if (patient.labs.length === 0) {
        list.innerHTML = '<p class="empty-message">No lab results added yet</p>';
    } else {
        patient.labs.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'ehr-item';
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
            div.innerHTML = `
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 600;">${item.text || item}</span>
                        <span style="font-size: 11px; color: var(--text-lighter);">📅 ${timestamp}</span>
                    </div>
                </div>
                <button onclick="removeLabResult(${idx})" class="remove-btn">✕</button>
            `;
            list.appendChild(div);
        });
    }
}

function addLabResult() {
    const input = document.getElementById('labInput');
    const value = input.value.trim();
    if (value) {
        const entry = {
            text: value,
            timestamp: new Date().toISOString(),
            addedBy: currentUser ? currentUser.username : 'Unknown'
        };
        patients[currentPatientIndex].labs.push(entry);
        localStorage.setItem('patients', JSON.stringify(patients));
        input.value = '';
        loadLabsList();
    }
}

function removeLabResult(idx) {
    patients[currentPatientIndex].labs.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadLabsList();
}

function loadNotes() {
    const textarea = document.getElementById('notesArea');
    const patient = patients[currentPatientIndex];
    textarea.value = patient.clinicalNotes || '';
    
    // Display last save info if available
    if (patient.notesSaveHistory && patient.notesSaveHistory.length > 0) {
        const lastSave = patient.notesSaveHistory[patient.notesSaveHistory.length - 1];
        const lastSaveTime = new Date(lastSave.timestamp).toLocaleString();
        const saveInfo = document.getElementById('notesSaveInfo');
        if (saveInfo) {
            saveInfo.textContent = `Last saved by ${lastSave.savedBy} on ${lastSaveTime}`;
        }
    }
}

function saveNotes() {
    const textarea = document.getElementById('notesArea');
    const timestamp = new Date().toLocaleString();
    const username = currentUser ? currentUser.username : 'Unknown';
    
    // Add timestamp header to the notes
    const timestampHeader = `\n\n--- Entry by ${username} on ${timestamp} ---\n`;
    
    patients[currentPatientIndex].clinicalNotes = textarea.value;
    
    // Store the last save timestamp
    if (!patients[currentPatientIndex].notesSaveHistory) {
        patients[currentPatientIndex].notesSaveHistory = [];
    }
    patients[currentPatientIndex].notesSaveHistory.push({
        timestamp: new Date().toISOString(),
        savedBy: username
    });
    
    localStorage.setItem('patients', JSON.stringify(patients));
    alert(`Nurses notes saved successfully!\nSaved by: ${username}\nTime: ${timestamp}`);
}

// FDAR functions
function loadFDARList() {
    const list = document.getElementById('fdarList');
    const noMsg = document.getElementById('noFdarMsg');
    const patient = patients[currentPatientIndex];
    if (!list) return;
    list.innerHTML = '';
    const fdar = patient.fdar || [];
    if (fdar.length === 0) {
        noMsg.style.display = 'block';
        return;
    }
    noMsg.style.display = 'none';
    fdar.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700; margin-bottom:6px;">${entry.focus} <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:8px;">${new Date(entry.time).toLocaleString()}</span></div>
                <div><strong>Data:</strong> ${entry.data}</div>
                <div><strong>Action:</strong> ${entry.action}</div>
                <div><strong>Response:</strong> ${entry.response}</div>
            </div>
            <div style="margin-left:10px"><button class="remove-btn" onclick="removeFDAR(${idx})">✕</button></div>
        `;
        list.appendChild(div);
    });
}

function addFDAR() {
    if (currentPatientIndex === null) return;
    const focus = document.getElementById('fdarFocus').value.trim();
    const data = document.getElementById('fdarData').value.trim();
    const action = document.getElementById('fdarAction').value.trim();
    const response = document.getElementById('fdarResponse').value.trim();
    if (!focus || !data) {
        alert('Please provide at least Focus and Data for the FDAR entry.');
        return;
    }
    const entry = { focus, data, action, response, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.fdar) patient.fdar = [];
    patient.fdar.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    // clear inputs
    clearFDARInputs();
    loadFDARList();
    loadFDARIntoNotes();
    renderFDARChart();
}

function clearFDARInputs() {
    document.getElementById('fdarFocus').value = '';
    document.getElementById('fdarData').value = '';
    document.getElementById('fdarAction').value = '';
    document.getElementById('fdarResponse').value = '';
}

function removeFDAR(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.fdar || !patient.fdar[idx]) return;
    if (!confirm('Delete this FDAR entry?')) return;
    patient.fdar.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadFDARList();
    loadFDARIntoNotes();
    renderFDARChart();
}

// Add sample FDAR entries for preview/testing
function addSampleFDAR() {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.fdar) patient.fdar = [];

    const now = Date.now();
    const samples = [
        {
            focus: 'Pain',
            data: 'Patient reports 6/10 abdominal pain, localized to RLQ; vitals stable.',
            action: 'Administered 1g paracetamol PO, IV access obtained.',
            response: 'Pain reduced to 4/10 after medication.',
            time: new Date(now - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            focus: 'Respiration',
            data: 'RR 22, mild tachypnea; breath sounds clear bilaterally.',
            action: 'Placed patient on supplemental O2 2L via nasal cannula.',
            response: 'RR decreased to 18, O2 sat improved to 97%.',
            time: new Date(now - 90 * 60 * 1000).toISOString()
        },
        {
            focus: 'Wound',
            data: 'Surgical wound at left lower quadrant with minimal serous drainage.',
            action: 'Dressing changed and wound cleaned with normal saline.',
            response: 'Wound dry, no signs of active bleeding.',
            time: new Date(now - 30 * 60 * 1000).toISOString()
        }
    ];

    samples.forEach(s => patient.fdar.push(s));
    localStorage.setItem('patients', JSON.stringify(patients));
    loadFDARList();
    loadFDARIntoNotes();
    renderFDARChart();
    alert('Sample FDAR entries added.');
}

// Load FDAR entries into Clinical Notes quick-insert area
function loadFDARIntoNotes() {
    const container = document.getElementById('fdarInNotes');
    if (!container) return;
    container.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const fdar = patient && patient.fdar ? patient.fdar : [];
    if (!fdar || fdar.length === 0) {
        container.innerHTML = '<p class="empty-message">No FDAR entries available</p>';
        return;
    }
    // add controls for bulk insert
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.gap = '8px';
    topBar.style.marginBottom = '8px';
    topBar.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="fdarInNotes_selectAll"> Select All</label><button class="ehr-add-btn" id="fdarInNotes_insertSelected">Insert Selected</button>`;
    container.appendChild(topBar);

    // attach select all handler later
    fdar.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.innerHTML = `
            <div style="display:flex; gap:8px; align-items:flex-start; flex:1">
                <input type="checkbox" class="fdarInNotes_chk" data-idx="${idx}" />
                <div>
                    <div style="font-weight:700;">${entry.focus} <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:6px;">${new Date(entry.time).toLocaleString()}</span></div>
                    <div style="font-size:13px; color:var(--text-color);">Data: ${entry.data}</div>
                </div>
            </div>
            <div style="margin-left:10px; display:flex; gap:6px;">
                <button class="ehr-add-btn" onclick="insertFDARToNotes(${idx})">Insert</button>
                <button class="remove-btn" onclick="removeFDARFromNotes(${idx})">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    // wire select all and insert selected
    const selectAll = document.getElementById('fdarInNotes_selectAll');
    if (selectAll) selectAll.addEventListener('change', toggleSelectAllFDARInNotes);
    const insertBtn = document.getElementById('fdarInNotes_insertSelected');
    if (insertBtn) insertBtn.addEventListener('click', insertSelectedFDARs);
}

function toggleSelectAllFDARInNotes(e) {
    const checked = e.target.checked;
    const boxes = document.querySelectorAll('.fdarInNotes_chk');
    boxes.forEach(b => { b.checked = checked; });
}

function insertSelectedFDARs() {
    if (currentPatientIndex === null) return;
    const boxes = Array.from(document.querySelectorAll('.fdarInNotes_chk'));
    const selectedIdx = boxes.filter(b => b.checked).map(b => Number(b.getAttribute('data-idx')));
    if (selectedIdx.length === 0) { alert('No FDAR entries selected'); return; }
    const patient = patients[currentPatientIndex];
    const entries = (patient.fdar || []).filter((_, i) => selectedIdx.includes(i));
    if (!entries || entries.length === 0) return;
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = entries.map(entry => `\n--- FDAR (${new Date(entry.time).toLocaleString()}) ---\nFocus: ${entry.focus}\nData: ${entry.data}\nAction: ${entry.action}\nResponse: ${entry.response}\n`).join('\n');
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

// Insert FDAR entry formatted into the clinical notes textarea
function insertFDARToNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.fdar || !patient.fdar[idx]) return;
    const entry = patient.fdar[idx];
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = `\n--- FDAR (${new Date(entry.time).toLocaleString()}) ---\nFocus: ${entry.focus}\nData: ${entry.data}\nAction: ${entry.action}\nResponse: ${entry.response}\n`;
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

// SOAPIEa functions
function loadSOAPIEaList() {
    const list = document.getElementById('soapieaList');
    const noMsg = document.getElementById('noSOAPIEaMsg');
    if (!list) return;
    list.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const arr = patient.soapiea || [];
    if (arr.length === 0) { noMsg.style.display = 'block'; return; }
    noMsg.style.display = 'none';
    arr.forEach((e, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700; margin-bottom:6px;">SOAPIEa - ${new Date(e.time).toLocaleString()}</div>
                <div><strong>S:</strong> ${e.subjective}</div>
                <div><strong>O:</strong> ${e.objective}</div>
                <div><strong>A:</strong> ${e.assessment}</div>
                <div><strong>P:</strong> ${e.plan}</div>
                <div><strong>I:</strong> ${e.intervention}</div>
                <div><strong>E:</strong> ${e.evaluation}</div>
            </div>
            <div style="margin-left:10px"><button class="remove-btn" onclick="removeSOAPIEa(${idx})">✕</button></div>
        `;
        list.appendChild(div);
    });
}

function addSOAPIEa() {
    if (currentPatientIndex === null) return;
    const subj = document.getElementById('soapieaSubjective').value.trim();
    const obj = document.getElementById('soapieaObjective').value.trim();
    const assess = document.getElementById('soapieaAssessment').value.trim();
    const plan = document.getElementById('soapieaPlan').value.trim();
    const interv = document.getElementById('soapieaIntervention').value.trim();
    const evalv = document.getElementById('soapieaEvaluation').value.trim();
    if (!subj && !obj && !assess) { alert('Provide at least Subjective or Objective or Assessment.'); return; }
    const entry = { subjective: subj, objective: obj, assessment: assess, plan, intervention: interv, evaluation: evalv, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.soapiea) patient.soapiea = [];
    patient.soapiea.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    clearSOAPIEaInputs();
    loadSOAPIEaList();
    loadSOAPIEaIntoNotes();
}

function clearSOAPIEaInputs() {
    ['soapieaSubjective','soapieaObjective','soapieaAssessment','soapieaPlan','soapieaIntervention','soapieaEvaluation'].forEach(id => document.getElementById(id).value = '');
}

function removeSOAPIEa(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.soapiea || !patient.soapiea[idx]) return;
    if (!confirm('Delete this SOAPIE entry?')) return;
    patient.soapiea.splice(idx,1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadSOAPIEaList();
    loadSOAPIEaIntoNotes();
}

// ADPIE functions
function loadADPIEList() {
    const list = document.getElementById('ADPIEList');
    const noMsg = document.getElementById('noADPIEMsg');
    if (!list) return;
    list.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const arr = patient.adpie || [];
    if (arr.length === 0) { noMsg.style.display = 'block'; return; }
    noMsg.style.display = 'none';
    arr.forEach((e, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700; margin-bottom:6px;">ADPIE - ${new Date(e.time).toLocaleString()}</div>
                <div><strong>Assessment:</strong> ${e.data}</div>
                <div><strong>Diagnosis:</strong> ${e.problem}</div>
                <div><strong>Planning:</strong> ${e.planning}</div>
                <div><strong>Intervention:</strong> ${e.intervention}</div>
                <div><strong>Evaluation:</strong> ${e.evaluation}</div>
            </div>
            <div style="margin-left:10px"><button class="remove-btn" onclick="removeADPIE(${idx})">✕</button></div>
        `;
        list.appendChild(div);
    });
}

function addADPIE() {
    if (currentPatientIndex === null) return;
    const data = document.getElementById('ADPIEData').value.trim();
    const problem = document.getElementById('ADPIEProblem').value.trim();
    const planning = document.getElementById('ADPIEPlanning').value.trim();
    const intervention = document.getElementById('ADPIEIntervention').value.trim();
    const evaluation = document.getElementById('ADPIEEvaluation').value.trim();
    if (!data && !problem) { alert('Provide at least Assessment or Diagnosis.'); return; }
    const entry = { data, problem, planning, intervention, evaluation, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.adpie) patient.adpie = [];
    patient.adpie.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    clearADPIEInputs();
    loadADPIEList();
    loadADPIEIntoNotes();
}

function clearADPIEInputs() {
    ['ADPIEData','ADPIEProblem','ADPIEPlanning','ADPIEIntervention','ADPIEEvaluation'].forEach(id => document.getElementById(id).value = '');
}

function removeADPIE(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.adpie || !patient.adpie[idx]) return;
    if (!confirm('Delete this ADPIE entry?')) return;
    patient.adpie.splice(idx,1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadADPIEList();
    loadADPIEIntoNotes();
}

// Patient History functions
function loadPatientHistory() {
    const list = document.getElementById('historyList');
    const noMsg = document.getElementById('noHistoryMsg');
    if (!list) return;
    list.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const arr = patient.history || [];
    if (arr.length === 0) { noMsg.style.display = 'block'; return; }
    noMsg.style.display = 'none';
    arr.forEach((h, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700; margin-bottom:6px;">${h.title} <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:8px;">${h.date || new Date(h.time).toLocaleDateString()}</span></div>
                <div>${h.description}</div>
            </div>
            <div style="margin-left:10px"><button class="remove-btn" onclick="removeHistoryEntry(${idx})">✕</button></div>
        `;
        list.appendChild(div);
    });
}

function addHistoryEntry() {
    if (currentPatientIndex === null) return;
    const date = document.getElementById('historyDate').value;
    const title = document.getElementById('historyTitle').value.trim();
    const description = document.getElementById('historyDescription').value.trim();
    if (!title && !description) { alert('Please provide a title or description for the history entry.'); return; }
    const entry = { date: date || null, title, description, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.history) patient.history = [];
    patient.history.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    clearHistoryInputs();
    loadPatientHistory();
}

function clearHistoryInputs() {
    document.getElementById('historyDate').value = '';
    document.getElementById('historyTitle').value = '';
    document.getElementById('historyDescription').value = '';
}

function removeHistoryEntry(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.history || !patient.history[idx]) return;
    if (!confirm('Delete this history entry?')) return;
    patient.history.splice(idx,1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadPatientHistory();
}

// All patients history view
let allHistoryEntries = [];
let filteredHistoryEntries = [];
let selectedPatientIndex = null;

function openAllHistoryModal() {
    const modal = document.getElementById('allHistoryModal');
    if (!modal) return;
    modal.style.display = 'block';
    loadAllPatientHistory();
}

function closeAllHistoryModal() {
    const modal = document.getElementById('allHistoryModal');
    if (!modal) return;
    modal.style.display = 'none';
    selectedPatientIndex = null;
    document.getElementById('historyPatientInfo').style.display = 'none';
    document.getElementById('historySearchInput').value = '';
}

function loadAllPatientHistory() {
    const list = document.getElementById('allHistoryList');
    if (!list) return;
    list.innerHTML = '';
    allHistoryEntries = [];
    patients.forEach((p, pIdx) => {
        if (!p.history) return;
        p.history.forEach((h, hIdx) => {
            allHistoryEntries.push({ patientIndex: pIdx, historyIndex: hIdx, patientId: p.id, name: p.name, title: h.title, description: h.description, date: h.date, time: h.time });
        });
    });
    filteredHistoryEntries = [...allHistoryEntries];
    displayHistoryEntries();
}

function displayHistoryEntries() {
    const list = document.getElementById('allHistoryList');
    if (!list) return;
    list.innerHTML = '';
    
    if (filteredHistoryEntries.length === 0) {
        list.innerHTML = '<p class="empty-message">No history entries found.</p>';
        return;
    }
    
    // sort by time desc
    filteredHistoryEntries.sort((a,b) => new Date(b.time) - new Date(a.time));
    filteredHistoryEntries.forEach(e => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-weight:700;">${e.title || '(No title)'} <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:8px;">${e.date || new Date(e.time).toLocaleDateString()}</span></div>
                <div style="font-size:13px; color:var(--text-color);">${e.description || ''}</div>
                <div style="margin-top:6px; font-size:12px; color:var(--text-lighter);">Patient: <strong style="cursor: pointer; color: var(--primary);" onclick="showPatientInfo(${e.patientIndex})">${e.name}</strong> (${e.patientId})</div>
            </div>
            <div style="margin-left:10px; display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                <button class="ehr-add-btn" onclick="openPatientRecord(${e.patientIndex})">View Patient</button>
                <button class="remove-btn" onclick="removeGlobalHistory(${e.patientIndex}, ${e.historyIndex})">Delete History</button>
                <button class="delete-btn" onclick="deletePatientFromHistory(${e.patientIndex})">Delete Patient</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function searchAllHistory() {
    const searchTerm = document.getElementById('historySearchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredHistoryEntries = [...allHistoryEntries];
    } else {
        filteredHistoryEntries = allHistoryEntries.filter(entry => {
            return (
                entry.name.toLowerCase().includes(searchTerm) ||
                entry.patientId.toLowerCase().includes(searchTerm) ||
                (entry.title && entry.title.toLowerCase().includes(searchTerm)) ||
                (entry.description && entry.description.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    displayHistoryEntries();
}

function resetHistorySearch() {
    document.getElementById('historySearchInput').value = '';
    filteredHistoryEntries = [...allHistoryEntries];
    displayHistoryEntries();
}

function showPatientInfo(patientIndex) {
    if (!patients[patientIndex]) return;
    selectedPatientIndex = patientIndex;
    const patient = patients[patientIndex];
    
    // Show patient info section
    document.getElementById('historyPatientInfo').style.display = 'block';
    
    // Populate patient info
    document.getElementById('historyPatientName').textContent = patient.name;
    document.getElementById('historyPatientId').textContent = 'ID: ' + patient.id;
    document.getElementById('historyPatientAge').textContent = patient.age || 'N/A';
    document.getElementById('historyPatientLocation').textContent = patient.location || 'N/A';
    document.getElementById('historyPatientRoom').textContent = (patient.room || 'N/A') + (patient.bed ? ' - ' + patient.bed : '');
    document.getElementById('historyPatientESI').textContent = patient.esiLevel || 'N/A';
    document.getElementById('historyPatientPhysician').textContent = patient.physician || 'N/A';
    
    const dateAdmitted = patient.time ? new Date(patient.time).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) : 'N/A';
    document.getElementById('historyPatientAdmitted').textContent = dateAdmitted;
    
    // Scroll to top to show patient info
    document.getElementById('allHistoryModal').querySelector('.modal-content').scrollTop = 0;
}

function deleteSelectedPatient() {
    if (selectedPatientIndex === null) return;
    deletePatientFromHistory(selectedPatientIndex);
    document.getElementById('historyPatientInfo').style.display = 'none';
    selectedPatientIndex = null;
}

function removeGlobalHistory(patientIndex, historyIndex) {
    if (!confirm('Delete this history entry?')) return;
    if (!patients[patientIndex] || !patients[patientIndex].history || !patients[patientIndex].history[historyIndex]) return;
    patients[patientIndex].history.splice(historyIndex, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadAllPatientHistory();
}

function deletePatientFromHistory(patientIndex) {
    if (!patients[patientIndex]) return;
    const patient = patients[patientIndex];
    
    if (!confirm(`Are you sure you want to delete patient "${patient.name}" (${patient.id})? This will remove all their records permanently.`)) return;
    
    // Free up the bed
    if (patient.room && patient.bed) {
        const roomObj = rooms.find(r => r.number === patient.room);
        if (roomObj && roomObj.occupiedBeds) {
            const bedIndex = roomObj.occupiedBeds.indexOf(patient.bed);
            if (bedIndex > -1) {
                roomObj.occupiedBeds.splice(bedIndex, 1);
                localStorage.setItem('rooms', JSON.stringify(rooms));
            }
        }
    }
    
    // Delete the patient
    patients.splice(patientIndex, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    filteredPatients = patients;
    
    // Reload the history list and main patient display
    loadAllPatientHistory();
    displayPatients();
    
    alert(`Patient "${patient.name}" has been deleted successfully.`);
}

// Load SOAPIEa entries into Nurses Notes quick-insert area
function loadSOAPIEaIntoNotes() {
    const container = document.getElementById('soapieaInNotes');
    if (!container) return;
    container.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const soapiea = patient && patient.soapiea ? patient.soapiea : [];
    if (!soapiea || soapiea.length === 0) {
        container.innerHTML = '<p class="empty-message">No SOAPIEa entries available</p>';
        return;
    }
    
    // Add controls for bulk insert
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.gap = '8px';
    topBar.style.marginBottom = '8px';
    topBar.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="soapieaInNotes_selectAll"> Select All</label><button class="ehr-add-btn" id="soapieaInNotes_insertSelected">Insert Selected</button>`;
    container.appendChild(topBar);

    soapiea.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.innerHTML = `
            <div style="display:flex; gap:8px; align-items:flex-start; flex:1">
                <input type="checkbox" class="soapieaInNotes_chk" data-idx="${idx}" />
                <div>
                    <div style="font-weight:700;">SOAPIEa <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:6px;">${new Date(entry.time).toLocaleString()}</span></div>
                    <div style="font-size:13px; color:var(--text-color);">S: ${entry.subjective || 'N/A'}</div>
                </div>
            </div>
            <div style="margin-left:10px; display:flex; gap:6px;">
                <button class="ehr-add-btn" onclick="insertSOAPIEaToNotes(${idx})">Insert</button>
                <button class="remove-btn" onclick="removeSOAPIEaFromNotes(${idx})">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    const selectAll = document.getElementById('soapieaInNotes_selectAll');
    if (selectAll) selectAll.addEventListener('change', toggleSelectAllSOAPIEaInNotes);
    const insertBtn = document.getElementById('soapieaInNotes_insertSelected');
    if (insertBtn) insertBtn.addEventListener('click', insertSelectedSOAPIEas);
}

function toggleSelectAllSOAPIEaInNotes(e) {
    const checked = e.target.checked;
    const boxes = document.querySelectorAll('.soapieaInNotes_chk');
    boxes.forEach(b => { b.checked = checked; });
}

function insertSelectedSOAPIEas() {
    if (currentPatientIndex === null) return;
    const boxes = Array.from(document.querySelectorAll('.soapieaInNotes_chk'));
    const selectedIdx = boxes.filter(b => b.checked).map(b => Number(b.getAttribute('data-idx')));
    if (selectedIdx.length === 0) { alert('No SOAPIEa entries selected'); return; }
    const patient = patients[currentPatientIndex];
    const entries = (patient.soapiea || []).filter((_, i) => selectedIdx.includes(i));
    if (!entries || entries.length === 0) return;
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = entries.map(entry => `\n--- SOAPIEa (${new Date(entry.time).toLocaleString()}) ---\nSubjective: ${entry.subjective}\nObjective: ${entry.objective}\nAssessment: ${entry.assessment}\nPlan: ${entry.plan}\nIntervention: ${entry.intervention}\nEvaluation: ${entry.evaluation}\n`).join('\n');
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

function insertSOAPIEaToNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.soapiea || !patient.soapiea[idx]) return;
    const entry = patient.soapiea[idx];
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = `\n--- SOAPIEa (${new Date(entry.time).toLocaleString()}) ---\nSubjective: ${entry.subjective}\nObjective: ${entry.objective}\nAssessment: ${entry.assessment}\nPlan: ${entry.plan}\nIntervention: ${entry.intervention}\nEvaluation: ${entry.evaluation}\n`;
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

// Load ADPIE entries into Nurses Notes quick-insert area
function loadADPIEIntoNotes() {
    const container = document.getElementById('adpieInNotes');
    if (!container) return;
    container.innerHTML = '';
    const patient = patients[currentPatientIndex];
    const adpie = patient && patient.adpie ? patient.adpie : [];
    if (!adpie || adpie.length === 0) {
        container.innerHTML = '<p class="empty-message">No ADPIE entries available</p>';
        return;
    }
    
    // Add controls for bulk insert
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.gap = '8px';
    topBar.style.marginBottom = '8px';
    topBar.innerHTML = `<label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="adpieInNotes_selectAll"> Select All</label><button class="ehr-add-btn" id="adpieInNotes_insertSelected">Insert Selected</button>`;
    container.appendChild(topBar);

    adpie.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.innerHTML = `
            <div style="display:flex; gap:8px; align-items:flex-start; flex:1">
                <input type="checkbox" class="adpieInNotes_chk" data-idx="${idx}" />
                <div>
                    <div style="font-weight:700;">ADPIE <span style="font-weight:400; color:var(--text-lighter); font-size:12px; margin-left:6px;">${new Date(entry.time).toLocaleString()}</span></div>
                    <div style="font-size:13px; color:var(--text-color);">Assessment: ${entry.data || 'N/A'}</div>
                </div>
            </div>
            <div style="margin-left:10px; display:flex; gap:6px;">
                <button class="ehr-add-btn" onclick="insertADPIEToNotes(${idx})">Insert</button>
                <button class="remove-btn" onclick="removeADPIEFromNotes(${idx})">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    const selectAll = document.getElementById('adpieInNotes_selectAll');
    if (selectAll) selectAll.addEventListener('change', toggleSelectAllADPIEInNotes);
    const insertBtn = document.getElementById('adpieInNotes_insertSelected');
    if (insertBtn) insertBtn.addEventListener('click', insertSelectedADPIEs);
}

function toggleSelectAllADPIEInNotes(e) {
    const checked = e.target.checked;
    const boxes = document.querySelectorAll('.adpieInNotes_chk');
    boxes.forEach(b => { b.checked = checked; });
}

function insertSelectedADPIEs() {
    if (currentPatientIndex === null) return;
    const boxes = Array.from(document.querySelectorAll('.adpieInNotes_chk'));
    const selectedIdx = boxes.filter(b => b.checked).map(b => Number(b.getAttribute('data-idx')));
    if (selectedIdx.length === 0) { alert('No ADPIE entries selected'); return; }
    const patient = patients[currentPatientIndex];
    const entries = (patient.adpie || []).filter((_, i) => selectedIdx.includes(i));
    if (!entries || entries.length === 0) return;
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = entries.map(entry => `\n--- ADPIE (${new Date(entry.time).toLocaleString()}) ---\nAssessment: ${entry.data}\nDiagnosis: ${entry.problem}\nPlanning: ${entry.planning}\nIntervention: ${entry.intervention}\nEvaluation: ${entry.evaluation}\n`).join('\n');
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

function insertADPIEToNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.adpie || !patient.adpie[idx]) return;
    const entry = patient.adpie[idx];
    const notesEl = document.getElementById('notesArea');
    if (!notesEl) return;
    const formatted = `\n--- ADPIE (${new Date(entry.time).toLocaleString()}) ---\nAssessment: ${entry.data}\nDiagnosis: ${entry.problem}\nPlanning: ${entry.planning}\nIntervention: ${entry.intervention}\nEvaluation: ${entry.evaluation}\n`;
    notesEl.value = (notesEl.value ? notesEl.value + '\n' : '') + formatted;
    notesEl.focus();
}

// Remove functions for Quick Insert entries
function removeFDARFromNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.fdar || !patient.fdar[idx]) return;
    if (!confirm('Delete this FDAR entry?')) return;
    patient.fdar.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadFDARIntoNotes();
}

function removeSOAPIEaFromNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.soapiea || !patient.soapiea[idx]) return;
    if (!confirm('Delete this SOAPIE entry?')) return;
    patient.soapiea.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadSOAPIEaIntoNotes();
}

function removeADPIEFromNotes(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.adpie || !patient.adpie[idx]) return;
    if (!confirm('Delete this ADPIE entry?')) return;
    patient.adpie.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadADPIEIntoNotes();
}

// Add Special Endorsement from Nurses Notes
function addSpecialEndorsement() {
    if (currentPatientIndex === null) return;
    const title = document.getElementById('specialEndorsementTitle').value.trim();
    const content = document.getElementById('specialEndorsementContent').value.trim();
    
    if (!title || !content) {
        alert('Please provide both title and content for the Special Endorsement.');
        return;
    }
    
    const entry = { 
        title, 
        content, 
        time: new Date().toISOString(),
        addedBy: currentUser ? currentUser.username : 'Unknown'
    };
    const patient = patients[currentPatientIndex];
    if (!patient.specialEndorsement) patient.specialEndorsement = [];
    patient.specialEndorsement.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear inputs
    document.getElementById('specialEndorsementTitle').value = '';
    document.getElementById('specialEndorsementContent').value = '';
    
    // Reload the quick insert list
    loadSpecialEndorsementIntoNotes();
    
    alert('Special Endorsement added successfully!');
}

// Load Special Endorsement into Nurses Notes quick insert
function loadSpecialEndorsementIntoNotes() {
    const container = document.getElementById('specialEndorsementInNotes');
    if (!container) return;
    
    const patient = patients[currentPatientIndex];
    if (!patient || !patient.specialEndorsement || patient.specialEndorsement.length === 0) {
        container.innerHTML = '<p class="empty-message" style="font-size: 12px; color: var(--text-lighter); margin: 8px 0;">No special endorsements yet</p>';
        return;
    }
    
    container.innerHTML = '';
    patient.specialEndorsement.forEach((entry, idx) => {
        const div = document.createElement('div');
        div.className = 'ehr-item';
        div.style.cursor = 'pointer';
        div.style.padding = '10px';
        div.style.marginBottom = '8px';
        
        const timestamp = new Date(entry.time).toLocaleString();
        
        div.innerHTML = `
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-weight: 700; color: var(--primary); font-size: 13px;">${entry.title}</span>
                    <span style="font-size: 10px; color: var(--text-lighter);">📅 ${timestamp}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-color); margin-bottom: 4px;">${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</div>
                <div style="font-size: 10px; color: var(--text-lighter);">By: ${entry.addedBy}</div>
            </div>
            <button onclick="insertSpecialEndorsementToNotes(${idx}); event.stopPropagation();" class="ehr-add-btn" style="padding: 6px 12px; font-size: 11px; margin-left: 8px;">Insert</button>
            <button onclick="removeSpecialEndorsement(${idx}); event.stopPropagation();" class="remove-btn">✕</button>
        `;
        
        container.appendChild(div);
    });
}

function insertSpecialEndorsementToNotes(idx) {
    const patient = patients[currentPatientIndex];
    if (!patient || !patient.specialEndorsement || !patient.specialEndorsement[idx]) return;
    
    const entry = patient.specialEndorsement[idx];
    const notesArea = document.getElementById('notesArea');
    const timestamp = new Date(entry.time).toLocaleString();
    
    const text = `\n\n--- SPECIAL ENDORSEMENT ---\nTitle: ${entry.title}\nDate: ${timestamp}\nBy: ${entry.addedBy}\n\n${entry.content}\n--- END SPECIAL ENDORSEMENT ---\n`;
    
    notesArea.value += text;
}

function removeSpecialEndorsement(idx) {
    if (currentPatientIndex === null) return;
    const patient = patients[currentPatientIndex];
    if (!patient.specialEndorsement || !patient.specialEndorsement[idx]) return;
    if (!confirm('Delete this Special Endorsement entry?')) return;
    
    patient.specialEndorsement.splice(idx, 1);
    localStorage.setItem('patients', JSON.stringify(patients));
    loadSpecialEndorsementIntoNotes();
}

// Add FDAR from Nurses Notes
function addFDARFromNotes() {
    if (currentPatientIndex === null) return;
    const focus = document.getElementById('fdarFocusNotes').value.trim();
    const data = document.getElementById('fdarDataNotes').value.trim();
    const action = document.getElementById('fdarActionNotes').value.trim();
    const response = document.getElementById('fdarResponseNotes').value.trim();
    
    if (!focus || !data) {
        alert('Please provide at least Focus and Data for the FDAR entry.');
        return;
    }
    
    const entry = { focus, data, action, response, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.fdar) patient.fdar = [];
    patient.fdar.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear inputs
    document.getElementById('fdarFocusNotes').value = '';
    document.getElementById('fdarDataNotes').value = '';
    document.getElementById('fdarActionNotes').value = '';
    document.getElementById('fdarResponseNotes').value = '';
    
    // Reload the quick insert list
    loadFDARIntoNotes();
    
    alert('FDAR entry added successfully!');
}

// Add SOAPIEa from Nurses Notes
function addSOAPIEaFromNotes() {
    if (currentPatientIndex === null) return;
    const subj = document.getElementById('soapieaSubjectiveNotes').value.trim();
    const obj = document.getElementById('soapieaObjectiveNotes').value.trim();
    const assess = document.getElementById('soapieaAssessmentNotes').value.trim();
    const plan = document.getElementById('soapieaPlanNotes').value.trim();
    const interv = document.getElementById('soapieaInterventionNotes').value.trim();
    const evalv = document.getElementById('soapieaEvaluationNotes').value.trim();
    
    if (!subj && !obj && !assess) {
        alert('Provide at least Subjective or Objective or Assessment.');
        return;
    }
    
    const entry = { subjective: subj, objective: obj, assessment: assess, plan, intervention: interv, evaluation: evalv, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.soapiea) patient.soapiea = [];
    patient.soapiea.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear inputs
    document.getElementById('soapieaSubjectiveNotes').value = '';
    document.getElementById('soapieaObjectiveNotes').value = '';
    document.getElementById('soapieaAssessmentNotes').value = '';
    document.getElementById('soapieaPlanNotes').value = '';
    document.getElementById('soapieaInterventionNotes').value = '';
    document.getElementById('soapieaEvaluationNotes').value = '';
    
    // Reload the quick insert list
    loadSOAPIEaIntoNotes();
    
    alert('SOAPIE entry added successfully!');
}

// Add ADPIE from Nurses Notes
function addADPIEFromNotes() {
    if (currentPatientIndex === null) return;
    const data = document.getElementById('ADPIEDataNotes').value.trim();
    const problem = document.getElementById('ADPIEProblemNotes').value.trim();
    const planning = document.getElementById('ADPIEPlanningNotes').value.trim();
    const intervention = document.getElementById('ADPIEInterventionNotes').value.trim();
    const evaluation = document.getElementById('ADPIEEvaluationNotes').value.trim();
    
    if (!data && !problem) {
        alert('Provide at least Assessment or Diagnosis.');
        return;
    }
    
    const entry = { data, problem, planning, intervention, evaluation, time: new Date().toISOString() };
    const patient = patients[currentPatientIndex];
    if (!patient.adpie) patient.adpie = [];
    patient.adpie.push(entry);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    // Clear inputs
    document.getElementById('ADPIEDataNotes').value = '';
    document.getElementById('ADPIEProblemNotes').value = '';
    document.getElementById('ADPIEPlanningNotes').value = '';
    document.getElementById('ADPIEInterventionNotes').value = '';
    document.getElementById('ADPIEEvaluationNotes').value = '';
    
    // Reload the quick insert list
    loadADPIEIntoNotes();
    
    alert('ADPIE entry added successfully!');
}

// Room Management Functions
function openRoomManagement() {
    const modal = document.getElementById('roomManagementModal');
    if (modal) {
        modal.style.display = 'block';
        loadRoomsList();
    }
}

function closeRoomManagement() {
    const modal = document.getElementById('roomManagementModal');
    if (modal) modal.style.display = 'none';
}

function addRoom() {
    const number = document.getElementById('newRoomNumber').value.trim();
    const beds = parseInt(document.getElementById('newRoomBeds').value);
    const type = document.getElementById('newRoomType').value;
    
    if (!number) {
        alert('Please enter a room number');
        return;
    }
    
    if (rooms.find(r => r.number === number)) {
        alert('Room number already exists');
        return;
    }
    
    const newRoom = {
        number: number,
        type: type,
        beds: beds,
        occupiedBeds: []
    };
    
    rooms.push(newRoom);
    localStorage.setItem('rooms', JSON.stringify(rooms));
    
    document.getElementById('newRoomNumber').value = '';
    document.getElementById('newRoomBeds').value = '1';
    document.getElementById('newRoomType').value = 'General Ward';
    
    loadRoomsList();
    alert('Room added successfully!');
}

function loadRoomsList() {
    const container = document.getElementById('roomsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (rooms.length === 0) {
        container.innerHTML = '<p class="empty-message">No rooms available. Add a room to get started.</p>';
        return;
    }
    
    rooms.forEach((room, idx) => {
        const availableBeds = room.beds - (room.occupiedBeds ? room.occupiedBeds.length : 0);
        const statusClass = availableBeds > 0 ? 'room-status-available' : 'room-status-full';
        const statusText = availableBeds > 0 ? 'Available' : 'Full';
        
        const div = document.createElement('div');
        div.className = 'room-card';
        div.innerHTML = `
            <div class="room-card-header">
                <div class="room-card-title">
                    <strong>Room ${room.number}</strong>
                    <span class="room-type-badge">${room.type}</span>
                </div>
                <span class="room-status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="room-card-stats">
                <span>Total Beds: <strong>${room.beds}</strong></span>
                <span>Available: <strong style="color: ${availableBeds > 0 ? '#5cb85c' : '#ff6b6b'};">${availableBeds}</strong></span>
                <span>Occupied: <strong>${room.occupiedBeds ? room.occupiedBeds.length : 0}</strong></span>
            </div>
            ${room.occupiedBeds && room.occupiedBeds.length > 0 ? `
                <div class="room-occupied-beds">
                    <strong>Occupied Beds:</strong> ${room.occupiedBeds.join(', ')}
                </div>
            ` : ''}
            <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
                <button class="remove-btn" onclick="deleteRoom(${idx})">Delete Room</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function deleteRoom(idx) {
    const room = rooms[idx];
    
    // Check if room has occupied beds
    if (room.occupiedBeds && room.occupiedBeds.length > 0) {
        alert('Cannot delete room with occupied beds. Please discharge patients first.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete Room ${room.number}?`)) {
        rooms.splice(idx, 1);
        localStorage.setItem('rooms', JSON.stringify(rooms));
        loadRoomsList();
    }
}

function loadAvailableRooms() {
    const select = document.getElementById('patientRoom');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Available Room</option>';
    
    rooms.forEach(room => {
        const availableBeds = room.beds - (room.occupiedBeds ? room.occupiedBeds.length : 0);
        if (availableBeds > 0) {
            const option = document.createElement('option');
            option.value = room.number;
            option.textContent = `Room ${room.number} - ${room.type} (${availableBeds} bed${availableBeds > 1 ? 's' : ''} available)`;
            select.appendChild(option);
        }
    });
}

function loadAvailableBeds(roomNumber) {
    const select = document.getElementById('patientBed');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Bed</option>';
    
    if (!roomNumber) {
        select.innerHTML = '<option value="">Select Room First</option>';
        return;
    }
    
    const room = rooms.find(r => r.number === roomNumber);
    if (!room) return;
    
    for (let i = 1; i <= room.beds; i++) {
        const bedNumber = `Bed ${i}`;
        if (!room.occupiedBeds || !room.occupiedBeds.includes(bedNumber)) {
            const option = document.createElement('option');
            option.value = bedNumber;
            option.textContent = bedNumber;
            select.appendChild(option);
        }
    }
}

// ER Schedule Management Functions
function openScheduleManagement() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'block';
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('scheduleDate').value = today;
        loadScheduleList();
    }
}

function closeScheduleManagement() {
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.style.display = 'none';
}

function addSchedule() {
    const staffName = document.getElementById('scheduleStaffName').value.trim();
    const licenseNumber = document.getElementById('scheduleLicenseNumber').value.trim();
    const role = document.getElementById('scheduleRole').value;
    const shift = document.getElementById('scheduleShift').value.trim();
    const date = document.getElementById('scheduleDate').value;
    
    if (!staffName || !licenseNumber || !role || !shift || !date) {
        alert('Please fill in all fields');
        return;
    }
    
    const newSchedule = {
        id: Date.now(),
        staffName: staffName,
        licenseNumber: licenseNumber,
        role: role,
        shift: shift,
        date: date,
        postedBy: currentUser ? currentUser.username : 'Admin',
        postedAt: new Date().toISOString()
    };
    
    schedules.push(newSchedule);
    localStorage.setItem('erSchedules', JSON.stringify(schedules));
    
    // Clear form
    document.getElementById('scheduleStaffName').value = '';
    document.getElementById('scheduleLicenseNumber').value = '';
    document.getElementById('scheduleRole').value = '';
    document.getElementById('scheduleShift').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;
    
    loadScheduleList();
    alert('Schedule posted successfully!');
}

function filterSchedule(filter) {
    scheduleFilter = filter;
    
    // Update active button
    document.querySelectorAll('.schedule-filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');
    
    loadScheduleList();
}

function loadScheduleList() {
    const container = document.getElementById('scheduleList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Filter schedules
    let filteredSchedules = [...schedules];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduleFilter === 'today') {
        filteredSchedules = schedules.filter(s => {
            const scheduleDate = new Date(s.date);
            scheduleDate.setHours(0, 0, 0, 0);
            return scheduleDate.getTime() === today.getTime();
        });
    } else if (scheduleFilter === 'week') {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        filteredSchedules = schedules.filter(s => {
            const scheduleDate = new Date(s.date);
            return scheduleDate >= today && scheduleDate <= weekFromNow;
        });
    }
    
    // Sort by date (newest first)
    filteredSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredSchedules.length === 0) {
        container.innerHTML = '<p class="empty-message">No schedules posted yet.</p>';
        return;
    }
    
    // Group by date
    const groupedByDate = {};
    filteredSchedules.forEach(schedule => {
        if (!groupedByDate[schedule.date]) {
            groupedByDate[schedule.date] = [];
        }
        groupedByDate[schedule.date].push(schedule);
    });
    
    // Display grouped schedules
    Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const dateHeader = document.createElement('div');
        dateHeader.className = 'schedule-date-header';
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dateHeader.innerHTML = `<h4>${formattedDate}</h4>`;
        container.appendChild(dateHeader);
        
        groupedByDate[date].forEach(schedule => {
            const div = document.createElement('div');
            div.className = 'schedule-card';
            
            // Role color
            let roleColor = '#667eea';
            if (schedule.role === 'Doctor') roleColor = '#5cb85c';
            else if (schedule.role === 'Nurse') roleColor = '#5bc0de';
            else if (schedule.role === 'Resident') roleColor = '#f0ad4e';
            else if (schedule.role === 'Technician') roleColor = '#ec7c26';
            
            div.innerHTML = `
                <div class="schedule-card-header">
                    <div>
                        <strong style="font-size: 18px; color: var(--text-color);">${schedule.staffName}</strong>
                        <span class="schedule-role-badge" style="background: ${roleColor};">${schedule.role}</span>
                    </div>
                    <button class="remove-btn" onclick="deleteSchedule(${schedule.id})">Delete</button>
                </div>
                <div class="schedule-card-body">
                    <div class="schedule-info-row">
                        <span class="schedule-label">License Number:</span>
                        <span class="schedule-value">${schedule.licenseNumber || 'N/A'}</span>
                    </div>
                    <div class="schedule-info-row">
                        <span class="schedule-label">Shift:</span>
                        <span class="schedule-value">${schedule.shift}</span>
                    </div>
                    <div class="schedule-info-row">
                        <span class="schedule-label">Posted By:</span>
                        <span class="schedule-value">👤 ${schedule.postedBy}</span>
                    </div>
                    <div class="schedule-info-row">
                        <span class="schedule-label">Posted At:</span>
                        <span class="schedule-value">${new Date(schedule.postedAt).toLocaleString()}</span>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    });
}

function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        schedules = schedules.filter(s => s.id !== scheduleId);
        localStorage.setItem('erSchedules', JSON.stringify(schedules));
        loadScheduleList();
    }
}

// Feedback & Rating System
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
let currentRating = 0;

function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'block';
        currentRating = 0;
        resetStarRating();
        loadFeedbackList();
    }
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
        clearFeedbackForm();
    }
}

function resetStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('active'));
    document.getElementById('ratingText').textContent = 'Select a rating';
}

function clearFeedbackForm() {
    document.getElementById('feedbackCategory').value = '';
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackComments').value = '';
    currentRating = 0;
    resetStarRating();
}

// Helper function for ESI badge
function getESIBadge(esiLevel) {
    if (!esiLevel) return '';
    
    let badgeClass = '';
    if (esiLevel.includes('ESI-1')) badgeClass = 'esi-1';
    else if (esiLevel.includes('ESI-2')) badgeClass = 'esi-2';
    else if (esiLevel.includes('ESI-3')) badgeClass = 'esi-3';
    else if (esiLevel.includes('ESI-4')) badgeClass = 'esi-4';
    else if (esiLevel.includes('ESI-5')) badgeClass = 'esi-5';
    
    return `<span class="esi-badge ${badgeClass}">${esiLevel}</span>`;
}


// ==================== DATABASE MANAGEMENT FUNCTIONS ====================

// Open database management modal
function openDatabaseManagement() {
    // Check if user is owner
    if (!isOwner()) {
    const container = document.getElementById('qrCodeContainer');

    // Clear previous QR code
    container.innerHTML = '';

    // Store patient data for download/print
    currentQRPatientData = {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        room: patient.room,
        bed: patient.bed,
        esiLevel: patient.esiLevel,
        birthday: patient.birthday,
        religion: patient.religion,
        physician: patient.physician,
        location: patient.location,
        dateAdmitted: patient.dateAdmitted,
        addedBy: patient.addedBy,
        diseases: patient.diseases
    };

    // Generate a unique ID for this QR code session
    const qrId = 'qr_' + Date.now();
    
    // Store patient data in localStorage with the unique ID
    localStorage.setItem(qrId, JSON.stringify(currentQRPatientData));

    // Create a very short URL that references the stored data
    const currentURL = window.location.href.split('?')[0];
    const qrURL = currentURL + '?qr=' + qrId;

    try {
        // Generate QR code with the short URL
        currentQRCode = new QRCode(container, {
            text: qrURL,
            width: 256,
            height: 256,
            colorDark: '#667eea',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });

        // Update patient info
        document.getElementById('qrPatientId').textContent = patient.id;
        document.getElementById('qrPatientName').textContent = patient.name;

        // Show modal
        modal.style.display = 'block';
    } catch (error) {
        console.error('QR Code generation error:', error);
        alert('Failed to generate QR code: ' + error.message);
    }
}

// Check if page was opened via QR code and trigger download - MUST BE FIRST
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('qr');
    
    if (qrId) {
        // Stop all other scripts from loading
        window.stop && window.stop();
        
        // Get patient data from localStorage
        const patientDataStr = localStorage.getItem(qrId);
        
        if (patientDataStr) {
            const patient = JSON.parse(patientDataStr);
            
            // Replace entire page with download page
            document.open();
            document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Patient ${patient.id}</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0}
.box{background:white;color:#333;padding:30px;border-radius:15px;max-width:500px;box-shadow:0 10px 40px rgba(0,0,0,0.3)}
h1{color:#667eea;margin:0 0 15px;font-size:24px}
.info{background:#f8f9fa;padding:15px;border-radius:8px;margin:15px 0;text-align:left}
.row{padding:8px;border-bottom:1px solid #ddd;font-size:14px}
.row:last-child{border-bottom:none}
.label{font-weight:bold;color:#667eea;display:inline-block;width:100px}
button{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;padding:12px 24px;font-size:16px;border-radius:8px;cursor:pointer;margin:10px;font-weight:600}
button:hover{transform:scale(1.05)}
.spinner{border:3px solid #f3f3f3;border-top:3px solid #667eea;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;margin:15px auto}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.success{color:#28a745;font-weight:bold;margin:15px 0}
</style>
</head>
<body>
<div class="box">
<h1>🏥 Patient Information</h1>
<div class="spinner"></div>
<p class="success">Downloading...</p>
<div class="info">
<div class="row"><span class="label">ID:</span> ${patient.id}</div>
<div class="row"><span class="label">Name:</span> ${patient.name}</div>
<div class="row"><span class="label">Age:</span> ${patient.age} years</div>
<div class="row"><span class="label">Room:</span> ${patient.room} - Bed ${patient.bed}</div>
<div class="row"><span class="label">ESI Level:</span> ${patient.esiLevel}</div>
</div>
<button onclick="downloadDoc()">📥 Download Document</button>
<p style="font-size:12px;color:#666;margin-top:15px">If download doesn't start, click the button above</p>
</div>
<script>
const p = ${JSON.stringify(patient)};

function downloadDoc() {
    const html = \`<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<title>Patient \${p.id} - \${p.name}</title>
<style>
@page {
    margin: 1in;
}
body {
    font-family: Calibri, Arial, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
}
.header {
    text-align: center;
    border-bottom: 3px solid #667eea;
    padding-bottom: 20px;
    margin-bottom: 30px;
}
.header h1 {
    color: #667eea;
    font-size: 28pt;
    margin: 0 0 10px 0;
}
.header p {
    font-size: 14pt;
    color: #666;
    margin: 5px 0;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}
td {
    padding: 12px;
    border: 1px solid #ddd;
}
.label {
    background-color: #667eea;
    color: white;
    font-weight: bold;
    width: 35%;
}
.value {
    background-color: #f8f9fa;
    font-size: 14pt;
}
.warning {
    background-color: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 5px;
    padding: 15px;
    margin: 20px 0;
}
.footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    color: #666;
    font-size: 10pt;
}
</style>
</head>
<body>
<div class="header">
<h1>🏥 Patient Management System</h1>
<p>Patient Information Document</p>
</div>

<table border="1" cellpadding="12" cellspacing="0">
<tr>
<td class="label">Patient ID</td>
<td class="value" style="font-family: 'Courier New', monospace; font-weight: bold; color: #667eea; font-size: 16pt;">\${p.id}</td>
</tr>
<tr>
<td class="label">Patient Name</td>
<td class="value"><strong style="font-size: 16pt;">\${p.name}</strong></td>
</tr>
<tr>
<td class="label">Age</td>
<td class="value">\${p.age} years old</td>
</tr>
<tr>
<td class="label">Birthday</td>
<td class="value">\${p.birthday || 'N/A'}</td>
</tr>
<tr>
<td class="label">Religion</td>
<td class="value">\${p.religion || 'N/A'}</td>
</tr>
<tr>
<td class="label">Location (From)</td>
<td class="value">\${p.location || 'N/A'}</td>
</tr>
<tr>
<td class="label">Room & Bed</td>
<td class="value">\${p.room} - Bed \${p.bed}</td>
</tr>
<tr>
<td class="label">Attending Physician</td>
<td class="value">\${p.physician || 'N/A'}</td>
</tr>
<tr>
<td class="label">Date Admitted</td>
<td class="value">\${p.dateAdmitted || 'N/A'}</td>
</tr>
<tr>
<td class="label">Added By</td>
<td class="value">\${p.addedBy || 'N/A'}</td>
</tr>
<tr>
<td class="label">ESI Level</td>
<td class="value"><strong style="color: #ff6b6b; font-size: 14pt;">\${p.esiLevel}</strong></td>
</tr>
<tr>
<td class="label">Diseases/Conditions</td>
<td class="value">\${p.diseases || 'None recorded'}</td>
</tr>
</table>

<div class="warning">
<p><strong style="color: #856404;">⚠️ CONFIDENTIAL PATIENT INFORMATION</strong></p>
<p>This document contains protected health information (PHI). Handle according to HIPAA regulations. Unauthorized access, use, or disclosure is prohibited.</p>
</div>

<div class="footer">
<p><strong>Generated by Patient Management System</strong></p>
<p>Document generated: \${new Date().toLocaleString()}</p>
<p style="margin-top: 10px; font-size: 9pt;">For authorized medical personnel only.</p>
</div>
</body>
</html>\`;

    // Create blob with proper Word MIME type
    const blob = new Blob(['\\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Patient_' + p.id + '_' + p.name.replace(/\\s+/g, '_') + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Auto-download after 1 second
setTimeout(downloadDoc, 1000);
</script>
</body>
</html>`);
            document.close();
        } else {
            document.open();
            document.write('<div style="text-align:center;padding:50px;font-family:Arial"><h1>❌ QR Code Expired</h1><p>This QR code link is no longer valid.</p></div>');
            document.close();
        }
        
        // Prevent further script execution
        throw new Error('QR mode - stopping normal page load');
    }
})();

// Helper function to generate Word document HTML
function generateWordDocumentHTML(patient) {
    return `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset='utf-8'>
    <title>Patient Information - ${patient.name}</title>
    <style>
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #667eea;
            font-size: 28pt;
            margin: 0 0 10px 0;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .info-table td {
            padding: 12px;
            border: 1px solid #ddd;
        }
        .info-table .label {
            background-color: #667eea;
            color: white;
            font-weight: bold;
            width: 35%;
        }
        .info-table .value {
            background-color: #f8f9fa;
            font-size: 14pt;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 10pt;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Patient Management System</h1>
        <p style="font-size: 14pt; color: #666;">Patient Information Document</p>
    </div>
    
    <table class="info-table">
        <tr>
            <td class="label">Patient ID</td>
            <td class="value" style="font-family: 'Courier New', monospace; font-weight: bold; color: #667eea; font-size: 16pt;">${patient.id}</td>
        </tr>
        <tr>
            <td class="label">Patient Name</td>
            <td class="value"><strong style="font-size: 16pt;">${patient.name}</strong></td>
        </tr>
        <tr>
            <td class="label">Age</td>
            <td class="value">${patient.age} years old</td>
        </tr>
        <tr>
            <td class="label">Birthday</td>
            <td class="value">${patient.birthday || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">Religion</td>
            <td class="value">${patient.religion || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">Location (From)</td>
            <td class="value">${patient.location || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">Room & Bed</td>
            <td class="value">${patient.room} - Bed ${patient.bed}</td>
        </tr>
        <tr>
            <td class="label">Attending Physician</td>
            <td class="value">${patient.physician || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">Date Admitted</td>
            <td class="value">${patient.dateAdmitted || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">Added By</td>
            <td class="value">${patient.addedBy || 'N/A'}</td>
        </tr>
        <tr>
            <td class="label">ESI Level</td>
            <td class="value"><strong style="color: #ff6b6b; font-size: 14pt;">${patient.esiLevel}</strong></td>
        </tr>
        <tr>
            <td class="label">Diseases/Conditions</td>
            <td class="value">${patient.diseases || 'None recorded'}</td>
        </tr>
    </table>
    
    <div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <strong style="color: #856404;">⚠️ Confidential:</strong> This document contains protected health information. Handle according to HIPAA regulations.
    </div>
    
    <div class="footer">
        <p><strong>Generated by Patient Management System</strong></p>
        <p>Document generated: ${new Date().toLocaleString()}</p>
        <p style="margin-top: 10px; font-size: 9pt;">For authorized medical personnel only.</p>
    </div>
</body>
</html>`;
}

function closeQRCodeModal() {
    const modal = document.getElementById('qrCodeModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentQRCode = null;
    currentQRPatientData = null;
}

function downloadQRCode() {
    if (!currentQRPatientData) return;
    
    const container = document.getElementById('qrCodeContainer');
    const canvas = container.querySelector('canvas');
    
    if (canvas) {
        // Convert canvas to image
        const image = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.download = `QR_${currentQRPatientData.id}_${currentQRPatientData.name.replace(/\s+/g, '_')}.png`;
        link.href = image;
        link.click();
    }
}

function printQRCode() {
    if (!currentQRPatientData) return;
    
    const container = document.getElementById('qrCodeContainer');
    const canvas = container.querySelector('canvas');
    
    if (canvas) {
        const image = canvas.toDataURL('image/png');
        
        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Patient QR Code - ${currentQRPatientData.name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px;
                        margin: 0;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #667eea;
                        margin: 0 0 10px 0;
                        font-size: 28px;
                    }
                    .header p {
                        color: #666;
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .qr-container {
                        border: 3px solid #667eea;
                        padding: 20px;
                        border-radius: 12px;
                        background: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                    }
                    .patient-info {
                        text-align: center;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        max-width: 400px;
                    }
                    .patient-info .label {
                        color: #666;
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                    .patient-info .value {
                        color: #333;
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 15px;
                    }
                    .patient-info .id {
                        color: #667eea;
                        font-size: 20px;
                        font-family: monospace;
                        font-weight: bold;
                    }
                    @media print {
                        body {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏥 Patient Management System</h1>
                    <p>Patient QR Code</p>
                </div>
                <div class="qr-container">
                    <img src="${image}" alt="Patient QR Code" style="display: block;">
                </div>
                <div class="patient-info">
                    <div class="label">Patient ID</div>
                    <div class="value id">${currentQRPatientData.id}</div>
                    <div class="label">Patient Name</div>
                    <div class="value">${currentQRPatientData.name}</div>
                    <div class="label">Room & Bed</div>
                    <div class="value">${currentQRPatientData.room} - ${currentQRPatientData.bed}</div>
                    <div class="label">ESI Level</div>
                    <div class="value">${currentQRPatientData.esiLevel}</div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
}

function exportQRToWord() {
    if (!currentQRPatientData) {
        alert('Please generate a QR code first.');
        return;
    }
    
    const container = document.getElementById('qrCodeContainer');
    const canvas = container.querySelector('canvas');
    
    if (!canvas) {
        alert('QR code not found. Please try again.');
        return;
    }
    
    try {
        const image = canvas.toDataURL('image/png');
        
        // Create HTML content for Word document
        const htmlContent = `
            <!DOCTYPE html>
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Patient QR Code - ${currentQRPatientData.name}</title>
                <style>
                    body {
                        font-family: 'Calibri', 'Arial', sans-serif;
                        margin: 40px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px solid #667eea;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #667eea;
                        font-size: 28pt;
                        margin: 0 0 10px 0;
                    }
                    .header p {
                        color: #666;
                        font-size: 14pt;
                        margin: 5px 0;
                    }
                    .content {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .qr-section {
                        text-align: center;
                        margin: 30px 0;
                        padding: 20px;
                        border: 2px solid #667eea;
                        border-radius: 10px;
                        background-color: #f8f9fa;
                    }
                    .qr-section img {
                        max-width: 300px;
                        height: auto;
                        margin: 20px 0;
                        border: 3px solid #667eea;
                        padding: 10px;
                        background: white;
                    }
                    .info-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .info-table td {
                        padding: 12px;
                        border: 1px solid #ddd;
                    }
                    .info-table .label {
                        background-color: #667eea;
                        color: white;
                        font-weight: bold;
                        width: 40%;
                    }
                    .info-table .value {
                        background-color: #f8f9fa;
                        font-size: 14pt;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 10pt;
                    }
                    .warning-box {
                        background-color: #fff3cd;
                        border: 2px solid #ffc107;
                        border-radius: 5px;
                        padding: 15px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏥 Patient Management System</h1>
                    <p>Patient QR Code Document</p>
                </div>
                
                <div class="content">
                    <div class="qr-section">
                        <h2 style="color: #667eea; margin-top: 0;">Patient QR Code</h2>
                        <p style="color: #666; font-size: 12pt;">Scan this code with your phone camera to access patient information</p>
                        <img src="${image}" alt="Patient QR Code">
                    </div>
                    
                    <table class="info-table">
                        <tr>
                            <td class="label">Patient ID</td>
                            <td class="value" style="font-family: 'Courier New', monospace; font-weight: bold; color: #667eea; font-size: 16pt;">${currentQRPatientData.id}</td>
                        </tr>
                        <tr>
                            <td class="label">Patient Name</td>
                            <td class="value"><strong style="font-size: 16pt;">${currentQRPatientData.name}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Age</td>
                            <td class="value">${currentQRPatientData.age} years old</td>
                        </tr>
                        <tr>
                            <td class="label">Room & Bed</td>
                            <td class="value">${currentQRPatientData.room} - ${currentQRPatientData.bed}</td>
                        </tr>
                        <tr>
                            <td class="label">ESI Level</td>
                            <td class="value"><strong style="color: #ff6b6b;">${currentQRPatientData.esiLevel}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Generated Date</td>
                            <td class="value">${new Date().toLocaleString()}</td>
                        </tr>
                    </table>
                    
                    <div class="warning-box">
                        <strong style="color: #856404;">⚠️ Important:</strong> This QR code contains patient identification information. Please handle with care and maintain patient confidentiality according to HIPAA regulations.
                    </div>
                    
                    <div style="background-color: #d1ecf1; border: 2px solid #0c5460; border-radius: 5px; padding: 15px; margin: 20px 0;">
                        <strong style="color: #0c5460;">💡 How to Use:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px; color: #0c5460;">
                            <li>Open your phone's camera app</li>
                            <li>Point it at the QR code</li>
                            <li>Tap the notification to access patient information</li>
                            <li>No special app required!</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Generated by Patient Management System</strong></p>
                    <p>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    <p style="margin-top: 10px; font-size: 9pt;">This document is for authorized medical personnel only.</p>
                </div>
            </body>
            </html>
        `;
        
        // Create Blob and download as .doc file
        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Patient_QR_${currentQRPatientData.id}_${currentQRPatientData.name.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        alert(`✓ Word document downloaded successfully!\n\nFile: Patient_QR_${currentQRPatientData.id}_${currentQRPatientData.name.replace(/\s+/g, '_')}.doc`);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
        console.error('Error exporting to Word:', error);
        alert('Failed to export QR code to Word. Please try again.');
    }
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.getElementById('starRating');
    if (starRating) {
        const stars = starRating.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = parseInt(this.getAttribute('data-rating'));
                updateStarRating(currentRating);
            });
            
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
        });
        
        starRating.addEventListener('mouseleave', function() {
            updateStarRating(currentRating);
        });
    }
});

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#ffd700';
            star.style.transform = 'scale(1.2)';
        } else {
            star.style.color = '#e0e0e0';
            star.style.transform = 'scale(1)';
        }
    });
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    ratingText.textContent = rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''} - ${ratingLabels[rating]}` : 'Select a rating';
}

function submitFeedback() {
    const category = document.getElementById('feedbackCategory').value;
    const name = document.getElementById('feedbackName').value.trim();
    const comments = document.getElementById('feedbackComments').value.trim();
    
    if (currentRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    if (!comments) {
        alert('Please enter your comments');
        return;
    }
    
    const feedback = {
        id: Date.now(),
        rating: currentRating,
        category: category,
        name: name || 'Anonymous',
        comments: comments,
        submittedBy: currentUser ? currentUser.username : 'Guest',
        submittedAt: new Date().toISOString()
    };
    
    feedbacks.unshift(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    alert('Thank you for your feedback! We appreciate your input.');
    
    clearFeedbackForm();
    loadFeedbackList();
}

function loadFeedbackList() {
    const list = document.getElementById('feedbackList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (feedbacks.length === 0) {
        list.innerHTML = '<p class="empty-message">No feedback submitted yet. Be the first to share your thoughts!</p>';
        return;
    }
    
    feedbacks.forEach((feedback, index) => {
        const div = document.createElement('div');
        div.className = 'feedback-item';
        
        const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
        
        div.innerHTML = `
            <div class="feedback-header">
                <div>
                    <span class="feedback-category">${feedback.category}</span>
                    <span class="feedback-rating">${stars}</span>
                </div>
                <button class="remove-btn" onclick="deleteFeedback(${index})" style="margin: 0;">✕</button>
            </div>
            <div class="feedback-comments">${feedback.comments}</div>
            <div class="feedback-meta">
                By: <strong>${feedback.name}</strong> (${feedback.submittedBy}) • 
                ${new Date(feedback.submittedAt).toLocaleString()}
            </div>
        `;
        
        list.appendChild(div);
    });
}

function deleteFeedback(index) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        feedbacks.splice(index, 1);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        loadFeedbackList();
    }
}

function clearAllFeedback() {
    if (confirm('Are you sure you want to delete all feedback? This action cannot be undone.')) {
        feedbacks = [];
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        loadFeedbackList();
        alert('All feedback has been cleared.');
    }
}

// Print Patient Record
function printPatientRecord() {
    const patient = patients[currentPatientIndex];
    if (!patient) return;
    
    const timeDisplay = patient.time ? new Date(patient.time).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) : 'N/A';
    
    const printWindow = window.open('', '', 'width=900,height=700');
    
    let printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Patient Record - ${patient.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.6;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 14px;
        }
        
        .patient-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .patient-header h2 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .patient-header .patient-id {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            background: #f8f9ff;
            color: #667eea;
            padding: 12px 15px;
            font-size: 18px;
            font-weight: 700;
            border-left: 4px solid #667eea;
            margin-bottom: 15px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .info-item {
            padding: 12px;
            background: #f8f9ff;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        
        .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: block;
        }
        
        .info-value {
            font-size: 15px;
            color: #333;
            font-weight: 600;
        }
        
        .list-item {
            padding: 10px 15px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-left: 3px solid #667eea;
            margin-bottom: 8px;
            border-radius: 4px;
        }
        
        .list-item .timestamp {
            font-size: 11px;
            color: #999;
            margin-top: 4px;
        }
        
        .vitals-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .vitals-table th,
        .vitals-table td {
            padding: 10px;
            text-align: left;
            border: 1px solid #e0e0e0;
        }
        
        .vitals-table th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        
        .vitals-table tr:nth-child(even) {
            background: #f8f9ff;
        }
        
        .notes-box {
            padding: 15px;
            background: #f8f9ff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.8;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .esi-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 12px;
            color: white;
        }
        
        .esi-1 { background: #c9302c; }
        .esi-2 { background: #ec7c26; }
        .esi-3 { background: #f0ad4e; }
        .esi-4 { background: #5cb85c; }
        .esi-5 { background: #5bc0de; }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PATIENT MEDICAL RECORD</h1>
        <p>Emergency Room - Patient Management System</p>
    </div>
    
    <div class="patient-header">
        <h2>${patient.name}</h2>
        <p class="patient-id">Patient ID: ${patient.id}</p>
    </div>
    
    <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Age</span>
                <span class="info-value">${patient.age || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Birthday</span>
                <span class="info-value">${patient.birthday || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Religion</span>
                <span class="info-value">${patient.religion || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Location (From)</span>
                <span class="info-value">${patient.location || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Room & Bed</span>
                <span class="info-value">${(patient.room || 'N/A') + (patient.bed ? ' - ' + patient.bed : '')}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Attending Physician</span>
                <span class="info-value">${patient.physician || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date Admitted</span>
                <span class="info-value">${timeDisplay}</span>
            </div>
            <div class="info-item">
                <span class="info-label">ESI Level</span>
                <span class="info-value">${getESIBadge(patient.esiLevel)}</span>
            </div>
        </div>
    </div>
    `;
    
    // Diagnosis Section
    if (patient.diagnosis && patient.diagnosis.length > 0) {
        printContent += `
    <div class="section">
        <div class="section-title">Diagnosis & Medical History</div>
        ${patient.diagnosis.map(item => {
            const text = typeof item === 'string' ? item : item.text;
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
            return `<div class="list-item">
                ${text}
                ${timestamp ? `<div class="timestamp">📅 ${timestamp}</div>` : ''}
            </div>`;
        }).join('')}
    </div>`;
    }
    
    // Medications Section
    if (patient.medications && patient.medications.length > 0) {
        printContent += `
    <div class="section">
        <div class="section-title">Medications & Prescriptions</div>
        ${patient.medications.map(item => {
            const text = typeof item === 'string' ? item : item.text;
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
            return `<div class="list-item">
                ${text}
                ${timestamp ? `<div class="timestamp">📅 ${timestamp}</div>` : ''}
            </div>`;
        }).join('')}
    </div>`;
    }
    
    // Lab Results Section
    if (patient.labs && patient.labs.length > 0) {
        printContent += `
    <div class="section">
        <div class="section-title">Lab Results & Tests</div>
        ${patient.labs.map(item => {
            const text = typeof item === 'string' ? item : item.text;
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
            return `<div class="list-item">
                ${text}
                ${timestamp ? `<div class="timestamp">📅 ${timestamp}</div>` : ''}
            </div>`;
        }).join('')}
    </div>`;
    }
    
    // Vitals Section
    if (patient.vitals && patient.vitals.length > 0) {
        printContent += `
    <div class="section">
        <div class="section-title">Vital Signs</div>
        <table class="vitals-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Time Recorded</th>
                </tr>
            </thead>
            <tbody>
                ${patient.vitals.map(vital => `
                    <tr>
                        <td><strong>${vital.type}</strong></td>
                        <td>${vital.value}</td>
                        <td>${new Date(vital.time).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
    }
    
    // Clinical Notes Section
    if (patient.clinicalNotes && patient.clinicalNotes.trim()) {
        printContent += `
    <div class="section">
        <div class="section-title">Nurses Notes & Observations</div>
        <div class="notes-box">${patient.clinicalNotes}</div>
    </div>`;
    }
    
    // Footer
    printContent += `
    <div class="footer">
        <p>Printed on: ${new Date().toLocaleString()}</p>
        <p>This is a confidential medical record. Handle with care.</p>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; margin-right: 10px;">Print</button>
        <button onclick="window.close()" style="padding: 12px 30px; background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">Close</button>
    </div>
</body>
</html>`;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
}

function getESIBadge(esiLevel) {
    if (!esiLevel || esiLevel === 'N/A') return 'N/A';
    
    let badgeClass = '';
    if (esiLevel.includes('ESI-1')) badgeClass = 'esi-1';
    else if (esiLevel.includes('ESI-2')) badgeClass = 'esi-2';
    else if (esiLevel.includes('ESI-3')) badgeClass = 'esi-3';
    else if (esiLevel.includes('ESI-4')) badgeClass = 'esi-4';
    else if (esiLevel.includes('ESI-5')) badgeClass = 'esi-5';
    
    return `<span class="esi-badge ${badgeClass}">${esiLevel}</span>`;
}


// ==================== DATABASE MANAGEMENT FUNCTIONS ====================

// Open database management modal
function openDatabaseManagement() {
    // Check if user is owner
    if (!isOwner()) {
        alert('⚠️ Access Denied\n\nDatabase management is restricted to Owner/Administrator accounts only.\n\nPlease contact your system administrator for access.');
        return;
    }
    
    const modal = document.getElementById('databaseModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close database management modal
function closeDatabaseModal() {
    const modal = document.getElementById('databaseModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// View all users in the system
async function viewAllUsers() {
    try {
        const users = await getAllUsersDB();
        
        if (users.length === 0) {
            alert('No users found in the database.');
            return;
        }
        
        let userList = '👥 ALL REGISTERED USERS\n\n';
        users.forEach((user, index) => {
            userList += `${index + 1}. ${user.username}\n`;
            userList += `   Role: ${user.role}\n`;
            userList += `   Email: ${user.email || 'N/A'}\n`;
            userList += `   Full Name: ${user.fullName || 'N/A'}\n`;
            userList += `   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}\n`;
            userList += `   Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}\n`;
            userList += `   Status: ${user.isActive ? '✅ Active' : '❌ Inactive'}\n\n`;
        });
        
        alert(userList);
    } catch (error) {
        console.error('Error viewing users:', error);
        alert('Error loading users: ' + error.message);
    }
}

// Close database modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('databaseModal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});


// ==================== COMMITTEE STRUCTURE FUNCTIONS ====================

// Open committee structure modal
function openCommitteeStructure() {
    const modal = document.getElementById('committeeModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close committee structure modal
function closeCommitteeModal() {
    const modal = document.getElementById('committeeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close committee modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('committeeModal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});


// Initialize login system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginSystem();
    checkLoginStatus();
});
}
