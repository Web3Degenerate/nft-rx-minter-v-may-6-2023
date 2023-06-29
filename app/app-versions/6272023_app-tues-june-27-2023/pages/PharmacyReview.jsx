import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/ViewScripts.css";
import 'bootstrap/dist/css/bootstrap.css';
// import "../styles/App.css";

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead, useContractEvents } from "@thirdweb-dev/react";

    import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, formatDateTwoDigit, 
      convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear, convertNumberDateToTwoDigitString, convertBigNumberToRawString } from '../utils'
    import { solidityContractAddress } from '../constants'
  
  import { ethers } from 'ethers';
import { number } from "prop-types";



const PharmacyReview = () => {

    let navigate = useNavigate();

    // From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
    const { id } = useParams();

    // const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.  
    // const { contract } = useContract("0x92525216C74e3B5819e487Bef564e12845BafdB2"); // 11.5 - Fix SVG uint, Events, Roles (5/20/23)
    // const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
    const { contract } = useContract(solidityContractAddress); // 12.4+ -  (5/29/23)


    const tokenId = id;
    const { data: nftz } = useNFT(contract, tokenId);

    // console.log("nftz from useNFT() is:", nftz)

    // ***********************************

    const address = useAddress(); 

      // const { data: nfts } = useOwnedNFTs(contract, address);
      // console.log(nfts)

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
      }, [pharmacy])



    const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_address} = pharmacy;
    const pharmacy_name_constant = pharmacy.pharmacy_name;

    const loadPharmacyByAddress = async () => {
        // console.log('ID check inside loadUsers', id) 
      //   setPharmacy({pharmacy_name: "", pharmacy_wallet: "", pharmacy_phone:"", pharmacy_fax: "", pharmacy_address:"", id:""});
        const result = await axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+address);
        // console.log("loadPharmacyByAddress fetched:", result);
        // setPatient(result.data.records);
        setPharmacy(result.data);
        // navigate('/');
    }
    
    if(pharmacy.pharmacy_name == null) {loadPharmacyByAddress()}
    // loadPharmacyByAddress();
 

    const maxPillsPerFuckingDay = nftz?.metadata.attributes[14].value;
    const getDateOringinallyFuckingFilled = nftz?.metadata.attributes[6].value;
    const getFuckingQuantityFilled = nftz?.metadata.attributes[3].value;
    const patientMedication = nftz?.metadata.attributes[0].value;

    let initialNextFillDate;
    if (nftz?.metadata.attributes[6].value == 0) {
      let initialNextFillDate = 'N/A!'
    }else{
      let initialNextFillDate = convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[11].value);
    }

    const [updatedNextFillDate, setUpdatedNextFillDate] = useState('');


// ******** 'getMax' GET "MAX Pills PER DAY" Temporarily 'getPatientPhysicalAddress' ***********************************      
const [getMax,setGetMax] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getMaxPillsPerDay = async (tokenId) => {   
  try{       
          // const data = await contract.call("getPatientPhysicalAddress", [tokenId]);
          const data = await contract.call("getPerDiemMax", [tokenId]);

          // const { data } = useContractRead(contract, "getPatientPhysicalAddress", [tokenId])

          console.log("getMax state is:", data);
          console.log(typeof data)
          // setGetMax(data.toNumber())
          // setGetDober(data.toString());
          setGetMax(data)
  } catch (error) {
          console.log("Unable to fetch getMax", error)
  }
 
}
// getMaxPillsPerDay(tokenId)


// ******** 'getQuantity' GET "TOTAL PRESCRIBED BY DOC" ***********************************      
const [getQuantity,setGetQuantity] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getQuantityPrescribed = async (tokenId) => {   
  try{       
          const data = await contract.call("getQuantity", [tokenId]);

          console.log("getQuantityPrescribed fn call returned:", data);
          // setGetDober(data.toString())
          // setGetQuantity(data.toNumber())
          setGetQuantity(data)
  } catch (error) {
          console.log("Unable to fetch getQuantityPrescribed", error)
  }
 
}
// getQuantityPrescribed(tokenId)


// ******** 'getQuantityFilled' GET "Pills Filled on Current Prescription" ***********************************      
const [getQuantityFilled,setGetQuantityFilled] = useState('')
// Your NFT collection contract address
//   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";

const getQuantityFill = async (tokenId) => {   
  try{       
          const data = await contract.call("getQuantityFilled", [tokenId]);

          console.log("getQuantityFilled fn call returned:", data);
          // setGetDober(data.toString())
          // setGetQuantityFilled(data.toNumber())
          setGetQuantityFilled(data)

  } catch (error) {
          console.log("Unable to fetch getQuantityFilled", error)
  }
 
}
// getQuantityFill(tokenId)


// ******** 'getDateNextFill' GET "Pills Filled on Current Prescription" ***********************************      
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
// getNextFillDate(tokenId)


