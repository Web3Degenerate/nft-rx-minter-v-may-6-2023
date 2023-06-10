// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
// import "@thirdweb-dev/contracts/extension/Permissions.sol";

// ** Version 12.4 **  //
contract RxNftMinter is ERC721Base {
    uint256 private rx_tokenCounter;

    constructor( 
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
         ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps)
    {
        rx_tokenCounter = 0;
        add(admins, msg.sender);
    }


// 6/9/23 v.12.7 prep error "Stack too deep, try removing local variables", changed patient_address from address to string and removed it as param in _createScripts
// address patient_address;
    struct Script {
        string patient_address;
        string name;
        string description;
        string medication;
        string dob;
        uint256 quantity;
        uint256 quantityFilled;
        uint256 rxId;
        string datePrescribed;
        string dateFilled;
        string dateNextFill;
    }

    mapping(uint256 => Script) public scripts;
    Script[] allScripts;

    struct ScriptRevised {
        address patient_address;
        uint256 patient_wallet;
        string name;
        string description;
        string medication;
        uint256 dob;
        uint256 quantity;
        uint256 quantityFilled;
        uint256 rxId;
        uint256 datePrescribed;
        uint256 dateFilled;
        uint256 dateNextFill;
    }

    mapping(uint256 => ScriptRevised) public scriptz;
    ScriptRevised[] allScriptsRevised;

// ***********v.11.7*************************************
    struct Receipt {
        string patient_wallet_string;
        string doctor_name;
        string doctor_dea;
        string patient_physical_address;
        uint256 rxId;
    }

    mapping(uint256 => Receipt) public receipts;

    Receipt[] allReceipts;
// ********************************************************

// ***********v.12.7*************************************
        // string date_last_filled;
        // string date_last_filled_formatted;
    struct UtilsStorage {
        string date_prescribed_formatted;
        string date_last_filled_formatted;
        
        string date_next_fill;
        string date_next_fill_formatted;

        uint256 per_diem_max;

        string script_status;      
        uint256 rxId;
    }

    mapping(uint256 => UtilsStorage) public utils;

    UtilsStorage[] allUtilsStorage;
// ********************************************************



// ***********v.12.7*************************************

        // bool active;
        // string[] fill_date; 
        // uint256 rxId;

// string date_next_fill_formatted;

    struct PharmacyFills {
        string date_original_filled;
        string date_original_filled_formatted;
        string date_current_fill;
        string date_current_fill_formatted;     
        string script_status;
        uint256 rxId;
    }

    mapping(uint256 => PharmacyFills) public fills;

    PharmacyFills[] allPharmacyFills;
// ********************************************************




//6/9/23, v.12.7 prep, removed  uint256 dateRxStart from ScriptWritten Event and changed 'address indexed patient_wallet' to string
// address indexed patient_wallet,
    event ScriptWritten (
        string indexed patient_wallet,
        string patient_name,
        string medication,
        uint256 quantity,
        uint256 quantityFilled,
        string datePrescribed,
        uint256 indexed script_token_number
    );

    event ScriptSentToPt (
        address indexed patient_wallet,
        address indexed doctor_wallet,
        uint256 indexed script_token_number
    );


// add uint256 'string script_status' or 'bool active'
            // string script_status,
            // bool complete 
// 6/9/23, v12.7 prep, changed 'address indexed patient_address' to string

    event UpdateScriptQuantityAndDatesEvent(
            string pharmacy_name,
            string doctor_name,
            string doctor_dea,
            string medication_name,            
            uint256 quantity_prescribed,
            uint256 quantity_filled,
            uint256 quantity_filled_today,
            uint256 quantity_unfilled,
            string date_filled,
            string next_available_fill_date,
            uint256 indexed script_token_number,
            address indexed pharmacy_address,
            string indexed patient_address
        );


// Text message confirmation to patient:
    event PatientTransferToPharmacy(
        address indexed patient_address,
        address indexed pharmacy_address,
        string pharmacy_name,
        string patient_name,
        string medication_name,
        string doctor_name,
        string doctor_dea,
        uint256 indexed script_token_number
    );

    event PharmacyTransferToPatient(
        address indexed pharmacy_address,
        address indexed patient_address,
        uint256 indexed script_token_number
    );


// ** Roles **
    struct Role {
        mapping(address => bool) bearer;
    }

    Role private patients;
    Role private pharmacies;
    Role private doctors;
    Role private admins;

    function add(Role storage _role, address _account) internal {
        require(!has(_role, _account), "Roles: Account already has this role");
        _role.bearer[_account] = true;
    }

    function remove(Role storage _role, address _account) internal {
        require(has(_role, _account), "Roles: Unable to remove because Account does NOT currently have this role");
        _role.bearer[_account] = false;
    }

//Check if account HAS Role:
    function has(
        Role storage _role,
        address _account
    ) internal view returns (bool) {
        require(_account != address(0), "Roles: Account is the zero address");
        return _role.bearer[_account];
    }


// ** Set Modifiers **
    modifier onlyPatient() {
        // require(patients.has(patients, address) == true, "Must have patient role.");
        require(has(patients, msg.sender) == true, "Must have patient role.");
        _;
    }

    modifier onlyPharmacy() {
        require(has(pharmacies, msg.sender) == true, "Must have Pharmacy role.");     
        _;
    }

    modifier onlyDoctor() {
        require(has(doctors, msg.sender) == true, "Must have Doctor role.");
        _;
    }

    modifier onlyAdmin() {
        require(has(admins, msg.sender) == true, "Must have Admin role.");
        _;
    }


    function addPatient(address _newPatient) external onlyAdmin {
        add(patients, _newPatient);
    }

    function addPharmacy(address _newPharmacy) external onlyAdmin {
        add(pharmacies, _newPharmacy);
    }

    function addDoctor(address _newDoctor) external onlyAdmin {
        add(doctors, _newDoctor);
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        add(admins, _newAdmin);
    }

// Remove Roles
    function removePatient(address _oldPatient) external onlyAdmin {
        remove(patients, _oldPatient);
    }

    function removePharmacy(address _oldPharmacy) external onlyAdmin {
        remove(pharmacies, _oldPharmacy);
    }

    function removeDoctor(address _oldDoctor) external onlyAdmin {
        remove(doctors, _oldDoctor);
    }



// Check Roles
    function hasRolePatient(address _potentialPatient) public view returns (bool) {
        return has(patients, _potentialPatient);
    }

    function hasRolePatientString(address _potentialPatient) public view returns (string memory) {
        if (has(patients, _potentialPatient) == true){
            return "Patient Role Assigned";
        }else{
            return "Patient Role NOT Assigned";
        }
    }

    function hasRolePharmacy(address _potentialPharmacy) public view returns (bool) {
        return has(pharmacies, _potentialPharmacy);
    }


    function hasRolePharmacyString(address _potentialPharmacy) public view returns (string memory) {
        if (has(pharmacies, _potentialPharmacy) == true){
            return "Pharmacy Role Assigned";
        }else{
            return "Pharmacy Role NOT Assigned";
        }
    }

    function hasRoleDoctor(address _potentialDoctor) public view returns (bool) {
        return has(doctors, _potentialDoctor);
    }


    function hasRoleDoctorString(address _potentialDoctor) public view returns (string memory) {
        if (has(doctors, _potentialDoctor) == true){
            return "Doctor Role Assigned";
        }else{
            return "Doctor Role NOT Assigned";
        }
    }

    function hasRoleAdmin(address _potentialAdmin) public view returns (bool) {
        return has(admins, _potentialAdmin);
    }

    function hasRoleAdminString(address _potentialAdmin) public view returns (string memory) {
        if (has(admins, _potentialAdmin) == true){
            return "Admin Role Assigned";
        }else{
            return "Admin Role NOT Assigned";
        }
    }



    function _createScript(
        // string memory _patient_wallet_string,
        // address _patient_address,
        // bytes calldata _patient_wallet_string, https://ethereum.stackexchange.com/questions/74442/when-should-i-use-calldata-and-when-should-i-use-memory
        string memory _patient_wallet_string,
        string memory _name,
        string memory _description,
        string memory _medication,
        string memory _dob,
        // string memory _patient_physical_address,
        // string memory _quantity,
        uint256 _quantity,
        // uint256 _quantityPrescribed,
            // string memory _npi,
        string memory _doctor_name,
        string memory _doctor_dea,
        // string memory _datePrescribed,
        string memory _datePrescribedFormatted,
        // uint256 _dateRxStart, 
        uint256 _per_diem_max,
        string memory _date_next_fill,
        string memory _date_next_fill_formatted
        // string memory _dateFilled,
        // uint256 _dateRxEnd,
        // string memory _dateNextFill,
        // uint256 _dateRxNext
    )
    public returns (uint256) {

        Script memory _rx = Script({
            // patient_wallet: _patient_wallet,
            patient_address: _patient_wallet_string,
            name: _name,
            description: _description,
            medication: _medication,
            dob: _dob,
            quantity: _quantity,
            quantityFilled: 0, // assume quantity filled always zero when script written.
            rxId: rx_tokenCounter,
            datePrescribed: _datePrescribedFormatted, // string datePrescribed;
            // dateRxStart: _dateRxStart, // uint256 dateRxStart;
            dateFilled: 'N/A', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            dateNextFill: _date_next_fill  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;
            // dea: _dea
        });

        allScripts.push(_rx);

// ***** v11.7 ***************
        // Receipt memory _receipt = Receipt({
        //     patient_wallet_string: _patient_wallet_string,
        //     doctor_name: _doctor_name,
        //     doctor_dea: _doctor_dea,
        //     patient_physical_address: _patient_physical_address,
        //     rxId: rx_tokenCounter
        // });

        // allReceipts.push(_receipt);

        // _createScriptReceipt(_patient_wallet_string, _doctor_name, _doctor_dea, _patient_physical_address);
        _createScriptReceipt(_patient_wallet_string, _doctor_name, _doctor_dea, "123 Smith Street, San Francisco, CA");
        
        _createUtilsScript(_datePrescribedFormatted, _per_diem_max, _date_next_fill, _date_next_fill_formatted);

        // _pharmacyFillScript(_date_current_fill, _date_next_fill, _script_status, active);
        // _pharmacyFillScript('N/A', 'N/A', "active", true);



        

// ***** v11.7 ***************

//updated ScriptWritten on 6/9/23 v.12.7 prep, removed address and only using string patient_wallet_string     
        emit ScriptWritten(
            //_patient_wallet, //address ("string")   
            _patient_wallet_string, //address ('string') declared as 'address' in _createScript
            _name, //string
            _medication, //string
            _quantity, //uint256
            0,  //quantityFilled uint256
            _datePrescribedFormatted, // string date
            // _dateRxStart, // uint256 date
            rx_tokenCounter // uint256 tokenId
        );

        // _transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // emit Transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // mintRx(_rx.patient_wallet, _rx.rxId);
        // mintRx(_patient_address, rx_tokenCounter);

        return _rx.rxId;
    }


    function _createScriptReceipt(
        string memory _patient_wallet_string,
        string memory _doctor_name,
        string memory _doctor_dea,
        string memory _patient_physical_address
        // uint256 rx_tokenCounter
    ) public {

        Receipt memory _receipt = Receipt({
            patient_wallet_string: _patient_wallet_string,
            doctor_name: _doctor_name,
            doctor_dea: _doctor_dea,
            patient_physical_address: _patient_physical_address,
            rxId: getTokenCount()
        });

        allReceipts.push(_receipt);
    }

    function _createUtilsScript(
        string memory _date_prescribed_formatted,
        // string memory _date_filled_formatted,
        uint256 _per_diem_max, 
        string memory _date_next_fill,
        string memory _date_next_fill_formatted
        // string memory _script_status
        // uint256 rx_tokenCounter
    ) public {

        UtilsStorage memory _util = UtilsStorage({
            date_prescribed_formatted: _date_prescribed_formatted,
            date_last_filled_formatted: "N/A",
            date_next_fill: _date_next_fill,
            date_next_fill_formatted: _date_next_fill_formatted,
            per_diem_max: _per_diem_max,
            script_status: "pending",
            rxId: getTokenCount()
        });

        allUtilsStorage.push(_util);
    }



    function mintRx(address _to ) public { 
        _safeMint(_to, 1);

        emit ScriptSentToPt(
            _to,
            msg.sender,
            rx_tokenCounter
        );

        rx_tokenCounter += 1;
    }


    function transferPatientToPharmacy(address _from, address _to, string memory _pharmacyName, uint256 tokenId) public {
        safeTransferFrom(_from, _to, tokenId);

        // string memory patientName = getPatientName(tokenId);
        // string memory medicationName = getMedication(tokenId);
        // string memory doctorName = getDoctor(tokenId);
        // string memory doctorDea = getDoctorDea(tokenId);

        emit PatientTransferToPharmacy (
            _from,
            _to,
            _pharmacyName,
            getPatientName(tokenId),
            getMedication(tokenId),
            getDoctor(tokenId),
            getDoctorDea(tokenId),
            tokenId 
        );
    }

    function transferPatientToPharmacyRoles(address _from, address _to, string memory _pharmacyName, uint256 tokenId) public onlyPatient {
        safeTransferFrom(_from, _to, tokenId);

        emit PatientTransferToPharmacy (
            _from,
            _to,
            _pharmacyName,
            getPatientName(tokenId),
            getMedication(tokenId),
            getDoctor(tokenId),
            getDoctorDea(tokenId),
            tokenId 
        );
    }

 
    function transferPharmacyToPatient(address _from, address _to, uint256 tokenId) public {
        safeTransferFrom(_from, _to, tokenId);
        emit PharmacyTransferToPatient (
            _from,
            _to,
            tokenId 
        );
    }   

    function transferPharmacyToPatientRoles(address _from, address _to, uint256 tokenId) public onlyPharmacy {
        safeTransferFrom(_from, _to, tokenId);
        emit PharmacyTransferToPatient (
            _from,
            _to,
            tokenId 
        );
    }     
    


    //*********************************************************************************************************** */

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }


    function tokenSVGImageURI(uint256 tokenId) public view returns (string memory) {

        string[7] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';
                   
        // parts[1] = getPatientInfo(tokenId);
        parts[1] = getMedicationInfo(tokenId);        
       
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getQuantityInfo(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getDateInfo(tokenId);

        parts[6] = "</text></svg>";

        // string memory output = string(
        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6]
            )
        );

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(output))));                  
                                       
    }


    function jsonMetaDataOne(uint256 tokenId) public view returns (string memory) {
        string memory json_one = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        '{"name":"',
                        getPatientName(tokenId),
                        '","description":"',
                        getSig(tokenId),
                        // '",',
                // '","medication":"',
                // getMedication(tokenId),
                // '","dob":"',
                // getDob(tokenId),
                        // '",',
                // '","quantity":"',
                // getQuantity(tokenId),
                // // '",',
                // '","quantityfilled":"',
                // getQuantityFilled(tokenId),
                // '","patientaddress":"',
                // getAddressString(tokenId),
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                        '", "image":"',
                        tokenSVGImageURI(tokenId),
                // '"}'
                        '",'

                        // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                );
        //     )
        // );
        // return
        //    output = string(abi.encodePacked(_baseURI(),));
        
        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
        return json_one;
    }





    function jsonMetaDataTwo(uint256 tokenId) public view returns (string memory) {
        string memory json_two = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
                        // '",',
                        // '","quantity":"',
                        // getQuantity(tokenId),
                        // '",',
                        // '","quantityfilled":"',
                        // getQuantityFilled(tokenId),
                        // '","patientaddress":"',
                        // getAddressString(tokenId),
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        '"attributes":[{"trait_type":"medication","value":"',getMedication(tokenId),
                        '"},{"trait_type":"dob","value":"',getDob(tokenId),
                        '"},{"trait_type":"quantity","value":"',getQuantity(tokenId),
                         '"},{"trait_type":"quantityfilled","value":"',getQuantityFilled(tokenId),
                        '"},{"trait_type":"patientaddress","value":"',getAddressString(tokenId),
                        '"},'
                        // '"},{"trait_type": "dateprescribed", "value": "',getDatePrescribed(tokenId),                                               
                        // '"},{"trait_type": "datefilled", "value": "',getDatePrescribed(tokenId),'"}]}'
                            // '"attributes":',
                            // jsonAttributes,
                            // "}"
                    )
                );
        //   )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_two;
    }


        function jsonMetaDataThree(uint256 tokenId) public view returns (string memory) {
        string memory json_three = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
                        // '",',
                        // '","quantity":"',
                        // getQuantity(tokenId),
                        // '",',
                        // '","quantityfilled":"',
                        // getQuantityFilled(tokenId),
                        // '","patientaddress":"',
                        // getAddressString(tokenId),
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        // '"attributes": [{"trait_type": "medication", "value": "',getMedication(tokenId),
                        // '"},{"trait_type": "dob", "value": "',getDob(tokenId),
                        // '"},{"trait_type": "quantity", "value": "',getQuantity(tokenId),
                        //  '"},{"trait_type": "quantityfilled", "value": "',getQuantityFilled(tokenId),
                        // '"},{"trait_type": "patientaddress", "value": "',getAddressString(tokenId),
          
                      
                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '"},{"trait_type":"date-first-filled","value":"',getDateFilled(tokenId),
                        '"},{"trait_type":"next-fill-date","value":"',getDateNextFill(tokenId)
                        // '"},{"trait_type":"datenextfill","value":"',getDateNextFill(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                        // '",'
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_three;
    }


        function jsonMetaDataFour(uint256 tokenId) public view returns (string memory) {
        string memory json_four = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                    
                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '{"trait_type":"doctor","value":"',getDoctor(tokenId),
                        '"},{"trait_type":"doctor-dea","value":"',getDoctorDea(tokenId),
                        '"},{"trait_type":"pt-physical-address","value":"',getPatientPhysicalAddress(tokenId)
                        // '"},{"trait_type":"datenextfill","value":"',getDateNextFill(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                        // '",'
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_four;
    }


            function jsonMetaDataFive(uint256 tokenId) public view returns (string memory) {
        string memory json_four = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
                        // '",',
                        // '","quantity":"',
                        // getQuantity(tokenId),
                        // '",',
                        // '","quantityfilled":"',
                        // getQuantityFilled(tokenId),
                        // '","patientaddress":"',
                        // getAddressString(tokenId),
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        // '"attributes": [{"trait_type": "medication", "value": "',getMedication(tokenId),
                        // '"},{"trait_type": "dob", "value": "',getDob(tokenId),
                        // '"},{"trait_type": "quantity", "value": "',getQuantity(tokenId),
                        //  '"},{"trait_type": "quantityfilled", "value": "',getQuantityFilled(tokenId),
                        // '"},{"trait_type": "patientaddress", "value": "',getAddressString(tokenId),

      
   
   
  

                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '"},{"trait_type":"date-last-filled","value":"',getLastDateFilledUpdate(tokenId),
                        '"},{"trait_type":"script-status","value":"',getScriptStatus(tokenId),   
                        '"},{"trait_type":"per-diem-max","value":"',getPerDiemMax(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_four;
    }


// (5/23/23) - New tokenURI yolo attempt:
    function tokenURI(uint256 tokenId) public view override returns (string memory) {

        // string memory json_one = jsonMetaDataOne(tokenId);
        // string memory json_two = jsonMetaDataTwo(tokenId);
        // string memory json_three = jsonMetaDataThree(tokenId);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        jsonMetaDataOne(tokenId),
                        jsonMetaDataTwo(tokenId),
                        jsonMetaDataThree(tokenId),
                        jsonMetaDataFour(tokenId), 
                        jsonMetaDataFive(tokenId)
                    )
                )
            )
        );

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json_one, json_two));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json_one, json_two, json_three));

        string memory output = string(abi.encodePacked(_baseURI(), json));


        // string memory output = string(abi.encodePacked(_baseURI(), jsonMetaDataOne(tokenId), jsonMetaDataTwo(tokenId)));
            
        return output;
    }


