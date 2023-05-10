## Summary of Minting dApp

## Commands

1. Set up the 721 Smart Contract Version

   - Install the thirdweb Contract Kit

     - > npx thirdweb@latest create --contract
       - Hardhat, ERC721, None.

   - Import OpenZeppelin

     - > npm install @openzeppelin/contracts

     - > import "@openzeppelin/contracts/utils/Base64.sol";

2. base 64 sources:

   - Thirdweb: [SVG Github Repo](https://github.com/thirdweb-example/on-chain-nft-metadata/blob/main/contracts/Contract.sol)

     - Thirdweb's [YouTube video on SVG solution](https://www.youtube.com/watch?v=rJQinCp1_Fw)

   - FCC: [FCC Github Repo](https://github.com/PatrickAlphaC/hardhat-nft-fcc/blob/main/contracts/DynamicSvgNft.sol)

   - base64 code from [Loopring's @Brechtpd](https://github.com/brechtpd/base64)

     - Install @Brechtpd's base64 code using this [npmjs.com package](https://www.npmjs.com/package/base64-sol/v/1.0.1)

       - > npm i base64-sol@1.0.1

       - > yarn add --dev base64-sol

       - Then import into solidity with:

         - > import "base64-sol/base64.sol"

   - FCC [YouTube base64 reference](https://youtu.be/gyMwXuJrbJQ?t=80098)

     - FCC [YouTube SVG Part 1 (22:07:03)](https://youtu.be/gyMwXuJrbJQ?t=79623)
     - FCC [YouTube SVG Part 2 (23:01:10)](https://youtu.be/gyMwXuJrbJQ?t=82870)
     - FFC [YouTube Basic NFT Overview (20:44:49)](https://youtu.be/gyMwXuJrbJQ?t=74689)

       - FCC [BasicNFT covers tokenURI (20:45:45)](https://youtu.be/gyMwXuJrbJQ?t=74745)
       - FCC [BasicNFT contract actually writes tokenURI fn (20:49:00)](https://youtu.be/gyMwXuJrbJQ?t=74940)
         - FCC [BasicNFT event and emit (23:14:08)](https://youtu.be/gyMwXuJrbJQ?t=83648)

     - Another [FCC user's github](https://gist.github.com/mbvissers/b507e810af73b1079efbad6d06d3aaf7)

       - _Less useful contract we found_ [mumbai contract view](https://mumbai.polygonscan.com/address/0x02a8d9c0ffdea713051a277f68c174abc0b630fc#code)

3. Deploy with:

   - > npm run deploy

4. Run a local dev server (App)

   > npm run dev

   > yarn dev

## Resources

1. SVG Stack overflow

   - Stack Overflow article on [using **textPath** to wrap text for sig on the last line](https://stackoverflow.com/questions/4991171/auto-line-wrapping-in-svg-text):
     - Test it out here

2. Run tests using W3 Schools

   - Latest test we ran [using the W3 school tool](https://www.w3schools.com/graphics/tryit.asp?filename=trysvg_text)

```html
<!DOCTYPE html>
<html>
  <body>
    <svg height="30" width="200">
      <text x="0" y="15" fill="red">I love SVG!</text>
      Sorry, your browser does not support inline SVG.
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 350 350"
    >
      <style>
        .base {
          fill: black;
          font-family: serif;
          font-size: 12px;
        }
      </style>
      <rect width="100%" height="100%" fill="#e6f7ff" />
      <text x="100" y="20" class="base" fill="red">Patient: Dave</text>
      <text x="10" y="40" class="base">
        Medication: Amlodipine 50mg Qty: 30 pills
      </text>
      <text x="10" y="60" class="base">SIG: Take 2x in AM</text>
      <text x="10" y="80" fill="green">Status: FILLED</text>
      <text x="10" y="100" fill="green">Status: FILLED</text>
      <text x="10" y="120" fill="green">Status: FILLED</text>
      <text x="10" y="140" fill="red">
        Longer text can it ever wrap? does it wrap? do naggers wrap?
      </text>

      <text x="10" y="160" fill="black">SIG: Directions:</text>
      <defs>
        <!-- define lines for text lies on -->
        <path
          id="path1"
          d="M10,20 H350 M10,40 H350 M10,60 H350 M10,80 H350"
        ></path>
      </defs>
      <use xlink:href="#path1" x="10" y="162" stroke="blue" stroke-width="1" />
      <text transform="translate(10,160)" fill="red" font-size="14px">
        <textPath xlink:href="#path1">
          Longer text can it ever wrap? does it wrap? Take as needed. Please
          call my office if the problem persists.
        </textPath>
      </text>

      <text x="10" y="260" fill="black" font-size="12px">NPI:</text>
      <text x="10" y="280" fill="black">NPI:</text>
    </svg>

    <h2>End Output</h2>
  </body>
</html>
```

Naz [721 video, covers allowList around 43:30](https://www.youtube.com/live/DSKDhBCmHXk?feature=share&t=2610)

# Temporary Solution to "Stack Too Deep Error"

From this [Stack article, see the last solution](https://stackoverflow.com/questions/70310087/how-do-i-resolve-this-hardhat-compilererror-stack-too-deep-when-compiling-inli)

```js
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: false, // changed from enabled: true,
        runs: 5000, // changed from 200,
      },
    },
  },
};
```

# Inherit from 721 NOT ERC721Base for now (which is just 721A which uses \_safeMint(\_to, quantity))

The **721Base / 721A \_safeMint()** function is why we are getting the "MintZero" error of death:

```js
 function _safeMint(
        address to,
        uint256 quantity,
        bytes memory _data
    ) internal {
        uint256 startTokenId = _currentIndex;
        if (to == address(0)) revert MintToZeroAddress();
        if (quantity == 0) revert MintZeroQuantity();


```

## Front end success/failure messages attempted with [react bootstrap]()

special thanks to the tutorial here: https://stackblitz.com/edit/react-hooks-bootstrap-alerts?file=_services%2Falert.service.js,_services%2Findex.js

## External and Internal Linking in React/Vite

External Linking Solution From: https://herewecode.io/blog/react-router-link-to-external-url/

Bootstrap Alerts: https://getbootstrap.com/docs/4.0/components/alerts/

BigNumber to string solution from:

Pass the tokenId through `onChange({e => handleChange(e, nft.metadata.id )})` from: https://stackoverflow.com/questions/68256270/react-map-method-render-input-dynamically-change-value-separate-fields

How to make React Dropdown Component: https://blog.logrocket.com/customize-reusable-react-dropdown-menu-component/

```js
# php -- BEGIN cPanel-generated handler, do not edit
# Set the “ea-php80” package as the default “PHP” programming language.
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php80 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit


```

Then we found this one from: https://dev.to/crishanks/deploy-host-your-react-app-with-cpanel-in-under-5-minutes-4mf6

```js
<IfModule mod_rewrite.c>

  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]

</IfModule>

```
