import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
  useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";
  //removed MediaRenderer, Web3Button
// import "../styles/Home.css";
// import "../styles/globals.css";


import "../styles/ViewScripts.css";
// import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect, useRef} from 'react' 

import { useNavigate, Link } from 'react-router-dom'

// import { Link, useNavigate, useParams } from 'react-router-dom'

// import { FormField, CustomButton } from '../components';

// popped up from mac pro 2:
// import { resolveContractUriFromAddress } from "@thirdweb-dev/sdk";
// resolveContractUriFromAddress

import axios from 'axios';

// import { alertService } from '../services';

import { ethers } from 'ethers';

import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, formatDateTwoDigit } from '../utils'
import { solidityContractAddress } from '../constants'

import { GetMedication } from '../components';

const ViewScripts = () => {

  // const navigate = useNavigate();

 // const [isLoading, setIsLoading] = useState(false);
//  const { contract } = useContract("0x7e45B8A00e2B1Fb9C7302982610219714E500576"); //NFT Rx9.0 - George Minter on mumbai
 //const { contract } = useContract("0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15"); //NFT Rx - 10.2 - 721 Struct (NO BASE)
//  const { contract } = useContract("0xEC44e3efeD46D6ffd392e32D6c99E04780Ce4d08"); //NFT Rx - 10.3 721 only - supply issue
//  const { contract } = useContract("0x03766B73D752D3155D6D8d7ff98D88ba656db7E0"); //NFT Rx - 10.4 - addy string issue.
//  const { contract } = useContract("0x3bcf6B3d11d2737A7F2E3D819D6E66F63C6f7a8e"); //NFT Rx - 10.5 - Two Calls

//  const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue. 
//  const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.  

  const { pharmacyContract } = useContract("0x684E9cA3BDf984769531Af2778957815EB096e01"); // 11.1 - Testing Pharmacy Update
// const { contract } = useContract("0x92525216C74e3B5819e487Bef564e12845BafdB2"); // 11.5 - Fix SVG uint, Events, Roles (5/20/23)
// const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
  // const { contract } = useContract("0xd76F7225D8563071d04f16FF26873f7B4468bD5D"); // 11.9 - Improved metadata and function callls (5/21/23)
 
  // const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata  (5/23/23)
  const { contract } = useContract(solidityContractAddress); // 12.1 - Improved metadata  (5/23/23)


  


 // Your NFT collection contract address
//  const contractAddress = "0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"; // 11.0
 const contractAddress = "0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"; // 12.1


 const pharmacyContractAddress = "0x684E9cA3BDf984769531Af2778957815EB096e01";
 

 //https://portal.thirdweb.com/extensions

 //Get Current User's Addy: 
 const address = useAddress(); 
//  const address = '0xE3cEA19e68430563f71C591390358e54d1fa857a'

//docs erc-721
 // ERC721 - docs: 
 const { mutateAsync } = useTransferNFT(contract)

//docs useMetadata
 const { data } = useMetadata(contract)

//  const { data: medicacion } = useContractRead(contract, "getMedication", [nft.metadata.id])



// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
 const { data: nfts, isLoading: loading } = useOwnedNFTs(contract, address);
 console.log(nfts)

 const { data: nftsPharma } = useOwnedNFTs(pharmacyContract, address)
 console.log(nftsPharma)

// Contract must be an ERC-721 or ERC-1155 contract
 const {
   mutateAsync: transferNFT,
   // isLoading,
   // error,
 } = useTransferNFT(contract); 


 // https://portal.thirdweb.com/typescript/sdk.tokendrop
//  const [balance, setBalance] = useState(0);
//  const checkYoBalance = async () => {
//     const balance = await contract.erc721.balanceOf(address);
//     setBalance(balance);
//  }




//***********************************  UTILITY FUNCTIONS *******************************************/

//  const addyShortner = (address) => {
//   let tempAddy = String(address);
//     // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
//     const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
//     return tinyAddy;
//  }

 const getDob = async (tokenId) => {   
  try{       
          const { k } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
          // const addy = useAddress()

          const dataDob = await contract.call("getDob", [tokenId]);

          console.log("getDob fn call returned:", dataDob);
          // setGetDober(data.toString())
          // setGetDober(data)
          return dataDob;
  } catch (error) {
          console.log("Unable to fetch getDob", error)
  }
}

    const [getMedString,setGetMedString] = useState()


  const getMedicationString = async (tokenId) => {
      try{        


          const dataMedication = await contract.call("getMedication", [tokenId]);
          // const dataMedication = await k.call("getMedication", [tokenId]);

              console.log("getMedication fn call returned:", dataMedication);
              // setGetDober(data.toString())
              // setGetMedication(data)

              const medication = {
                name: dataMedication
              }


              // setGetMedString(dataMedication)
              // return medication.name;

              return {dataMedication}
              

      } catch (error) {
          console.log("Error from getMedication K Call:", error)
      }
    }






// *************************************** Accordion Update From The Tech Team: https://www.youtube.com/watch?v=bGpZrr32ECw

const [selectedNFT, setSelectedNFT] = useState(null); 

 const toggleNFT = (item) => {

    if (selectedNFT == item){
      return setSelectedNFT(null);
    }
    setSelectedNFT(item);
 }


//************************************* Pull in Pharmacies for drop down menu ********************** */

//State for Pharmacies, initialized as []
const [pharmacy, setPharmacy] = useState([]);
const [tokenIdMemory, setTokenIdMemory] = useState('')

// useEffect to load the pharmacies on page load:
useEffect(()=> {    
  // loadEditPharmacy(); 
  // loadMedications();
  loadViewPharmacy();
  // getMedicationString();
}, [])

// Make call to server to pull pharmacies:
const loadViewPharmacy = async () => {
  const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
  console.log(result);
  setPharmacy(result.data.records);
}


// const [name,wallet_address,email] = patient; // patient is not iterable nasty error
const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_address} = pharmacy; 

  //************************************************************************************ Transfer to Pharmacy ********************* */
  

  // *********************************** PHARMACY UPDATES QUANTITY FILLED, FILL DATE ********************************************* //

  // const [rxWallet, setRxWallet] = useState(''); //working on wallet adddy

  const [rxWallet, setRxWallet] = useState({
    tokenId: '', 
    rxWallet: ''
  });

  const inputTokenId = useRef(); 
  const inputPharmacyWallet = useRef('');

  const inputPillsFilled = useRef();
  const inputDateFilled = useRef();
  const inputDateNextFill = useRef();
  // const inputTokenId = useRef();


  const handleChange=(e, id)=>{
    setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id })
    // console.log(e);
    console.log('handleChange just updated:',rxWallet);
}


