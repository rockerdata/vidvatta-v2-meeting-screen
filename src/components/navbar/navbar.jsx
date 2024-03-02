'use client'
import React, {useEffect, useState} from 'react'
import { Button } from '../ui/button'
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation'


const Navbar = () => {

  const [username, setUsername] = useState(null);
  const router = useRouter()

  useEffect(() => {

    getCurrentUser().then((user) => {
      console.log('user:', user);
      setUsername(user.username);
    }).catch((e) =>{

    });

    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          getCurrentUser().then((user) => {
            setUsername(user.username);
          });
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          setUsername(null);
          break;
      }
    });
  }, []);


  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (


<nav className="bg-white border-gray-200 shadow-lg">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap">Flowbite</span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">
        <li>
          <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 " aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">About</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">Services</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">Pricing</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ">Contact</a>
        </li>
        <li >
          {username? 
            <div className='flex flex-row'>
            <div className=' align-middle'>{username}</div> <Button onClick={handleSignOut} className=' cursor-pointer'>Sign Out</Button> 
            </div> 
          : 
          <Button onClick={() => router.push('/dashboard')}>Sign up</Button>

          }  
        </li>
      </ul>
    </div>
  </div>
</nav>

  )
}

export default Navbar