// ******** GET DOB ***********************************      
    const [getDateLastFilled,setGetDateLastFilled] = useState('')
      // Your NFT collection contract address
    //   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";
   
      const getDateFilled = async (tokenId) => {   
        try{       
                const data = await contract.call("getDateFilled", [tokenId]);

                console.log("getDateLastFilled state is:", data);
                // setGetDober(data.toString())
                setGetDateLastFilled(data.toString())
        } catch (error) {
                console.log("Unable to fetch getDateLastFilled", error)
        }
       
    }
    // getDateFilled(tokenId)

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
      
      // getMedicationString(id);
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

  const [dynamicSetFillDate, setDynamicSetFillDate] = useState('N/A')
  const dynamicFillDateRef = useRef('N/A')
  const dynamicNextFillRef = useRef()
  const overrideNextFillRef = useRef()
  
  const [currentFillDate, setCurrentFillDate] = useState('N/A')
  const [updateScriptStatus, setUpdateScriptStatus] = useState('pending')



  const inputDateFilled = useRef()
  const inputPillsFilled = useRef()

  const [showOverrideButton, setShowOverrideButton] = useState('none')

// ******************** UPDATE QTY FILLED AND DATE ***************************************** //

// #handleSubmit

  const handleSubmitUpdateFilled = async (e) => { 
    e.preventDefault();  
        console.log("handleSubmitUpdateFilled submit event value:", e)

        // updateNextGodDamnFuckingFillDay();

// ****************** CALCULATE NEXT FILL DAY FIRST *********************************************** //
      
            
  // let date_filled_Ref = formatDateCard(inputDateFilled.current.value);
  // let date_filled_Ref = inputDateFilled.current.value;

  // // const nextGodDamnFillDate = await calcNextFillDate();

      let pills_filled_Ref = inputPillsFilled.current.value;
      // let quantity_filled_int = parseInt(getQuantityFilled)
      let quantity_filled_int = parseInt(nftz?.metadata.attributes[3].value)

      let pills_filled_Ref_int = parseInt(pills_filled_Ref);

      let totalPillsFilled = quantity_filled_int + pills_filled_Ref_int;
      console.log('totalPillsFilled is: ', totalPillsFilled)
      let date_next_fill_Ref;

      // let get_Quantity_int = parseInt(getQuantity)
      let get_Quantity_int = parseInt(nftz?.metadata.attributes[3].value)

      let nextGodDamnFillDate;
      let fillDateSelectedByPharmacist = inputDateFilled.current.value;

      if(overrideNextFillRef.current.value == ''){
            if(get_Quantity_int - totalPillsFilled == 0){ 
                  // if(getDateLastFilled == 'N/A'){
// Version 12.6
                  // if(nftz?.metadata.attributes[6].value == 'N/A'){
// Version 13.0: 
                  if(nftz?.metadata.attributes[6].value == 0){
                      let nextGodDamnFillDate = await getNextFillDateCompleteFirstFill(fillDateSelectedByPharmacist, pills_filled_Ref)
                      setUpdatedNextFillDate(nextGodDamnFillDate)
                
                      dynamicNextFillRef.current = nextGodDamnFillDate;
                      // this.setUpdatedNextFillDate(nextGodDamnFillDate)
                      // this.setState(setUpdatedNextFillDate(nextGodDamnFillDate))
                  }else{
                      let nextGodDamnFillDate = await getNextFillDateCompleteSecondFill(fillDateSelectedByPharmacist, pills_filled_Ref)
                      setUpdatedNextFillDate(nextGodDamnFillDate)
                
                      dynamicNextFillRef.current = nextGodDamnFillDate;
                      // this.setUpdatedNextFillDate(nextGodDamnFillDate)
                      // this.setState(setUpdatedNextFillDate(nextGodDamnFillDate))
                  }
            }else{
// Version 12.6
                  // if(nftz?.metadata.attributes[6].value == 'N/A'){
// Version 13.0: 
                if(nftz?.metadata.attributes[6].value == 0){
                    let nextGodDamnFillDate = await getNextFillDatePartialFirstFill(fillDateSelectedByPharmacist, pills_filled_Ref)
                    setUpdatedNextFillDate(nextGodDamnFillDate)
              
                      dynamicNextFillRef.current = nextGodDamnFillDate;
                    // this.setUpdatedNextFillDate(nextGodDamnFillDate)
                      // this.setState(setUpdatedNextFillDate(nextGodDamnFillDate))
                }else{
                    let nextGodDamnFillDate = await getNextFillDatePartialSecondFill(fillDateSelectedByPharmacist, pills_filled_Ref)
                    setUpdatedNextFillDate(nextGodDamnFillDate)
                
                      dynamicNextFillRef.current = nextGodDamnFillDate;
                    // this.setUpdatedNextFillDate(nextGodDamnFillDate)
                      // this.setState({updatedNextFillDate})
                }
            }
      }else{
        let yoMama = overrideNextFillRef.current.value;
        dynamicNextFillRef.current = yoMama;
      }

// ****************** END OF CALCULATE NEXT FILL DAY FIRST *********************************************** //
if(get_Quantity_int - totalPillsFilled == 0){
  setUpdateScriptStatus('complete');
}else{
  setUpdateScriptStatus('pending');
}



// end up update script status on Utils Struct

        let displayDateFilled = formatDateCard(inputDateFilled.current.value);
        let date_filled_Ref = inputDateFilled.current.value;
        
// Version 12.6
    // if(nftz?.metadata.attributes[6].value == 'N/A'){
// Version 13.0: 
    if(nftz?.metadata.attributes[6].value == 0){ 
      setDynamicSetFillDate(date_filled_Ref);
      // dynamicFillDateRef = inputDateFilled.current.value;
      dynamicFillDateRef.current = date_filled_Ref;
              
    }else{
      setDynamicSetFillDate(nftz?.metadata.attributes[6].value)
      // dynamicFillDateRef.current = nftz?.metadata.attributes[6].value;
      dynamicFillDateRef.current = convertBigNumberToRawString(nftz?.metadata.attributes[6].value);
             
    }


    // if(nftz?.metadata.attributes[6].value == 'N/A'){
    //   let date_filled_Ref = inputDateFilled.current.value;
    //   setCurrentFillDate(date_filled_Ref)
    // }else{
    //   let date_filled_Ref = inputDateFilled.current.value;
    //   setCurrentFillDate(date_filled_Ref)
    // }


    // if(updatedNextFillDate == 'N/A') {updateNextGodDamnFuckingFillDay()}
    // if(dynamicSetFillDate == 'N/A') {updateNextGodDamnFuckingFillDay()}


          // dynamicFillDateRef.current  dynamicSetFillDate
          // dynamicNextFillRef.current  updatedNextFillDate
    

    // if (confirm(`Would you like to Proceed Filling Prescription NFT #${id} for ${nftz?.metadata.name} on ${displayDateFilled} for medication ${patientMedication} in the quantity of ${pills_filled_Ref}? Next fill date set for ${dynamicNextFillRef.current} and first date filled ${dynamicFillDateRef.current}`) == true){  
    //   // await updateScriptQuantityAndDates()
    //   updateScriptQuantityAndDates()
    // }else{
    //   alert('hi mom')
    // }


    if (confirm(`Pharmacist Note: Confirm Next Refill Date is ${formatDateTwoDigitYear(dynamicNextFillRef.current)}
    If not, press Cancel and you will be prompted to override this date.
    
    Click OK to proceed filling Prescription NFT #${id} for ${nftz?.metadata.name} 
    on ${displayDateFilled} for medication ${patientMedication} in the 
    quantity of ${pills_filled_Ref}.`) == true){  
      // await updateScriptQuantityAndDates()
      updateScriptQuantityAndDates()
    }else{
      alert(`To override ${formatDateTwoDigitYear(dynamicNextFillRef.current)} as the Next Refill Date click okay and use the Pharmacy Manual Entry Date Field Below to set the correct Next Refill Date on the blockchain.`)
      setShowOverrideButton('block')
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
                                //today, previous day
   const getDaysBetweenDates = (dateStringToday, dateStringPreviousFill) => {

    if (dateStringToday == 'N/A'){return 0}
    const date1 = new Date(dateStringToday); // Today 6/8/23
    const date2 = new Date(dateStringPreviousFill); // Previous 6/1/23
  
    // Calculate the time difference in milliseconds
    const timeDifference = date1.getTime() - date2.getTime();
  
    // Convert milliseconds to days (milliseconds * seconds * minutes * hours)
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    return daysDifference;
  }
  
  // Usage example
  // const startDate = "2022-01-10";
  // const endDate = "2022-02-05";
  
  // const daysBetween = getDaysBetweenDates(startDate, endDate);
  // console.log('chatgpt days diff: ',daysBetween); // Output: 26

// ****************************((((((((((((((((((  COMPLETE FILLS ))))))))))))))))))**************** //

// useEffect(()=> {   
//   doSomething(); 
// }, [updatedNextFillDate])

   // pass in inputDateFilled, inputPillsFilled
  const getNextFillDateCompleteFirstFill = (dateValue, fillQty) => {
          // Assuming dateValue = '2023-05-19';
          let fillQtyInt = parseInt(fillQty)

// let numberOfDays = Math.floor(fillQtyInt/getMax);
// let numberOfDays = Math.floor(fillQtyInt/maxPillsPerFuckingDay);
          let numberOfDays = fillQtyInt/maxPillsPerFuckingDay;

          
          console.log("numberOfDays in Complete First Fill is: ", numberOfDays)

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
        // numberOfDays
        // fillQtyInt or adjustedFillQty
        // perDiemMaxInt

        if(numberOfDays < 1){ 
          // numberOfDays += 1
          numberOfDays = Math.ceil(numberOfDays);
          console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
        }

        if(numberOfDays > 1){
          // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
          numberOfDays = Math.ceil(numberOfDays);
        }

        if(fillQtyInt % perDiemMaxInt === 0){
          numberOfDays += 1
          console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
        }

          console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //          


          // // Create a new Date object using the date value
          // const originalFillDate = new Date(dateValue);
          // // Add numberOfDays days to the original date
          // // const modifiedDate = new Date(originalFillDate.getTime() + (30 * 24 * 60 * 60 * 1000));
          // const modifiedFillDate = new Date(originalFillDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
          // // Format the modified date as YYYY-mm-dd
          // const modifiedFillDateString = modifiedFillDate.toISOString().split('T')[0];

          // // return formatDateCard(modifiedFillDateString); 
          // setUpdatedNextFillDate(modifiedFillDateString);       
          const todaysFillDate = new Date(dateValue);
          todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays);
  
          const year = todaysFillDate.getFullYear();
          const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
          const day = String(todaysFillDate.getDate()).padStart(2, '0');
  
          const modifiedNextFillDateString = `${year}-${month}-${day}`;
  
          console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
          console.log(typeof modifiedNextFillDateString)
          console.log("******* Next Fill Date Type ABOVE********************")
  
          dynamicNextFillRef.current = modifiedNextFillDateString;
          setUpdatedNextFillDate(modifiedNextFillDateString); 
          return modifiedNextFillDateString;
  }

// maxPillsPerFuckingDay
// const getDateOringinallyFuckingFilled = nftz?.metadata.attributes[6].value;
// const getFuckingQuantityFilled = nftz?.metadata.attributes[3].value;

  const getNextFillDateCompleteSecondFill = (dateValue, fillQty) => {
    // Assuming dateValue = '2023-05-19';

    //1. Get Last Fill Date: getDateLastFilled
// let pastDays = getDaysBetweenDates(dateValue, getDateLastFilled)
let pastDays = getDaysBetweenDates(dateValue, getDateOringinallyFuckingFilled) 
    console.log("pastDays = ", pastDays)
// let perDiemMaxInt = parseInt(getMax)
let perDiemMaxInt = parseInt(maxPillsPerFuckingDay)


    let potentialPillsUsed = pastDays * perDiemMaxInt;
    console.log("potentialPillsUsed = ",potentialPillsUsed)
// let surplus = getQuantityFilled - potentialPillsUsed;
    let surplus = getFuckingQuantityFilled - potentialPillsUsed;
    console.log("surplus = ",surplus)


    if(surplus > 0){
      //overlapping pill quantity
        let fillQtyInt = parseInt(fillQty)
        let adjustedFillQty = surplus + fillQtyInt;
        console.log("adjustedFillQty = ",adjustedFillQty)
            // let totalPillsFilled = getQuantityFilled + fillQty; 
            // if (getQuantity - totalPillsFilled == 0) {
            //     let numberOfDays = Math.ceil(adjustedFillQty / getMax);
            // }else{
            //     let numberOfDays = Math.floor(adjustedFillQty / getMax);
            // }
// let numberOfDays = Math.ceil(adjustedFillQty / perDiemMaxInt);
        let numberOfDays = adjustedFillQty / perDiemMaxInt;

        console.log("numberOfDays in Complete Second Fill, surplus > 0 = ",numberOfDays)

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
        // numberOfDays
        // fillQtyInt or adjustedFillQty
        // perDiemMaxInt

        if(numberOfDays < 1){ 
          // numberOfDays += 1
          numberOfDays = Math.ceil(numberOfDays);
          console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
        }

        if(numberOfDays > 1){
          // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
          numberOfDays = Math.ceil(numberOfDays);
        }
//CHECK if fillQtyInt or adjustedFillQty ??
        if(adjustedFillQty % perDiemMaxInt === 0){
          numberOfDays += 1
          console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
        }

          console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //




        // const todaysFillDate = new Date(dateValue);
        // const modifiedNextFillDate = new Date(todaysFillDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
        // // Format the modified date as YYYY-mm-dd
        // const modifiedNextFillDateString = modifiedNextFillDate.toISOString().split('T')[0];
        // setUpdatedNextFillDate(modifiedFillDateString);

        const todaysFillDate = new Date(dateValue);
        todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays);

        const year = todaysFillDate.getFullYear();
        const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const day = String(todaysFillDate.getDate()).padStart(2, '0');

        const modifiedNextFillDateString = `${year}-${month}-${day}`;

        console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
        console.log(typeof modifiedNextFillDateString)
        console.log("******* Next Fill Date Type ABOVE********************")

      
        dynamicNextFillRef.current = modifiedNextFillDateString;
        setUpdatedNextFillDate(modifiedNextFillDateString);
        return modifiedNextFillDateString;
      
    }else{
      //ignore past fill case:
            // if (getQuantity - totalPillsFilled == 0) {
            //     let numberOfDays = Math.ceil(fillQty / getMax);
            // }else{
            //     let numberOfDays = Math.floor(fillQty / getMax);
            // }
      let fillQtyInt = parseInt(fillQty)
      let perDiemMaxInt = parseInt(maxPillsPerFuckingDay)

// let numberOfDays = Math.ceil(fillQtyInt / perDiemMaxInt);
      let numberOfDays = fillQtyInt / perDiemMaxInt;
      console.log("numberOfDays in (Complete Two surplus < 0) is: ",numberOfDays)

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
// MODULO REMINDER FROM: https://levelup.gitconnected.com/javascript-algorithm-can-we-divide-it-c86842cb5657
        // numberOfDays
        // fillQtyInt or adjustedFillQty
        // perDiemMaxInt

        if(numberOfDays < 1){ 
          // numberOfDays += 1
          numberOfDays = Math.ceil(numberOfDays);
          console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
        }

        if(numberOfDays > 1){
          // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
          numberOfDays = Math.ceil(numberOfDays);
        }

        if(fillQtyInt % perDiemMaxInt === 0){
          numberOfDays += 1
          console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
        }

          console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //

      // if(numberOfDays == 1){ 
      //   numberOfDays += 1
      //   console.log("#SingleDay Issue in (Complete Two surplus < 0) numberOfDays is now 2: ", numberOfDays)    
      // }




      // const todaysFillDate = new Date(dateValue);
      // const modifiedNextFillDate = new Date(todaysFillDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
      // // Format the modified date as YYYY-mm-dd
      // const modifiedNextFillDateString = modifiedNextFillDate.toISOString().split('T')[0];
      // setUpdatedNextFillDate(modifiedFillDateString);
      // return formatDateCard(modifiedTodaysFillDateString);

      const todaysFillDate = new Date(dateValue);
      todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays);

      const year = todaysFillDate.getFullYear();
      const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
      const day = String(todaysFillDate.getDate()).padStart(2, '0');

      const modifiedNextFillDateString = `${year}-${month}-${day}`;

      console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
      console.log(typeof modifiedNextFillDateString)
      console.log("******* Next Fill Date Type ABOVE********************")

 
      dynamicNextFillRef.current = modifiedNextFillDateString;
      setUpdatedNextFillDate(modifiedNextFillDateString);
      return modifiedNextFillDateString;

    }
  
  }

