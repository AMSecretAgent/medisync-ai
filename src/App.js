import React, { useState, useEffect } from 'react';
import { AlertTriangle, User, Users, Search, Camera, CheckCircle, XCircle, Clock, MapPin, Activity, AlertCircle, FileText, Upload, Home, UserPlus, Heart, TrendingUp } from 'lucide-react';

// Generate realistic mock patients
const generateMockPatients = () => {
  const names = ['Rajesh Sharma', 'Priya Verma', 'Amit Kumar', 'Sunita Singh', 'Vikram Patel', 'Anjali Gupta', 'Rahul Yadav', 'Deepa Mishra'];
  const conditions = ['Blunt chest trauma', 'Multiple fractures', 'Head injury', 'Internal bleeding', 'Lacerations', 'Spinal injury', 'Burns', 'Crush injury'];
  const locations = ['Trauma Bay 1', 'Trauma Bay 2', 'Trauma Bay 3', 'OR 1', 'OR 2', 'ICU Bed 5', 'CT Scan', 'Radiology'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const isUnknown = i < 12;
    const triageColor = i < 5 ? 'red' : i < 20 ? 'yellow' : 'green';
    
    return {
      id: `MCI-047-${String(i + 1).padStart(3, '0')}`,
      name: isUnknown ? null : names[i % names.length] + ` ${String.fromCharCode(65 + i)}`,
      isUnknown,
      age: isUnknown ? `${Math.floor(Math.random() * 30) + 25}-${Math.floor(Math.random() * 30) + 35}` : Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      triageColor,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      status: triageColor === 'red' ? 'Critical' : triageColor === 'yellow' ? 'Moderate' : 'Stable',
      location: locations[Math.floor(Math.random() * locations.length)],
      arrivalTime: new Date(Date.now() - Math.random() * 7200000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      vitals: {
        bp: triageColor === 'red' ? `${Math.floor(Math.random() * 30) + 70}/${Math.floor(Math.random() * 30) + 40}` : `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 20) + 70}`,
        hr: triageColor === 'red' ? Math.floor(Math.random() * 50) + 110 : Math.floor(Math.random() * 30) + 70,
        spo2: triageColor === 'red' ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 5) + 95,
        temp: (Math.random() * 2 + 36.5).toFixed(1)
      },
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=b6e3f4`,
      timeline: [
        { time: new Date(Date.now() - Math.random() * 7200000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: 'Arrived via ambulance', type: 'arrival' },
        { time: new Date(Date.now() - Math.random() * 7000000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: `Triaged ${triageColor.toUpperCase()} priority`, type: 'triage' },
        { time: new Date(Date.now() - Math.random() * 6800000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: 'Vitals recorded and initial assessment', type: 'assessment' },
        { time: new Date(Date.now() - Math.random() * 6500000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: isUnknown ? 'Marked as unknown identity - biometrics captured' : 'Patient details confirmed', type: 'identity' }
      ],
      medicalHistory: isUnknown ? null : {
        bloodType: ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'][Math.floor(Math.random() * 6)],
        allergies: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'Penicillin' : 'Aspirin') : 'None known',
        conditions: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'Hypertension' : 'Diabetes Type 2') : 'None known',
        medications: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'Amlodipine 5mg daily' : 'Metformin 500mg BD') : 'None'
      }
    };
  });
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [patients, setPatients] = useState(generateMockPatients());
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPhoto, setSearchPhoto] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  const unknownPatients = patients.filter(p => p.isUnknown);
  const redTagPatients = patients.filter(p => p.triageColor === 'red');
  const yellowTagPatients = patients.filter(p => p.triageColor === 'yellow');
  const greenTagPatients = patients.filter(p => p.triageColor === 'green');

  // Simulate photo search with progress
  const handlePhotoSearch = () => {
    if (!searchPhoto) return;
    
    setIsSearching(true);
    setSearchProgress(0);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      const matchedPatient = unknownPatients[0];
      setSearchResults({
        matches: [{
          patient: matchedPatient,
          confidence: 98.3,
          status: 'High Confidence Match'
        }]
      });
      setIsSearching(false);
      setSearchProgress(0);
    }, 3000);
  };

  // Confirm patient identity
  const confirmIdentity = (patient, familyInfo) => {
    const updatedTimeline = [
      ...patient.timeline,
      { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: 'Identity confirmed via family photo match (98.3% confidence)', type: 'identity' },
      { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: 'Medical history retrieved from ABDM Health ID', type: 'system' },
      { time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), event: '⚠️ CRITICAL: Penicillin allergy detected - Patient received Amoxicillin at 14:30', type: 'alert' }
    ];

    setPatients(prev => prev.map(p => 
      p.id === patient.id 
        ? {
            ...p,
            name: familyInfo.name,
            age: familyInfo.age || 36,
            isUnknown: false,
            medicalHistory: {
              bloodType: 'O+',
              allergies: 'Penicillin',
              conditions: 'Hypertension',
              medications: 'Amlodipine 5mg daily'
            },
            timeline: updatedTimeline
          }
        : p
    ));
    
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 10000);
    setSearchResults(null);
    setSearchPhoto(null);
    setActiveView('dashboard');
  };

  // Statistics
  const stats = {
    total: patients.length,
    critical: redTagPatients.length,
    unknown: unknownPatients.length,
    incidents: 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MediSync AI</h1>
                <p className="text-xs text-gray-500">Mass Casualty Command Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-red-700">ACTIVE: Agra Expressway MCI</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Incident Commander</div>
                <div className="text-sm font-semibold">Dr. A. Verma</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Command Center', icon: Home },
              { id: 'intake', label: 'Patient Intake', icon: UserPlus },
              { id: 'family-search', label: 'Family Search', icon: Search }
            ].map(nav => (
              <button
                key={nav.id}
                onClick={() => setActiveView(nav.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeView === nav.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <nav.icon className="w-4 h-4 mr-2" />
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            stats={stats}
            showAlert={showAlert}
            unknownPatients={unknownPatients}
            redTagPatients={redTagPatients}
            yellowTagPatients={yellowTagPatients}
            greenTagPatients={greenTagPatients}
            onPatientClick={setSelectedPatient}
            onFamilySearchClick={() => setActiveView('family-search')}
          />
        )}

        {activeView === 'intake' && <IntakeView />}

        {activeView === 'family-search' && (
          <FamilySearchView
            searchPhoto={searchPhoto}
            setSearchPhoto={setSearchPhoto}
            isSearching={isSearching}
            searchProgress={searchProgress}
            searchResults={searchResults}
            unknownPatients={unknownPatients}
            onSearch={handlePhotoSearch}
            onConfirm={confirmIdentity}
            onReset={() => {
              setSearchResults(null);
              setSearchPhoto(null);
            }}
          />
        )}
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

// Dashboard View Component
const DashboardView = ({ stats, showAlert, unknownPatients, redTagPatients, yellowTagPatients, greenTagPatients, onPatientClick, onFamilySearchClick }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Users className="w-6 h-6" />} title="Total Patients" value={stats.total} color="blue" />
      <StatCard icon={<AlertTriangle className="w-6 h-6" />} title="Critical (Red)" value={stats.critical} color="red" />
      <StatCard icon={<User className="w-6 h-6" />} title="Unknown Identity" value={stats.unknown} color="orange" trend="+2 in last hour" />
      <StatCard icon={<Activity className="w-6 h-6" />} title="Active Incidents" value={stats.incidents} color="green" />
    </div>

    {/* Critical Alert */}
    {showAlert && (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-lg animate-pulse">
        <div className="flex items-start">
          <AlertCircle className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold text-red-800">🚨 CRITICAL MEDICAL ALERT</h3>
            </div>
            <div className="space-y-2">
              <p className="text-red-700 font-semibold">
                Patient <span className="font-mono">MCI-047-001</span> identified as <span className="font-bold">Ramesh Kumar</span> (Age: 36, Male)
              </p>
              <div className="bg-red-100 p-4 rounded-lg mt-3">
                <p className="text-red-800 font-bold text-lg mb-2">⚠️ MEDICAL HISTORY RETRIEVED FROM ABDM:</p>
                <ul className="space-y-1 text-red-700 text-sm">
                  <li>🩸 Blood Type: <strong>O+</strong></li>
                  <li>💊 Known Allergy: <strong className="text-red-900">PENICILLIN</strong></li>
                  <li>📋 Chronic Condition: <strong>Hypertension</strong></li>
                  <li>💉 Current Medication: Amlodipine 5mg daily</li>
                </ul>
              </div>
              <div className="bg-red-900 text-white p-4 rounded-lg mt-3 border-2 border-red-700">
                <p className="font-bold text-lg">⚠️ DRUG INTERACTION DETECTED</p>
                <p className="mt-1">Patient administered <strong>Amoxicillin 500mg</strong> at 14:30 PM</p>
                <p className="mt-1 text-red-200">Amoxicillin is penicillin-based antibiotic</p>
                <p className="mt-3 font-bold text-yellow-300">→ IMMEDIATE PHYSICIAN REVIEW REQUIRED</p>
                <p className="text-sm mt-1">Monitor for allergic reaction • Prepare epinephrine • Review alternative antibiotics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Unknown Patients Alert */}
    {unknownPatients.length > 0 && (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
            <div>
              <span className="font-bold text-orange-900 text-lg">
                {unknownPatients.length} patients with unknown identity
              </span>
              <p className="text-sm text-orange-700 mt-1">Family members can search using photo matching</p>
            </div>
          </div>
          <button
            onClick={onFamilySearchClick}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Open Family Portal →
          </button>
        </div>
      </div>
    )}

    {/* Triage Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TriageSection title="Critical (Red Tag)" patients={redTagPatients} color="red" onPatientClick={onPatientClick} />
      <TriageSection title="Urgent (Yellow Tag)" patients={yellowTagPatients} color="yellow" onPatientClick={onPatientClick} />
      <TriageSection title="Stable (Green Tag)" patients={greenTagPatients} color="green" onPatientClick={onPatientClick} />
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, title, value, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    green: 'bg-green-50 text-green-600 border-green-200'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'red' ? 'bg-red-100' : color === 'orange' ? 'bg-orange-100' : 'bg-green-100'}`}>
          {icon}
        </div>
        {trend && <span className="text-xs font-medium">{trend}</span>}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-75">{title}</div>
    </div>
  );
};

