 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// import "@thirdweb-dev/contracts/extension/Permissions.sol";

// import "base64-sol/base64.sol";

// contract RxNftMinter is ERC721Base, Permissions {
contract RxNftMinter is ERC721Base {
    uint256 private rx_tokenCounter;

    // constructor() ERC721("RxNFT", "HMD") {
    //     rx_tokenCounter = 0;
    // }

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


    struct Script {
        // string patient_wallet;
        address patient_address;
        string name;
        string description;
        string medication;
        string dob;
        // string quantity;
        uint256 quantity;
        uint256 quantityFilled;
        // SUNDAY PASS ENDS HERE
        uint256 rxId;
        //POST SUNDAY 5/7/23 ADDITION:
        // string npi;
        // string dea;

        string datePrescribed;
        // uint256 dateRxStart;
        string dateFilled;
        // uint256 dateRxEnd;
        string dateNextFill;
        // uint256 dateRxNext;
    }

    mapping(uint256 => Script) public scripts;

    Script[] allScripts;

    event ScriptWritten (
        address indexed patient_wallet,
        string patient_name,
        string medication,
        uint256 quantity,
        uint256 quantityFilled,
        string datePrescribed,
        uint256 dateRxStart,
        uint256 indexed script_token_number
    );

    event ScriptSentToPt (
        address indexed patient_wallet,
        address indexed doctor_wallet,
        uint256 indexed script_token_number
    );



    event UpdateScriptQuantityAndDatesEvent(            
            uint256 quantity_prescribed,
            uint256 indexed quantity_filled,
            uint256 quantity_filled_today,
            uint256 quantity_unfilled,
            string date_filled,
            string next_available_fill_date,
            uint256 script_token_number,
            address indexed pharmacy_address,
            address indexed patient_address
        );


    event PatientTransferToPharmacy(
        address indexed patient_address,
        address indexed pharmacy_address,
        uint256 indexed script_token_number
    );

    event PharmacyTransferToPatient(
        address indexed pharmacy_address,
        address indexed patient_address,
        uint256 indexed script_token_number
    );



    // function toAddress(
    //     string memory _patient_wallet
    // ) public pure returns (bytes32 result) {
    //     address patientAddress = address(bytes20(bytes(_patient_wallet)));
    //     return patientAddress;
    // }

    // function toAddress(
    //     string memory source
    // ) public pure returns (bytes32 result) {
    //     // require(bytes(source).length <= 32); // causes error, but string have to be max 32 chars

    //     // https://ethereum.stackexchange.com/questions/9603/understanding-mload-assembly-function
    //     // http://solidity.readthedocs.io/en/latest/assembly.html
    //     // this converts every char to its byte representation
    //     // see hex codes on http://www.asciitable.com/ (7 > 37, a > 61, z > 7a)
    //     // "az7" > 0x617a370000000000000000000000000000000000000000000000000000000000
    //     assembly {
    //         result := mload(add(source, 32))
    //     }
    //     return result;
    // }

// ** Roles **
    struct Role {
        mapping(address => bool) bearer;
    }

    Role private patients;
    Role private pharmacies;
    // Role private doctors;
    Role private admins;

    function add(Role storage _role, address _account) internal {
        require(!has(_role, _account), "Roles: Account has role");
        _role.bearer[_account] = true;
    }

    function remove(Role storage _role, address _account) internal {
        require(has(_role, _account), "Roles: Account does NOT have role");
        _role.bearer[_account] = false;
    }

    // //Check if account HAS Role:
    function has(
        Role storage _role,
        address _account
    ) internal view returns (bool) {
        require(_account != address(0), "Roles: Account is the zero address");
        return _role.bearer[_account];
    }

    // //Example Protected Functions (Patients, Pharmacies, Doctors)
    // function patientProtectedFunction() external onlyPatient {}

    // function pharmacyProtectedFunction() external onlyPharmacy {}

    // function doctorProtectedFunction() external onlyDoctor {}

// ** Set Modifiers to check if CALLER is a Patient, Pharmacy or Doctor: **
    modifier onlyPatient() {
    //     // require(patients.has(patients, address) == true, "Must have patient role.");
        require(has(patients, msg.sender) == true, "Must have patient role.");
        _;
    }

    modifier onlyPharmacy() {
        require(has(pharmacies, msg.sender) == true, "Must have Pharmacy role.");     
        _;
    }

    // modifier onlyDoctor() {
    //     require(has(doctors, msg.sender) == true, "Must have Doctor role.");
    //     _;
    // }

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

    // function addDoctor(address _newDoctor) external onlyAdmin {
    //     add(doctors, _newDoctor);
    // }

    function addAdmin(address _newAdmin) external onlyAdmin {
        add(admins, _newAdmin);
    }

    // // Remove Roles
    function removePatient(address _oldPatient) external onlyAdmin {
        remove(patients, _oldPatient);
    }

    function removePharmacy(address _oldPharmacy) external onlyAdmin {
        remove(pharmacies, _oldPharmacy);
    }

    //remove docs, remove admins

    function _createScript(
        // string memory _patient_wallet,
        address _patient_address,
        string memory _name,
        string memory _description,
        string memory _medication,
        string memory _dob,
        // string memory _quantity,
        uint256 _quantity,
        // uint256 _quantityPrescribed,
            // string memory _npi,
            // string memory _dea
        string memory _datePrescribed,
        uint256 _dateRxStart
        // string memory _dateFilled,
        // uint256 _dateRxEnd,
        // string memory _dateNextFill,
        // uint256 _dateRxNext
    )
        public
        returns (
            // ) public onlyDoctor onlyAdmin returns (uint256) {
            uint256
        )
    {
        Script memory _rx = Script({
            // patient_wallet: _patient_wallet,
            patient_address: _patient_address,
            name: _name,
            description: _description,
            medication: _medication,
            dob: _dob,
            quantity: _quantity,
            quantityFilled: 0, // assume quantity filled always zero when script written.
            rxId: rx_tokenCounter,
            datePrescribed: _datePrescribed, // string datePrescribed;
            // dateRxStart: _dateRxStart, // uint256 dateRxStart;
            dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            dateNextFill: ''  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

            // npi: _npi,
            // dea: _dea
        });

        allScripts.push(_rx);

        emit ScriptWritten(
            //_patient_wallet, //address ("string")   
            _patient_address, //address ('string') declared as 'address' in _createScript
            _name, //string
            _medication, //string
            _quantity, //uint256
            0,  //quantityFilled uint256
            _datePrescribed, // string date
            _dateRxStart, // uint256 date
            rx_tokenCounter // uint256 tokenId
        );

        // _transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // emit Transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // mintRx(_rx.patient_wallet, _rx.rxId);

        // mintRx(_patient_address, rx_tokenCounter);

        return _rx.rxId;
    }

    // (12:00) - mapping allows us to reference campaigns[0]
    // mapping(uint256 => Campaign) public campaigns;

    // (12:23) - global public variable:
    // uint256 public numberOfCampaigns = 0;

    // At: https://youtu.be/gyMwXuJrbJQ?t=80144
    // function svgToImageURI(
    //     string memory svg
    // ) public pure returns (string memory) {
    // His comments on the svg direct at (23:01:51): https://youtu.be/gyMwXuJrbJQ?t=82911
    // string memory baseURL = "data:image/svg+xml;base64,";
    // string memory svgBase64Encoded = Base64.encode(
    //     bytes(string(abi.encodePacked(svg)))
    // );
    // return string(abi.encodePacked(baseURL, svgBase64Encoded));
    //     return
    //         string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    // }

    // function mintNFT() public returns (uint256) {
    //     _safeMint(msg.sender, s_tokenCounter);
    //     s_tokenCounter = s_tokenCounter + 1;
    //     return s_tokenCounter; //BasicNFT: https://youtu.be/gyMwXuJrbJQ?t=74727
    // }

    // function getTokenCounter() public view returns (uint256) {
    //     return s_tokenCounter;
    // }

    // function safeMint(address _to, string memory _uri) public onlyOwner {
    // At: https://www.youtube.com/live/DSKDhBCmHXk?feature=share&t=531

    function mintRx(
        address _to // onlyDoctor // onlyAdmin
    )
        public
    // uint256 _rx_tokenCounter // string memory _uri // string memory _patient, // string memory _description, // string memory _medication, // string memory _dob, // string memory _quantity
    {
        // uint256 tokenId = _tokenIdCounter.current();

        // _safeMint(_to, _rx_tokenCounter);
        _safeMint(_to, 1);
        // _setTokenURI(tokenId, _uri);
        // _setTokenURI(
        // _rxId,
        // _setRxURI(_to, _patient, _description, _medication, _dob, _quantity)
        // _setRxURI(_rxId)
        // );

        emit ScriptSentToPt(
            _to,
            msg.sender,
            rx_tokenCounter
        );

        rx_tokenCounter += 1;
    }


    function transferPatientToPharmacy(address _from, address _to, uint256 tokenId) public {

        safeTransferFrom(_from, _to, tokenId);

        emit PatientTransferToPharmacy (
            _from,
            _to,
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
        
    

    //**********************From wizard: https://docs.openzeppelin.com/contracts/4.x/wizard ************************************************ */
    //Adds tokenURI at (23:03:16): https://youtu.be/gyMwXuJrbJQ?t=82996
    // require(_exists(tokenId), "Token Id not found. Contact Bates Bots.");

    // function tokenURI(
    //     uint256 tokenId
    // ) public view override returns (string memory) {
    //     return super.tokenURI(tokenId);
    // }

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     uint256 batchSize
    // ) internal override(ERC721) {
    //     super._beforeTokenTransfer(from, to, tokenId, batchSize);
    // }

    // function _burn(
    //     uint256 tokenId
    // ) internal override {
    //     super._burn(tokenId);
    // }

    // function supportsInterface(
    //     bytes4 interfaceId
    // ) public view override returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }

    //*********************************************************************************************************** */

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }


    function tokenSVGImageURI(uint256 tokenId) public view returns (string memory) {

        string[7] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';
                   
        // parts[1] = getPatientInfo(tokenId);
        parts[1] = getQuantityInfo(tokenId);        
       
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getMedicationInfo(tokenId);

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

        return string(abi.encodePacked("data:image/svg+xml;base64", Base64.encode(bytes(output))));                  

    }



    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Script storage rx = allScripts[tokenId];

//start Sat 5/20/23 edit
        // string[7] memory parts;

        // parts[
        //     0
        // ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';

        // // parts[1] = getPatientInfo(tokenId);
        // parts[1] = getQuantityInfo(tokenId);        
       
        // parts[2] = '</text><text x="10" y="40" class="base">';

        // parts[3] = getMedicationInfo(tokenId);

        // parts[4] = '</text><text x="10" y="60" class="base">';

        // parts[5] = getDateInfo(tokenId);

        // parts[6] = "</text></svg>";

        // // string memory output = string(
        // string memory output = string(
        //     abi.encodePacked(
        //         parts[0],
        //         parts[1],
        //         parts[2],
        //         parts[3],
        //         parts[4],
        //         parts[5],
        //         parts[6]
        //     )
        // );
//end Sat 5/20/23 edit

        // string memory imageBaseURL = "data:image/svg+xml;base64,";

        // string memory svgBase64Encoded = Base64.encode(bytes(output));
        // bytes(string(abi.encodePacked(output)))
        // bytes(abi.encodePacked(output))

        // return string(abi.encodePacked(baseURL, svgBase64Encoded));
        // string memory imageURI = string(
        //     abi.encodePacked(imageBaseURL, svgBase64Encoded)
        // );

        // attributes
        // string memory jsonAttributes = string(
        //     abi.encodePacked(
        //         '[{"trait_type":"sig","value":"',
        //         rx.description,
        //         '"}, {"trait_type":"patient_wallet_address","value":"',
        //         rx.patient_wallet,
        //         '"}, {"trait_type":"fill_status","value":"',
        //         rx.dob,
        //         '"}]'
        //     )
        // );

        //string memory json
        // string memory billsMafiaImageURI = string(
        // return
        //     string(
        //         abi.encodePacked(
        //             _baseURI(),

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"',
                        getPatientName(tokenId),
                        '","description":"',
                        getSig(tokenId),
                        // '",',
                        '","medication":"',
                        getMedication(tokenId),
                        // '",',
                        '","quantity":"',
                        getQuantity(tokenId),
                        // '",',
                        '","quantityfilled":"',
                        getQuantityFilled(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                        '", "image":',
                        tokenSVGImageURI(tokenId),
                        '"}'
                        // '",',
                        // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                )
            )
        );
        // return
        //    output = string(abi.encodePacked(_baseURI(),));
        string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
        return output;
    } //end of tokenURI or generateSVG


    function updateScriptQuantityAndDates(uint256 tokenId, uint256 _pillsFilled, string memory _dateFilled, string memory _dateNextFill) public {
        Script storage rx = allScripts[tokenId];
        rx.quantityFilled += _pillsFilled;
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);

        emit UpdateScriptQuantityAndDatesEvent(
            // toString(rx.quantityFilled += _pillsFilled), // 15 + 0 to string
            // string(abi.encodePacked("Total Filled: ", rx.quantityFilled, "/", rx.quantity)),
            rx.quantity,
            rx.quantityFilled,
            _pillsFilled,
            rx.quantity - rx.quantityFilled,
            _dateFilled,
            _dateNextFill,
            tokenId,
            msg.sender,
            rx.patient_address
            // rx.patient_wallet
        );
    }


    function updateScriptQuantityAndDatesExplicit(uint256 tokenId, uint256 pillsFilled, string memory _dateFilled, string memory _dateNextFill) public {
        Script storage rx = allScripts[tokenId];
        rx.quantityFilled += pillsFilled;
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);
        tokenURI(tokenId);
    }


                                                    // ) public onlyPharmacy returns (uint256) {
    function updateScriptQuantity(uint256 tokenId, uint256 pillsFilled) public returns (uint256) {
        Script storage rx = allScripts[tokenId];
        // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        // return rx.quantity -= pillsFilled;
        require(rx.quantityFilled + pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += pillsFilled;
    }

    function updateScriptQuantityExplicit(uint256 tokenId, uint256 pillsFilled) public {
        Script storage rx = allScripts[tokenId];
        // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        // rx.quantity -= pillsFilled;
        rx.quantityFilled += pillsFilled;
        tokenURI(tokenId);
    }

    function updateScriptDates(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // returns (string memory) {
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);
    }

    function updateScriptDatesExplicit(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // returns (string memory) {
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);
        tokenURI(tokenId);
    }


            // dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            // dateNextFill: '',  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

    function getPatientInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt: ", rx.patient_address));
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
                    " | Rx Item #",
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
        Script storage rx = allScripts[tokenId];
        return             
            string(
                abi.encodePacked(
                    "Rx Date: ",
                    rx.datePrescribed,
                    " | Filled: ",
                    rx.dateFilled,
                     " | Next Fill: ",
                     rx.dateNextFill
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

    

    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
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
