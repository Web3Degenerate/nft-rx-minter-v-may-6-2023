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