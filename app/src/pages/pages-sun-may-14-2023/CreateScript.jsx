import { useAddress, useContract, ConnectWallet, useOwnedNFTs,
    useTransferNFT, useMetadata, useTotalCount } from "@thirdweb-dev/react";
    //Removed ThirdwebNftMedia, MediaRenderer, Web3Button
  // import "../styles/Home.css";
  // import "../styles/globals.css";
  import 'bootstrap/dist/css/bootstrap.css';
  import "../styles/App.css";
  import axios from 'axios';

  // import { contract, contractAddress } from '../constants';

  import { ethers } from 'ethers';
  
// Original idea for useRef came from: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
  // Confirmed process: https://flaviocopes.com/react-hook-useref/
  import React, { useState, useEffect, useRef } from 'react'
  
  import { Link, useNavigate, useParams } from 'react-router-dom'
  
  import { FormField, CustomButton } from '../components';

  import { alertService } from '../services';

  // import Web3 from 'web3';
  // import { convertTokenId } from '../utils'; 


  

const CreateScript = () => {

// load patient by id:
  const { id } = useParams();

  const [patient, setPatient] = useState({
    name: "",
    wallet_address: "",
    email:"",
    id:"",
    dob:"",
  });


useEffect(()=> {    
  loadUser(); 
  loadMedications();
  // loadPatients();
}, [])

const [medication, setMedication] = useState([]);

// const [wtf3provider, setWtf3Provder] = useState('');

// const web3 = new Web3(Web3.givenProvider || "http://localhost:5173"); //returns address 50 times??
// web3.eth.getAccounts().then(console.log);
// setWtf3Provder(web3.eth.getAccounts());

// const personallyWTF = web3.eth.getAccounts();



const loadUser = async () => {
  // console.log('ID check inside loadUsers', id) 
  setPatient({name: "", wallet_address: "", email:"", dob:"", id:""});
  const result = await axios.get("https://rxminter.com/php-react/edit.php?id="+id);
  console.log(result);
  setPatient(result.data);
}

const {name,wallet_address,dob,email} = patient;


const [options, setOptions] = useState({
  autoClose: false,
  keepAfterRouteChange: false
});


// const [isLoading, setIsLoading] = useState(false);
  // const { contract } = useContract("0x7e45B8A00e2B1Fb9C7302982610219714E500576"); //NFT Rx9.0 - George Minter on mumbai
  // const { contract } = useContract("0x0967b8b29Df848E63239F5dc9314fDcff8839f7B"); //NFT Rx-10.1 - Struct, tokenURI w/ struct
  // const { contract } = useContract("0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15"); //NFT Rx-10.2 (NOT BASE/721A) - Struct, tokenURI w/ struct
  
  // const { contract } = useContract("0xEC44e3efeD46D6ffd392e32D6c99E04780Ce4d08"); // NFT RX -10.3 721 ONLY. FINALLY INCREMENT
  // const { contract } = useContract("0x03766B73D752D3155D6D8d7ff98D88ba656db7E0"); // NFT RX 10.4 - fix addy string 
  // const { contract } = useContract("0x3bcf6B3d11d2737A7F2E3D819D6E66F63C6f7a8e"); // NFT RX 10.5 - Two Calls
  // const { contract } = useContract("0xb1F31B06dA1FEca5Bd98D52E89b7AD3e9cbD23B6"); // 10.6 reworked svg section (Yellow, fixed duplicates, but SPACING breaking metadata)
  const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue. 
  
  
  

  const address = useAddress(); 

// Your NFT collection contract address
  const contractAddress = "0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF";

//docs erc-721
  // ERC721 - docs: 
  const { mutateAsync } = useTransferNFT(contract)

//docs useMetadata
  const { data } = useMetadata(contract)


// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
  const { data: nfts } = useOwnedNFTs(contract, address);

  // console.log(nfts)

// Contract must be an ERC-721 or ERC-1155 contract
  const {
    mutateAsync: transferNFT,
    // isLoading,
    // error,
  } = useTransferNFT(contract);



//*********************************** Address Transfer Form ********************* */

const [transferForm, setTransferForm] = useState({
  address: '',
});

const handleTransferFormFieldChange = (fieldName, e) => {
  setTransferForm({ ...form, [fieldName]: e.target.value })
}

const handleTransferSubmit = async (e) => {
  e.preventDefault();
  await mintNFT({ ...transferForm })
  
}

const mintNFT = async (transferForm) => {
  try {
    const data = await contract.call("mintNFT", [transferForm.address])

    console.log("contract call success", data)
    setTransferForm({ address: '' });
  } catch (error) {
    console.log("contract call failure", error)
  }
}


//*********************************** Rx Fields Form ************************** */
  // const [form, setForm] = useState({
  //   name: '',
  //   wallet_address: '',
  //   description: '',
  //   medication: '',
  //   dob: '', 
  //   quantity: ''
  // });

  const [form, setForm] = useState({
    name: '',
    wallet_address: '',
    description: '',
    medication: '',
    dob: '', 
    quantity: '',
    datePrescribed: ''
  });

  //Delay Issue: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
  // explained also: https://www.w3schools.com/react/react_useref.asp
  // const inputName = useRef(); 
  // const inputDOB = useRef(); 
  // const inputWalletAddress = useRef(); 
  const inputDescription = useRef(); 
  //put useRef() ON the select tag, not the option: https://stackoverflow.com/questions/70421676/react-search-filter-using-select-option-and-useref
  const inputMedication = useRef(); 
  const inputQuantity = useRef(); 

  const inputDatePrescribed = useRef(); //datePrescribed

//For Version 11.1:
  // const inputDoctor = useRef(); 
  // const inputNPI = useRef(); 
  // const inputDEA = useRef(); 

//*************************************************************************** Sun 10:38pm (5/7/23) removed in favor of useRef() to fix lag  */
  // const handleFormFieldChange = (fieldName, e) => {
  const handleFormFieldChange = (e) => {
    // setForm({ ...form, [fieldName]: e.target.value })
    setForm({ ...form, [e.target.name]: e.target.value })
  }
//********************************************************************************** */
 
  const handleSubmit = async (e) => { // useRef() example didn't have e param, but also no e.prevent: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
                                      // Per Crowd Funding example, I think we can call onSubmit={handleSubmit} without explicitly passing e
    e.preventDefault();
    console.log("e is this ese:", e)
    // await _createScript({ ...form, name: name, wallet_address: ethers.utils.getAddress(wallet_address) })

//useRef() remove lag solution: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
    // let wallet_address_Ref = inputWalletAddress.current.value;
    // let name_Ref = inputName.current.value;

    // setForm({ ...form, [e.target.name]: e.target.value })
    let description_Ref = inputDescription.current.value;
    let medication_Ref = inputMedication.current.value;
    // let dob_Ref = inputDOB.current.value;
    let quantity_Ref = inputQuantity.current.value;

    let date_prescribed_Ref = inputDatePrescribed.current.value;

    // await _createScript({ ...form, wallet_address: wallet_address, name: name, description: description_Ref, medication: medication_Ref, dob: dob,
    // quantity: quantity_Ref})

    // await _createScript({wallet_address, name, description_Ref, medication_Ref, dob, quantity_Ref});

    // const _createScript = async (form) => {

  //*********************************************************************** START OF MERGE FN TEST ************************************************/


  try {

    // const data = await contract.call("_createScript", [form.wallet_address, form.name, form.description, form.medication, form.dosage, form.quantity])
    // const data = await contract.call("_createScript", [wallet_address, name, description_Ref, medication_Ref, dob, quantity_Ref])
    const data = await contract.call("_createScript", [wallet_address, name, description_Ref, medication_Ref, dob, quantity_Ref, datePrescribed])
    

    console.log("Rx NFT Data Set", data)


    const sendRx = await contract.call("mintRx", [wallet_address]); 

    console.log("Rx NFT Sent to Patient!", sendRx);

    // alertService.success(`Success, The Rx NFT has been minted and sent to ${name} at address ${wallet_address}`, options);

    alert(`Rx has been minted and sent to ${name} at address ${wallet_address} and transaction ID of ${sendRx.receipt.transactionHash}`); 
    setForm({ name: '', wallet_address: '', description: '', medication: '', dosage: '', quantity: '', datePrescribed: '' });
    setTestNet(sendRx.receipt.transactionHash)


//from: https://stackoverflow.com/questions/67803090/how-to-get-erc-721-tokenid
// We tried calling .toNumber() but the returned value is string "0x0000000000000000000000000000000000000000000000000000000000000006"
// so get the last item in the string with soln: https://stackoverflow.com/questions/3884632/how-to-get-the-last-character-of-a-string
    // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-2);

    let tokenId_stepOneProfit = sendRx.receipt.events[0].args.tokenId;
    // let tokenId_step3profit = web3.toUtf8(tokenId_stepOneProfit);

  //https://ethereum.stackexchange.com/questions/101356/how-to-convert-bignumber-to-normal-number-using-ethers-js
  // Close, on 19 got 0.000000000000000019
  // HEX Big Gay number was 0x0000000000000000000000000000000000000000000000000000000000000013

  //##################################************************$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  CONQUERED BIGNUMBER!!! $$$$$$$$$$$$$$$$$$$$$$$$***********************###################################
    let step1Profit = ethers.utils.formatEther(tokenId_stepOneProfit.toString());
  // FINAL SOLUTION IN COMMENT AT BOTTOM: https://ethereum.stackexchange.com/questions/101356/how-to-convert-bignumber-to-normal-number-using-ethers-js
    const step3Profit = Math.round(parseFloat(step1Profit) * (10 ** 18));

 

    // let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;
    let getOpenSeaURL = `${contractAddress}/${step3Profit}`;
    
    setOpenSeaURL(getOpenSeaURL)
    setSuccess('block')


  } catch (error) {
    console.log("contract call failure", error)
    alertService.error(`Error with error message of ${error} :(`, options);
  }



//**************************************************************************END OF MERGE FN TEST FOR LAG ********************************/
    // await setRx({ ...form })
  }
       

  const [testNet, setTestNet] = useState('')
  const [openSeaURL, setOpenSeaURL] = useState('')
  const [success, setSuccess ] = useState('none')



            console.log("right before create script:", form)

  const _createScript = async (form) => {
  // const _createScript = async (wallet_address, name, description_Ref, medication_Ref, dob, quantity_Ref) => {
    

            console.log("inside create script:", form)

    try {
      // const data = await contract.call("setRx", [form.name, form.description, form.medication, form.dosage, form.quantity])
      // const data = await contract.call("_createScript", [form.wallet_address, form.name, form.description, form.medication, form.dosage, form.quantity])

//LAST WORKING SOLIDITY FN CALL (v.11.0) before useRef() change:
      const data = await contract.call("_createScript", [form.wallet_address, form.name, form.description, form.medication, form.dosage, form.quantity])
      // const data = await contract.call("_createScript", [wallet_address, name, description_Ref, medication_Ref, dob, quantity_Ref])

      console.log("Rx NFT Data Set", data)


      const sendRx = await contract.call("mintRx", [wallet_address]); 

      console.log("Rx NFT Sent to Patient!", sendRx);

      // alertService.success(`Success, The Rx NFT has been minted and sent to ${name} at address ${wallet_address}`, options);

      alert(`Rx has been minted and sent to ${name} at address ${wallet_address} and transaction ID of ${sendRx.receipt.transactionHash}`); 
      setForm({ name: '', wallet_address: '', description: '', medication: '', dosage: '', quantity: '' });
      setTestNet(sendRx.receipt.transactionHash)


//from: https://stackoverflow.com/questions/67803090/how-to-get-erc-721-tokenid
// We tried calling .toNumber() but the returned value is string "0x0000000000000000000000000000000000000000000000000000000000000006"
// so get the last item in the string with soln: https://stackoverflow.com/questions/3884632/how-to-get-the-last-character-of-a-string
      // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-1);
      let getTokenUri = sendRx.receipt.events[0].args.tokenId.toHexString();
      // then .toString(); ??

      let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;
      setOpenSeaURL(getOpenSeaURL)
      setSuccess('block')


    } catch (error) {
      console.log("contract call failure", error)
      alertService.error(`Error with error message of ${error} :(`, options);
    }
  }


  const mintRx = async (transferForm) => {
    try {
      const data = await contract.call("mintRx", [wallet_address])
  
      console.log("contract call success", data)
      setTransferForm({ address: '' });
    } catch (error) {
      console.log("contract call failure", error)
    }
  }



// 8:55pm R 5/4/23: Load all medications: 
  const loadMedications = async () => {
    setMedication([]);   
    const result = await axios.get("https://rxminter.com/php-react/viewmeds.php");
    console.log(result);
    setMedication(result.data.meds);
    // navigate('/');
  }


  // https://stackoverflow.com/questions/49277112/react-js-how-to-set-a-default-value-for-input-date-type
  let currentDate = new Date().toJSON().slice(0, 10);


  // const { data: totalCount, isLoading, error } = useTotalCount(contract);

  const medLabel = useRef('"inputGroup-sizing-lg"');

  return (
<>    



  

    
    {/* <form onSubmit={handleSubmit}> */}
          
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h3>Your Wallet Details: </h3>   
                            <ConnectWallet dropdownPosition={{
                                align: 'center',
                                side: 'bottom'
                              }} />
                        </div>
                    <div className="wallet_box_size">
                          <div className="connect">
                              
                          </div>
                    </div>
                    </div>  
                        <br />  
                        <hr></hr>
                        <br />
{/* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}
                    <div className="row">  
                        <div className="col-md-12 text-center">
                            <h3>Write Script for Patient: {name} To Address: {wallet_address.slice(0,6)}...{wallet_address.slice(37)}</h3>      
                    
                               
                        </div>
                    </div>

                  
{/* External Linking Solution From: https://herewecode.io/blog/react-router-link-to-external-url/ */}
                    <div className="box_size_success" style={{display:`${success}`, background:"#D4EDDA"}}>
                        <br></br>
                          
                          <h3 className="text-justify" style={{color:"#74A27F"}}><a href={`https://mumbai.polygonscan.com/tx/${testNet}`} target="_blank">
                          Success! Click Here to View the transaction on the Polygonscan explorer.
                        </a></h3>
                        <br></br>
                        
                        <h3 className="text-justify" style={{color:"#74A27F"}}><a href={`https://testnets.opensea.io/assets/mumbai/${openSeaURL}`} target="_blank">
                        Click Here to View the NFT on OpenSea.
                        </a></h3>
                        <hr></hr>
                        
                        <Link style={{color:"#74A27F"}} to="/view-script">
                            <h4 className="text-justify" style={{color:"#74A27F"}}>Click Here to View Your Scripts.</h4>
                        </Link>

                    </div>
                    
           

    {/* <form onSubmit={(e) => handleSubmit(e)}> */}
    <form onSubmit={handleSubmit}>
    <div className="box_size">
                    <div className="row">
                            <div className="col-md-6">Patient Name:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleFormFieldChange('name', e)} />  */}
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleFormFieldChange(e)} />   */}
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleFormFieldChange(e)} disabled/> */}
                                <input type="text" name="name" className="form-control" value={name} disabled/>
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-md-6">Patient DOB:</div>
                            <div className="col-md-6">
                      
                                <input type="string" name="dob" className="form-control" value={dob} disabled/>
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-md-6">Patient Address:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}
                                {/* <input type="text" name="wallet_address" className="form-control" onChange={(e) => handleChange(e)} />  */}
                                {/* <input type="text" name="wallet_address" className="form-control" value={form.wallet_address} onChange={(e) => handleFormFieldChange('wallet_address', e)} />  */}
                                {/* <input type="string" name="wallet_address" className="form-control" value={wallet_address} onChange={(e) => handleFormFieldChange(e)} disabled/> */}
                                {/* <input type="string" name="wallet_address" className="form-control" value={wallet_address} ref={inputWalletAddress} disabled/> */}
                                <input type="string" name="wallet_address" className="form-control" value={wallet_address} disabled/>
                            </div>
                    </div>

      
                    <div className="row">
                            <div className="col-md-6">Date Prescribed:</div>
                            <div className="col-md-6">
                      
                                <input type="date" name="datePrescribed" className="form-control" defaultValue={currentDate} ref={inputDatePrescribed} />
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-md-2">SIG:</div>
                            <div className="col-md-10">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="description" className="form-control" value={form.description} onChange={(e) => handleFormFieldChange('description', e)} />   */}
                                {/* <input type="text" name="description" className="form-control" value={form.description} onChange={(e) => handleFormFieldChange(e)} /> */}
                                <input type="text" name="description" className="form-control" ref={inputDescription} />
                            </div>
                    </div>

                    {/* <div className="row" style={{display: "none"}}>  */}
                   {/* <div className="row">
                            <div className="col-md-6">Medication:</div>
                            <div className="col-md-6">                          
                                <input type="text" name="medication" className="form-control" value={form.medication} onChange={(e) => handleFormFieldChange(e)} /> 
                            </div>
                    </div> */}

                    {/* <div className="row">
                        <div className="col-md-2">Original Med Select:</div> */}
                                {/* <select className="form-select" aria-label="Default select example" name="email" value={email} onChange={(e) => handleChange(e)}> */}
                                {/* Previously working with onChange as shown on line below: */}
                                {/* <select className="form-select" aria-label="Select A Medication" name="medication" onChange={(e) => handleChange(e)} > */}
                        {/* <select className="form-select" aria-label="Select A Medication" name="medication" ref={inputMedication} >
                            <option selected>Select A Medication</option>

                            {medication.map((medication, index) => (
                                    <option value={`${medication.name}`} key={`${index}`}>{medication.name}</option>                                   
                            ))}
                        </select>
                    </div> */}

        <div className="row">         
                    <div className="input-group mb-3">    
                    {/* <div className="input-group input-group-lg"> */}
                        <div className="input-group-prepend">
                            {/* <span className="input-group-text">Medication:</span> */}
                            <span class="input-group-text" ref={medLabel}>Medication: </span>
                            {/* <span>Medication:</span> */}
                        </div>

                        <select className="form-select" aria-label="Select A Medication" name="medication" ref={inputMedication} >
                            <option selected>Select A Medication</option>

                            {medication.map((medication, index) => (
                                    <option value={`${medication.name}`} key={`${index}`}>{medication.name}</option>                                   
                            ))}
                        </select>
                    
                    </div>
          </div> 
                    <div className="row">
                            <div className="col-md-6">Quantity Prescribed:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="quantity" className="form-control" value={form.quantity} onChange={(e) => handleFormFieldChange('quantity', e)} /> */}
                                {/* <input type="text" name="quantity" className="form-control" value={form.quantity} onChange={(e) => handleFormFieldChange(e)} />    */}
                                <input type="number" name="quantity" className="form-control" ref={inputQuantity} /> 
                            </div>
                    </div>


                    <div className="row">
                            <div className="col-md-6">Referring Doctor:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange('dosage', e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange(e)} /> */}
                                {/* <input type="text" name="dosage" className="form-control" value="Dr. Jorge Rucker, M.D." onChange={(e) => handleFormFieldChange(e)} disabled/> */}
                                {/* <input type="text" name="doctor" className="form-control" value="Dr. Jorge Rucker, M.D." ref={inputDoctor} disabled/> */}
                                <input type="text" name="doctor" className="form-control" value="Dr. Jorge Rucker, M.D." disabled/>
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-md-6">NPI #:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange('dosage', e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange(e)} /> */}
                                {/* <input type="text" name="dosage" className="form-control" value="1417960428" onChange={(e) => handleFormFieldChange(e)} disabled/> */}
                                {/* <input type="text" name="npi" className="form-control" value="1417960428" ref={inputNPI}  disabled/> */}
                                <input type="text" name="npi" className="form-control" value="1417960428" disabled/>
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-md-6">DEA #:</div>
                            <div className="col-md-6">
                                {/* <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} /> */}             
                                {/* <input type="text" name="name" className="form-control" value={form.name} onChange={(e) => handleChange(e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange('dosage', e)} />   */}
                                {/* <input type="text" name="dosage" className="form-control" value={form.dosage} onChange={(e) => handleFormFieldChange(e)} /> */}
                                {/* <input type="text" name="dosage" className="form-control" value="EB7344196" onChange={(e) => handleFormFieldChange(e)} disabled/> */}
                                {/* <input type="text" name="dea" className="form-control" value="EB7344196" ref={inputDEA}  disabled/> */}
                                <input type="text" name="dea" className="form-control" value="EB7344196" disabled/>
                            </div>
                    </div>
                    




</div>
                      <div className="row block_button_box_size">
                          <div className="col-md-12 text-center"> 
                              {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                              <button type="submit" className="btn btn-primary btn-lg btn-block"> Mint This Rx NFT For {name} </button>
                          </div>
                      </div> 

                </form>
            
  
                
</>


)

}
export default CreateScript