// (5/23/23) - Last Working tokenURI function intact ***********************************************
    // function tokenURI(
    //     uint256 tokenId
    // ) public view override returns (string memory) {
       
    //     string memory json = Base64.encode(
    //         bytes(
    //             string(
    //                 abi.encodePacked(
    //                     '{"name":"',
    //                     getPatientName(tokenId),
    //                     '","description":"',
    //                     getSig(tokenId),
    //                     // '",',
    //                     // '","medication":"',
    //                     // getMedication(tokenId),
    //                     // '",',
    //                     '","quantity":"',
    //                     getQuantity(tokenId),
    //                     // '",',
    //                     '","quantityfilled":"',
    //                     getQuantityFilled(tokenId),
    //                     '","patientaddress":"',
    //                     getAddressString(tokenId),
    //                     '","dateprescribed":"',
    //                     getDatePrescribed(tokenId),
    //                     // '",',
    //                     // '", "image": "data:image/svg+xml;base64,',
    //                     // Base64.encode(bytes(output)),
    //                     '", "image":"',
    //                     tokenSVGImageURI(tokenId),
    //                     '"}'
    //                     // '",',
    //                     // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
    //                     // '"attributes":',
    //                     // jsonAttributes,
    //                     // "}"
    //                 )
    //             )
    //         )
    //     );
    //         // return
    //         //    output = string(abi.encodePacked(_baseURI(),));
    //     string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
    //     return output;
    // } //end of tokenURI or generateSVG
