import "../styles/App.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../styles/App.css";

const AddPatient = () => {
// export default function AddPatient() {

    let history = useNavigate(); 

// Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
    const [patient, setPatient] = useState({
        name: "",
        wallet_address: "",
        email:""
    });

    // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
    const {name,wallet_address,email} = patient; 

    const handleChange=(e)=>{
        setPatient({...patient,[e.target.name]: e.target.value })
        // console.log(e);
        console.log(patient);
    }

    const submitForm = async (e) => {
        e.preventDefault(); 

        console.log(patient);

        // https://rxminter.com/php-react/phpmysql-student-crud/insert.php
        await axios.post("https://rxminter.com/php-react/insert.php", patient).then((result)=>{
            console.log(result);

            // history('/');
            if(result.data.status =='valid'){
                history('/');
            }else{
                alert('There is a problem saving this patient to the database. Please try again.');
            }
        });

    }

  return (
    <>
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-12 text-center">
                <h1>Add Patient</h1>
                        
            </div>
        </div>

        <form onSubmit={e => submitForm(e)}>
        {/* <form onSubmit={submitForm}> */}
                    <div className="box_size">
                            <div className="row">
                                    <div className="col-md-6">Patient Name:</div>
                                    <div className="col-md-6">
                                        <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            {/* <div className="row">
                                    <div className="col-md-6">Patient Name:</div>
                                    <select className="form-select" aria-label="Default select example" name="name" value={name} onChange={e => handleChange(e)}>
                                        <option selected>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                            </div> */}

                            <div className="row">
                                    <div className="col-md-6">Wallet Address:</div>
                                    <div className="col-md-6">
                                        <input type="text" name="wallet_address" className="form-control" value={wallet_address} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-6">Email:</div>
                                    <div className="col-md-6">
                                        <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                        
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning" >Add Patient</button>

                                </div>
                            </div>
                    </div>
        </form>
    </div>                       
    </>
  )
}
export default AddPatient