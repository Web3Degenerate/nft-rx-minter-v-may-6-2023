import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, Web3Button, 
  useTransferNFT, MediaRenderer, useMetadata } from "@thirdweb-dev/react";
// import "../styles/Home.css";
// import "../styles/globals.css";

import "../styles/ViewScripts.css";
// import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect, useRef} from 'react' 

import { Link, useNavigate, useParams } from 'react-router-dom'

import { FormField, CustomButton } from '../components';

import axios from 'axios';

import { alertService } from '../services';



const ViewScripts = () => {

  const navigate = useNavigate();

 // const [isLoading, setIsLoading] = useState(false);
//  const { contract } = useContract("0x7e45B8A00e2B1Fb9C7302982610219714E500576"); //NFT Rx9.0 - George Minter on mumbai
 //const { contract } = useContract("0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15"); //NFT Rx - 10.2 - 721 Struct (NO BASE)
//  const { contract } = useContract("0xEC44e3efeD46D6ffd392e32D6c99E04780Ce4d08"); //NFT Rx - 10.3 721 only - supply issue
//  const { contract } = useContract("0x03766B73D752D3155D6D8d7ff98D88ba656db7E0"); //NFT Rx - 10.4 - addy string issue.
//  const { contract } = useContract("0x3bcf6B3d11d2737A7F2E3D819D6E66F63C6f7a8e"); //NFT Rx - 10.5 - Two Calls
 const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 10.7
 
 

 //https://portal.thirdweb.com/extensions

 //Get Current User's Addy: 
 const address = useAddress(); 

 const addyShortner = (address) => {
  let tempAddy = String(address);
    // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
    const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
    return tinyAddy;

 }

// Your NFT collection contract address
 const contractAddress = "0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF";

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

// const handleFormFieldChange = (fieldName, e) => {
//   setForm({ ...form, [fieldName]: e.target.value })
// }

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   await setRx({ ...form })
  
// }

// const setRx = async (form) => {
//   try {
//     const data = await contract.call("setRx", [form.name, form.description, form.medication, form.dosage, form.quantity])



const handleSubmitTest = async (e) => { 

  e.preventDefault();

  console.log("handleSubmitTests e value:", e)
  alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)

  await _safeTransferFromToPharmacy({ ...rxWallet })

}


const _safeTransferFromToPharmacy = async (rxWallet) => {
    // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)

    try {
              const data = await contract.call("safeTransferFrom", [address, rxWallet.rxWallet, rxWallet.tokenId]);
          
              console.log("NFT Sent to Selected Pharmacy with response:", data);
      
              alert(`Success! Your NFT Prescription has been sent to  your pharmacy at address ${rxWallet.rxWallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
              
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

      <h4 style={{color:"white"}}>Current tokenId Set to: {rxWallet.tokenId} </h4>
      <h4 style={{color:"white"}}>Current Rx Wallet Set to: {rxWallet.rxWallet} </h4>

  {/* </>
    )} */}


<hr></hr>
{/* <br></br>
<br></br> */}
{/* ########################################################################################################################################################## */}
  
  {/* </div> [End of "parent" nft_box_div ] - (16:00) - use <ThirdwebNftMedia /> tag to display image */}


          <div className="view-scripts-cards">
                {nfts?.map((nft) => (

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