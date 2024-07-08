import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Diagnosis, Patient, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry, Entry, EntryFormValues } from "../types";
import { apiBaseUrl } from "../constants";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { HospitalEntryDetails, OccupationalHealthcareEntryDetails, HealthCheckEntryDetails} from './entries';
import './PatientDetailsPage.css';
import AddEntry from "./AddEntry";
import patientService from '../services/patients';


const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string>();


  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();

    const fetchDiagnoses = async () => {
      try {
        const {data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        setDiagnoses(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, [id]);

  if (!patient) return <div>Loading...</div>;
  // console.log('patient entries', patient.entries);
  console.log('this is diagnoses', diagnoses);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  const EntryDetails: React.FC<{ entry: Entry; getDiagnosisName: (code: string) => string }> = ({ entry, getDiagnosisName }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntryDetails entry={entry as HospitalEntry} getDiagnosisName={getDiagnosisName} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryDetails entry={entry as OccupationalHealthcareEntry} />;
      case "HealthCheck":
        return <HealthCheckEntryDetails entry={entry as HealthCheckEntry} />;
      default:
        return assertNever(entry);
    }
  };

  const submitNewEntry = async (entry: EntryFormValues) => {

    if (!patient) return;

    try {
      const newEntry = await patientService.createEntry(patient.id, entry);
      setPatient({ ...patient, entries: [...patient.entries, newEntry ]});
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <h2>{patient.name}
        {patient.gender === 'male' && <MaleIcon />}
        {patient.gender === 'female' && <FemaleIcon />}
        {patient.gender === 'other' && <TransgenderIcon />}
      </h2>

      <p className="no-margin">Occupation: {patient.occupation}</p>
      <p className="no-margin">Date of Birth: {patient.dateOfBirth}</p>
      <p className="no-margin">SSN: {patient.ssn}</p>
      < br/>
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <AddEntry onSubmit={submitNewEntry} onCancel={() => {}} />
      </div>
      <br />
      <br />
      <h3>Entries</h3>
    
      {patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <div key={entry.id} className="entry-box">
            <EntryDetails entry={entry} getDiagnosisName={getDiagnosisName} />
          </div>
          // <div key={index}>
          //   <p className="no-margin">
          //     {entry.date} 
          //     {' '}{entry.type === "HealthCheck" && <MedicalServicesIcon />}
          //     {' '}{entry.type === "OccupationalHealthcare" && (
          //       <>
          //         <WorkIcon />{' '}
          //         {typeof (entry as OccupationalHealthcareEntry).employerName !== 'undefined' &&
          //           <em>{(entry as OccupationalHealthcareEntry).employerName}</em>}
          //       </>
          //     )}
          //     {' '}{entry.type === "Hospital" && <LocalHospitalIcon />}
          //   </p>
          //   <p className="no-margin"><em>{entry.description}</em></p>
          //   {entry.type === "HealthCheck" && entry.healthCheckRating === 0 && <FavoriteIcon style={({ color: 'green' })}/>}
          //   {entry.type === "HealthCheck" && entry.healthCheckRating === 1 && <FavoriteIcon style={({ color: 'yellow' })}/>}
          //   {entry.type === "HealthCheck" && entry.healthCheckRating === 2 && <FavoriteIcon style={({ color: 'orange' })}/>}
          //   {entry.type === "HealthCheck" && entry.healthCheckRating === 3 && <FavoriteIcon style={({ color: 'red' })}/>}
          //   <p>diagnose by {entry.specialist}</p>
          //   <ul>
          //   {entry.diagnosisCodes && (
          //     <ul>
          //       {entry.diagnosisCodes.map((code, index) => (
          //           <li key={index}>
          //             {code} - {getDiagnosisName(code)}
          //           </li>
          //       ))}
          //     </ul>
          //   )}
          //   </ul>
          // </div>
        ))
      ) : (
        <p>No entries</p>
      )}
    </div>
  );
};

export default PatientDetailsPage;
function assertNever(entry: never): React.ReactNode {
  throw new Error("Function not implemented.");
}