// (5/23/23) - Last Working tokenURI function intact ***********************************************

// *********************************  6/9/23 v.12.7 Prep Removed updateScriptQuantityAndDates without Roles ***************************************
    // function updateScriptQuantityAndDates(uint256 tokenId, uint256 _pillsFilled, string memory _dateFilled, 
    // string memory _dateNextFill, string memory _pharmacyName) public {
    //     Script storage rx = allScripts[tokenId];
    //     rx.quantityFilled += _pillsFilled;
    //     rx.dateFilled = _dateFilled;
    //     rx.dateNextFill = _dateNextFill;
    //     getQuantityInfo(tokenId);

    
    //     emit UpdateScriptQuantityAndDatesEvent(
    //         _pharmacyName,
    //         getDoctor(tokenId),
    //         getDoctorDea(tokenId),
    //         getMedication(tokenId),
    //         rx.quantity,
    //         rx.quantityFilled,
    //         _pillsFilled,
    //         rx.quantity - rx.quantityFilled,
    //         _dateFilled,
    //         _dateNextFill,
    //         tokenId,
    //         msg.sender,
    //         rx.patient_address
    //     );
    // }
// *********************************  6/9/23 v.12.7 Prep Removed updateScriptQuantityAndDates without Roles ***************************************


    function updateScriptQuantityAndDatesRoles(
        uint256 tokenId, 
        uint256 _pillsFilled, 
        string memory _dateFilled, //original
        // string memory _dateFilledFormatted,
        string memory _dateCurrentFilled,
        string memory _dateCurrentFilledFormatted,
        // string memory _dateNextFill,
        string memory _dateNextFillFormatted
        // string memory _pharmacyName
        // string memory _script_status_update
        // bool active
        ) 
        public onlyPharmacy {
            Script storage rx = allScripts[tokenId];
            require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
            rx.quantityFilled += _pillsFilled;
            // updateScriptQuantityRoles(tokenId, _pillsFilled);
            rx.dateFilled = _dateFilled;
            rx.dateNextFill = "_dateNextFill";
            // getQuantityInfo(tokenId);
            // getDateInfo(tokenId);

            UtilsStorage storage util = allUtilsStorage[tokenId];
            util.date_next_fill_formatted = _dateNextFillFormatted;
            util.date_last_filled_formatted = _dateCurrentFilledFormatted;
            // util.script_status = _script_status_update;

            // setScriptStatus(tokenId, _script_status_update); //updates UtilsStorage struct
            // setDateNextFillFormatted(tokenId, _dateNextFillFormatted);

            // _pharmacyFillScript(_dateFilled, _dateFilledFormatted, _dateCurrentFilled, _dateCurrentFilledFormatted, _script_status_update, tokenId); 

        // PharmacyFills memory _fill = PharmacyFills({
        //     date_original_filled: _dateFilled,
        //     date_original_filled_formatted: _dateFilledFormatted,
        //     date_current_fill: _dateCurrentFilled,
        //     date_current_fill_formatted: _dateCurrentFilledFormatted,
        //     script_status: "testing",
        //     rxId: tokenId
        // });

        // allPharmacyFills.push(_fill);

            // string memory doctorName = getDoctor(tokenId);
            // string memory doctorDea = getDoctorDea(tokenId);
        
            emit UpdateScriptQuantityAndDatesEvent(
                "_pharmacyName",
                getDoctor(tokenId),     //stack too deep started here
                getDoctorDea(tokenId),
                getMedication(tokenId),
                rx.quantity,
                rx.quantityFilled,
                _pillsFilled,           //stack too deep moved here after commenting out PillsFilled
                rx.quantity - rx.quantityFilled,
                _dateCurrentFilled,
                "_dateNextFill",
                tokenId,
                msg.sender,
                rx.patient_address
                // getScriptStatusString(tokenId),
                // getScriptStatus(tokenId)             
            );
        }


