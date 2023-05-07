// From: https://stackoverflow.com/questions/70310087/how-do-i-resolve-this-hardhat-compilererror-stack-too-deep-when-compiling-inli

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
      version: '0.8.9',
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
          "details": {
            "yul": true,
            "yulDetails": {
              "stackAllocation": true,
              "optimizerSteps": "dhfoDgvulfnTUtnIf"
            }
          }
        },
      },
    },
  };


// https://stackoverflow.com/questions/70310087/how-do-i-resolve-this-hardhat-compilererror-stack-too-deep-when-compiling-inli
  
// https://docs.soliditylang.org/en/v0.8.17/yul.html

  // https://docs.soliditylang.org/en/latest/yul.html#optimization-step-sequence