import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";



const EditPharmacy = () => {

  let navigate = useNavigate();

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
  const { id } = useParams();

  // console.log('id check', id);

  // Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
      const [pharmacy, setPharmacy] = useState({
          pharmacy_name: "",
          pharmacy_wallet: "",
          pharmacy_phone:"",
          pharmacy_fax:"",
          pharmacy_address:""
      });
  
    //   const [medication, setMedication] = useState([]);
      const [patients, setPatients] = useState([]);
      // const [medication, setMedication] = useState({
      //     name: "",
      //     sig: "",
      //     strength:"",
      //     quantity:""
      // });

    useEffect(()=> {    
        loadEditPharmacy(); 
        // loadMedications();
        loadViewPharmacy();
    }, [])

      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_address} = pharmacy; 
  
      const handleChange=(e)=>{
          setPharmacy({...pharmacy,[e.target.name]: e.target.value })
          // console.log(e);
          console.log(pharmacy);
      }
  
      const updateForm = async (e) => {
          e.preventDefault(); 
  
          console.log(pharmacy);
  
          await axios.post("https://rxminter.com/php-react/update-pharmacy.php", pharmacy).then((result)=>{
              console.log(result);

              if(result.data.status =='valid'){
                  navigate('/');
              }else{
                  alert('There is a problem saving this patient to the database. Please try again.');
              }
          });
      }

   

      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadEditPharmacy = async () => {
          // console.log('ID check inside loadUsers', id) 
        //   setPharmacy({name: "", wallet_address: "", email:"", id:""});
          const result = await axios.get("https://rxminter.com/php-react/edit-pharmacy.php?id="+id);
          console.log(result);
          // setPatient(result.data.records);
          setPharmacy(result.data);
          // navigate('/');
      }


// 5:10pm R 5/4/23: Load all medications: 
    //   const loadMedications = async () => {
    //     setMedication([]);   
    //     const result = await axios.get("https://rxminter.com/php-react/viewmeds.php");
    //     console.log(result);
    //     setMedication(result.data.meds);
    //     // navigate('/');
    //   }



      const loadViewPharmacy = async () => {
        setPharmacy([]);   
        const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
        console.log(result);
        setPharmacy(result.data.records);
        // navigate('/');
    }

  return (
        <form onSubmit={e => updateForm(e)}>
              <div className="box_size">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1>Edit Pharmacy: {pharmacy_name}</h1>                                       
                            </div>
                        </div>


                        <div className="row">
                                <div className="col-md-3">Pharmacy Name:</div>
                                <div className="col-md-9">
                                    <input type="text" name="pharmacy_name" className="form-control" value={pharmacy_name} onChange={(e) => handleChange(e)} />   
                                </div>
                        </div>



                            <div className="row">
                                    <div className="col-md-3">Wallet Address:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_wallet" className="form-control" value={pharmacy_wallet} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_phone" className="form-control" value={pharmacy_phone} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Fax:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_fax" className="form-control" value={pharmacy_fax} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Address:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_address" className="form-control" value={pharmacy_address} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>
                        
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning" >Save Changes To Pharmacy</button>

                                </div>
                            </div>
                </div>
        </form>

  )
}
export default EditPharmacy