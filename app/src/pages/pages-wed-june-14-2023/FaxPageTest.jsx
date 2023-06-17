import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";
import axios from 'axios';

//************************************************************************************************************************** *//
// ****** TUTORIAL RAYS ON REACT IMAGE UPLAOD - MY MAN IN INDIA: https://www.youtube.com/watch?v=fFx4Pbe9dAs *************** //
//************************************************************************************************************************** *//



import { ethers } from 'ethers';

// Original idea for useRef came from: https://dev.to/kevinkh89/how-to-solve-input-delay-lagging-in-react-j2o
// Confirmed process: https://flaviocopes.com/react-hook-useref/
import React, { useState, useEffect, useRef, useContext, getContext } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { FormField, CustomButton, ScriptSvgTemplate } from '../components';

import { alertService } from '../services';

import { scriptImageTest } from '../assets';

import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, dayCalculatorDoc, convertNumberDateToRawString, convertBigNumberToFourDigitYear, convertBigNumberToRawString } from '../utils'
import { solidityContractAddress } from '../constants'


const FaxPageTest = () => {

    const canvasRef = useRef(null);
    // const [canvasRef, setCanvasRef] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // const canvas = canvasRef;
        const ctx = canvas.getContext('2d');
        const svgData = ScriptSvgTemplate(); // Replace with your SVG data
    
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          const imageDataURL = canvas.toDataURL('image/png');
          // Proceed to send the imageDataURL as a fax
          console.log("image is: ", image)
        };
    
        image.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }, []);  

// for Alert Options
    const [options, setOptions] = useState({
    autoClose: false,
    keepAfterRouteChange: false
    });

    // const handleChange=(e)=>{
    //     setPatient({...patient,[e.target.name]: e.target.value })
    //     // console.log(e);
    //     console.log("Patient in handleChange: ",patient);
    // }

    const [scriptFax, setScriptFax] = useState({
        script_image_name: "script-Image-Test-6.14.23.jpg",
        script_image_location: "fileupload/images/script-Image-Test-6.14.23.jpg",
        pharmacy_fax: "17162106152"
        // script_image: "Files/script-Image-Test-6.14.23.jpg"
    });
    // const {script_image_name,script_image} = patient; 

    const [selectedFile, setSelectedFile] = useState(null)
//https://youtu.be/fFx4Pbe9dAs?t=773
    const [msg, setMsg] = useState('')

    console.log('scriptFax pharmacy_fax BEFORE handleClickedr is ', scriptFax.pharmacy_fax)
    console.log('scriptFax pharmacy_fax BEFORE handleClickedr is ', scriptFax.script_image_location)


    const handleClicker = e => {
        // e.preventDefault(); 
            // if (confirm(`Send Script Image named ${scriptFax.script_image_name} to Pharmacy? `) == true){            
                setSelectedFile(e.target.files[0])
                // setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id, pharmacyName: options[e.target.selectedIndex].text })
                // setScriptFax({...scriptFax,script_image: e.target.files[0]})
                console.log("selected file is: **",e.target.files[0])
                console.log("name of selected file is: ", e.target.files[0].name)

                setScriptFax({...scriptFax, script_image_name: e.target.files[0].name, script_image_location: `fileupload/images/${e.target.files[0].name}`});

                console.log("selectedFile inside handleClicker is: ",selectedFile)
                console.log("scriptFax inside handleClicker (after setScriptFax) is: ",scriptFax)
                    // setScriptFax({script_image_name: "script-Image-Test-6.14.23", script_image: scriptImageTest});

                            // const selectedFile = event.target.files[0];
                                // const selectedFile = scriptImageTest;

                                // if (selectedFile) {
                                // // uploadImage(selectedFile);
                                // sendFax(selectedFile);
                                // }
            // }
    }


    console.log('selectedFile outside of handleClicker is: ', selectedFile)
    console.log('scriptFax outside of handleClicker is: ', scriptFax)
    console.log('scriptFax pharmacy_fax outside of handleClickedr is ', scriptFax.pharmacy_fax)



    const handleSubmitter = async (e) => {
        e.preventDefault();
        // https://youtu.be/fFx4Pbe9dAs?t=474
        const formData = new FormData(); 
        formData.append("fileData", selectedFile);
        // formData.append("script_image_name", "script-Image-Test-6.14.23.jpg");
        
        try{
                    // await axios.post("https://rxminter.com/srfax/Queue_Fax.php", scriptFax).then((result)=>{
                    await axios.post("https://rxminter.com/srfax/fileupload/insert-image.php", formData
                                // , {
                                //     headers: {
                                //         'accept': 'application/json',
                                //         'Accept-Language': 'en-US,en;q=0.8',
                                //         'Content-Type': `multipart/form-data; boundary=${scriptFax._boundary}`,
                                //       },
                                //     }
                    ).then((result)=>{
                        
                        console.log(result);
                    
                        if(result.data.status == "valid"){
                        // if(result.data.valid){
                            // alert('Upload Complete')
                            // alertService.success(`Success, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);
                            alertService.success(`Success, The Image has been uploaded!`, options);
                            setMsg('Script Uploaded To The Pharmacist Successfully!')
                            sendFax();
// *********************** THEN CALL THE sendFax() function with the name stirngs to find the image uploaded in this handleSubmitter function.                          

                        }else{
                            alert('There is a problem uploading this Image. Please try again.');
                            alertService.error(`Error with error message of :(`, options);
                            setMsg('Error, Script was not uploaded. Please try again.')
                        }
                    }); //end of axios post call
    
        }catch(error){
                alertService.error(`Catch Clause Error with message of ${error} :(`, options);
                console.log("Catch Clause Error Message: ",error);
        }

    }


