import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, Web3Button, 
    useTransferNFT, MediaRenderer, useMetadata } from "@thirdweb-dev/react";
  // import "../styles/Home.css";
  // import "../styles/globals.css";
  
  import React, { useState } from 'react' 
  
  import { Link, useNavigate } from 'react-router-dom'
  
  import { FormField, CustomButton } from '../components';
  
  const ViewScripts = () => {
  
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
  
   
    return (
  <>
    <h1 className="display-4">View / Fill Your Scripts </h1>
  
  <div className="nft_box_size">
  
          <div className="row">
              <div className="col-md-4 text-left">
                                                    
              </div>
  
              <div className="col-md-4 text-center">
                    <h1>Your Wallet Details: </h1>    
                             <br></br>   
                             <hr></hr>
                             {/* <div className="connect">
                                    <ConnectWallet dropdownPosition={{
                                      align: 'center',
                                      side: 'bottom'
                                    }} />
                            </div> */}
              </div>
  
              <div className="col-md-4 text-right">
                            <div className="connect">
                                    <ConnectWallet dropdownPosition={{
                                      align: 'center',
                                      side: 'bottom'
                                    }} />
                            </div>             
              </div>
          </div> 
  
    
  
  {/* {address && (
    <> */}
        <h1 className="display-4" style={{color:"white"}}>View / Fill Your Scripts (Patient View) </h1>
        <h3 className="text-muted" style={{color:"white"}}>Your connected with address: {addyShortner(address)}</h3>
    {/* </>
      )} */}
  
  
      <hr></hr>
  <br></br>
  <br></br>
                <div className="row">
                              
                      <div className="col-lg-4">
                              <div className="ibox">
                                  <div className="ibox-content">
      
                              <div className="card">
                                    <h5 className="card-header">Patients</h5>
                                    <div className="card-body">
                                            <h5 className="card-title">h5</h5>
                                            <p className="card-text"></p>
                                        
  
                                              {nfts?.map((nft) => (
                                                  <div key={nft.metadata.id.toString()}>
                                                      
                                                  <ThirdwebNftMedia metadata={nft.metadata}
                                                    background="Hello dthere"
                                                  /> 
                                                  {/* <MediaRenderer metadata={nft.metadata}/> */}
  
                                                      <p>Patient: {nft.metadata.name} </p>
                                                      <p>DOB: {nft.metadata.dob}</p>
                                                      <p>SIG: {nft.metadata.description}</p>
                                                      <p>Medication: {nft.metadata.medication}</p>
                                                      <p>Quantity: {nft.metadata.quantity}</p>
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
                                                  </div>
                                              ))} 
  
  
                                      </div>
                                </div>
                                              
                                  </div>
                              </div>
                      </div>
  
  
  
  
                      <div className="col-lg-4">
                          <div className="ibox">
                              <div className="ibox-content">
  
  
  
                              </div>
                          </div>
                      </div>
  
  
  
                      <div className="col-lg-4">
                          <div className="ibox">
                              <div className="ibox-content">
  
  
  
                              </div>
                          </div>
                      </div>
  
      </div> {/* <!--END of Row WITH THREE CARDS FROM @Step3Profit--> */}
      
  
  
  
       
  
  </div>{/* [End of "parent" nft_box_div ] - (16:00) - use <ThirdwebNftMedia /> tag to display image */}
  
  
      {/* <div className={styles.container}> */}
      <div className="container">
            <div className="cards">
                  {nfts?.map((nft) => (
  
                        <div key={nft.metadata.id.toString()} className="card">
                                    
                                <ThirdwebNftMedia metadata={nft.metadata} /> 
                                {/* <MediaRenderer metadata={nft.metadata}/> */}
  
                                    <p><b>Patient:</b> {nft.metadata.name} </p>
                                    <p><b>DOB:</b> {nft.metadata.dob}</p>
                                    <p><b>SIG:</b> {nft.metadata.description}</p>
                                    <p><b>Medication</b> {nft.metadata.medication}</p>
                                    <p><b>Qty:</b> {nft.metadata.quantity}</p>
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
                          </div>
                    ))} 
            </div>
      </div>
  
  
  
  
  
  </>
    )
  }
  export default ViewScripts