// Pharmacy Fills 
    // function _pharmacyFillScript(
    //     string memory _date_filled,
    //     string memory _date_filled_formatted,
    //     string memory _date_current_fill,
    //     string memory _date_current_fill_formatted,
    //                                 // string memory _date_next_fill,
    //                                 // string memory _date_next_fill_formatted,
    //     string memory _script_status,
    //     uint256 tokenId
    //                                 // bool _active
    //                                 // uint256 _fill_id,
    //                                 // string memory _fill_date

    //                                 // uint256 rx_tokenCounter
    // ) public {

    //                                 // getScriptStatus(tokenId);

    //     PharmacyFills memory _fill = PharmacyFills({
    //         date_original_filled: _date_filled,
    //         date_original_filled_formatted: _date_filled_formatted,
    //         date_current_fill: _date_current_fill,
    //         date_current_fill_formatted: _date_current_fill_formatted,
    //         script_status: _script_status,
    //         rxId: tokenId
    //     });

    //     allPharmacyFills.push(_fill);

    //                                 // PharmacyFills storage _fill = fills[rx_tokenCounter];

    //                                 // // PharmacyFills memory _fill = PharmacyFills({
    //                                 //     _fill.date_current_fill = _current_fill_date;
    //                                 //     _fill.date_next_fill = _date_next_fill;
    //                                 //     _fill.script_status = _script_status;
    //                                 //     _fill.active = _active;
    //                                 //     // fill_date: _fill.fill_date.push(_current_fill_date),
    //                                 //     _fill.rxId = getTokenCount();
    //                                 //     // patient_physical_address: _patient_physical_address,
    //                                 //     // rxId: getTokenCount()
    //                                 // // });

    //                                 // // allPharmacyFills.push(_fill);
    // }


