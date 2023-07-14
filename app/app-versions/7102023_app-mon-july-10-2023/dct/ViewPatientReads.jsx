//Added 7/13/2023:

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite,  } from "@thirdweb-dev/react";

import { addyShortner } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";



const ViewPatientReads = () => {

  let navigate = useNavigate();
//   const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
//   const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata and hasPatientRole (5/23/23)
  
    const { contract } = useContract(solidityContractAddress)
  
  const address = useAddress(); 

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
  const { id } = useParams();



    const [readings, setReadings] = useState([]);

    useEffect(() => {
      loadUsers();
    }, []);




      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadUsers = async () => {
        try {
            setReadings([]); // Clear previous readings before fetching new ones
            const result = await axios.get("https://dentcareteam.com/ihealth/php-react/view-single-patient-bp-readings.php?id="+id);
            console.log(result.data);
            setReadings(result.data); // Assign the fetched data directly to readings
          } catch (error) {
            console.error(error);
          }
        };
      


// 5:10pm R 5/4/23: Load all medications: 
      const loadMedications = async () => {
        setMedication([]);   
        const result = await axios.get("https://rxminter.com/php-react/viewmeds.php");
        console.log(result);
        setMedication(result.data.meds);
        // navigate('/');
      }



      const loadPatients = async () => {
        setPatient([]);   
        const result = await axios.get("https://rxminter.com/php-react/view.php");
        console.log(result);
        setPatients(result.data.records);
        // navigate('/');
    }

    

  return (

   <> 
             <div className="row">
            <div className="col-md-12 text-center">
                <h1>BP Readings for Patient</h1>
            </div>
        </div>



        
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search For Reading" aria-label="Recipient's username" aria-describedby="basic-addon2"
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}></input>
                    {/* <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">Search</button>
                    </div> */}
                </div>        
            </div>
        </div>

        <table className="table table-striped table-dark">
            <thead>          
                <tr>
                    <th style={{display: "none"}}>Key</th>
                    <th>Date</th>
                    
                    <th>Systolic</th>
                    
                    <th>Diastolic</th>

                    <th>Heart Rate</th>
                    
                    <th>Note</th>

                    <th>Add Note</th>
                </tr> 
            </thead>
            <tbody className="table-striped">
             {/* <tr key={`${index}`}> */}

            {/* {readings.filter((readings) => {
               return search.toLowerCase() === '' ? readings : readings.measurement_time.toLowerCase().includes(search) || readings.patient_note.toLowerCase().includes(search)
            }

            ) */}
            
            {readings?.map((reading, index) => (
                    <tr key={`${index}`}>
                        <td style={{display: "none"}}>{index+1}</td>

                        <td><Link className="btn btn-outline-light"  to={`/patient-history/${reading.id}`}>{reading.measurement_time}</Link></td>
                        
                        <td>{reading.hp}</td>

                        <td>{reading.lp}</td>

                        <td>{reading.hr}</td>

                        <td>{reading.patient_note}</td>

                        <td><Link className="btn btn-primary" to={`/view-your-reads/${reading.id}`}>Edit Note</Link></td>

                    </tr>
                ))}
            </tbody>
        </table>

    
</>

  )
}
export default ViewPatientReads