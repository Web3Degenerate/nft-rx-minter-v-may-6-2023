    export const daysLeft = (deadline) => {
        const difference = new Date(deadline).getTime() - Date.now();
        const remainingDays = difference / (1000 * 3600 * 24);
    
        return remainingDays.toFixed(0);
    };


    export const addyShortner = (address) => {
        let stringAddy = String(address);
        // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
        const shortenedAddy = stringAddy.substring(0, 6) + "..." + stringAddy.substring(37)
        return shortenedAddy;
   }

//JavaScript Mastery Kickstarter barPercentage
    export const calculateFilledPercentage = (prescribedAmount, filledAmount) => {
        const percentageFilled = Math.round((filledAmount * 100) / prescribedAmount);
    
        return percentageFilled;
    };

//chatGPT functions
export const formatDateTwoDigitYear = (date) => {
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
    let dateValue = String(date);

    // Split the date value by the hyphen
    const [year, month, day] = dateValue.split('-');

    // Create a new Date object using the extracted values
    const formattedDate = new Date(year, month - 1, day);

    // Format the date as mm/dd/YY
    const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString().slice(-2)}`;
    return formattedDateString; // Output: 05/19/23
   }

                        // STRING
   export const formatDateTwoDigit = (dateValue) => {
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
    // let dateValue = String(date);

    // Split the date value by the hyphen
    const [year, month, day] = dateValue.split('-');

    // Create a new Date object using the extracted values
    const formattedDate = new Date(year, month - 1, day);

    // Format the date as mm/dd/YY
    const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString().slice(-2)}`;
    return formattedDateString; // Output: 05/19/23
   }

   export const formatDateFourDigitYear = (date) => {
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
    let dateValue = String(date);

    // Split the date value by the hyphen
    const [year, month, day] = dateValue.split('-');

    // Create a new Date object using the extracted values
    const formattedDate = new Date(year, month - 1, day);

    // Format the date as mm/dd/YY
    const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear()}`;
    return formattedDateString; // Output: 05/19/23
   }


//    let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));
   export const formatPharmacyName = (pharmacy) => {
        const formattedPharmacyName = pharmacy.substring(0, rxWallet.pharmacyName.indexOf(" ["))
        return formattedPharmacyName;
   }


// ChatGPT Day Calculator + 1
   export const dayCalculatorDoc = (startDate, numberOfDays) => {
        const todaysFillDate = new Date(startDate);
        todaysFillDate.setDate(todaysFillDate.getDate() + numberOfDays + 1);

        const year = todaysFillDate.getFullYear();
        const month = String(todaysFillDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const day = String(todaysFillDate.getDate()).padStart(2, '0');

        const modifiedNextFillDateString = `${year}-${month}-${day}`;
        return modifiedNextFillDateString;
   }

   
// ChatGPT Convert date as number to raw string "YYYY-MM-DD" (plus 1 to get it right?)
export const convertNumberDateToRawString = (dateNumber) => {
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return dateString;
  }


  export const convertNumberDateToFourDigitString = (dateNumber) => {
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateFourDigitYear(dateString);
  }

  export const convertNumberDateToTwoDigitString = (dateNumber) => {
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateTwoDigitYear(dateString);
  }





 // CONVERT BIG NUMBER to RAW Date, Four Digit Year and Two Digit Year: 
 
 export const convertBigNumberToRawString = (bigNumberDate) => {
  let dateNumber = Number(bigNumberDate);
  var date = new Date(dateNumber);
  
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()+1).padStart(2, '0');
  
  var dateString = year + '-' + month + '-' + day;
  return dateString;
}

  export const convertBigNumberToFourDigitYear = (bigNumberDate) => {
    let dateNumber = Number(bigNumberDate);
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateFourDigitYear(dateString);
  }

  export const convertBigNumberToTwoDigitYear = (bigNumberDate) => {
    let dateNumber = Number(bigNumberDate);
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateTwoDigitYear(dateString);
  }