// Triage Section Component
const TriageSection = ({ title, patients, color, onPatientClick }) => {
  const colorClasses = {
    red: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', badge: 'bg-red-100 text-red-800' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800' },
    green: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', badge: 'bg-green-100 text-green-800' }
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} border-2 ${classes.border} rounded-xl p-5 shadow-sm`}>
      <h3 className={`text-lg font-bold ${classes.text} mb-4 flex items-center`}>
        <div className={`w-3 h-3 rounded-full ${color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
        {title} ({patients.length})
      </h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {patients.map(patient => (
          <button
            key={patient.id}
            onClick={() => onPatientClick(patient)}
            className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <img src={patient.photoUrl} alt="Patient" className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <div className="font-bold text-gray-900">
                    {patient.isUnknown ? (
                      <span className="flex items-center">
                        {patient.id}
                        <span className={`ml-2 px-2 py-0.5 ${classes.badge} text-xs rounded-full font-medium`}>UNKNOWN</span>
                      </span>
                    ) : (
                      patient.name
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{patient.gender}, {patient.age}{typeof patient.age === 'string' ? ' est.' : 'y'}</div>
                </div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-1" />
                {patient.location}
              </div>
              <div className="text-gray-600">{patient.condition}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">Arrived: {patient.arrivalTime}</span>
                <span className={`text-xs font-medium ${patient.status === 'Critical' ? 'text-red-600' : patient.status === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {patient.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Patient Intake View
const IntakeView = () => (
  <div className="max-w-3xl mx-auto">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <Camera className="w-6 h-6 text-blue-600" />
        </div>
        Rapid Patient Intake
      </h2>
      
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Quick capture for unknown patients:</strong> Photo + basic vitals + injury description. System will assign temporary ID and enable family search.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Patient Photo *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
            <Camera className="w-16 h-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">Capture or upload patient photo</p>
            <p className="text-sm text-gray-500">Required for biometric tracking & family matching</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Open Camera
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Estimated Age</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="30-40 years" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Gender</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Condition / Injury Description</label>
          <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="4" placeholder="Blunt head trauma, patient conscious but disoriented, visible lacerations on forehead..."/>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">BP</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="120/80" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">HR (bpm)</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="75" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">SpO2 (%)</label>
            <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="98" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Temp (°C)</label>
            <input type="number" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="37.0" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Triage Priority *</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center p-4 border-2 border-red-300 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
              <input type="radio" name="triage" className="mr-3" />
              <div>
                <div className="font-bold text-red-800">Red - Critical</div>
                <div className="text-xs text-red-600">Immediate intervention</div>
              </div>
            </label>
            <label className="flex items-center p-4 border-2 border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors">
              <input type="radio" name="triage" className="mr-3" />
              <div>
                <div className="font-bold text-yellow-800">Yellow - Urgent</div>
                <div className="text-xs text-yellow-600">Treatment within 1hr</div>
              </div>
            </label>
            <label className="flex items-center p-4 border-2 border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
              <input type="radio" name="triage" className="mr-3" />
              <div>
                <div className="font-bold text-green-800">Green - Stable</div>
                <div className="text-xs text-green-600">Non-urgent care</div>
              </div>
            </label>
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
          Create Patient Record
        </button>
      </div>
    </div>
  </div>
);

// Family Search View
const FamilySearchView = ({ searchPhoto, setSearchPhoto, isSearching, searchProgress, searchResults, unknownPatients, onSearch, onConfirm, onReset }) => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Family Search Portal</h2>
        <p className="text-gray-600 text-lg">Agra Expressway Mass Casualty Incident - January 28, 2026</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
          <Users className="w-4 h-4 mr-2" />
          {unknownPatients.length} unidentified patients currently in system
        </div>
      </div>

      {!searchResults ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-lg text-blue-900 mb-2 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              How It Works
            </h3>
            <p className="text-blue-800 mb-3">
              Looking for someone in this incident? Our AI-powered facial recognition will search through all unidentified patients to help locate your loved one.
            </p>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>Upload a clear recent photo of the person you're searching for</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>AI analyzes facial features and matches against patient intake photos</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>Results typically appear within 3-5 seconds</span>
              </li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Upload Patient Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 relative">
              <Upload className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 font-semibold text-lg mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG, JPEG up to 10MB</p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => setSearchPhoto(event.target.result);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all">
                Select Photo
              </label>
              <p className="text-xs text-gray-500 mt-4">Your privacy is protected. Photos are only used for matching and are not stored permanently.</p>
            </div>
          </div>

          {searchPhoto && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <img src={searchPhoto} alt="Search" className="w-48 h-48 rounded-xl object-cover border-4 border-blue-500 shadow-lg" />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              {!isSearching ? (
                <button
                  onClick={onSearch}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Search for Match
                </button>
              ) : (
                <div className="text-center py-12">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">{searchProgress}%</span>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold text-xl mb-2">Analyzing photo with AI...</p>
                  <p className="text-gray-500">Comparing against {unknownPatients.length} unidentified patients</p>
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Face detection</span>
                      <span>Feature extraction</span>
                      <span>Database matching</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${searchProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-xl shadow-md">
            <div className="flex items-start">
              <div className="bg-green-500 text-white p-3 rounded-full mr-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-2xl mb-1">Match Found!</h3>
                <p className="text-green-700 text-lg">We found a high-confidence match with an unidentified patient</p>
              </div>
            </div>
          </div>

          {searchResults.matches.map((match, idx) => (
            <div key={idx} className="border-2 border-green-200 rounded-xl p-8 bg-gradient-to-br from-white to-green-50 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src={match.patient.photoUrl}
                    alt="Patient"
                    className="w-28 h-28 rounded-xl object-cover mr-6 border-4 border-green-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl font-bold mr-4 font-mono">{match.patient.id}</span>
                      <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-md">
                        {match.confidence}% Match Confidence
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg mb-1">{match.patient.gender}, Age: ~{match.patient.age}</p>
                    <p className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Arrived: {match.patient.arrivalTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 p-6 bg-white rounded-xl shadow-sm">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Location</p>
                  <p className="font-bold text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    {match.patient.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Status</p>
                  <p className="font-bold text-lg flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    {match.patient.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Condition</p>
                  <p className="font-bold text-lg">{match.patient.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Triage Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    match.patient.triageColor === 'red' ? 'bg-red-100 text-red-800' :
                    match.patient.triageColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {match.patient.triageColor.toUpperCase()} TAG
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-blue-900 mb-4 text-lg">Confirm Identity & Retrieve Medical Records</h4>
                <p className="text-blue-700 text-sm mb-4">Please provide the patient's details to confirm identity and access their medical history from ABDM Health ID system</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Patient's full name (e.g., Ramesh Kumar)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="patient-name"
                  />
                  <input
                    type="number"
                    placeholder="Patient's age"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="patient-age"
                  />
                  <input
                    type="tel"
                    placeholder="Family contact number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const name = document.getElementById('patient-name').value || 'Ramesh Kumar';
                      const age = document.getElementById('patient-age').value || 36;
                      onConfirm(match.patient, { name, age });
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Confirm Identity & Retrieve Medical History
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={onReset}
                  className="text-gray-600 hover:text-gray-800 font-medium flex items-center mx-auto"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  This isn't the right person - Start new search
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Patient Detail Modal
const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div className="flex items-center">
            <img src={patient.photoUrl} alt="Patient" className="w-20 h-20 rounded-xl object-cover mr-4 border-2 border-gray-200" />
            <div>
              <h2 className="text-3xl font-bold">
                {patient.isUnknown ? patient.id : patient.name}
              </h2>
              {patient.isUnknown && (
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                  Identity Unknown - Awaiting Family Match
                </span>
              )}
              <p className="text-gray-600 mt-1 text-lg">{patient.gender}, Age: {patient.age}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Vital Signs */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center text-blue-900">
                <Activity className="w-6 h-6 mr-2" />
                Vital Signs
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Blood Pressure', value: `${patient.vitals.bp} mmHg`, icon: '💓' },
                  { label: 'Heart Rate', value: `${patient.vitals.hr} bpm`, icon: '❤️' },
                  { label: 'SpO2', value: `${patient.vitals.spo2}%`, icon: '🫁' },
                  { label: 'Temperature', value: `${patient.vitals.temp}°C`, icon: '🌡️' }
                ].map((vital, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <span className="text-gray-700 flex items-center">
                      <span className="text-xl mr-2">{vital.icon}</span>
                      {vital.label}:
                    </span>
                    <span className="font-bold text-lg">{vital.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center text-green-900">
                <MapPin className="w-6 h-6 mr-2" />
                Current Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Location', value: patient.location, icon: '📍' },
                  { label: 'Status', value: patient.status, icon: '📊' },
                  { label: 'Condition', value: patient.condition, icon: '🩺' },
                  { label: 'Triage', value: patient.triageColor.toUpperCase(), icon: '🏥', color: patient.triageColor }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <span className="text-gray-700 flex items-center">
                      <span className="text-xl mr-2">{item.icon}</span>
                      {item.label}:
                    </span>
                    <span className={`font-bold text-lg ${item.color ? (item.color === 'red' ? 'text-red-600' : item.color === 'yellow' ? 'text-yellow-600' : 'text-green-600') : ''}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medical History */}
          {patient.medicalHistory && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-xl mb-4 flex items-center text-purple-900">
                <FileText className="w-6 h-6 mr-2" />
                Medical History (Retrieved from ABDM)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Blood Type', value: patient.medicalHistory.bloodType, icon: '🩸' },
                  { label: 'Allergies', value: patient.medicalHistory.allergies, icon: '⚠️', highlight: patient.medicalHistory.allergies !== 'None known' },
                  { label: 'Chronic Conditions', value: patient.medicalHistory.conditions, icon: '📋' },
                  { label: 'Current Medications', value: patient.medicalHistory.medications, icon: '💊' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${item.highlight ? 'bg-red-100 border-2 border-red-400' : 'bg-white'}`}>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </p>
                    <p className={`font-bold text-lg ${item.highlight ? 'text-red-800' : 'text-gray-900'}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-4 flex items-center text-gray-900">
              <Clock className="w-6 h-6 mr-2" />
              Patient Timeline
            </h3>
            <div className="space-y-4">
              {patient.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                    event.type === 'alert' ? 'bg-red-100 text-red-600' :
                    event.type === 'identity' ? 'bg-green-100 text-green-600' :
                    event.type === 'system' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {event.type === 'alert' ? <AlertTriangle className="w-6 h-6" /> :
                     event.type === 'identity' ? <User className="w-6 h-6" /> :
                     event.type === 'system' ? <Activity className="w-6 h-6" /> :
                     <Clock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm text-gray-500 font-semibold">{event.time}</span>
                      {event.type === 'alert' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">CRITICAL</span>
                      )}
                    </div>
                    <p className={`text-gray-800 ${event.type === 'alert' ? 'font-bold text-red-800' : ''}`}>
                      {event.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App