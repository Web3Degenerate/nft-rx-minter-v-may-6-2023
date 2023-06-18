//created (1:04:25)
import React from 'react'

//(1:12:58) - Pass in the FOUR props we defined in Navbar.js
const CustomButton = ({btnType, title, handleClick, styles}) => {

// (1:13:37) - just return button with the props we pass in. Originally from Navbar.js. (-1:14:45)
  return (
    <button
      type={btnType}
      // className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4
      // rounded-[10px] ${styles}`}
      className={styles}
      onClick={handleClick}
    >
    {title}
    </button>
  )
}

export default CustomButton