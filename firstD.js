document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
  });
  
  document.querySelector('.add-patient').addEventListener('click', function() {
    document.getElementById('addPatientForm').style.display = 'block';
  });
  
  document.querySelector('#addPatientBtn').addEventListener('click', function() {
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    const patientList = document.getElementById('patientList');
    const li = document.createElement('li');
    li.classList.add('patient-item');
    li.innerHTML = `<strong>${fullName}</strong>: ${phoneNumber}
      <div class="patient-options">
        <button class="modify-btn">Modify</button>
        <button class="delete-btn">Delete</button>
      </div>`;
    patientList.appendChild(li);
    
    document.getElementById('addPatientForm').style.display = 'none';
  });
  
  document.querySelector('#cancelBtn').addEventListener('click', function() {
    document.getElementById('addPatientForm').style.display = 'none';
});