// ****************************((((((((((((((((((  PARTIAL FILLS ))))))))))))))))))**************** //

// maxPillsPerFuckingDay
// const getDateOringinallyFuckingFilled = nftz?.metadata.attributes[6].value;
// const getFuckingQuantityFilled = nftz?.metadata.attributes[3].value;

  const getNextFillDatePartialFirstFill = (dateValue, fillQty) => {
    // Assuming dateValue = '2023-05-19';

      // try{
            // const getMaxPills = await getMaxPillsPerDay(id);
  let fillQtyInt = parseInt(fillQty)
  // let perDiemMaxInt = parseInt(getMax)
  let perDiemMaxInt = parseInt(maxPillsPerFuckingDay)
  
  
// let numberOfDays = Math.ceil(fillQtyInt/perDiemMaxInt);
          let numberOfDays = fillQtyInt/perDiemMaxInt;

          console.log("numberOfDays in Partial First Fill is: ", numberOfDays)

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
        // numberOfDays
        // fillQtyInt or adjustedFillQty
        // perDiemMaxInt

        if(numberOfDays < 1){ 
          // numberOfDays += 1
          numberOfDays = Math.ceil(numberOfDays);
          console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
        }

        if(numberOfDays > 1){
          // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
          numberOfDays = Math.ceil(numberOfDays);
        }

        if(fillQtyInt % perDiemMaxInt === 0){
          numberOfDays += 1
          console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
        }

          console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //



          // if(numberOfDays == 1){ 
          //   numberOfDays += 1
          //   console.log("#SingleDay Issue in Partial First Fill numberOfDays is now 2: ", numberOfDays)
          // }
          
            const todaysFillDate = new Date(dateValue);
            console.log('First Partial Fill todaysFillDate is:', todaysFillDate)
            todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays);
            console.log('Updated Partial Fill todaysFillDate is:', todaysFillDate)


            const year = todaysFillDate.getFullYear();
            const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
            const day = String(todaysFillDate.getDate()).padStart(2, '0');

            const modifiedNextFillDateString = `${year}-${month}-${day}`;


            console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
            console.log(typeof modifiedNextFillDateString)
            console.log("******* Next Fill Date Type ABOVE********************")

         
            dynamicNextFillRef.current = modifiedNextFillDateString;
            setUpdatedNextFillDate(modifiedNextFillDateString);
            return modifiedNextFillDateString;

      // }catch(error){
      //   console.log("Partial First Fill ERROR: ", error)
      // }

  }

