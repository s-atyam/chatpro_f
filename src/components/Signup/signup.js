import React, { useContext, useState, useEffect } from 'react'
import logo_dp from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../../context/userContext';

// the signup react funtional component
const Signup = () => {
    const context = useContext(userContext);
    const { signup, getUserData, token } = context;

    const navigate = useNavigate();

    const [name, setName] = useState({fName:'',lName:''});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState({pass:'',confirm:''});
    const [flag,setFlag] = useState({fName:false,email:false,pass:false,confirm:false})

    // function trigered when, typing the Fname
    const handleChangeFname = (e)=>{
        setName({...name,fName:e.target.value});
        setFlag({...flag,fName:false});
    }
    // function trigered when, typing the Lname
    const handleChangeLname = (e)=>{
        setName({...name,lName:e.target.value});
    }
    // function trigered when, typing the Email
    const handleChangeEmail = (e)=>{
        setEmail(e.target.value);
        setFlag({...flag,email:false});
    }
    // function trigered when, typing the Email
    const handleChangePassword = (e)=>{
        setPassword({...password,pass:e.target.value});
        setFlag({...flag,pass:false});
    }
    // function trigered when, typing the Confirm Password
    const handleChangeConfirmPass = (e)=>{
        setPassword({...password,confirm:e.target.value});
        setFlag({...flag,confirm:false});
    }
    
    // function trigered when, clicked on the SUBMIT button
    const handleClick = async (e)=>{
        e.preventDefault();
        const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const validPassRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(name.fName===''){
            setFlag({...flag,fName:true});
            return;
        }
        if(!email.match(validEmailRegex)){
            setFlag({...flag,email:true});
            return;
        }
        if(!password.pass.match(validPassRegex)){
            setFlag({...flag,pass:true});
            return;
        }
        if(password.pass!==password.confirm){
            setFlag({...flag,confirm:true});
            return;
        }
        
        const userData = await signup({name,email,password});
        if(Object.keys(userData).length>0){
            navigate('/user');
        }else{
            console.log(token,"New User not Created")

        }
    }    

  return (
    <div className='h-screen w-screen bg-slate-900 flex justify-center items-center text-slate-400 flex-col'>
        <div className="w-2/3 md:w-1/6 flex mb-10">
            <img src={logo_dp} alt="" />
        </div>
        <form className='w-11/12 sm:w-1/2 lg:w-1/3 h-fit py-10 border-2 border-slate-700 rounded-md flex justify-center items-center flex-wrap'>
            <div className='w-11/12 h-fit flex flex-wrap mb-4 md:mb-0 '>
                <div className='w-full md:w-[48%] h-fit flex flex-col mr-auto'>
                    <label className='text-sm mb-1'>FIRST NAME *</label>
                    <input onChange={handleChangeFname} className='flex h-9 outline-none bg-transparent border border-slate-700 pl-3 text-lg font-medium rounded-md focus:bg-slate-800' type='text' />
                    <div className='w-full h-6 mt-1'>
                        {flag.fName && <p className='text-red-600 font-medium text-xs'>*First name is required</p>}
                    </div>
                </div>
                <div className='w-full md:w-[48%] flex h-fit flex-col'>
                    <label className='text-sm mb-1'>LAST NAME</label>
                    <input onChange={handleChangeLname} className='flex h-9 outline-none bg-transparent border border-slate-700 pl-3 text-lg font-medium rounded-md focus:bg-slate-800 ' type='text' />
                </div>
            </div>
            <div className='w-11/12 h-fit flex flex-wrap '>
                <div className='w-full flex h-fit flex-col'>
                    <label className='text-sm mb-1'>EMAIL *</label>
                    <input onChange={handleChangeEmail} className='flex h-9 outline-none bg-transparent border border-slate-700 pl-3 text-lg font-medium rounded-md focus:bg-slate-800 ' type='email' />
                </div>
                <div className='w-full h-6 mt-1'>
                    {flag.email && <p className='text-red-600 font-medium text-xs'>*Valid email is required</p>}
                </div>
            </div>
            <div className='w-11/12 h-fit flex flex-wrap mb-4 md:mb-0 '>
                <div className='w-full md:w-[48%] h-fit flex flex-col mr-auto'>
                    <label className='text-sm mb-1'>PASSWORD *</label>
                    <input onChange={handleChangePassword} className='flex h-9 outline-none bg-transparent border border-slate-700 pl-3 text-lg font-medium rounded-md focus:bg-slate-800' type='password' />
                    <div className='w-full h-6 mt-1'>
                        {flag.pass && <p className='text-red-600 font-medium text-xs'>*Uppercase and special character required</p>}
                    </div>
                </div>
                <div className='w-full md:w-[48%] flex h-fit flex-col'>
                    <label className='text-sm mb-1'>CONFIRM PASSWORD *</label>
                    <input onChange={handleChangeConfirmPass} className='flex h-9 outline-none bg-transparent border border-slate-700 pl-3 text-lg font-medium rounded-md focus:bg-slate-800 ' type='password' />
                    <div className='w-full h-6 mt-1'>
                        {flag.confirm && <p className='text-red-600 font-medium text-xs'>*Password does not match</p>}
                    </div>
                </div>
            </div>
            <div className='w-11/12 h-fit flex justify-center flex-wrap md:mt-5'>
                <Link to='/' className=' border text-sm font-semibold px-12 py-2 md:py-1  rounded-sm mx-auto border-slate-300 text-slate-300'>Back</Link>
                <button onClick={handleClick} className=' border text-sm font-semibold px-12 py-2 md:py-1  rounded-sm mx-auto border-blue-600 text-blue-600'>Submit</button>
            </div>
        </form>
        <p className='font-semibold text-md mt-10'>Already a user? <Link to='/login' className='text-green-600 cursor-pointer'>Login</Link></p>
    </div>
  )
}

export default Signup
