import { BsThreeDots, BsFillCameraVideoFill, BsFillTelephoneFill, BsSearch, BsFillMicFill, BsSend, BsPaperclip, BsGearWideConnected, BsBoxArrowInRight } from "react-icons/bs";
import { FaUserAlt, FaUserSecret, FaUserFriends, FaArrowCircleLeft } from "react-icons/fa";
import { AiOutlineProfile } from "react-icons/ai";
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo_dp from '../images/logo.png'
import Chat from './Chat/chat';
import Messages from './Messages/messages';
import { io } from "socket.io-client";
import userContext from "../../context/userContext";

const connectWithSocket = (data) =>{
  const s = io(process.env.REACT_APP_SERVER_LINK,{
    autoConnect: false,
    query: { userid:data }
  });
  s.connect();
  return s;
}

const Body = () => {
  
  const socketRef = useRef(null);
  const hasEffectRun = useRef(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const context = useContext(userContext);
  const { userData, searchUser, searchFriends, getUserData, setToken } = context;
  
  let arrayInitial = [];
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [currUser, setCurrUser] = useState({"_id":"","name":"Default User","status":null,"lastActive":Date.now(),"isFriend":false});
  const [usersArray,setUsersArray] = useState(arrayInitial);
  const [msgArray,setMsgArray] = useState(arrayInitial);
  const [imgURL,setImgURL] = useState('');
  const [typing1,setTyping1] = useState(false);
  const [typing2,setTyping2] = useState(false);
  const [showChatArea,setShowChatArea] = useState(window.innerWidth>640?true:false);
  const [desktopView,setDesktopView] = useState(window.innerWidth>1024?true:false);


  // various functions for handling the onChange and onClick effect
  const handleOnChange = (e)=>{
    setText(e.target.value);
    if(!typing1){
      socketRef.current.emit('sTyping',currUser._id);
      setTyping1(true);
    }
    isTyping();
  }
  // for selecting the file
  const handleFileSelected = (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    socketRef.current.emit('send_message',selectedFile,currUser._id,currUser.isFriend,true);
  };

  // this function if for delaying after an event end (used in tying status)
  const debounce = (callback,delay=1000)=>{
    let timeout;
    return (...args)=>{
      clearTimeout(timeout)
      timeout = setTimeout(()=>{callback(...args)},delay);
    }
  }
  // used in typing status
  const isTyping = debounce(()=>{
    console.log("event");
    socketRef.current.emit('eTyping',currUser._id);
    setTyping1(false);
  },1500)

  // to send the message
  const handleSend = (e)=>{
    e.preventDefault();
    if(text){
      setMsgArray([...msgArray,{'text':text,'time':Date.now(),'dir':'right'}]);
    socketRef.current.emit('send_message',text,currUser._id,currUser.isFriend,false);
    setText('');
    }
  }
  // TODO
  const handleMicClick = (e)=>{
    e.preventDefault();
  }

  const handleOnSearch = (e)=>{
    setSearch(e.target.value);
  }

  // for searching the user
  const handleSearchClick = async (e) => {
    e.preventDefault();
    if(search.length!==0){
      const searchedUser = await searchUser(search,userData._id);
      setSearch('');
      setUsersArray(searchedUser.data)
    }
  }

  // for selecting the desire user for chatting
  const handleNewClick = (data) =>{
    let temp = userData.friends.findIndex((e)=>{return e===data._id});
    if(temp===-1){
      setCurrUser({"_id":data._id,"name":data.fName+" "+data.lName,"status":data.status,"lastActive":data.lastModified,"isFriend":false});
    }else{
      setCurrUser({"_id":data._id,"name":data.fName+" "+data.lName,"status":data.status,"lastActive":data.lastModified,"isFriend":true});
    }
    console.log(currUser)
    setMsgArray([]);
    setShowChatArea(true);
  } 
  
  // logout functionality
  const handleLogout = ()=>{
    socketRef.current.emit('dis_status');
    socketRef.current.disconnect();
    localStorage.removeItem('chatpro_auth_token');
    navigate('/');
  }
  // to serach for friends
  const getFriends = async () =>{
    // console.log(userData)
    const searchedFriends = await searchFriends(userData._id);
    console.log("searched friends ",searchedFriends);
    setUsersArray(searchedFriends);
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgArray]);

  useEffect(() => {
    if(Object.keys(userData).length===0){
      navigate('/login');
    }else{
      if (!hasEffectRun.current) {
        
        hasEffectRun.current = true;
        socketRef.current = connectWithSocket(userData._id);

        getFriends();

        // socket events
        
        // event on connection
        socketRef.current.on("connect", () => {
          console.log(socketRef.current.id);
        });
        
        // event on disconnection
        socketRef.current.on("disconnect", () => {
          console.log("Logout! client side disconnected");
        });
        
        // typing status turn to true 
        socketRef.current.on('typingS',()=>{
          setTyping2(true);
        })
        
        // typing status turn to false 
        socketRef.current.on('typingE',()=>{
          setTyping2(false);
        })

        // event on reciving messages
        socketRef.current.on('recv-message',(received_msg,isFile)=>{
          console.log(received_msg);
          if(isFile){
            const blob = new Blob([received_msg], { type: 'image/jpeg' });
            const fileUrl = URL.createObjectURL(blob);
            setImgURL(fileUrl);
            console.log(fileUrl);
            setMsgArray((prevMsgArray) => [
              ...prevMsgArray,
              { 'text': "image", 'time': Date.now(), 'dir': 'left' },
            ]);
          }else{
            setMsgArray((prevMsgArray) => [
              ...prevMsgArray,
              { 'text': received_msg, 'time': Date.now(), 'dir': 'left' },
            ]);
          }
          console.log(msgArray);
        })

        // when a friends get online , then changing status
        socketRef.current.on("status_on_conn", (userid) => {
          console.log("status update of user ", userid)
          setCurrUser(prevCurrUser => {        
            if (prevCurrUser._id === userid) {
              return {
                ...prevCurrUser,
                'status': true,
              };
            }
            return prevCurrUser;
          });
          setUsersArray((usersArray)=>{
            return usersArray.map((item)=>{
              if(item._id===userid){
                return {...item,'status':true};
              }else{
                return item;
              }
            })
          })
        });
        
        // when a friends get offline , then changing status
        socketRef.current.on("status_on_dis", (userid) => {
          console.log("status update of user ", userid)
          setCurrUser(prevCurrUser => {        
            if (prevCurrUser._id === userid) {
              return {
                ...prevCurrUser,
                'status': false,
              };
            }
            return prevCurrUser;
          });
          console.log(currUser);
          setUsersArray((usersArray)=>{
            return usersArray.map((item)=>{
              if(item._id===userid){
                return {...item,'status':false};
              }else{
                return item;
              }
            })
          })
        });
      }
    }
    // eslint-disable-next-line
  }, [])
  

  return (
    <div className='bg-slate-900 text-slate-400 w-screen h-screen flex justify-center items-center flex-col md:flex-row'>
      {/* left bar */}
      <div className='min-w-[15rem] w-52 h-full border-r border-slate-700 md:flex hidden flex-col justify-around items-center'>
        <div className='w-full h-fit flex justify-center flex-wrap'>
          <img src={logo_dp} alt="" />
        </div>
        <div className='w-5/6 h-fit flex justify-center flex-wrap'>
          <button disabled={true} className='w-2/3 h-10 border border-slate-700 my-2 rounded-sm flex items-center justify-center'> <AiOutlineProfile className="mr-1 text-xl text-yellow-500"/> Profile</button>
          <button disabled={true} className='w-2/3 h-10 border border-slate-700 my-2 rounded-sm flex items-center justify-center'> <FaUserSecret className="mr-1 text-xl text-blue-500"/> Private</button>
          <button onClick={getFriends} className='w-2/3 h-10 border border-slate-700 my-2 rounded-sm flex items-center justify-center'> <FaUserFriends className="mr-1 text-xl text-green-500"/>Friends</button>
        </div>
        <div className='w-5/6 h-fit flex justify-center flex-wrap'>
          <button disabled={true} className='w-2/3 h-10 border border-slate-700 my-2 rounded-sm flex items-center justify-center'> <BsGearWideConnected className="mr-1 text-xl text-gray-500"/> Settings</button>
          <button onClick={handleLogout} className='w-2/3 h-10 border border-slate-700 my-2 rounded-sm flex items-center justify-center'> <BsBoxArrowInRight className="mr-1 text-xl text-red-500"/> Logout</button>
        </div>
      </div>

      {/* left bar becomes top bar */}
      <div className="h-14 w-full flex justify-between md:hidden border border-slate-500">
        <div className="h-full w-fit flex items-center">
          {showChatArea && <FaArrowCircleLeft onClick={()=>{setShowChatArea(false)}} className={`mx-2 mx-${showChatArea?5:10} text-xl cursor-pointer`}/>}
          <AiOutlineProfile className={`mx-2 mx-${showChatArea?'5':'6'} text-xl text-yellow-500`}/>
          <FaUserSecret className={`mx-2 mx-${showChatArea?5:6} text-xl text-blue-500`}/>
          <FaUserFriends onClick={getFriends} className={`mx-2 mx-${showChatArea?3:6} text-xl text-gren-500 cursor-pointer`}/>
        </div>
        <div className="h-full w-fit flex items-center">
          <BsGearWideConnected className={`mx-2 mx-${showChatArea?5:6} text-xl text-gray-500`}/>
          <BsBoxArrowInRight onClick={handleLogout} className={`mx-2 mx-${showChatArea?5:6} text-xl text-red-500 cursor-pointer`}/>
        </div>
      </div>

      <div className='h-full flex flex-grow flex-col'>
        {/* search bar */}
        <div className='w-full min-h-min h-14 border-b border-slate-700 sm:flex hidden justify-between items-center'>
          <div className='w-96 h-full flex justify-center items-center'>
            <button onClick={handleSearchClick} className='h-2/3 aspect-square mx-1 flex justify-center items-center cursor-pointer'><BsSearch/></button>
            <input onChange={handleOnSearch} value={search} className='h-2/3 w-full bg-transparent outline-none text-sm pl-3' placeholder='Search . . .'></input>
          </div>
          <div className='w-fit h-full flex justify-center items-center mr-5'>
            <p>{userData.fName+" "+userData.lName}</p>
            <div className='h-4/5 aspect-square mx-1 border border-slate-700 rounded-full flex items-center justify-center'><FaUserAlt/></div>
          </div>
        </div>
        {!showChatArea && <div className='w-full min-h-min h-14 border-b border-slate-700 justify-between items-center'>
          <div className='w-96 h-full flex justify-center items-center'>
            <button onClick={handleSearchClick} className='h-2/3 aspect-square mx-1 flex justify-center items-center cursor-pointer'><BsSearch/></button>
            <input onChange={handleOnSearch} value={search} className='h-2/3 w-full bg-transparent outline-none text-sm pl-3' placeholder='Search . . .'></input>
          </div>
        </div>}

        <div className='flex flex-grow h-full'>
          { (!showChatArea || desktopView) && <div className='w-96 h-full border-r border-slate-700'>
            {
              usersArray.map((data)=>{
                return <Chat clickFunction={()=>{handleNewClick(data)}} key={data._id} name={`${data.fName} ${data.lName}`} status={data.status} lastOnline={data.lastModified}  />
              })  
            }
          </div>}
        
          {/* chatting area */}
          {showChatArea && <div className='w-[70%] flex-grow h-full flex flex-col justify-between items-center'>
            <div className='flex items-center w-full border-b border-slate-700 h-14'>
              <div className=' h-2/3 aspect-square ml-2 flex justify-center items-center'><FaUserAlt/></div>
              <div className=' h-5/6 w-fit ml-2'>
                <p className=''>{currUser.name}</p>
                {currUser.status===false && <p className='text-xs font-semibold text-slate-600'><span className="text-red-500">Offline</span> . {currUser.lastActive}</p>}
                <div className="flex w-20 justify-between">
                  {currUser.status===true && <p className='text-xs font-semibold text-green-500'>Online</p>}
                  {typing2 && <p className="text-xs">Typing...</p>}
                </div>
              </div>
              <div className='ml-auto flex h-5/6 mr-4'>
                {!showChatArea && <div className='h-full mx-1 flex justify-center items-center aspect-square cursor-pointer'><BsFillTelephoneFill/></div>}
                {!showChatArea && <div className='h-full mx-1 flex justify-center items-center aspect-square cursor-pointer'><BsFillCameraVideoFill/></div>}
                <div className='h-full mx-1 flex justify-center items-center aspect-square cursor-pointer'><BsThreeDots/></div>
              </div>
            </div>
            
            {msgArray.length===0 && <div className='h-3/4 max-h-[40rem] flex-grow w-[96%] max-w-6xl my-5 border border-slate-700 p-2 flex justify-center items-center'>No new messages</div>}
            
            {msgArray.length!==0 && <div ref={chatContainerRef} className='h-3/4 max-h-[40rem] flex-grow w-[96%] max-w-6xl my-5 scroll-smooth border border-slate-700 p-2'>
              {msgArray.map((msgs)=>{
                if(msgs.text==="image"){
                  return <Messages key={msgs.time} direction={msgs.dir} txt={msgs.text} time={msgs.time} type="i" src={imgURL} />
                }else{
                  return <Messages key={msgs.time} direction={msgs.dir} txt={msgs.text} time={msgs.time} type="t" />
                }
              })}
            </div>}
            <form className='w-[96%] h-14 mb-5 flex justify-between items-center'>
              <div onClick={handleMicClick} className='h-2/3 aspect-square ml-2  outline-none flex justify-center items-center text-xl '><BsFillMicFill/></div>
              <label className='h-2/3 aspect-square ml-2  outline-none flex justify-center items-center text-xl '><input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelected}/> <span><BsPaperclip/></span> </label>
              <input onChange={handleOnChange} value={text}  className='flex flex-grow h-3/4 bg-transparent outline-0 mx-2 border border-slate-700 px-3' placeholder='Type a message here ...'></input>
              <button disabled={currUser._id.length===0?true:false} type='submit' onClick={handleSend} className='h-3/4 w-fit mr-2 px-4  text-xl outline-none flex justify-center items-center cursor-pointer'><BsSend/></button>
            </form>
          </div>}
        </div>

      </div>
    </div>
  )
}

export default Body;