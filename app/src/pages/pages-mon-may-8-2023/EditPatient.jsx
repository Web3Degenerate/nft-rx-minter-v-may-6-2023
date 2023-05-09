import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";



const EditPatient = () => {

  let navigate = useNavigate();

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
  const { id } = useParams();

  // console.log('id check', id);

  // Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
      const [patient, setPatient] = useState({
          name: "",
          wallet_address: "",
          dob: "",
          email:"",
          id:""
      });
  
      const [medication, setMedication] = useState([]);
      const [patients, setPatients] = useState([]);
      // const [medication, setMedication] = useState({
      //     name: "",
      //     sig: "",
      //     strength:"",
      //     quantity:""
      // });

    useEffect(()=> {    
        loadUsers(); 
        loadMedications();
        loadPatients();
    }, [])

      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {name,wallet_address,dob,email} = patient; 
  
      const handleChange=(e)=>{
          setPatient({...patient,[e.target.name]: e.target.value })
          // console.log(e);
          console.log(patient);
      }
  
      const updateForm = async (e) => {
          e.preventDefault(); 
  
          console.log(patient);
  
          await axios.post("https://rxminter.com/php-react/update.php", patient).then((result)=>{
              console.log(result);
  
           
              if(result.data.status =='valid'){
                  navigate('/');
              }else{
                  alert('There is a problem saving this patient to the database. Please try again.');
              }
          });
      }

   

      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadUsers = async () => {
          // console.log('ID check inside loadUsers', id) 
          setPatient({name: "", wallet_address: "", dob: "", email:"", id:""});
          const result = await axios.get("https://rxminter.com/php-react/edit.php?id="+id);
          console.log(result);
          // setPatient(result.data.records);
          setPatient(result.data);
          // navigate('/');
      }


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
        <form onSubmit={e => updateForm(e)}>
              <div className="box_size">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1>Edit Patient: {name} </h1>                                       
                            </div>
                        </div>


                        <div className="row">
                                <div className="col-md-6">Patient Name:</div>
                                <div className="col-md-6">
                                    <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} />   
                                </div>
                        </div>



                            <div className="row">
                                    <div className="col-md-6">Wallet Address:</div>
                                    <div className="col-md-6">
                                        <input type="text" name="wallet_address" className="form-control" value={wallet_address} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-6">DOB:</div>
                                    <div className="col-md-6">
                                      {/* <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />
                                      <input type="date" name="dob" className="form-control" value="1969-06-09" onChange={(e) => handleChange(e)} /> */}
                                        <input type="date" name="dob" className="form-control" value={dob} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-6">Email Address:</div>
                                    <div className="col-md-6">
                                        <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            {/* <div className="row">
                                    <div className="col-md-6">Select Patient Email Test:</div>
                                    
                                    <select className="form-select" aria-label="Default select example" name="email" onChange={(e) => handleChange(e)}>
                                        <option selected>{email}</option>

                                        {patients.map((patient, index) => (
                                                <option value={`${patient.email}`} key={`${index}`}>{patient.email}</option>          
                                        ))}

                                    </select>
                            </div> */}

                        
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning" >Save Changes</button>

                                </div>
                            </div>
                </div>
        </form>

  )
}
export default EditPatient