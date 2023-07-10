//created (1:04:25)
// import { useState } from "react";
import React, {useState} from 'react'
import { useContractRead, useContract } from "@thirdweb-dev/react";


//(1:12:58) - Pass in the FOUR props we defined in Navbar.js
const GetMedication = (props) => {

    const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
    const { data: getMedication } = useContractRead(contract, "getMedication", [props.tokenId])

    // const address = useAddress()
    // const { data: PtNfts } = useOwnedNFTs(contract, address);

    // const [getMedication,setGetMedication] = useState('')

    // const getMedicationString = async (tokenId) => {
    //     try{        
    //         const dataMedication = await contract.call("getMedication", [tokenId]);
    //             console.log("GetMedication Component fn call returned:", dataMedication);
    //             // setGetDober(data.toString())
    //             setGetMedication(dataMedication)

    //     } catch (error) {
    //         console.log("Error from getMedication K Call:", error)
    //     }
    //   }

    //  getMedicationString(props.tokenId);





// (1:13:37) - just return button with the props we pass in. Originally from Navbar.js. (-1:14:45)
  return (

        {getMedication}


    // <button
    //   type={btnType}
      // className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4
      // rounded-[10px] ${styles}`}
    //   className={styles}
    //   onClick={handleClick}
    // >
    // {title}
    // </button>
  )
}

export default GetMedication