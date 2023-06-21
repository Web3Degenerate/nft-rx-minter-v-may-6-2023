// import { useContract } from "@thirdweb-dev/react";
import axios from 'axios';

// Original idea for useRef came from: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
// Confirmed process: https://flaviocopes.com/react-hook-useref/
import React, { useState, useEffect, useRef } from 'react'

// const { contract } = useContract("0x0967b8b29Df848E63239F5dc9314fDcff8839f7B"); //NFT Rx-10.1 - Struct, tokenURI w/ struct

// export const { contract } = useContract("0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15");  //NFT Rx-10.2 - Struct/tokenUri 721 NOT BASE! (Mint zero erro)
// export const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata and hasPatientRole (5/23/23)

// Your NFT collection contract address"
// export const contractAddress = "0x46222c35eCA09F0eDDEF9B1faA14B7a236eD0C15";


// export const solidityContractAddress = "0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"; // 12.1 - Improved metadata and hasPatientRole (5/23/23)
// export const solidityContractAddress = "0xd82DdA4dFb571056A0FeE872c12498974873edAE"; // 12.2 - Attributes metadata attempt (5/28/23)
// export const solidityContractAddress = "0x1e7BFf055910E5674d45051B71fA4bf1b27a448F"; // 12.3 - Attributes metadata fixed spacing and extra } (5/28/23)

// export const solidityContractAddress = "0x642941DA2D6EeA5f2DA591B85010228cCd973588"; // 12.4 - Attributes spacing, bytes once (5/29/23)

// export const solidityContractAddress = "0x34c1DB481c1c68f15B560e873E963c3ADE9B742d"; // 12.5 - Event index / Metadata Doctors / DEA (6/3/23)



// const [contract, setContract] = useState([]);
// 8:55pm R 5/4/23: Load all medications: 


                    // const loadContract = async () => {
                    //     // setContract([]);   
                    //     // const result = await axios.get("https://rxminter.com/php-react/constants.php");
                    //     const result = await axios.get("https://rxminter.com/php-react/constants.php?id="+id);
                    //     // console.log(result);
                    //     // setContract(result.data.contract);

                    //     let lFGMN = result.contract_address;
                    //     return lFGMN;

                    //   }


  

  // export const solidityContractAddress = "0x9DF1b4b34B0944DB3B09010a73215A910150fE22"; // 12.6 - Event index / Fixed Metadata Doctors / DEA (6/4/23)
  // export const solidityContractAddress = "0x1610bD548B2338c892d47104CDA00E523e09ef6C"; // 13.0 - Massive rewrite / Fixed Metadata Doctors / DEA (6/4/23)
  export const solidityContractAddress = "0x4779320Da5E3AD1858A39422d62B5eeDb7fD6C57"; // 13.1 - Removed indexed pharma msg.sender / (6/12/23 Nuggets win first title)


  

// const result = await axios.get("https://rxminter.com/php-react/constants.php?id=1");
// export const solidityContractAddress = result.data.contract_address; // 12.6 - Event index / Fixed Metadata Doctors / DEA (6/4/23)



// export const loadContract = async () => {
//     const result = await axios.get("https://rxminter.com/php-react/constants.php?id="+id);
    
//     let LFGMN = result.data.contract_address;
//     return LFGMN;
// }

// loadContract();
// export const solidityContractAddress = LFGMN;

// const solidityContractAddressMN = async () => {
//     const result = await axios.get("https://rxminter.com/php-react/constants.php?id=1");
//     const solidityContractAddress = result.data.contract_address; // 12.6 - Event index / Fixed Metadata Doctors / DEA (6/4/23)
//     return solidityContractAddress;
// }



// export const solidityContractAddress = solidityContractAddressMN();