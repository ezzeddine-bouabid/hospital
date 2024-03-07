pragma solidity ^0.8.0;

contract MedicalRecords {
    mapping(address => string[]) patientFiles;

    function sendFileToPatient(address patientAddress, string memory swarmHash) public {
        patientFiles[patientAddress].push(swarmHash);
    }

    function getFilesForPatient() public view returns (string[] memory) {
        return patientFiles[msg.sender];
    }
}
