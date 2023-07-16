// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, Web3Button, 
//   useTransferNFT, MediaRenderer, useMetadata } from "@thirdweb-dev/react";
// import "./styles/Home.css";
// import "./styles/globals.css";
//weird error "The requested module '/node_modules/.vite/deps/@thirdweb-dev_react.js?v=71415013' does not provide an export named 'NFTCollection'"
// (at App.jsx:2:47): so we removed NFTCollection from the thirdweb-dev/react import above.

// import { useState } from 'react'

import { Route, Routes } from 'react-router-dom'
  //removed: Link, useNavigate, 

// import { FormField, CustomButton } from './components';

import { Navbar } from './components';

import { CreateScript, ViewScripts, AddPatient, EditPatient, Home, EditPharmacy, 
  ListPharmacies, PharmacyReview, PharmacyDashboard, PatientHistory, TokenHistory, TokenHistoryOld, 
  FaxPageTest, PatientFaxScript, CreateImagingOrders, AddPharmacy } from './pages';

import { BpDashboard, ViewPatientReads } from './dct';


// import "./styles.css";
// import "./styles/App.css";

// Alerts from: https://react-bootstrap.github.io/getting-started/introduction/
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

//from https://stackblitz.com/edit/react-hooks-bootstrap-alerts?file=_services%2Falert.service.js,app%2FApp.jsx
import { Alert } from './components';


// export default function Home() {
export default function App() {


return (
  <>
    <Navbar />
      <main className="container">
          <Alert />
          <div>
   
              <Routes>

              {/* main app container */}
                  {/* <div className="jumbotron p-4">
                      <div className="container text-center"> */}

                            
                              <Route path="/" element={ <Home /> } />

                              {/* <Route path="/patient-list" element={ <ListPatients /> } /> */}

                              <Route path="/add-patient" element={ <AddPatient /> } />
                              <Route path="/edit-patient/:id" element={ <EditPatient /> } />

                              <Route path="/mint-script/:id" element={ <CreateScript /> } /> 
                              <Route path="/mint-imaging-order/:id" element={ <CreateImagingOrders /> } /> 

                              
                              <Route path="/view-script" element={ <ViewScripts /> } /> 
                              <Route path="/patient-fax-script/:id" element={ <PatientFaxScript /> } />

                              <Route path="/pharmacy-list" element={ <ListPharmacies /> } />
                              <Route path="/add-pharmacy" element={ <AddPharmacy /> } />


                              <Route path="/edit-pharmacy/:id" element={ <EditPharmacy /> } />

                              <Route path="/pharmacy-review-nft/:id" element={ <PharmacyReview /> } />
                              <Route path="/pharmacy-dashboard" element={ <PharmacyDashboard /> } />
                              
                              <Route path="/patient-history/:id" element={ <PatientHistory /> } />

                              <Route path="/prescription-history/:id" element={ <TokenHistory /> } />

                              <Route path="/token-detail/:id" element={ <TokenHistoryOld /> } />

                              <Route path="/fax-test/" element={ <FaxPageTest /> } />


                              <Route path="/bp-dashboard" element={ <BpDashboard /> } />
                              <Route path="/view-your-reads/:id" element={ <ViewPatientReads /> } />


                              
                              


                            {/* <Route path="/add-medication/" element={ <EditPatient /> } /> */}
                            {/* <Route path="/all-scripts/" element={ <AllScripts /> } /> */}
                      {/* </div>
                  </div> */}

              </Routes>
          </div>

      </main>
</>

  )
}
