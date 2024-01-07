import { FaUserAlt } from "react-icons/fa";
import React from 'react'

const Chat = (props) => {
    function formatTimestamp(timestamp) {
        const inputDate = new Date(timestamp);

  // Create a Date object for today's date
  const today = new Date();

  // Check if the input date is yesterday
  if (
    inputDate.getDate() === today.getDate() - 1 &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return "yesterday";
  } else {
    // Format the date as "dd-mm-yyyy"
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = inputDate.getFullYear();

    return `${day}-${month}-${year}`;
        }
    }
      
  return (
    <button onClick={props.clickFunction} className='w-full h-14 border-b px-1 border-slate-700 flex justify-center items-center'>
        <div className='h-4/5 aspect-square my-1 flex justify-center items-center'><FaUserAlt/></div>
        <div className='flex w-full justify-center items-center flex-col h-5/6 mx-2'>
            <div className='w-full h-fit flex justify-between mx-2'>
                <div className='flex w-1/2 justify-between'>
                    <h1 className='text-sm font-medium'>{props.name}</h1>
                </div>
                    {!props.status && <p className='text-red-500 text-[10px] font-bold'>Offline</p>}
                    {props.status && <p className='text-green-500 text-[10px] font-bold'>Online</p>}
                {!props.status && <h1 className='text-[11px] text-slate-500 font-semibold'>{formatTimestamp(props.lastOnline)}</h1>}
            </div>
            <div className='w-full h-fit flex justify-between mx-2'>
                <p className='w-full text-xs flex text-slate-500 font-medium'>Click here to chat with them</p>
                {/* <p className='text-[10px] font-bold text-slate-900  w-[18px] rounded-full bg-slate-300'>5</p> */}
            </div>
            
        </div>
    </button>
  )
}

export default Chat