import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite, ConnectWallet, useOwnedNFTs } from "@thirdweb-dev/react";
// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
//     useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";


import { addyShortner, formatDateTwoDigitYear, formatDateFourDigitYear } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

const PatientHistory = () => {

let navigate = useNavigate();
//   const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
//   const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata and hasPatientRole (5/23/23)

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
    const { id } = useParams();

    const { contract } = useContract(solidityContractAddress)
  



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
        loadUser(); 
        // loadMedications();
        // loadPatients();
        // getPatientRoleString();
    }, [])



      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {name,wallet_address,dob,email} = patient; 

  const address = useAddress(); 
  const audit_address = patient.wallet_address;
  console.log("Audit address:", audit_address)

  const { data: nfts, isLoading: loading } = useOwnedNFTs(contract, audit_address);
  console.log(nfts)
  
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

 
// Add Patient Role - Added 5/22/23 
    // const [patientRole, setPatientRole] = useState("")

    // const getPatientRoleString = async () => {
    //     try{
    //         const dataPatientRole = await contract.call("hasRolePatientString", [wallet_address]);
    //         setPatientRole(dataPatientRole)
    //         console.log('getPatientRoleString returned: ', dataPatientRole)
    //     }catch(err){
    //         console.error("contract call failure", err);
    //     }
    // }

    //     console.log('patient address just outside of getPatientRoleString() is:', wallet_address)
    // getPatientRoleString();

    // const { mutateAsync: addPatient } = useContractWrite(contract, "addPatient")

    // const addPatientRole = async (e) => {
    //     e.preventDefault();
    //   try {
    //     const data = await addPatient({ args: [wallet_address] });
    //         console.info("contract call successs", data);
    //         // setPatientRole(data) receipt.events[0].args.tokenId;
    //         console.log("Target Receipt Transaction:", data.receipt.events[0].getTransaction)
    //         console.log("Target Receipt Status:", data.receipt.status)
    //         // setPatientRole("Patient Role Assigned")
        
    //     getPatientRoleString();

    //   } catch (err) {
    //     console.error("contract call failure", err);
    //   }
    // }

    // const removePatientRole = async (e) => {
    //     e.preventDefault()
    //     try{
    //         const dataRemovePatient = await contract.call("removePatient", [wallet_address]);
    //         console.log('getPatientRoleString returned: ', dataRemovePatient)
            
    //         getPatientRoleString();
    //     }catch(err){
    //         console.error("contract call failure", err);
    //     }
    // }
  


      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadUser = async () => {
          // console.log('ID check inside loadUsers', id) 
        //   setPatient({name: "", wallet_address: "", dob: "", email:"", id:""});
            console.log("id inside loadUser() is:", id)
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




//from: https://www.youtube.com/watch?v=xAqCEBFGdYk
const [search, setSearch] = useState('');
// console.log(search);


  return (

    
    <>

{address ? (
    <>
                            <div className="connect text-center">
                                    <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
                            </div> 

                {/* <div className="row">   */}
                        <div className="col-md-12 text-center">
                            <b>You have connected to Rx Minter With Wallet: {addyShortner(address)}</b>  
                        </div>
                {/* </div> */}
        
        <div className="row">
            <div className="col-md-12 text-center">
                <h1>Cures 3.0 Rx NFT History For: {patient.name}</h1>
                <h5>With Verified Wallet Address: {patient.wallet_address}</h5>
            </div>
        </div>



        
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search For Patient" aria-label="Recipient's username" aria-describedby="basic-addon2"
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

                    <th>Date Filled</th>

                    <th>Patient</th>

                    <th>DOB</th>
                    
                    {/* <th>Wallet Address</th> */}
                    
                    <th>Medication</th>                  

                    <th>Qty</th>

                    <th>Qty Filled</th>
                   
                    <th>Prescribing Doctor</th>

                    <th>DEA #</th>

                    <th>Rx #</th>
                </tr> 
            </thead>
            <tbody className="table-striped">
             {/* <tr key={`${index}`}> */}
             {/* {nfts?.map((nft, index) => ( */}

            {nfts?.filter((nft) => {
               return search.toLowerCase() === '' ? nft : nft.metadata.name.toLowerCase().includes(search) || nft.metadata.attributes[0].value.toLowerCase().includes(search)
            }

            ).map((nft, index) => (

            
                    <tr key={`${index}`}>
                        <td style={{display: "none"}}>{index+1}</td>

                        {nft.metadata.attributes[3].value != 0 ? (                       
                            <td className="text-center"><Link className="btn btn-primary" to={`/prescription-history/${nft.metadata.id}`}>{nft.metadata.attributes[6].value}</Link></td>
                        ) : (
                            <td className="text-center">{nft.metadata.attributes[6].value}</td>
                        )}

                        <td>{nft.metadata.name}</td>

                        <td>{formatDateFourDigitYear(nft.metadata.attributes[1].value)}</td>
                        
                        {/* <td>{patient.wallet_address.slice(0,5)}...{patient.wallet_address.slice(37)}</td> */}

                        <td>{nft.metadata.attributes[0].value}</td>

                        

                        <td>{nft.metadata.attributes[2].value}</td>

                        <td className="text-center">{nft.metadata.attributes[3].value}</td>

                       

                        {nft.metadata.id != 10 && nft.metadata.id != 4 ? (
                            <td>Dr. Jorge J. Rucker, M.D.</td>
                        ) : (
                            <td>Dr. Marshawneous D. Lynch, M.D.</td>                     
                        )}

                        {nft.metadata.id != 10 && nft.metadata.id != 4 ? (
                            <td>HMD-696969</td>
                        ) : (
                            <td>HMD-000000</td>                     
                        )}
                    
                        <td>{nft.metadata.id}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
        ) : (
            <>
                    
                    <div className="box_size_login text-center" style={{background:"#444943"}}>
                            <h2 style={{color:"white"}}>Please connect your MetaMask Wallet</h2>
                            <div className="connect text-center">
                                    <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
                            </div>                   

                    </div>
            </>
        )}

    {/* </div> */}
    
</>





  )
}
export default PatientHistory