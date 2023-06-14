import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";
import axios from 'axios';

// import { contract, contractAddress } from '../constants';

import { ethers } from 'ethers';

// Original idea for useRef came from: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
// Confirmed process: https://flaviocopes.com/react-hook-useref/
import React, { useState, useEffect, useRef, useContext, getContext } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { FormField, CustomButton, ScriptSvgTemplate } from '../components';

import { alertService } from '../services';

import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, dayCalculatorDoc, convertNumberDateToRawString, convertBigNumberToFourDigitYear, convertBigNumberToRawString } from '../utils'
import { solidityContractAddress } from '../constants'


const FaxPageTest = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // const canvas = ScriptSvgTemplate;
        const ctx = canvas.getContext('2d');
        const svgData = ScriptSvgTemplate; // Replace with your SVG data
    
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          const imageDataURL = canvas.toDataURL('image/png');
          // Proceed to send the imageDataURL as a fax
        };
    
        image.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }, []);  

                // try{
                // // fax attempt
                // alertService.success(`Success, The Fax Has Been Sent to  ${name} at address ${wallet_address}`, options);

                // } catch (error) {
                //     console.log("contract call failure", error)
                //     alertService.error(`Error with error message of ${error} :(`, options);
                // }

  return (
        <>
                <h2>FaxPageTest</h2>
                <canvas ref={canvasRef} />

                <ScriptSvgTemplate />

 
        </>
  )
}
export default FaxPageTest