// **********  JUST QUANTITY FILLED  ********************************************************************************** //
    function updateScriptQuantity(uint256 tokenId, uint256 _pillsFilled) public returns (uint256) {
        Script storage rx = allScripts[tokenId];
        // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        // return rx.quantity -= pillsFilled;
        require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += _pillsFilled;
    }

    function updateScriptQuantityRoles(uint256 tokenId, uint256 _pillsFilled) public onlyPharmacy returns (uint256) {
        Script storage rx = allScripts[tokenId];
        require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += _pillsFilled;
    }


// ******** JUST Fill DATES ****************************************************************************************** //
    function updateScriptDates(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // returns (string memory) {
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getDateInfo(tokenId);
    }

    function updateScriptDatesRoles(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) 
    public onlyPharmacy
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getDateInfo(tokenId);
    }


            // dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            // dateNextFill: '',  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

    function getPatientInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt: ", rx.name, " - DOB: ", rx.dob));
            // string(abi.encodePacked("Patient: ", rx.patient_wallet, " - DOB: ", rx.dob));
            
    }

    function getMedicationInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return
            string(
                abi.encodePacked(
                    "Medication: ",
                    rx.medication,
                    " | Rx NFT #",
                    toString(tokenId)
                )
            );
    }


    function getQuantityInfo(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
                return
            string(
                abi.encodePacked(
                    "Qty Prescribed: ",
                    toString(rx.quantity),                   
                    " | Qty Filled: ",
                    toString(rx.quantityFilled),
                     " | Qty Left: ",
                    toString(rx.quantity - rx.quantityFilled) 
                )
            );
    }

    function getDateInfo(uint256 tokenId) public view returns (string memory) {
        // Script storage rx = allScripts[tokenId];
        return             
            string(
                abi.encodePacked(
                    "Start: ",
                    getDatePrescribedFormatted(tokenId),
                    // rx.datePrescribed,
                    " | Filled: ",
                    getLastDateFilledUpdate(tokenId),
                    // rx.dateFilled,
                     " | Next Refill: ",
                     getDateNextFillFormatted(tokenId)
                    //  rx.dateNextFill
                    // rx.daysLeft
                    // rx.dateRxNext - block.timestamp
                )
            );
    } 

