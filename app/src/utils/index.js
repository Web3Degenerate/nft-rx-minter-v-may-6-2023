export const convertTokenId = (txReceipt) => {
    let formatTXReceipt = ethers.utils.formatEther(txReceipt.toString());
    // FINAL SOLUTION IN COMMENT AT BOTTOM: https://ethereum.stackexchange.com/questions/101356/how-to-convert-bignumber-to-normal-number-using-ethers-js
      const tokenId = Math.round(parseFloat(formatTXReceipt) * (10 ** 18));
  
    return tokenId;
  };