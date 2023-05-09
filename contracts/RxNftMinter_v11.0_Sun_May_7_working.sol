// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// import "base64-sol/base64.sol";

contract RxNftMinter is ERC721Base {
    uint256 private rx_tokenCounter;

    // constructor() ERC721("RxNFT", "HMD") {
    //     rx_tokenCounter = 0;
    // }

    constructor(
        string memory _name,
        string memory _symbol
    )
        // address _royaltyRecipient,
        // uint128 _royaltyBps
        ERC721Base(_name, _symbol, msg.sender, 0)
    {
        rx_tokenCounter = 0;
    }

    struct Script {
        string patient_wallet;
        string name;
        string description;
        string medication;
        string dob;
        string quantity;
        uint256 rxId;
    }

    mapping(uint256 => Script) public scripts;

    Script[] allScripts;

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

    function _createScript(
        string memory _patient_wallet,
        string memory _name,
        string memory _description,
        string memory _medication,
        string memory _dob,
        string memory _quantity
    ) public returns (uint256) {
        Script memory _rx = Script({
            patient_wallet: _patient_wallet,
            name: _name,
            description: _description,
            medication: _medication,
            dob: _dob,
            quantity: _quantity,
            rxId: rx_tokenCounter
        });

        allScripts.push(_rx);

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
        address _to
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
        rx_tokenCounter += 1;
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

    // struct Parts {
    //     string[] parts1;
    //     string[] parts2;
    //     string[] parts3;
    //     string[] parts4;
    //     string[] parts5;
    //     string[] parts6;
    //     string[] parts7;
    //     string[] parts8;
    //     string[] parts9;
    // }

    // string[9] storage parts;
    // Parts[9] public parts;

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Script storage rx = allScripts[tokenId];

        string[7] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';

        parts[1] = getPatientInfo(tokenId);

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getMedicationInfo(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getDescriptionInfo(tokenId);

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
                        '","dob":"',
                        getDob(tokenId),
                        // '",',
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
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
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    } //end of tokenURI or generateSVG

    function getPatientInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return
            string(abi.encodePacked("Patient: ", rx.name, " - DOB: ", rx.dob));
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
                    "| Qty: ",
                    rx.quantity
                )
            );
    }

    function getDescriptionInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("SIG: ", rx.description));
    }

    function getAddressInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt Address: ", rx.patient_wallet));
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

    function getQuantity(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.quantity;
    }

    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
    }
} //end of contract