//getDescriptionInfo()****************************************************
    // function getDescriptionInfo(
    //     uint256 tokenId
    // ) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return
    //         string(
    //             abi.encodePacked(
    //                 "NPI#: ",
    //                 rx.npi,
    //                 "| DEA#: ",
    //                 rx.dea,
    //                 "| Item #",
    //                 toString(tokenId)
    //             )
    //         );
    // }

    function getAddressInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt Address: ", rx.patient_address));
    }


// ******************** GET INDIVIDUAL VALUES W/O FORMATTING *****************************************************//

    function getTokenCount() public view returns (uint256) {
        return rx_tokenCounter;
    }

// ***** SCRIPT STRUCT VALUES *****//
// On 6/9/23 in v.12.7 prep, we changed the input from _createScripts to only take string address:
    // function getAddress(uint256 tokenId) public view returns (address) {
    function getAddress(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.patient_address;
    }

    function getPatientName(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.name;
    }

    function getSig(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.description;
    }

    function getMedication(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.medication;
    }

    // function getQuantity(uint256 tokenId) public view returns (string memory) {
    //ERROR: Return argument type (string memory) type uint256 (new quantity) not implicitly convertible to expected type (type of first return variable) string memory
    function getQuantity(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantity);
    }

    function getQuantityFilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantityFilled);
    }

    function getQuantityUnfilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantity - rx.quantityFilled);
    }

    
    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
    }

