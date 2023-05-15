import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
  useTransferNFT, useMetadata, useNFT } from "@thirdweb-dev/react";
  //removed MediaRenderer, Web3Button
// import "../styles/Home.css";
// import "../styles/globals.css";

import "../styles/ViewScripts.css";
// import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect, useRef} from 'react' 

// import { Link, useNavigate, useParams } from 'react-router-dom'

// import { FormField, CustomButton } from '../components';

import axios from 'axios';

// import { alertService } from '../services';

import { ethers } from 'ethers';

const ViewScripts = () => {

  // const navigate = useNavigate();

 // const [isLoading, setIsLoading] = useState(false);
//  const { contract } = useContract("0x7e45B8A00e2B1Fb9C7302982610219714E500576"); //NFT Rx9.0 - George Minter on mumbai
 //const { contract } = useContract("0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15"); //NFT Rx - 10.2 - 721 Struct (NO BASE)
//  const { contract } = useContract("0xEC44e3efeD46D6ffd392e32D6c99E04780Ce4d08"); //NFT Rx - 10.3 721 only - supply issue
//  const { contract } = useContract("0x03766B73D752D3155D6D8d7ff98D88ba656db7E0"); //NFT Rx - 10.4 - addy string issue.
//  const { contract } = useContract("0x3bcf6B3d11d2737A7F2E3D819D6E66F63C6f7a8e"); //NFT Rx - 10.5 - Two Calls
 const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue. 
 
 // Your NFT collection contract address
 const contractAddress = "0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF";

 //https://portal.thirdweb.com/extensions

 //Get Current User's Addy: 
 const address = useAddress(); 

 const addyShortner = (address) => {
  let tempAddy = String(address);
    // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
    const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
    return tinyAddy;
 }



//docs erc-721
 // ERC721 - docs: 
 const { mutateAsync } = useTransferNFT(contract)

//docs useMetadata
 const { data } = useMetadata(contract)


// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
 const { data: nfts } = useOwnedNFTs(contract, address);

 console.log(nfts)

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



//************************************* Pull in Pharmacies for drop down menu ********************** */

//State for Pharmacies, initialized as []
const [pharmacy, setPharmacy] = useState([]);
const [tokenIdMemory, setTokenIdMemory] = useState('')

// useEffect to load the pharmacies on page load:
useEffect(()=> {    
  // loadEditPharmacy(); 
  // loadMedications();
  loadViewPharmacy();
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
  

  // const [rxWallet, setRxWallet] = useState(''); //working on wallet adddy

  const [rxWallet, setRxWallet] = useState({
    tokenId: '', 
    rxWallet: ''
  });

  const inputTokenId = useRef(); 
  const inputPharmacyWallet = useRef('');

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

  

}


const _safeTransferFromToPharmacy = async (rxWallet) => {
    // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)

    try {
              const data = await contract.call("safeTransferFrom", [address, rxWallet.rxWallet, rxWallet.tokenId]);
          
              console.log("NFT Sent to Selected Pharmacy with response:", data);
      
              alert(`Success! Your NFT Prescription has been sent to  your pharmacy at address ${rxWallet.rxWallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
              setRxWallet({ tokenId: '', rxwallet: '' })
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


//TARDS CAN'T FIGURE OUT FILTER FUCK THIS F SHIT
// const singleNFT = nfts.filter(nfts => nfts.metadata.id === 13)

//COCK SUCKING TURD WEB: https://portal.thirdweb.com/react/react.usenft
const tokenId = 13;
const { data: nft } = useNFT(contract, tokenId);


// const { data: nftz } = contract.metadata.get(13)

// const singleNFTDisplay = async () => { 
//   const singleTokenId = 13;
//   const singleNFT = await contract.erc721.get(singleTokenId);
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

{/* ########################################################################################################################################################## */}

{/* {address && (
  <> */}
      <h1 className="display-4" style={{color:"white"}}>View / Fill Your Scripts (Patient View) </h1>
      <h5 style={{color:"white"}}>Your connected with address: {addyShortner(address)}</h5>

      <h4 style={{color:"white"}}>Current Role: {userRole.userRole} </h4>

      <h4 style={{color:"white"}}>RLP.encode is: {userRole.hashPatient} </h4>
      <h4 style={{color:"white"}}>RLP.decode is: {userRole.decodedRLP} </h4>
      <h4 style={{color:"white"}}>RLP.decoded String is: {userRole.translatePatient} </h4>

      {/* <input type='text' name="role" ref={user_role} onChange={(e) => handleRoleChange(e)}></input> */}
      <input type='text' name="role" ref={user_role} onChange={e => handleRoleChange()}></input>

      {/* <h4 style={{color:"white"}}>Current Prescription Item # {rxWallet.tokenId} </h4>
      <h4 style={{color:"white"}}>Current Rx Wallet Set to: {rxWallet.rxWallet} </h4> */}

  {/* </>
    )} */}


<hr></hr>
{/* <br></br>
<br></br> */}
{/* ########################################################################################################################################################## */}
  
  {/* </div> [End of "parent" nft_box_div ] - (16:00) - use <ThirdwebNftMedia /> tag to display image */}




    {/* <h2 style={{color:"white"}}>SIG for Token ID #13 is: {singleNFT.metadata.description}</h2> */}
    <h2 style={{color:"white"}}>SIG for Token ID #13 is: {nft.metadata.description}</h2>
    

          <div className="view-scripts-cards">
           {/* {nfts?.map((nft) => ( */}

                {nfts?.filter((nft) => {
                  return nft.metadata.id.toString() === '13'
                }
                ).map((nft) => (


                      <div key={nft.metadata.id.toString()} className="view-scripts-card">
                                  
                              <ThirdwebNftMedia metadata={nft.metadata} 
                                className="view-scripts-image"
                              /> 
                              {/* <MediaRenderer metadata={nft.metadata}/> */}

                                  <p><b>Patient:</b> {nft.metadata.name} | Item #: {nft.metadata.id}</p>
                                  <p><b>DOB:</b> {nft.metadata.dob}</p>
                                  <p><b>SIG:</b> {nft.metadata.description}</p>
                                  <p><b>Medication</b> {nft.metadata.medication}</p>
                                  <p><b>Qty:</b> {nft.metadata.quantity}</p>

{/* ****************************************************************************************************** */}
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
                                            <option value={`${pharmacy.pharmacy_wallet}`} key={`${index}`}>{pharmacy.pharmacy_name}</option>                                                                            
                                        ))}

                                    </select>

                                    
                                  </div>

                                  <div className="row">
                                    <div className="col-md-12">
                                        {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                        <button type="submit" className="btn btn-success">Submit {nft.metadata.medication} To Pharmacist</button>

                                    </div>
                                </div>
                          </div>
                    </form>
{/* ****************************************************************************************************** */}
                    
                                  <p className="hyphens"><b style={{color:"green"}}>Status: {" "}
                                  {address && nft.owner == address ? 
                                    `Waiting for ${nft.metadata.name} to submit. Quantity Filled: 0/${nft.metadata.quantity}.` : 
                                    `Pharmacy: ${addyShortner(nft.owner)} will be filled by them.
                                    Please contact 416-123-4567 if you have any further questions.`
                                  }</b></p>
                  </div>


                ))} 
          </div>





 </div>

</>
  )
}
export default ViewScripts