// maxPillsPerFuckingDay
// const getDateOringinallyFuckingFilled = nftz?.metadata.attributes[6].value;
// const getFuckingQuantityFilled = nftz?.metadata.attributes[3].value;

  const getNextFillDatePartialSecondFill = (dateValue, fillQty) => {
    // Assuming dateValue = '2023-05-19';

    //1. Get Last Fill Date: getDateLastFilled
    // let pastDays = getDaysBetweenDates(dateValue, getDateLastFilled)
    let pastDays = getDaysBetweenDates(dateValue, getDateOringinallyFuckingFilled)

    // let pastDays = getPastDays + 0;
    console.log("Partial Second Fill pastDays is:", pastDays)

    let perDiemMaxInt = parseInt(maxPillsPerFuckingDay)

    let potentialPillsUsed = pastDays * perDiemMaxInt;
    console.log("Partial Second Fill potentialPillsUsed is:", potentialPillsUsed)
    console.log("Partial Second Fill getQuantityFilled is:", getFuckingQuantityFilled)

    // let surplus = getQuantityFilled - potentialPillsUsed;
    let surplus = getFuckingQuantityFilled - potentialPillsUsed;

    console.log("Partial Second Fill surplus is:", surplus)

    if(surplus > 0){
      //overlapping pill quantity
        let fillQtyInt = parseInt(fillQty);
        // let adjustedFillQty = surplus + fillQty;
        let adjustedFillQty = surplus + fillQtyInt;

        console.log("Partial Second Fill adjustedFillQty is:", adjustedFillQty)


// let numberOfDays = Math.floor(adjustedFillQty / perDiemMaxInt);
        let numberOfDays = adjustedFillQty / perDiemMaxInt;
        console.log("numberOfDays in Partial Second Fill, Surplus > 0 is: ", numberOfDays)

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
        // numberOfDays
        // fillQtyInt or adjustedFillQty
        // perDiemMaxInt

        if(numberOfDays < 1){ 
          // numberOfDays += 1
          numberOfDays = Math.ceil(numberOfDays);
          console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
        }

        if(numberOfDays > 1){
          // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
          numberOfDays = Math.ceil(numberOfDays);
        }
// CHECK fillQtyInt or adjustedFillQty ??
        if(adjustedFillQty % perDiemMaxInt === 0){
          numberOfDays += 1
          console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
        }

          console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //

        
        // const todaysFillDate = new Date(dateValue);
        // const modifiedNextFillDate = new Date(todaysFillDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
        // // Format the modified date as YYYY-mm-dd
        // const modifiedNextFillDateString = modifiedNextFillDate.toISOString().split('T')[0];

        const todaysFillDate = new Date(dateValue);
        todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays);

        const year = todaysFillDate.getFullYear();
        const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const day = String(todaysFillDate.getDate()).padStart(2, '0');

        const modifiedNextFillDateString = `${year}-${month}-${day}`;

        console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
        console.log(typeof modifiedNextFillDateString)
        console.log("******* Next Fill Date Type ABOVE********************")


        dynamicNextFillRef.current = modifiedNextFillDateString;
        setUpdatedNextFillDate(modifiedNextFillDateString);
        return modifiedNextFillDateString;
      
    }else{
      let fillQtyInt = parseInt(fillQty);
      // let numberOfDays = Math.floor(fillQtyInt / perDiemMaxInt);
      let numberOfDays = fillQtyInt / perDiemMaxInt;
      // let numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)


      // if(numberOfDays == 1){ 
      //   numberOfDays += 1
      //   console.log("#SingleDay Issue in Partial First Fill numberOfDays is now 2: ", numberOfDays)
      // }

// ******************************* NUMBER OF DAY CALCULATOR ************************************************* //
      if(numberOfDays < 1){ 
        // number
        // numberOfDays += 1
        numberOfDays = Math.ceil(numberOfDays);
        console.log("#SingleDay Issue in Partial First Fill numberOfDays less than 1, ceil up: ", numberOfDays)
      }

      if(numberOfDays > 1){
        // numberOfDays = Math.floor(fillQtyInt/perDiemMaxInt)
        numberOfDays = Math.ceil(numberOfDays);
      }

      if(fillQtyInt % perDiemMaxInt === 0){
        numberOfDays += 1
        console.log("#SingleDay Issue in Partial First Fill numberOfDays modulo: ", numberOfDays)
      }

        console.log("numberOfDays in Partial Second, surplus < 0 Fill is: ", numberOfDays)
// ******************************* end of NUMBER OF DAY CALCULATOR ************************************************* //

            // const todaysFillDate = new Date(dateValue);
            // const modifiedNextFillDate = new Date(todaysFillDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
            // // Format the modified date as YYYY-mm-dd
            // const modifiedNextFillDateString = modifiedNextFillDate.toISOString().split('T')[0];
            // setUpdatedNextFillDate(modifiedFillDateString);
            // return formatDateCard(modifiedTodaysFillDateString);

      const todaysFillDate = new Date(dateValue);
      todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays );

      const year = todaysFillDate.getFullYear();
      const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
      const day = String(todaysFillDate.getDate()).padStart(2, '0');

      const modifiedNextFillDateString = `${year}-${month}-${day}`;

      console.log("ChaGPGT Next Date:",modifiedNextFillDateString); // Output: "2023-05-21" (example)
      console.log(typeof modifiedNextFillDateString)
      console.log("******* Next Fill Date Type ABOVE********************")


      dynamicNextFillRef.current = modifiedNextFillDateString;
      setUpdatedNextFillDate(modifiedNextFillDateString);
      return modifiedNextFillDateString;

    }
  
  }



  // const { data: fillEvents, isLoading: isLoadingFillEvents } = useContractEvents(
  //     contract,
  //     "UpdateScriptQuantityAndDatesEvent",
  //     {
  //         queryFilter: {
  //             filters: {
  //                 script_token_number: id
  //                 // script_token_number: id,
  //                 // patient_address: '0xE3cEA19e68430563f71C591390358e54d1fa857a'
  //                 // patient_address: "0xE3cEA19e68430563f71C591390358e54d1fa857a"
  //             },
  //             order: "desc",
  //         }
  //     }
  // )

