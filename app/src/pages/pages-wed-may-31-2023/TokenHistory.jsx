import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite, ConnectWallet, useOwnedNFTs, useContractEvents, useNFT, ThirdwebNftMedia, MediaRenderer } from "@thirdweb-dev/react";
// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
//     useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";


import { addyShortner, formatDateTwoDigitYear, formatDateFourDigitYear } from '../utils'
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
                    // script_token_number: id,
                    // patient_address: '0xE3cEA19e68430563f71C591390358e54d1fa857a'
                    patient_address: "0xE3cEA19e68430563f71C591390358e54d1fa857a"
                },
                order: "desc",
            }
        }
    )

    //convert BigNumber to JS Number: https://docs.ethers.org/v5/api/utils/bignumber/

    console.log("FUCKING EVENT IS", fillEvents)


  return (
<>

    <h1>Rx NFT History for {nftz?.metadata.attributes[0].value} filled on {nftz?.metadata.attributes[6].value}</h1>
    <h3>Patient: {nftz?.metadata.name}</h3>

    {!isLoadingEvents ? (
        <>
            <p>Events por la tarde</p>

            {/* <ThirdwebNftMedia 
                metadata={nftz?.metadata}
                width="250px"
                height="250px"
            /> */}

            {/* <ThirdwebNftMedia metadata={nftz?.metadata}
                width="250px"
                height="250px"    
            />  */}

            <MediaRenderer                               
                // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMCB8IFF0eSBMZWZ0OiAzODwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNDAiIGNsYXNzPSJiYXNlIj5NZWRpY2F0aW9uOiBBbWxvZGlwaW5lIDUgbWcgfCBSeCBJdGVtICMxPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSI2MCIgY2xhc3M9ImJhc2UiPkRhdGUgUHJlc2NyaWJlZDogMjAyMy0wNS0xNCB8IERhdGUgRmlsbGVkOiAgfCBOZXh0IFJlZmlsbCBEYXRlOiA8L3RleHQ+PC9zdmc+"
                // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMTYgfCBRdHkgTGVmdDogMjI8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjQwIiBjbGFzcz0iYmFzZSI+TWVkaWNhdGlvbjogQW1sb2RpcGluZSA1IG1nIHwgUnggSXRlbSAjMTwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjAiIGNsYXNzPSJiYXNlIj5EYXRlIFByZXNjcmliZWQ6IDIwMjMtMDUtMTQgfCBEYXRlIEZpbGxlZDogMjAyMy0wNS0yMCB8IE5leHQgUmVmaWxsIERhdGU6IDIwMjMtMDYtMjA8L3RleHQ+PC9zdmc+"
                src={nftz?.metadata.image}
                // metadata={nft.metadata}
                // className="view-scripts-image"
                width="250px"
                height="250px"
            />

            <div>
                <h3>Traits</h3>
                {nftz?.metadata.attributes.map((attribute, index) => (
                    <div key={index}>
                       <strong>{attribute.trait_type}</strong>: {attribute.value}
                    </div>
                ))}
                
            </div>
            <div>
                <h3>History:</h3>
                    {!isLoadingEvents && (
                        <div>
                            {events.map((event, index) => (
                                <div key={index}>
                                    <strong>From:</strong> {event.data.from}  
                                    <strong>To:</strong> {event.data.to}

                                    
                                </div>
                            ))}
                        </div>
                    )}
            </div>

        </>
    ) : (
        <p>loading events...</p>
    )}
    

    {!isLoadingFillEvents ? (

        <>
                <h3>Rx NFT History for {nftz?.metadata.attributes[0].value} filled on {nftz?.metadata.attributes[6].value}</h3>
                <h3>Patient: {nftz?.metadata.name}</h3>
                <table className="table table-striped table-dark">
                        <thead>          
                            <tr>
                                <th style={{display: "none"}}>Key</th>

                                <th>Date Filled</th>

                                <th>Medication</th>

                                <th>Qty Filled</th>
                                                
                                <th>Qty Prescribed</th>    

                                <th>Qty Left</th>              

                                <th>Pharmacy</th>

            
                            </tr> 
                        </thead>
                        <tbody className="table-striped">
                
                
                            {fillEvents.map((eventz, index) => (
                        
                                <tr key={`${index}`}>
                                    <td style={{display: "none"}}>{index+1}</td>

                                    <td>{eventz.data.date_filled}</td>

                                    <td>{nftz.metadata.attributes[0].value}</td>



                                    <td>{(eventz.data.quantity_filled_today).toNumber()}</td>

                                    <td>{(eventz.data.quantity_prescribed).toNumber()}</td>

                                    <td>{(eventz.data.quantity_unfilled).toNumber()}</td>





                                    <td>{addyShortner(eventz.data.pharmacy_address)}</td>
                                
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