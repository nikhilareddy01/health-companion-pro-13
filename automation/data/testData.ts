export const testData = {
  userCredentials: {
    validUser: {
      email: 'patient.john@aurahealth.org',
      password: 'SecurePassword123!',
      otp: '123456',
      role: 'Patient'
    },
    invalidUser: {
      email: 'invalid.user@aurahealth.org',
      password: 'WrongPassword!',
      otp: '000000',
      role: 'Unknown'
    },
    adminUser: {
      email: 'admin.doctor@aurahealth.org',
      password: 'AdminPassword987!',
      otp: '999888',
      role: 'Administrator'
    }
  },
  profileData: {
    fullName: 'Johnathan Doe',
    phone: '+1-555-019-2834',
    dob: '1988-11-23',
    bloodType: 'O+',
    address: '742 Evergreen Terrace, Springfield',
    emergencyContact: '+1-555-901-2233'
  },
  formData: {
    symptomName: 'Headache and fatigue',
    severityLevel: 'Moderate',
    durationDays: 3,
    notes: 'Occurs mostly in the evening after work hours.'
  },
  searchQueries: [
    'Cardiology Consultation',
    'Blood Pressure Tracking',
    'Lab Results 2026',
    'Dr. Emily Smith',
    'Non-existent Symptom XYZ'
  ],
  appConfig: {
    packageName: 'com.aurahealth.companion',
    activityName: '.MainActivity',
    version: '1.4.2-build.108',
    targetSdkVersion: 33
  }
};
