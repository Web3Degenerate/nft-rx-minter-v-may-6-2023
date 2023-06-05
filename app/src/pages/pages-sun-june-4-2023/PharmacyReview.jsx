import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/ViewScripts.css";
import 'bootstrap/dist/css/bootstrap.css';
// import "../styles/App.css";

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead, useContractEvents } from "@thirdweb-dev/react";

    import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, formatDateTwoDigit } from '../utils'
    import { solidityContractAddress } from '../constants'
  
  import { ethers } from 'ethers';



const PharmacyReview = () => {

    let navigate = useNavigate();

    // From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
    const { id } = useParams();

    // const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.  
    // const { contract } = useContract("0x92525216C74e3B5819e487Bef564e12845BafdB2"); // 11.5 - Fix SVG uint, Events, Roles (5/20/23)
    // const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
    const { contract } = useContract(solidityContractAddress); // 12.4 -  (5/29/23)


    const tokenId = id;
    const { data: nftz } = useNFT(contract, tokenId);

    console.log("nftz from useNFT() is:", nftz)

    // ***********************************

    const address = useAddress(); 

      const { data: nfts } = useOwnedNFTs(contract, address);
      console.log(nfts)

//********************************************************* */
    const [pharmacy, setPharmacy] = useState({
        pharmacy_name: "",
        pharmacy_wallet: "",
        pharmacy_phone:"",
        pharmacy_fax:"",
        pharmacy_address:"",
        id:""
    });

    useEffect(()=> {   
        loadPharmacyByAddress(); 
        // loadEditPharmacy(); 
        // loadMedications();
        // getDob();
      }, [])

    const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_address} = pharmacy;

    const loadPharmacyByAddress = async () => {
        // console.log('ID check inside loadUsers', id) 
      //   setPharmacy({pharmacy_name: "", pharmacy_wallet: "", pharmacy_phone:"", pharmacy_fax: "", pharmacy_address:"", id:""});
        const result = await axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+address);
        console.log("loadPharmacyByAddress fetched:", result);
        // setPatient(result.data.records);
        setPharmacy(result.data);
        // navigate('/');
    }


// ******** 'getMax' GET "MAX Pills PER DAY" Temporarily 'getPatientPhysicalAddress' ***********************************      
const [getMax,setGetMax] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getMaxPillsPerDay = async (tokenId) => {   
  try{       
          const data = await contract.call("getPatientPhysicalAddress", [tokenId]);

          console.log("getPatientPhysicalAddress fn call returned:", data);
          // setGetDober(data.toString())
          setGetMax(data)
  } catch (error) {
          console.log("Unable to fetch getDob", error)
  }
 
}
getMaxPillsPerDay(tokenId)


// ******** 'getQuantity' GET "TOTAL PRESCRIBED BY DOC" ***********************************      
const [getQuantity,setGetQuantity] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getQuantityPrescribed = async (tokenId) => {   
  try{       
          const data = await contract.call("getQuantity", [tokenId]);

          console.log("getQuantityPrescribed fn call returned:", data);
          // setGetDober(data.toString())
          setGetQuantity(data.toNumber())
  } catch (error) {
          console.log("Unable to fetch getQuantityPrescribed", error)
  }
 
}
getQuantityPrescribed(tokenId)


// ******** 'getQuantityFilled' GET "Pills Filled on Current Prescription" ***********************************      
const [getQuantityFilled,setGetQuantityFilled] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getQuantityFill = async (tokenId) => {   
  try{       
          const data = await contract.call("getQuantityFilled", [tokenId]);

          console.log("getQuantityFilled fn call returned:", data);
          // setGetDober(data.toString())
          setGetQuantityFilled(data.toNumber())
  } catch (error) {
          console.log("Unable to fetch getQuantityFilled", error)
  }
 
}
getQuantityFill(tokenId)


// ******** 'getQuantityFilled' GET "Pills Filled on Current Prescription" ***********************************      
const [getDateNextFill,setGetDateNextFill] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getNextFillDate = async (tokenId) => {   
  try{       
          const data = await contract.call("getDateNextFill", [tokenId]);

          console.log("getDateNextFill fn call returned:", data);
          // setGetDober(data.toString())
          setGetDateNextFill(data)
  } catch (error) {
          console.log("Unable to fetch getDateNextFill", error)
  }
 
}
getNextFillDate(tokenId)