// pass in inputDateFilled, inputPillsFilled
  const getNextSmartFillDate = (dateValue, fillQty) => {
    // Assuming dateValue = '2023-05-19';

//1. Get Max Pills Per Day
    let maxPillsPerDay = getMaxPillsPerDay(tokenId);
    let metaMaxPillsPerDay = nftz?.metadata.attributes[14].value;

//2. Check if this fill completes the Rx Order
        if (nftz?.metadata.attributes[2].value - fillQty == 0) {
              let numberOfDays = fillQty * maxPillsPerDay;
                // Create a new Date object using the date value
                const originalDate = new Date(dateValue);
                // Add numberOfDays days to the original date
                // const modifiedDate = new Date(originalDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                const modifiedDate = new Date(originalDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
                // Format the modified date as YYYY-mm-dd
                const modifiedDateString = modifiedDate.toISOString().split('T')[0];
                return formatDateCard(modifiedDateString);

        }else{

            if (nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value == 0) {
              let numberOfDays = Math.ceil(fillQty / maxPillsPerDay);
            }else{
              let numberOfDays = Math.floor(fillQty / maxPillsPerDay);
            }
                // Create a new Date object using the date value
                const originalDate = new Date(dateValue);
                // Add 30 days to the original date
                // const modifiedDate = new Date(originalDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                const modifiedDate = new Date(originalDate.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));


                // Format the modified date as YYYY-mm-dd
                const modifiedDateString = modifiedDate.toISOString().split('T')[0];
                return formatDateCard(modifiedDateString);
      }
  }

  

