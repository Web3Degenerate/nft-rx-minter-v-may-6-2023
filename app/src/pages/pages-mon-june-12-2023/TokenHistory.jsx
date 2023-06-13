import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite, ConnectWallet, useOwnedNFTs, useContractEvents, useNFT, ThirdwebNftMedia, MediaRenderer } from "@thirdweb-dev/react";
// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
//     useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";


import { addyShortner, formatDateTwoDigitYear, formatDateFourDigitYear, convertBigNumberToFourDigitYear, convertBigNumberToRawString } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

const TokenHistory = () => {

    const { id } = useParams();
    console.log("id passed in is:", id)
    const { contract } = useContract(solidityContractAddress);
    // console.log("contract passed in is:", contract)

    const { data: nftz } = useNFT(contract, id);

    const address = useAddress()
//From: https://youtu.be/VoM69TYbaqE?t=888
    // const { data: nft, isLoading: isLoadingNFT } = useNFT(contract, id)
    console.log("nftz data returned:", nftz)

    const { data: events, isLoading: isLoadingEvents } = useContractEvents(
        contract,
        "Transfer",
        {
            queryFilter: {
                filters: {
                    tokenId: id,
                },
                order: "asc",
            }
        }
    )


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

    //convert BigNumber to JS Number: https://docs.ethers.org/v5/api/utils/bignumber/

    console.log("EVENT IS", fillEvents)

    const medication_from_nft = nftz?.metadata.attributes[0].value;


    const currentDate = new Date();

        const options = {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };

    const pstDate = currentDate.toLocaleString('en-US', options).split(', ')[0];


  return (
<>



    {!isLoadingFillEvents ? (
        <>
                <h3>Rx NFT History for {nftz?.metadata.attributes[0].value} filled on {convertBigNumberToFourDigitYear(nftz?.metadata.attributes[11].value)}</h3>
                <h3>Patient: {nftz?.metadata.name}</h3>
                {/* <h5>Current Date in PST is {pstDate}</h5> */}
                <table className="table table-striped table-dark">
                        <thead>          
                            <tr>
                                <th style={{display: "none"}}>Key</th>

                                <th>Date Filled</th>

                                <th>Medication</th>

                                <th>Qty Filled</th>
                                                
                                <th>Qty Prescribed</th>    

                                <th>Qty Left</th>  

                                <th>Next Refill</th>            

                                <th>Pharmacy</th>

                                <th>Doctor</th>

                                <th>DEA #</th>
                            </tr> 
                        </thead>
                        <tbody className="table-striped">
                
                {/* {nfts?.filter((nft) => {
                  return nft.metadata.id.toString() === '25'
                }
                ).map((nft) => ( */}
                
                    {fillEvents.map((eventz, index) => (
    
                                <tr key={`${index}`}>
                                    <td style={{display: "none"}}>{index+1}</td>

                                    <td>{convertBigNumberToFourDigitYear(eventz.data.date_filled)}</td>

                                    {/* <td>{nftz.metadata.attributes[0].value}</td> */}

                                    <td>{medication_from_nft}</td>

                                    <td>{(eventz.data.quantity_filled_today).toNumber()}</td>

                                    <td>{(eventz.data.quantity_prescribed).toNumber()}</td>

                                    <td>{(eventz.data.quantity_unfilled).toNumber()}</td>

                                    <td>{convertBigNumberToFourDigitYear(eventz.data.next_available_fill_date)}</td>

                                    {/* <td>{eventz.data.pharmacy_name} {addyShortner(eventz.data.pharmacy_address)}</td> */}

                                    <td>{eventz.data.pharmacy_name}</td>

                                    <td>{eventz.data.doctor_name}</td>

                                    <td>{eventz.data.doctor_dea}</td>
                           
                                </tr>
                            ))}
                    
                        </tbody>
                    </table>
        </>
    ) : (
        <b>Loading Table...</b>
    )}
    

</>
  )
}
export default TokenHistory