// ******** GET DOB ***********************************      
    const [getDober,setGetDober] = useState('')
      // Your NFT collection contract address
    //   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";
   
      const getDob = async (tokenId) => {   
        try{       
                const data = await contract.call("getDob", [tokenId]);

                console.log("getDob fn call returned:", data);
                // setGetDober(data.toString())
                setGetDober(data)
        } catch (error) {
                console.log("Unable to fetch getDob", error)
        }
       
      }

 //*****************************  Get Medication String From congtract 'getMedication' function  ******************************************************************* */
    const [getMedication, setGetMedication] = useState([])
    const getMedicationString = async (id) => {
        try{
            
            const data = await contract.call("getMedication", [id]);
                console.log("getMedication fn call returned:", data);
                // setGetDober(data.toString())
                setGetMedication(data)
        } catch (error) {
            console.log("Error from getMedication K Call:", error)
        }
    }
      
      getMedicationString(id);
 //***************************************************************************************************** */
      
      

// Fill && Send Buttons:
    const [showSendButton,setShowSendButton] = useState('none')
    const [showFillButton,setShowFillButton] = useState('block')
    

// ******************** TRANSFER BACK TO PATIENT ***************************************** //


const [rxWallet, setRxWallet] = useState({
    tokenId: '', 
    rxWallet: ''
  });

  const inputTokenId = useRef(); 
  const inputPharmacyWallet = useRef('');

//   const inputPillsFilled = useRef();
//   const inputDateFilled = useRef();
//   const inputDateNextFill = useRef();
  // const inputTokenId = useRef();


  //probably won't use:
  const handleChange=(e, id)=>{
    setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id })
    // console.log(e);
    console.log('handleChange just updated:',rxWallet);
}


