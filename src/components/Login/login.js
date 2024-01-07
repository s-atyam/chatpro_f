import React, { useContext, useState, useEffect } from 'react'
import logo_dp from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import userContext from '../../context/userContext';

// this login react functional component is to login the user
const Login = () => {
    const context = useContext(userContext);
    const { login, getUserData, token } = context;
    
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [flag,setFlag] = useState({"email":false,"pass":false})

    // function trigered when, typing the Email
    const handleChangeEmail = (e)=>{
        setEmail(e.target.value);
        setFlag({...flag,"email":false});
    }
    // function trigered when, typing the Change Password
    const handleChangePassword = (e)=>{
        setPassword(e.target.value);
        setFlag({...flag,"pass":false});
    }

    // function trigered when, clicked on SUBMIT button
    const handleClick = async (e)=>{
        e.preventDefault();
        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let validPassRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(!email.match(validEmailRegex)){
            setFlag({...flag,"email":true});
            return;
        }
        if(!password.match(validPassRegex)){
            setFlag({...flag,"pass":true});
            return;
        }
        
        await login({email,password});
        if(token===''){
            console.log("Invaid user.")
        }else{
            await getUserData();
            navigate('/user');
        }
    }

  return (
    <div className='h-screen w-screen bg-slate-900 flex justify-center items-center text-slate-400 flex-col'>
        <div className="w-2/3 md:w-1/3 flex mb-10">
            <img src={logo_dp} alt="" />
        </div>
        {/* form container */}
        <form className='w-11/12 sm:w-1/2 lg:w-1/3 py-10 border-2 border-slate-700 rounded-md flex justify-center items-center flex-wrap'>
            {/* input for email */}
            <div className='w-5/6 h-fit flex flex-wrap'>
                <div className='w-full h-20 flex justify-center flex-col mr-auto'>
                    <label className='text-sm mb-1'>EMAIL *</label>
                    <input onChange={handleChangeEmail} className='flex h-10 outline-none bg-transparent border border-slate-700 pl-3 text-md font-medium rounded-sm focus:bg-slate-800' type='email'  />
                </div>
                <div className='w-full h-6'>
                    {flag.email && <p className='text-red-600 text-sm font-medium'>*Valid email is required</p>}
                </div>
            </div>
            {/* input for password */}
            <div className='w-5/6 h-fit flex flex-wrap'>
                <div className='w-full h-20 flex justify-center flex-col mr-auto'>
                    <label className='text-sm mb-1'>PASSWORD *</label>
                    <input onChange={handleChangePassword} className='flex h-10 outline-none bg-transparent border border-slate-700 pl-3 text-md font-medium rounded-sm focus:bg-slate-800' type='password'  />
                </div>
                <div className='w-full h-11'>
                    {flag.pass && <p className='text-red-600 text-sm font-medium'>*8-15 characters with one lowercase, uppercase, special, numeric character required</p>}
                </div>
                <div className='w-full'>
                    <p className='text-blue-400 text-sm cursor-pointer'>Forgot Password?</p>
                </div>
            </div>
            {/* buttons */}
            <div className='w-11/12 h-fit flex justify-center flex-wrap mt-5 '>
                <Link to='/' className=' border outline-none text-sm font-semibold px-12 py-2 rounded-sm mx-auto hover:bg-slate-800 border-slate-300 text-slate-300'>Back</Link>
                <button to='/body' onClick={handleClick} className=' border outline-none text-sm font-semibold px-12 py-2 rounded-sm mx-auto hover:bg-slate-800 border-blue-600 text-blue-600'>Submit</button>
            </div>
        </form>
        <p className='font-semibold text-sm mt-10'>New to ChatPro? <Link to='/signup' className='text-blue-600 cursor-pointer'>Signup</Link></p>
    </div>
  )
}

export default Login