const handleSubmitTest = async (e) => { 

  e.preventDefault();

  console.log("handleSubmitTests e value:", e)
  // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
  
  if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${rxWallet.rxWallet} `) == true){
    await _safeTransferFromToPharmacy({ ...rxWallet })
  }

  // let tokenId_Ref = inputTokenId.current.value;

  // if (confirm(`Process Rx Fulfillment for Prescription Item # ${tokenId_Ref} `) == true){
  //   await _safeTransferFromToPharmacy()
  // }

  

}


const _safeTransferFromToPharmacy = async (rxWallet) => {
  // const _safeTransferFromToPharmacy = async () => { 
    // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)

    try {
 
      
//********************* PHARMACY REVIEW UPDATE QTY AND FILL DATE METHOD CALL ************************************************** */

      // let pills_filled_Ref = inputPillsFilled.current.value;
      // let date_filled_Ref = inputDateFilled.current.value;
      // let date_next_fill_Ref = inputDateNextFill.current.value;
      // let tokenId_Ref = inputTokenId.current.value;

      // const data = await contract.call("updateScriptQuantityAndDates", [rxWallet.tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);
      // // const data = await contract.call("updateScriptQuantityAndDates", [tokenId_Ref, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);
      
          
      // console.log("RX NFT Has Been Filled As Follows:", data);

      // alert(`Success! You have received ${pills_filled_Ref} pills on ${date_filled_Ref} and you may refill this medication in Palau on ${date_next_fill_Ref} `);

// *********** END OF PHARMACY REVIEW UPDATE QTY AND FILL DATE METHOD CALL ************************************************** */



//********************* ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */

// VERSION 11.0 PATIENT TRANSFER:
              // const data = await contract.call("safeTransferFrom", [address, rxWallet.rxWallet, rxWallet.tokenId]);
// VERSION 11.2 PATIENT TRANSFER
              // const data = await contract.call("transferPharmacyToPatient", [address, rxWallet.rxWallet, rxWallet.tokenId]);

// VERSION 12.4 - Patient Transfer: 
              const data = await contract.call("transferPatientToPharmacyRoles", [address, rxWallet.rxWallet, rxWallet.tokenId]);

          
              console.log("NFT Sent to Selected Pharmacy with response:", data);
      
              alert(`Success! Your NFT Prescription has been sent to  your pharmacy at address ${rxWallet.rxWallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
              setRxWallet({ tokenId: '', rxwallet: '' })

//********************* --END OF -- ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */




              // setTestNet(sendRx.receipt.transactionHash);
      
              // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-2);
              // let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;
      
              // setOpenSeaURL(getOpenSeaURL)
              // setSuccess('block')
             
      } catch (error) {
              console.log("contract call failure", error)
              alert("Your NFT Prescription has NOT been sent.  Please try again or contact Rx Minter's Support Team located in Palau.");
              // alertService.error(`Error with error message of ${error} :(`, options);
      }


}


  const handleSubmit = async (e) => { 

      e.preventDefault();
      console.log("Event from inside Pharmacy Transfer handleSubmit async(e):", e)

      let tokenId_Ref = inputTokenId.current.value;
      let pharmacy_wallet_Ref = inputPharmacyWallet.current.value;

      try {
// const yolo = await loadViewPharmacy(); =====> refreshing fucks with e? https://felixgerschau.com/useref-react-hooks/
        // const data = await contract.call("_createScript", [form.wallet_address, form.name, form.description, form.medication, form.dosage, form.quantity])
        const data = await contract.call("safeTransferFrom", [address, pharmacy_wallet_Ref, tokenId_Ref]);
    
        console.log("NFT Sent to Selected Pharmacy with response:", data);

        // alert(`Rx has been minted and sent to your Pharmacy at address ${pharmacy_wallet_Ref} with transaction ID of ${sendRx.receipt.transactionHash}`); 
        alert(`Rx has been minted and sent to your Pharmacy at address ${pharmacy_wallet_Ref}. If you have any further questions, please call our dedicated support center in Palau.`);
        
        // setTestNet(sendRx.receipt.transactionHash);

        // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-2);
        // let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;

        // setOpenSeaURL(getOpenSeaURL)
        // setSuccess('block')
       
      } catch (error) {
        console.log("contract call failure", error)
        alert("Your Rx was not sent to the Pharmacy you selected.  Please try again or contact Rx Minter's Support Team locatged in Palau.");
        // alertService.error(`Error with error message of ${error} :(`, options);
      }

  }



//  const [userRole, setUserRole] = useState('');
 const [userRole, setUserRole] = useState({
  userRole: '',
  hashPatient: '',
  decodedRLP: '',
  translatePatient: ''
 });

 let user_role = useRef();

//  const inputTokenId = useRef(); 
//  const inputPharmacyWallet = useRef('');
 
 const handleRoleChange=()=>{
  //  setUserRole(e.target.value)
  // let new_user_role = user_role.current.value;
  // setUserRole(new_user_role)


// SUBTRACT_ROLE = 3ccb835e934d10e2ec13cf39065b900d8b3d4a3a39038f8b762590a977809e5e
// PATIENT_ROLE = 72606200fac42b7dc86b75901d61ecfab2a4a1a6eded478b97a428094891abed
// PHARMACY_ROLE = 2f3a5455f35aeca177ac653592f277fbe2fbafef01081a2030451bb2fb41c91d
// DOCTOR_ROLE = 0af1dac7dea2fd7f7738119cec7df099dfad49aa9d2e7d17ba6b60f63ae7411f


// ************ ETHERS V5.7 DOCS SOLUTION - CONVERT STRING TO keccak256() ***********************************
// https://docs.ethers.org/v5/api/utils/hashing/
// If needed, convert strings to bytes first: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("hello world"))

  // let hashNewRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user_role.current.value));
  let hashNewRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user_role.current.value));
 
  // WE WANT 0x prefix!!
  // let displayHashNewRole = hashNewRole.slice(2);

  // let abiCoder = new ethers.utils.AbiCoder;

// ******************** ONLY "ENCODE" / "DECODE" SOLUTION we got to work was formatBytes32String () and parseBytes32String FROM ***********************88
// https://docs.ethers.org/v5/api/utils/strings/#Bytes32String

  // let protectPatient = ethers.utils.base64.encode(user_role.current.value.toHexString());
  // let protectPatient = ethers.utils.formatBytes32String(user_role.current.value);


  //***************** ethereum.org on RLP: https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/  ************************************/
  let protectPatient = ethers.utils.RLP.encode(ethers.utils.toUtf8Bytes(user_role.current.value));
  // let protectPatient = ethers.utils.sha256(ethers.utils.toUtf8Bytes(user_role.current.value));

  // let showPatient = ethers.utils.base64.decode(protectPatient); 
  // let showPatient = ethers.utils.parseBytes32String(protectPatient); 
  // let showPatient = ethers.utils.RLP.decode(ethers.utils.toUtf8(protectPatient)); 
  // let showPatient = ethers.utils.toUtf8String(ethers.utils.RLP.decode(protectPatient));

// Online RLP Decoder (not to string): https://toolkit.abdk.consulting/ethereum#rlp
  let show_RLP_decoded = ethers.utils.RLP.decode(protectPatient);

  // let show_RLP_decoded = ethers.utils.toUtf8String(show_RLP_decoded);
  let showPatient = ethers.utils.toUtf8String(ethers.utils.RLP.decode(protectPatient));


// ********** string to address () conversion seems to work with getAddress: https://docs.ethers.org/v5/api/utils/address/
  // let showPatient = ethers.utils.getAddress(user_role.current.value);



// ************ ETHERS V5.7 DOCS SOLUTION - CONVERT STRING TO keccak256() ***********************************


  // console.log('hashNewRole is', hashNewRole)
  // setUserRole(user_role.current.value);
  setUserRole({userRole: hashNewRole, hashPatient: protectPatient, decodedRLP: show_RLP_decoded, translatePatient: showPatient });


   // console.log(e);
  //  console.log('handle Role Change just updated:', userRole);
  //  console.log('handle Role Change just updated:', userRole);
 }
 
//  const handleSubmit = async (e) => { 
 
//    e.preventDefault();
//    console.log("Event from inside Pharmacy Transfer handleSubmit async(e):", e)
 
//    let tokenId_Ref = inputTokenId.current.value;
//    let pharmacy_wallet_Ref = inputPharmacyWallet.current.value;
//  }


// Testing out single NFT display from docs: https://portal.thirdweb.com/typescript/sdk.nftcollection
// const singleTokenId = 13;
// const singleNFT = contract.erc721.get(13);




//TURD WEB: https://portal.thirdweb.com/react/react.usenft
// const tokenId = 13;
// const tokenIdNFT = nfts.slice(0, 1)[0];
// const tokenId = tokenIdNFT.metadata.id
// console.log('TARD tokeId is', tokenId)
// console.log('TARD nfts are', nfts)
// const { data: nft } = useNFT(contract, tokenId);


// const tokenIdNum = 3;
// const tokenId = ethers.BigNumber.from(tokenIdNum);
// const { data: nftPharma } = useNFT(pharmacyContract, [tokenId.toString()]);

// const tokenIdNum = 3;
// const tokenId = ethers.BigNumber.from(tokenIdNum);
// const { data: nftz } = useNFT(pharmacyContract, [tokenId.toString()]);

// const tokenId = 13;
// const { data: nftz } = useNFT(contract, tokenId);

const [nftzz, setNFftzz] = useState([{
  name: '',
  dob: '',
  image: '',
  description: '',
  medication: '',
  quantity: '',
  id: ''
}]);

// setPatient({name: "", wallet_address: "", dob: "", email:"", id:""});

const getNftCards = async () => {
  if(nfts){
    nfts.map((nft) => (
      setNFftzz([
            {
            name: useContractRead(contract, "getPatientName", [nft.metadata.id]),
            dob: useContractRead(contract, "getDob", [nft.metadata.id]),
            image: useContractRead(contract, "tokenSVGImageURI", [nft.metadata.id]),
            description: useContractRead(contract, "getSig", [nft.metadata.id]),
            medication: useContractRead(contract, "getMedication", [nft.metadata.id]),
            quantity: useContractRead(contract, "getQuantity", [nft.metadata.id]),
            id: nft.metadata.id
            }
      ])
    ))
  }
}

// getNftCards()



let displayPatientName
  if(nfts){
    nfts.map((nft) => (
      displayPatientName = `(for ${nft.metadata.name})`
    ))
  }

let loggedIn;
if (address) {
  let loggedIn = 'block'
}else{
  let loggedIn = "none"
}


// const { data: nftz } = contract.metadata.get(13)

// const singleNFTDisplay = async () => { 
//   const singleTokenId = 13;
//   const singleNFT = await contract.erc721.get(singleTokenId);
// }

// let dateAsUint256 = 1684195200000;
// const displayDateAsUint256 = new Date(dateAsUint256).getTime() //.toNumber();
 

// ****************************** GET tokenURI on 5/20/2023 ********************************************
// const tokenNum = 13;
// const tokenIdz = ethers.BigNumber.from(tokenNum);
// console.log("BigNiggerish", tokenIdz)
// const { data: nftz } = useContractRead(contract, "tokenURI", [tokenIdz.toString()])


// const tokenNum = 1;
// const tokenIdz = ethers.BigNumber.from(tokenNum);
// console.log("BigNiggerish", tokenIdz)
// const { data: nftz } = useContractRead(pharmacyContract, "tokenURI", [tokenIdz.toString()])

// console.log("ATTEMPTING tokenURI Call:", tokenIdz.toString())

// ****************************** GET tokenURI on 5/20/2023 ********************************************

const getBigNumberish = async (tokenIdz) => {
    try {
      const data = await contract.call("tokenURI", [tokenIdz]);
      // const data = await contract.call("updateScriptQuantityAndDates", [tokenId_Ref, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);        
      console.log("RX NFT Has Been Filled As Follows:", data);
      alert(`Success! You ahve received ${pills_filled_Ref} pills on ${date_filled_Ref} 
      and you may refill this medication in Palau on ${date_next_fill_Ref} `);  
    } catch (error) {
        console.log("contract call failure", error)
        alert("Your NFT Prescription has NOT been sent.  Please try again or contact Rx Minter's Support Team located in Palau.");
    }


}

  const getTokenSVGImageURI = (tokenId) => {
    return image = useContractRead(contract, "tokenSVGImageURI", [tokenId])
  }

  const [patientRole, setPatientRole] = useState("")
  const getPatientRoleString = async () => {
      try{
          const dataPatientRole = await contract.call("hasRolePatientString", [address]);
          setPatientRole(dataPatientRole)
          console.log('getPatientRoleString returned: ', dataPatientRole)
      }catch(err){
          console.error("contract call failure", err);
      }
  }

  getPatientRoleString();

let showLoading
let showAfterLoading
if (loading) {
  showLoading = "block"
  showAfterLoading = "none"
}else{
  showLoading = "none"
  showAfterLoading = "block"
}
// let medication

// if (loading) {
//   return <div className="container">Loading NFT Scripts...</div>
// }

  return (
<>
      <div className="view-scripts-container">

                          <div className="connect">
                                  <ConnectWallet dropdownPosition={{
                                    align: 'center',
                                    side: 'bottom'
                                  }} />
                          </div>   

{/* ################################# TESTING ROLE TO HEX / RLP AND BACK TO STRING  ####################################################################### */}

      <h1 className="display-4" style={{color:"white"}}>Manage Your NFT Scripts {displayPatientName} </h1>
      <h5 style={{color:"white"}}>Your connected with address: {addyShortner(address)}</h5>
      <h5 style={{color:"white"}}>Current role for ({addyShortner(address)}): {patientRole}</h5>

      {/* <h4 style={{color:"white"}}>Current Role: {userRole.userRole} </h4>

      <h4 style={{color:"white"}}>RLP.encode is: {userRole.hashPatient} </h4>
      <h4 style={{color:"white"}}>RLP.decode is: {userRole.decodedRLP} </h4>
      <h4 style={{color:"white"}}>RLP.decoded String is: {userRole.translatePatient} </h4>

      
      <input type='text' name="role" ref={user_role} onChange={e => handleRoleChange()}></input> */}
      
                {/* <input type='text' name="role" ref={user_role} onChange={(e) => handleRoleChange(e)}></input> */}

                {/* <h4 style={{color:"white"}}>Current Prescription Item # {rxWallet.tokenId} </h4>
                <h4 style={{color:"white"}}>Current Rx Wallet Set to: {rxWallet.rxWallet} </h4> */}

<hr></hr>
{/* ########################################################################################################################################################## */}
  
  {/* </div> [End of "parent" nft_box_div ] - (16:00) - use <ThirdwebNftMedia /> tag to display image */}




    {/* <h2 style={{color:"white"}}>SIG for Token ID #13 is: {singleNFT.metadata.description}</h2> */}

    {/* <h2 style={{color:"white"}}>SIG for Token ID #13 is: {nft?.metadata.description}</h2> */}
    {/* <h2 style={{color:"white"}}>SIG for Token ID #{nftz?.metadata.id} is: {nftz?.metadata.description}</h2> */}

    {/* <img src={nftz?.metadata.image} className="image--cover" /> */}

{/* tokenUri WORKING! */}
    {/* <p style={{color:"white"}}>URI on Token 17: {nftz?.metadata.tokenUri}</p> */}

    {/* <h3 style={{color:"white"}}>Date is: {displayDateAsUint256}</h3> */}


    <div className="wrapper" style={{display:`${loggedIn}`}}>
        <div className="accordion">
          <div className="view-scripts-cards">
                {/* {nfts?.map((nft) => ( */}

                {/* {nfts?.filter((nft) => {
                  return nft.metadata.id.toString() === '25'
                }
                ).map((nft) => ( */}


      <div style={{display:`${showLoading}`}}>
          <h3 style={{color:"white"}}>Loading NFT Scripts...</h3>
      </div>

      <div style={{display:`${showAfterLoading}`}}>

            {/* {nftzz.map((nft) => (
              <>
                <div key={nft.id.toString()} >
                  <p>{nft.name}</p>
                  <p>{nft.dob}</p>
                  <p>{nft.description}</p>
                  <img src={nft.image} />
                </div>
              </>
            ))} */}


            {nfts?.length > 0 ? 
              nfts.map((nft) => (
          
              <div className="item text-left">  
                <div className="title" onClick={() => toggleNFT(nft.metadata.id)}>
                  <h2>{nft.metadata.name} Script #{nft.metadata.id}</h2>
                  <span>{selectedNFT == nft.metadata.id ? '-' : '+'}</span>
                </div>
                <div className={selectedNFT == nft.metadata.id ? 'contento show' : 'contento'}>
                      <div key={nft.metadata.id.toString()} className="view-scripts-card text-left">

                        

                              {/* <ThirdwebNftMedia metadata={nft.metadata} 
                                className="view-scripts-image"
                              />  */}

                              <MediaRenderer                               
                                // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMCB8IFF0eSBMZWZ0OiAzODwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNDAiIGNsYXNzPSJiYXNlIj5NZWRpY2F0aW9uOiBBbWxvZGlwaW5lIDUgbWcgfCBSeCBJdGVtICMxPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSI2MCIgY2xhc3M9ImJhc2UiPkRhdGUgUHJlc2NyaWJlZDogMjAyMy0wNS0xNCB8IERhdGUgRmlsbGVkOiAgfCBOZXh0IFJlZmlsbCBEYXRlOiA8L3RleHQ+PC9zdmc+"
                                // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMTYgfCBRdHkgTGVmdDogMjI8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjQwIiBjbGFzcz0iYmFzZSI+TWVkaWNhdGlvbjogQW1sb2RpcGluZSA1IG1nIHwgUnggSXRlbSAjMTwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjAiIGNsYXNzPSJiYXNlIj5EYXRlIFByZXNjcmliZWQ6IDIwMjMtMDUtMTQgfCBEYXRlIEZpbGxlZDogMjAyMy0wNS0yMCB8IE5leHQgUmVmaWxsIERhdGU6IDIwMjMtMDYtMjA8L3RleHQ+PC9zdmc+"
                                src={nft.metadata.image}
                                // metadata={nft.metadata}
                                className="view-scripts-image"
                              />

                                  {/* <p><b>Patient:</b> {nft.metadata.name} | Item #: {nft.metadata.id}</p> */}
                                  <p><b>Patient:</b> {nft.metadata.name} | <b>DOB:</b> {formatDateFourDigitYear(nft.metadata.attributes[1].value)}</p>

                                  {/* <p><b>DOB:</b> {nft.metadata.dob}</p> */}
                                  <p><b>SIG:</b> {nft.metadata.description}</p>
                                  <p><b>Medication</b> {nft.metadata.attributes[0].value}</p>
                                  {/* <p><b>Medication</b> { getMedicationString(nft.metadata.id).toString()  }</p> */}
                                  {/* <p><b>Medication</b> { useContractRead(contract, "getMedication", [nft.metadata.id])  }</p> */}
                                  
                                  {/* <p><b>Medication</b> <GetMedication props={nft.metadata.id}/></p> */}

                                  
                                  <p><b>Qty:</b> {nft.metadata.attributes[2].value} | <b>Date Prescribed:</b> {formatDateFourDigitYear(nft.metadata.attributes[5].value)}</p>
                                  <p><b>Qty Filled:</b> {nft.metadata.attributes[3].value} | <b>Date Filled:</b> {nft.metadata.attributes[6].value}</p>
                                  <p className="text-left"><b>Next Fill Date:</b> {nft.metadata.attributes[7].value}</p>


{/* ****************************************************************************************************** */}
        {nft.metadata.attributes[2].value - nft.metadata.attributes[3].value !== 0 ? (
          <>
              <form onSubmit={e => handleSubmitTest(e)}>
              {/* <form onSubmit={handleTransferSubmit}>
        
                    <FormField 
                      labelName="Patient's Wallet Address:"
                      placeholder="Enter patient's polygon wallet address"
                      inputType="text"
                      value={transferForm.address}
                      handleChange={(e) => handleTransferFormFieldChange('address', e)}
                    /> */}


  
                          <div className="view-scripts-card">
                  
                                {/* <input type="hidden" name="tokenId" value={nft.metadata.id} ref={inputTokenId} /> */}
                                {/* <input name="tokenId" value={nft.metadata.id} /> */}

                                <div className="input-group-mb-3">
                                    {/* <button class="btn btn-outline-secondary" type="button">Select Pharmacy</button> */}                   
                                    {/* <select className="form-select" aria-label="Select A Medication" name="medication" onChange={(e) => handleChange(e)} > */}
                                    {/* <select className="form-select" name="pharmacy_wallet" ref={inputPharmacyWallet} > */}

                      {/* Mon 5/8/23 - working on wallet addy */}
                                    {/* <select className="form-select" aria-label="Select A Medication" name="rxWallet" value={rxWallet.value} onChange={(e) => setRxWallet(e.target.value)} > */}
                                    <select className="form-select" aria-label="Select A Medication" name="rxWallet" value={rxWallet.value} onChange={(e) => handleChange(e, nft.metadata.id)} >
                                        <option selected value="none">Select a Pharmacy...</option>

                                        {pharmacy.map((pharmacy, index) => (
                                            <option value={`${pharmacy.pharmacy_wallet}`} key={`${index}`}>{pharmacy.pharmacy_name} - {addyShortner(pharmacy.pharmacy_wallet)}</option>                                                                            
                                        ))}

                                    </select>     
                                  </div>

                                  <input type="hidden" name="tokenIdInput" value={nft.metadata.id} ref={inputTokenId}></input>


                                  {/* <input type="number" name="pillsFilled" ref={inputPillsFilled}></input>

                                  <div className="row">
                                          <div className="col-md-6">Date Filled:</div>
                                          <div className="col-md-6">
                                                                                                  
                                              <input type="date" name="dateFilled" className="form-control" ref={inputDateFilled} />
                                          </div>
                                  </div>
                                 
                                  <div className="row">
                                          <div className="col-md-6">Date Filled:</div>
                                          <div className="col-md-6">
                                                                                                  
                                              <input type="date" name="dateNextFill" className="form-control" ref={inputDateNextFill} />
                                          </div>
                                  </div> */}
                                  

                                  <div className="row">
                                    <div className="col-md-12">
                                        {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                        <button type="submit" className="btn btn-success">Submit {nft.metadata.attributes[0].value} To Pharmacist</button>

                                        {/* <Link className="btn btn-dark" to={`/pharmacy-review-nft/${nft.metadata.id}`}>Pharmacist Review Rx</Link> */}

                                    </div>
                                </div>
                          </div>
                    </form>
            </>
            ) : (

              <div className="view-scripts-card">

                    <div className="input-group-mb-3">
                        <h5 style={{color:"white"}}>Medication Filled</h5>
                    </div>
                    
                    
                    <div className="row">
                        <div className="col-md-12">                                    
                          <button className="btn btn-light" disabled>{nft.metadata.attributes[0].value} Filled: {formatDateTwoDigitYear(nft.metadata.attributes[5].value)}</button>                                     
                        </div>
                    </div>
              </div>

            )}
{/* ****************************************************************************************************** */}
                     <br></br>
                                  <p className="hyphens"><b style={{color:"white"}}>
                                  {address && nft.owner == address ? 
                                    `Quantity Filled: ${nft.metadata.attributes[3].value}/${nft.metadata.attributes[2].value}` : 
                                    `Pharmacy: ${addyShortner(nft.owner)} will be filled by them.
                                    Please contact 416-123-4567 if you have any further questions.`
                                  }</b></p>
                  </div> 
            </div>
          </div> 

              )) : (
                
                  <>
                    <div className="text-center">
                      <h3 style={{color:"white"}}>No NFT Scripts found for Address:</h3>
                      <h5 style={{color:"white"}}>{address}</h5>
                      <h5 style={{color:"white"}}>Please contact your doctors office if you need further assistance.</h5>
                    </div>
                  </>
              )}
        </div>{/* closing div for show scripts or no scripts message based on loading */}
      

          </div>{/* closing div for view-scripts-cards */}
      </div> {/* closing div for accordion */}
    </div> {/* closing div for wrapper */}
          





 </div> {/* closing div for wrapper  view-scripts-container*/}

</>
  )
}
export default ViewScripts