import React from 'react'

const Messages = (props) => {
  function formatDate(timestamp) {
    // Convert input to a Date object, whether it's in ISO 8601 or milliseconds
    const inputDate = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  
    const currentDate = new Date();
  
    // Calculate the time difference in milliseconds
    const timeDiff = currentDate - inputDate;
  
    // Calculate the time difference in days
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
    if (daysDiff < 1) {
      // Today
      const hours = inputDate.getHours();
      const minutes = inputDate.getMinutes();
      const amOrPm = hours < 12 ? "AM":"PM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12
      const formattedMinutes = minutes.toString().padStart(2, '0'); // Pad minutes with leading zero
  
      return `Today, ${formattedHours}:${formattedMinutes} ${amOrPm}`;
    } else if (daysDiff < 2) {
      // Yesterday
      const hours = inputDate.getHours();
      const minutes = inputDate.getMinutes();
      const amOrPm = hours < 12 ? "AM":"PM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
  
      return `Yesterday, ${formattedHours}:${formattedMinutes} ${amOrPm}`;
    } else {
      // A date more than 1 day ago
      const day = String(inputDate.getDate()).padStart(2, '0');
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const year = inputDate.getFullYear();
      const hours = inputDate.getHours();
      const minutes = inputDate.getMinutes();
      const amOrPm = hours < 12 ? "AM":"PM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
  
      return `${day}-${month}-${year} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
    }
  }
  
  return (
    <div className={`border w-fit max-w-[80%] h-fit min-h-fit font-medium my-1 p-2 border-slate-700 rounded-t-xl text-sm ${props.direction==="left"?'rounded-ee-xl':'ml-auto rounded-es-xl bg-slate-700 text-slate-300'}`}>
      {props.type==="i" && <img title="File Preview" src={props.src} width="200px" height="120px" className='rounded-md' />}
      {props.type==="t" && <p className=''>{props.txt}</p>}
      <p className={`w-fit h-fit ml-auto text-[11px] ${props.direction==='left'?'text-slate-500':'text-slate-400'}`}>{formatDate(props.time)}</p>
    </div>
  )
}

export default Messages