// Test out alternative string memory patient_address / patient_wallet in v.12.7
    function getAddressToString(uint256 tokenId) public view returns (string memory) {
        ScriptRevised storage rxRev = allScriptsRevised[tokenId];
        return string(abi.encodePacked("", rxRev.patient_address));
        // return rxRev.patient_address;
    }

    function getUintToString(uint256 tokenId) public view returns (string memory) {
        ScriptRevised storage rxRev = allScriptsRevised[tokenId];
        return toString(rxRev.patient_wallet);
    }

    


    function getDatePrescribed(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.datePrescribed;
    }

    function getDateFilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dateFilled;
    }

    function getDateNextFill(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dateNextFill;
    }

    function getScriptStatus(uint256 tokenId) public view returns (bool) {
        // UtilsStorage storage util = allUtilsStorage[tokenId];
        Script storage rx = allScripts[tokenId];
        return rx.quantity - rx.quantityFilled == 0;
    }


//new v.12.7 patient_address stored as bytes:
    // function getAddressFromBytesToString(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.patient_address));
    // }


// *********************** RECEIPT Struct functions ********************************* //

    function getAddressString(uint256 tokenId) public view returns (string memory) {
        Receipt storage rec = allReceipts[tokenId];
        return rec.patient_wallet_string;
    }

    function getDoctor(uint256 tokenId) public view returns (string memory) {
        Receipt storage rec = allReceipts[tokenId];
        return rec.doctor_name;
    }

    function getDoctorDea(uint256 tokenId) public view returns (string memory) {
        Receipt storage rec = allReceipts[tokenId];
        return rec.doctor_dea;
    }

    function getPatientPhysicalAddress(uint256 tokenId) public view returns (string memory) {
        Receipt storage rec = allReceipts[tokenId];
        return rec.patient_physical_address;
    }


