// Initial SPA demo
import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, Web3Button, 
    useTransferNFT, MediaRenderer, useMetadata } from "@thirdweb-dev/react";
  import "./styles/Home.css";
  import "./styles/globals.css"
  
  import { useState } from 'react'
  
  import { Link, useNavigate } from 'react-router-dom'
  
  import { FormField, CustomButton } from './components';
  
  // import "./styles.css";
  
  export default function Home() {
  
  
  
    // const [isLoading, setIsLoading] = useState(false);
  // (12:51) - Connect to the Contract Address Hosted by ThirdWeb: https://youtu.be/cKc8JVl_u30?t=771
    // const { contract } = useContract("0x2eEdF9Dd8Ae2960546f756a63F905c5854890807");
    // const { contract } = useContract("0x5367Be391936d5c73aF2b551781f098d0E3Dbf53");
    // const { contract } = useContract("0x9f3379F4C7e5Cd6Af773BfbaeB23b228dD40A5D1"); //NFT Rx 2.0
    // const { contract } = useContract("0xeC05aDf98C1aA72cD2Fab55ae5a3c48645Da369E"); //NFT Rx 3.0
    // const { contract } = useContract("0x82825E8657035F510162f137bfE5915Af77A887F"); //NFT Rx4.0
    // const { contract } = useContract("0x2954E64eC962983ce6Fe913c0f61953A2ac21099"); //NFT Rx5.0
    // const { contract } = useContract("0xD5e32C882E4eb5b9956A7C7b8D49871d61E8A235"); //NFT Rx6.0
    // const { contract } = useContract("0x75D37883ae821720cC6fb09619Eb76CCBCA65Cf4"); //NFT Rx8.0 AVAX C-chain
    // const { contract } = useContract("0xF0d215f26Cf3A2e974626c05deeB2E515a0acd36"); //NFT Rx9.0 - George Minter on mumbai
    const { contract } = useContract("0x7e45B8A00e2B1Fb9C7302982610219714E500576"); //NFT Rx9.0 - George Minter on mumbai
    
  
  
    const address = useAddress(); 
  
  // Your NFT collection contract address
    const contractAddress = "0x7e45B8A00e2B1Fb9C7302982610219714E500576";
    // const walletAddress = address;
    // const tokenId = 0;
  
  //docs erc-721
    // ERC721 - docs: 
    const { mutateAsync } = useTransferNFT(contract)
  
  //docs useMetadata
    const { data } = useMetadata(contract)
  
    // const { data: nftz } = contract.erc721.get(13)

  // (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
    const { data: nfts } = useOwnedNFTs(contract, address);
  
    console.log(nfts)
  
  // Contract must be an ERC-721 or ERC-1155 contract
    // const { contract } = useContract(contractAddress);
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
    const [form, setForm] = useState({
      name: '',
      description: '',
      medication: '',
      dosage: '', 
      quantity: ''
    });
  
    const handleFormFieldChange = (fieldName, e) => {
      setForm({ ...form, [fieldName]: e.target.value })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await setRx({ ...form })
      
    }
  
    const setRx = async (form) => {
      try {
        const data = await contract.call("setRx", [form.name, form.description, form.medication, form.dosage, form.quantity])
  
        console.log("contract call success", data)
        setForm({ name: '', description: '', medication: '', dosage: '', quantity: '' });
  
      } catch (error) {
        console.log("contract call failure", error)
      }
    }
  
  
  
    return (
      <div className="container">
        <main className="main">
  
  
            <h1 className="title">
  
  
        
            
                Welcome to <a href="#">dApp Scripts 9.0</a>!
              </h1>
              {/* <h1 className="title">
                Welcome to <a href="https://thirdweb.com/">thirdweb</a>!
              </h1>
  
              <p className="description">
                Get started by configuring your desired network in{" "}
                <code className="code">src/main.jsx</code>, then modify the{" "}
                <code className="code">src/App.jsx</code> file!
              </p> */}
  
              <div className="connect">
                <ConnectWallet dropdownPosition={{
                  align: 'center',
                  side: 'bottom'
                }} />
              </div>
  
              {/* <div className="grid">
                    <a href="https://portal.thirdweb.com/" className="card">
                      <h2>Portal &rarr;</h2>
                      <p>
                        Guides, references and resources that will help you build with
                        thirdweb.
                      </p>
                    </a>
  
                    <a href="https://thirdweb.com/dashboard" className="card">
                      <h2>Dashboard &rarr;</h2>
                      <p>
                        Deploy, configure and manage your smart contracts from the
                        dashboard.
                      </p>
                    </a>
  
                    <a href="https://portal.thirdweb.com/templates" className="card">
                      <h2>Templates &rarr;</h2>
                      <p>
                        Discover and clone template projects showcasing thirdweb features.
                      </p>
                    </a>
              </div> */}
          
      {/* <ThirdwebNftMedia metadata={nft.metadata}/> 
          <MediaRenderer src={nft.metadata.image} />
      */}
  
  
  
   
  <p>----------------------------------------------------------------------</p>
  
  
  {address ? (
  <>
       <h1 className="title">Write A Script - (Doctor View) </h1>
        <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
            <div class="mb-3">
                <FormField 
                  labelName="Patient Name"
                  placeholder="Enter patient's name"
                  inputType="text"
                  value={form.name}
                  handleChange={(e) => handleFormFieldChange('name', e)}
                />
            </div>
            <p>
                <FormField 
                  labelName="Description  "
                  placeholder="sig"
                  inputType="text"
                  value={form.description}
                  handleChange={(e) => handleFormFieldChange('description', e)}
                />
            </p>
            <p>
                <FormField 
                  labelName="Medication  "
                  placeholder="Enter the Medication"
                  inputType="text"
                  value={form.medication}
                  handleChange={(e) => handleFormFieldChange('medication', e)}
                />
            </p>
            <p>
                <FormField 
                  labelName="Dosage  "
                  placeholder="Enter the dosage"
                  inputType="text"
                  value={form.dosage}
                  handleChange={(e) => handleFormFieldChange('dosage', e)}
                />
            </p>
            <p>          
                <FormField 
                  labelName="Quantity  "
                  placeholder="Enter the quantity prescribed"
                  inputType="text"
                  value={form.quantity}
                  handleChange={(e) => handleFormFieldChange('quantity', e)}
                />
            </p>
  
            <CustomButton 
                    btnType="submit"
                    title="Set The Fields For The Prescription"
                    styles="btn btn-success"
            />
  
        </form>
  </>
  ) : (
    <h2>Connect Your Wallet To Write A Script</h2>
        )}
  
  
  
                <p>--------------------------------------------------------</p>
  
  
  
                
                <p>--------------------------------------------------------</p>
  
  {address && (
      <form onSubmit={handleTransferSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        
            <FormField 
              labelName="Patient's Wallet Address:"
              placeholder="Enter patient's polygon wallet address"
              inputType="text"
              value={transferForm.address}
              handleChange={(e) => handleTransferFormFieldChange('address', e)}
            />
  
            <CustomButton 
                btnType="submit"
                title="Send Prescription To Patient's Wallet"
                styles="btn btn-success"
            />
      </form>
  )}
  
  
  
  <p> --------------------------------------------------------- </p>
  
  {address && (
      <h1 className="title">View / Fill Your Scripts (Patient View) </h1>
      )}
  
            {/* (16:00) - use <ThirdwebNftMedia /> tag to display image */}
              {nfts?.map((nft) => (
                <div key={nft.metadata.id.toString()}>
                    
                <ThirdwebNftMedia metadata={nft.metadata}/> 
  
                    <p>Patient: {nft.metadata.name}</p>
                    <p>SIG: {nft.metadata.description}</p>
                    <p>Medication: {nft.metadata.medication} {nft.metadata.dosage}</p>
                    <p>Quantity: {nft.metadata.quantity}</p>
                    {/* <p>Status: {nft.metadata.unique_serial_number} </p>
                    <p>Script Number: {nft.metadata.medication}</p> */}                 
                    
  
                    <Web3Button 
  
                    contractAddress={contractAddress}
                    action={() =>
                        transferNFT({
                          to: "0x54F8B8694833422d09AdF9f5d5D469243e04C57e", // Address to transfer the token to
                          tokenId: nft.metadata.id, // Token ID to transfer
                        })
                      }
                    >
                
                    Submit Your Rx NFT To Your Pharmacist
                   
                    </Web3Button>
   
                    {/* {address="0x54F8B8694833422d09AdF9f5d5D469243e04C57e" && (
  
                      <Web3Button  
                        contractAddress={contractAddress}
                        action={(contract) => contract.erc721.burn(2)}
                        >
                        Fill this Rx and burn this NFT  
                      </Web3Button>
  
                    )} */}
                    
  
                      
                </div>
  
        
  
              ))}      
          
              <hr></hr>
        {/* (17:10) - Use ThirdWeb's Web3Button to mint nfts from our frontend 
                parameters are (tokenId, quantity)
                contract.erc1155.claim(0, 1)
  
                action={(contract) => contract.erc1155.claim(0, 1)}
  
                <Web3Button 
                  contractAddress={"0x5367Be391936d5c73aF2b551781f098d0E3Dbf53"}
                  action={(contract) => contract.erc721.claim(address, 1)}
                >
                    Submit Your Rx NFT To Your Pharmacist
                </Web3Button>
  
        */}
  
                {/* <Web3Button
                  contractAddress={contractAddress}
                  action={() =>
                      transferNFT({
                        to: walletAddress, // Address to transfer the token to
                        tokenId: tokenId, // Token ID to transfer
                      })
                    }
                  >
                    Transfer
                </Web3Button> */}
  
                {/* <Web3Button
                  contractAddress={contractAddress}
                  action={(contract) => contract.call("setRx", ["Patient: John Doe", "Medication: Amlodipine 50mg", "Sig: i po qhs: Your instructions are to take one pill, by mouth, at bedtime.", "John Doe", "take bid." ])}
                  >
                    Fill Rx Information
                </Web3Button>
  
  
                <Web3Button
                  contractAddress={contractAddress}
                  action={(contract) => contract.call("mintNFT", ["0xfa1B88F6a4Efa3Fc139492DC1B9cc5A3d66fDDC9"])}
                  >
                    Send Rx To Patient
                </Web3Button> */}
  
  
      {/* <h1 className="title">Pharmacy View</h1>  */}
  
  
      {/* var data = await contract.ERC721.Burn("{{token_id}}"); */}
                {/* <Web3Button 
                  contractAddress={"0x5367Be391936d5c73aF2b551781f098d0E3Dbf53"}
                  accentColor="red"
                  action={(contract) => contract.call("evolve")}
                >
                Get Confirmation of Completed Refill.
                </Web3Button> */}
  
   
        </main>
      </div>
    );
  }
  