const handleSubmitTransferToPatient = async (e) => { 

    e.preventDefault();
  
    console.log("handleSubmitTransferToPatient event value:", e)
    // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
    
    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${rxWallet.rxWallet} `) == true){
    //   await _safeTransferFromToPharmacy({ ...rxWallet })
    // }
  
    // let tokenId_Ref = inputTokenId.current.value;
  
    // if (confirm(`Process Rx Fulfillment for Prescription NFT # ${tokenId_Ref} `) == true){
    // if (confirm(`Process Rx Fulfillment for Prescription NFT # ${rxWallet.tokenId} `) == true){  
    if (confirm(`Press OK to Send this Prescription NFT #${id} to Patient ${nftz?.metadata.name}`) == true){          
      await transferPharmacyToPatient()
    }
      
  }


  const transferPharmacyToPatient = async (rxWallet) => {  
      try {
   
  //********************* ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */
  
  // VERSION 11.0 PATIENT TRANSFER:
                // const data = await contract.call("safeTransferFrom", [address, nftz?.metadata.patientaddress, id]);
                const data = await contract.call("transferPharmacyToPatientRoles", [address, nftz?.metadata.attributes[4].value, id]);
                
  // VERSION 11.2 PATIENT TRANSFER
                // const data = await contract.call("transferPharmacyToPatient", [address, rxWallet.rxWallet, rxWallet.tokenId]);
            
                console.log("NFT Sent to Selected Pharmacy with response:", data);
        
                alert(`Success! The NFT Prescription has been sent back to the patient at address ${nftz?.metadata.attributes[4].value}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
                // setRxWallet({ tokenId: '', rxwallet: '' })
                navigate('/pharmacy-dashboard');
  
  //********************* --END OF -- ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */
  

                // setTestNet(sendRx.receipt.transactionHash);
        
                // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-2);
                // let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;
        
                // setOpenSeaURL(getOpenSeaURL)
                // setSuccess('block')
               
        } catch (error) {
                console.log("contract call failure", error)
                alert("The NFT Prescription has NOT been sent back to the patient.  Please try again or contact Rx Minter's Support Team located in Palau.");
                // alertService.error(`Error with error message of ${error} :(`, options);
        }
  
  
  }



  // ******************** UPDATE QTY FILLED AND DATE ***************************************** //

  const inputDateFilled = useRef()
  const inputPillsFilled = useRef()

  const handleSubmitUpdateFilled = async (e) => { 
    e.preventDefault();  
        console.log("handleSubmitUpdateFilled submit event value:", e)

        let diplayPillsFilled = inputPillsFilled.current.value;
        let displayDateFilled = formatDateCard(inputDateFilled.current.value);

    if (confirm(`Would you like to Proceed Filling Prescription NFT #${id} for ${nftz?.metadata.name} on ${displayDateFilled} for medication ${getMedication} in the quantity of ${diplayPillsFilled}?`) == true){  
      await updateScriptQuantityAndDates()
    }
      
  }

// **************************** CHAT GPT HELPER FUNCTION FOR OUR DATE STRING IN v.11.5 ************************************
    const formatDateCard = (dateValue) => {
        // Assuming string from the input field dateValue = '2023-05-19';
            // let dateValue = String(date);
        // Split the date value by the hyphen
            const [year, month, day] = dateValue.split('-');
        // Create a new Date object using the extracted values
            const formattedDate = new Date(year, month - 1, day);
        // Format the date as mm/dd/YY
            const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString().slice(-2)}`;
            return formattedDateString; // Output: 05/19/23
    }

   const getNextFillDateOriginal = (dateValue) => {
    // Assuming dateValue = '2023-05-19';
        // Create a new Date object using the date value
        const originalDate = new Date(dateValue);
        // Add 30 days to the original date      
        const modifiedDate = new Date(originalDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        // Format the modified date as YYYY-mm-dd
        const modifiedDateString = modifiedDate.toISOString().split('T')[0];
        return formatDateCard(modifiedDateString);
   }



  const { data: fillEvents, isLoading: isLoadingFillEvents } = useContractEvents(
      contract,
      "UpdateScriptQuantityAndDatesEvent",
      {
          queryFilter: {
              filters: {
                  script_token_number: id
                  // script_token_number: id,
                  // patient_address: '0xE3cEA19e68430563f71C591390358e54d1fa857a'
                  // patient_address: "0xE3cEA19e68430563f71C591390358e54d1fa857a"
              },
              order: "desc",
          }
      }
  )


   const getNextFillDateQuantity = (dateValue, pillsFilled) => {
    // Assuming dateValue = '2023-05-19';

    let maxPillsPerDay = getMaxPillsPerDay(tokenId);
    let daysCalc = pillsFilled / maxPillsPerDay;
        // Create a new Date object using the date value
        const originalDate = new Date(dateValue);
        // Add 30 days to the original date
        // const modifiedDate = new Date(originalDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        const modifiedDate = new Date(originalDate.getTime() + (daysCalc * 24 * 60 * 60 * 1000));


        // Format the modified date as YYYY-mm-dd
        const modifiedDateString = modifiedDate.toISOString().split('T')[0];
        return formatDateCard(modifiedDateString);
   }




    const updateScriptQuantityAndDates = async () => {
        // const _safeTransferFromToPharmacy = async () => { 
        // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
  
    try {
        
            let pills_filled_Ref = inputPillsFilled.current.value;
            
            let date_filled_Ref = formatDateCard(inputDateFilled.current.value);
            let date_next_fill_Ref = getNextFillDateOriginal(inputDateFilled.current.value);
    
            // const data = await contract.call("updateScriptQuantityAndDates", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);
 //v12.5 pass in pharmacy_name        
            const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref, pharmacy_name]);

     
            console.log("RX NFT Has Been Filled As Follows:", data);
  
            alert(`Success! Quantity of ${pills_filled_Ref} pills on ${date_filled_Ref} has been recorded. Next refill date is ${date_next_fill_Ref}.`);
            setShowSendButton("block")
            setShowFillButton('none')
            // inputPillsFilled.current.value = '';
            // inputDateFilled.current.value = currentDate;
    } catch (error) {
            console.log("contract call failure", error)
            alert("CONTRACT CALL FAILURE. REASON: You must have a Pharmacy Role to update this NFT.");
    }
  
  
  }

  



// **************************** CHAT GPT HELPER FUNCTION FOR OUR DATE STRING IN v.11.5 ************************************
   const displayDateCard = (date) => {
    getDob(tokenId);
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
        let dateValue = String(date);
    // Split the date value by the hyphen
        const [year, month, day] = dateValue.split('-');
    // Create a new Date object using the extracted values
        const formattedDate = new Date(year, month - 1, day);
    // Format the date as mm/dd/YY
        const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString()}`;
        return formattedDateString; // Output: 05/19/23
}

  const [showFinishedWorking, setShowFinishedWorking] = useState('none')
   
  const handleContinueWorking = (e) => {
    e.preventDefault();  
    setShowFillButton('block')
    setShowSendButton('none')
    setShowFinishedWorking('block')
    inputPillsFilled.current.value = '';
    inputDateFilled.current.value = currentDate;
    navigate(`/pharmacy-review-nft/${id}`)
  }

  const handleFinishedWorking = (e) => {
    e.preventDefault();
    setShowFillButton('none')
    setShowSendButton('block')
    setShowFinishedWorking('none')
  }

  let currentDate = new Date().toJSON().slice(0, 10);

  return (
<>

        <div className="view-single-scripts-card">
            <h1 style={{color:"white"}}>Manage Prescription #{id} for {nftz?.metadata.name}</h1>
            <h5 style={{color:"white"}}>For {pharmacy_name}</h5>
                <div className="view-single-scripts-card">

                        <div className="card" style={{width: "18rem;"}}>
                            {/* <img className="card-img-top view-scripts-image" src={nftz?.metadata.image} alt="Card image cap" /> */}
                            <img className="card-img-top view-single-script-image" src={nftz?.metadata.image} alt="Card image cap" />
                            <div className="card-body">
                                <h5 className="card-title">Patient: {nftz?.metadata.name} | DOB: {formatDateFourDigitYear(nftz?.metadata.attributes[1].value)}</h5>
                                <ul className="list-group list-group-flush">
                                    {/* <li className="list-group-item">Medication: {nftz?.metadata.medication}</li> */}
                                    {/* <li className="list-group-item">Medication: {getMedication}</li> */}
                                    <li className="list-group-item">Medication: {nftz?.metadata.attributes[0].value}</li>                                  
                                    <li className="list-group-item">Qty Prescribed: {nftz?.metadata.attributes[2].value} | Qty Filled: {nftz?.metadata.attributes[3].value}  | Qty Unfilled: {nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value} </li>
                                    <li className="list-group-item">SIG: {nftz?.metadata.description}</li>
                                    <li className="list-group-item">Date Prescribed: {formatDateFourDigitYear(nftz?.metadata.attributes[5].value)}</li>
                                    {/* <li className="list-group-item">Date Prescribed: {formatDateCard(nftz?.metadata.datePrescribed)}</li> */}
                                </ul>
                                
                                {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}

                                <form onSubmit={e => handleSubmitUpdateFilled(e)}>  
                                            <div className="row">
                                                    <div className="col-6">
                                                        <label>Quantity Filled:</label>
                                                        <input type="number" name="quantityFilled" className="form-control" 
                                                            max={nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value}                                                 
                                                            placeholder="enter amount"
                                                            // onChange={(e) => handleChange(e)}
                                                            ref={inputPillsFilled}
                                                        />
                                                    </div>

                                                    <div className="col-6">
                                                        <label>Date Filled:</label>
                                                        <input type="date" name="dateFilled" className="form-control" defaultValue={currentDate} ref={inputDateFilled} />
                                                    </div>
                                            </div>
                                        <br></br>
                               
                                                <div className="text-center" style={{display:`${showFillButton}`}}>                                       
                                                    {/* <button type="submit" className="btn btn-primary">Fill {getMedication}</button> */}
                                                    <button type="submit" className="btn btn-primary">Fill {nftz?.metadata.attributes[0].value}</button>
                                                    
                                                </div>

                                                <div className="card-footer text-center" style={{display:`${showFinishedWorking}`}}> 
                                                    <button className="btn btn-danger" onClick={(e) => handleFinishedWorking(e)}>Cancel Edit and Send Rx</button>
                                                </div>
                                </form>
                          
                            </div>{/* END OF CARD BODY */}
                                
                                    <div className="card-footer text-center" style={{display:`${showSendButton}`}}>  
                                        <form onSubmit={e => handleSubmitTransferToPatient(e)}>
                                            <button type="submit" className="btn btn-success">Send Rx Back To {nftz?.metadata.name}</button>
                                        </form>
                                        <br></br>
                                        {nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value !== 0 &&
                                            <button className="btn btn-warning" onClick={(e) => handleContinueWorking(e)}>Continue Working on Rx</button>
                                        }
                                    </div>
                            
                        </div>
                </div>
        </div>

        
</>
    



  )
}
export default PharmacyReview