// *********************** PHARMACY FILLS Struct Functions ********************************* //
// LAST Date filled:
    function getDateCurrentFill(uint256 tokenId) public view returns (string memory) {
        // UtilsStorage storage util = allUtilsStorage[tokenId];
        PharmacyFills storage fill = allPharmacyFills[tokenId];
        return fill.date_current_fill;
    }

//6/9/23 v.12.7 prep, stack too deep trouble shooting. Only 1 of 1. 
    // function setDateCurrentFill(uint256 tokenId, string memory _dateLastFilled) public {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     fill.date_current_fill = _dateLastFilled;
    // }

    function getDateCurrentFillFormatted(uint256 tokenId) public view returns (string memory) {
        // UtilsStorage storage util = allUtilsStorage[tokenId];
        PharmacyFills storage fill = allPharmacyFills[tokenId];
        return fill.date_current_fill_formatted;
    }

//6/9/23 v.12.7 prep, stack too deep trouble shooting. Only 1 of 1. 
    // function setDateLastFilledFormatted(uint256 tokenId, string memory _dateLastFilledFormatted) public {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     fill.date_current_fill_formatted = _dateLastFilledFormatted;
    // }


// *********************** UTILS Struct Functions ********************************* //

    function getLastDateFilledUpdate(uint256 tokenId) public view returns (string memory) {
        // PharmacyFills storage fill = allPharmacyFills[tokenId];
        // return fill.date_current_fill;  
        UtilsStorage storage util = allUtilsStorage[tokenId];
        return util.date_last_filled_formatted;
    } 

    function getDatePrescribedFormatted(uint256 tokenId) public view returns (string memory) {
        UtilsStorage storage util = allUtilsStorage[tokenId];
        return util.date_prescribed_formatted;
    } 




    function getPerDiemMax(uint256 tokenId) public view returns (string memory) {
        UtilsStorage storage util = allUtilsStorage[tokenId];
        return toString(util.per_diem_max);  
    } 

//6/9/23 12.7 prep 
    // function setScriptStatus(uint256 tokenId, string memory _script_status_update) public {
    //     UtilsStorage storage util = allUtilsStorage[tokenId];
    //     util.script_status = _script_status_update;
    // }

    function getScriptStatusString(uint256 tokenId) public view returns (string memory) {
        UtilsStorage storage util = allUtilsStorage[tokenId];
        return util.script_status;
    }

// NEXT fill date Formattted: used by SVG getDateInfo() function:
    function getDateNextFillFormatted(uint256 tokenId) public view returns (string memory) {
        UtilsStorage storage util = allUtilsStorage[tokenId];
        return util.date_next_fill_formatted;
    }

    function setDateNextFillFormatted(uint256 tokenId, string memory _dateNextFillFormatted) public {
        UtilsStorage storage util = allUtilsStorage[tokenId];
        util.date_next_fill_formatted = _dateNextFillFormatted;
    }








    function toString(uint256 value) public pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
} //end of contract
