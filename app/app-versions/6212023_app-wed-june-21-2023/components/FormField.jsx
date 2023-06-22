
import React from 'react'

import "../styles.css";

//(1:38:32) - pass in the props we need from CreateCampaign
const FormField = ({ labelName, name, placeholder, inputType, isTextArea, value, handleChange}) => {

  return (
    // (1:39:00) - wrap everything in label tag 
    <label className="flex-1 w-full flex flex-col">
        {/* If labelName exists then show the labelName in span tags */}
            {labelName && (
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                    {labelName}
                </span>
            )}

        {/* (1:40:20) - check if it's a text area, else show input. textArea attributes at (1:42:44)  */}
            {isTextArea ? (
                <textarea 
                    required
                    value={value}
                    onChange={handleChange}
                    // type={inputType}
                    // step="0.1"
                    rows={10}
                    placeholder={placeholder}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent 
                    font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
            ) : (
                <input 
                    required
                    value={value}
                    name={name}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent 
                    font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
            )}

    </label>
  )
}

export default FormField