// ************************* #updateScript ***********************************************
    const updateScriptQuantityAndDates = async () => {
        // const _safeTransferFromToPharmacy = async () => { 
        // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
        
  
    try {
        
            let pills_filled_Ref = inputPillsFilled.current.value;
            
            // let date_filled_Ref = formatDateCard(inputDateFilled.current.value);
            let date_filled_Ref = inputDateFilled.current.value;

            let patient_wallet_address_from_metadata = nftz?.metadata.attributes[4].value;

// SET SCRIPT STATUS: 
            // let stringGetQuantityFilled = parseInt(getQuantityFilled)
            // let string_pills_filled_Ref = parseInt(pills_filled_Ref);
            // let totalPillsFilled = stringGetQuantityFilled + string_pills_filled_Ref;


  // //USE STRUCT (or events?) LATER:  
  //           if(nftz?.metadata.attributes[6].value == 'N/A'){
  //               let date_filled_Ref = inputDateFilled.current.value;
  //           }else{
  //               let date_filled_Ref = nftz?.metadata.attributes[6].value
  //           }

            // let date_filled_Ref = inputDateFilled.current.value;


            // // const nextGodDamnFillDate = await calcNextFillDate();

            // let stringGetQuantityFilled = parseInt(getQuantityFilled)
            // let string_pills_filled_Ref = parseInt(pills_filled_Ref);
      
            // let totalPillsFilled = stringGetQuantityFilled + string_pills_filled_Ref;
            // console.log('totalPillsFilled is: ', totalPillsFilled)
            // let date_next_fill_Ref;
            // if(getQuantity - totalPillsFilled == 0){
            //     if(getDateLastFilled == 'N/A'){
            //       let date_next_fill_Ref = await getNextFillDateCompleteFirstFill(inputDateFilled.current.value, pills_filled_Ref)
            //     }else{
            //       let date_next_fill_Ref = await getNextFillDateCompleteSecondFill(inputDateFilled.current.value, pills_filled_Ref)
            //     }
            // }else{
            //   if(getDateLastFilled != 'N/A'){
            //     let date_next_fill_Ref = await getNextFillDatePartialFirtFill(inputDateFilled.current.value, pills_filled_Ref)
            //   }else{
            //     let date_next_fill_Ref = await getNextFillDatePartialSecondFill(inputDateFilled.current.value, pills_filled_Ref)
            //   }
            // }


            
           
            // let date_next_fill_Ref = getNextFillDateOriginal(inputDateFilled.current.value);
    //END OF next fill date logic

            // const data = await contract.call("updateScriptQuantityAndDates", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);
 //v12.5 pass in pharmacy_name        
            // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, date_filled_Ref, formatDateTwoDigitYear(updatedNextFillDate), pharmacy_name]);
 //working v12.6:
          // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, dynamicSetFillDate, updatedNextFillDate, pharmacy_name]);       
          // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, dynamicFillDateRef.current, dynamicNextFillRef.current, pharmacy_name]);       
          
          
          
 //v12.7 version - added formatted dates, updatedNextFillDate apart from filld ate and script_status (pending or complete)        
            // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, dynamicSetFillDate, formatDateTwoDigitYear(dynamicSetFillDate), date_filled_Ref,
            //   formatDateTwoDigitYear(date_filled_Ref), updatedNextFillDate, formatDateTwoDigitYear(updatedNextFillDate), pharmacy_name]);
let numberDynamicFillDate = new Date(dynamicFillDateRef.current).getTime()
let number_date_filled_ref = new Date(date_filled_Ref).getTime()
let number_updatedNextFillDate = new Date(dynamicNextFillRef.current).getTime()
// convertNumberDateToTwoDigitString()
alert(`dynamicSetFillDate is ${formatDateTwoDigitYear(dynamicFillDateRef.current)}, and in number version is: ${numberDynamicFillDate} 
date_filled_Ref is ${formatDateTwoDigitYear(date_filled_Ref)}, and in number version is: ${number_date_filled_ref}.
and updatedNextFillDate is ${formatDateTwoDigitYear(dynamicNextFillRef.current)} and in number version is ${number_updatedNextFillDate}.`);

//v13.1 version - added formatted dates, updatedNextFillDate apart from filld ate and script_status (pending or complete)        
            const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, new Date(dynamicFillDateRef.current).getTime(), new Date(date_filled_Ref).getTime(),
              new Date(dynamicNextFillRef.current).getTime(), pharmacy_name, patient_wallet_address_from_metadata]);
            
            // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref, pharmacy_name]);
            
            
            // const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref, pharmacy_name]);


     
            console.log("RX NFT Has Been Filled As Follows:", data);
  
            // alert(`Success! Quantity of ${pills_filled_Ref} pills on ${date_filled_Ref} has been recorded. Next refill date is ${updatedNextFillDate}.`);