// ***************************************** SEND THE FAX ******************************************************************** //
   
    // const fetchFax = () => {

    //     try{
    //         fetch("https://rxminter.com/srfax/Queue_Fax.php", {
    //             "method": "POST",
    //             "headers": {
    //                 "Content-Type": "application/json; charset=utf-8"
    //             },
    //             "body": JSON.stringify(scriptFax)
    //         }).then(function(response){
    //             return response.text();
    //         }).then(function(data){
    //             console.log("fetch fax response:",data)
    //         })
    //     }catch(error){
    //         console.log(error); 
            
    //     }
    // }



    const sendFax = () => {
 
        // const formData = new FormData();
                                // formData.append('script_image_name', 'script-Image-Test-6.14.23.jpg', 'script_image', file);
        // formData.append('script_image_name', 'script-Image-Test-6.14.23.jpg');
        // formData.append('script_image', "images/script-Image-Test-6.14.23.jpg");
                                // formData.append('blow_me', "false");

        // setScriptFax({script_image_name: "script-Image-Test-6.14.23.jpg", script_image: "Files/script-Image-Test-6.14.23.jpg"});

        // console.log("formData state inside sendFax() fn is: ",formData);
        // console.log("scriptFax state inside sendFax() fn is: ",formData);

    try{
        // await axios.post("https://rxminter.com/srfax/Queue_Fax.php", scriptFax).then((result)=>{
        axios.post("https://rxminter.com/srfax/Staging_Queue_Fax.php", scriptFax
        // , {
        //     headers: {
        //         'accept': 'application/json',
        //         'Accept-Language': 'en-US,en;q=0.8',
        //         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        //       },
        //     }
        ).then((result)=>{
        
        
            console.log(result);

            alertService.success(`Success, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);
         
            if(result.data.status == 'valid'){
                // navigate('/');
                alert('HOLY SHIT! IT WORKS! IT WORKS!')
                alertService.success(`Valid, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);
            }else{
                alert('There is a problem sending this fax script to the pharmacy. Please try again.');
                alertService.error(`Error with error message of :(`, options);
            }
        }); //end of axios post call

        }catch(error){
            alertService.error(`Catch Clause Error with message of ${error} :(`, options);
        }
    }
    

    // console.log("scriptFax state OUTSIDE OF sendFax() fn is: ",scriptFax);

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
                
                <hr></hr>
                <h2>{msg}</h2>
                <img src={scriptImageTest} />
                <hr></hr>
{/* INDIAN FORM START ******************************************* */}
            <button className="btn btn-danger" onClick={sendFax}>Send Fax Now</button>


                        <form onSubmit={handleSubmitter}>           
                        {/* <form onSubmit={e => handleSubmitter(e)}> */}
                            {/* <input type="file"  onChange={e => handleClicker(e)}/> */}
                            <input type="file"  onChange={handleClicker}/>

                            <button type="submit" className="btn btn-success">Send Script To Pharmacy</button>
                        </form>
{/* INDIAN FORM END ******************************************* */}
                <hr></hr>
               
                    <div className="svg-component">
                        <ScriptSvgTemplate />
                    </div>

                <canvas ref={canvasRef} >

                </canvas>
               
 
        </>
  )
}
export default FaxPageTest