// 6/8/23 - NEXT FILL DATE NOT updatedNextFillDate but RATHER '${formatDateTwoDigitYear(dynamicNextFillRef.current)}' so it can be override if needed: ********
            // alert(`Success! Quantity of ${pills_filled_Ref} pills on ${dynamicSetFillDate} has been filled by ${pharmacy_name}. Next refill date is ${updatedNextFillDate}.`);
            alert(`Success! Quantity of ${pills_filled_Ref} pills on ${formatDateTwoDigitYear(date_filled_Ref)} has been filled by ${pharmacy_name}. Next refill date is ${formatDateTwoDigitYear(dynamicNextFillRef.current)}.`);
            setShowSendButton("block")
            setShowFillButton('none')
            // inputPillsFilled.current.value = '';
            // inputDateFilled.current.value = currentDate;
    } catch (error) {
            console.log("contract call failure", error)
            alert("CONTRACT CALL FAILURE. REASON:", error);
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



  function getCurrentDatePST() {
    var options = { timeZone: 'America/Los_Angeles' };
    var currentDate = new Date().toLocaleString('en-US', options);
    
    return currentDate;
  }

  let displayCurrentPSTDate = getCurrentDatePST();
  // let currentDate = new Date().toJSON().slice(0, 10);
  let currentDate = new Date(displayCurrentPSTDate).toJSON().slice(0, 10);



  return (
<>

        <div className="view-single-scripts-card">
            <h1 style={{color:"white"}}>Manage Prescription #{id} for {nftz?.metadata.name}</h1>
            <h5 style={{color:"white"}}>
                For {pharmacy_name} | Next Fill Date: {updatedNextFillDate} |
                 Max Per Day: {nftz?.metadata.attributes[14].value}
            </h5>
            <h5 style={{color:"white"}}>Fill Script Today: {displayCurrentPSTDate}</h5>
            <h5 style={{color:"#323331"}}>LGMFN: {dynamicSetFillDate}</h5>
            {/* <h5 style={{color: "white"}}>{pharmacy_name_constant}</h5> */}
           
            <Link className="btn btn-primary" to="/pharmacy-dashboard">Back To Pharmacy Dashboard</Link>
            <div className="text-center" style={{display:`${showFillButton}`}}>
            <form onSubmit={e => handleSubmitTransferToPatient(e)}>
                        <button type="submit" className="btn btn-danger">Send Rx Back To {nftz?.metadata.name}</button>
                    </form>
            </div>

            <div className="card-footer text-center" style={{display:`${showSendButton}`}}>

            </div>

                <div className="view-single-scripts-card">

                        <div className="card" style={{width: "18rem;"}}>
                            {/* <img className="card-img-top view-scripts-image" src={nftz?.metadata.image} alt="Card image cap" /> */}
                            <img className="card-img-top view-single-script-image" src={nftz?.metadata.image} alt="Card image cap" />
                            <div className="card-body">
                                <h5 className="card-title"><b>Patient:</b> {nftz?.metadata.name} | <b>DOB:</b> {formatDateFourDigitYear(nftz?.metadata.attributes[1].value)}</h5>
                                <ul className="list-group list-group-flush">
                                    {/* <li className="list-group-item">Medication: {nftz?.metadata.medication}</li> */}
                                    {/* <li className="list-group-item">Medication: {getMedication}</li> */}
                                    <li className="list-group-item"><b>Medication:</b> {nftz?.metadata.attributes[0].value}</li>                                  
                                    <li className="list-group-item"><b>Qty Prescribed:</b> {nftz?.metadata.attributes[2].value} | <b>Qty Filled:</b> {nftz?.metadata.attributes[3].value}  | <b>Qty Unfilled:</b> {nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value} </li>
                                    <li className="list-group-item"><b>Next Refill:</b> {nftz?.metadata.attributes[6].value == 0 ? 'N/A' : convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[13].value)}  |  
                                    
                                    <i style={{color:"grey"}}> (doc Refill: {convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[12].value)}   | 
                                        
                                       Latest Refill: {convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[7].value)}
                                    )</i>
                                    </li>
                                    <li className="list-group-item"><b>Last Filled</b> {nftz?.metadata.attributes[6].value == 0 ? 'N/A ' : convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[11].value) } |   
                                      <i style={{color:"grey"}}> (first Filled date: {nftz?.metadata.attributes[6].value == 0 ? 'N/A ' : convertBigNumberToTwoDigitYear(nftz?.metadata.attributes[6].value)})</i> 
                                    </li>
                                    
                                    <li className="list-group-item"><b>SIG:</b> {nftz?.metadata.description}</li>
                                    <li className="list-group-item"><b>Date Prescribed:</b> {convertBigNumberToFourDigitYear(nftz?.metadata.attributes[5].value)} |  
                                      <b> Days Supply:</b> {nftz?.metadata.attributes[2].value / nftz?.metadata.attributes[14].value} 
                                    </li>
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

                                            <div className="card-footer text-center" style={{display:`${showOverrideButton}`}}>
                                                  <div className="row">
                                                          <div className="col-4">
                                                              
                                                          </div>

                                                          <div className="col-8">
                                                              <label>Manually Set <b>Next Refill Date:</b></label>
                                                              <input type="date" name="dateFilled" className="form-control" ref={overrideNextFillRef} />
                                                          </div>
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