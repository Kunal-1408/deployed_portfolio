import React from "react";

import Link from "next/link";
import Image from "next/image";


import { FaInstagram, FaFacebook,FaTwitter,FaLinkedin } from "react-icons/fa";


export const Footer: React.FC = () =>{
    return (
        <div className="relative w-full flex items-center justify-center">
          
        </div>
      );
}

export const Footerimpli: React.FC = () =>{
    return (
        <div className="relative w-full mx-auto justify-between flex-col bg-neutral-100 border-t-2 border-orange-100">

            <div className="grid-cols-3 flex  px-10 py-10 mx-10 justify-center" >
                <div className="item-center flex flex-col col-span-2 pr-10">
                    <Link href={"http://localhost:3000"}><Image src={"/icon.png"} alt="logo" height={110} width={140}  ></Image></Link>
                    
                </div>
                <div className=" items-center col-span-1 px-20 ">
                    <h3 className=" text-neutral-500 mb-3 mt-2">Quick Links</h3>
                    <ul className="list-none text-neutral-400 text-sm">
                        <li className="mx-1"><Link href={"localhost:3000/works"}>Works </Link></li>
                        
                        <li className="mx-1"><Link href={"localhost:3000/works"}>Agency </Link></li>
                        
                        <li className="mx-1"><Link href={"localhost:3000/works"}>About </Link></li>
                        
                        <li className="mx-1"><Link href={"localhost:3000/works"}>Case Studies </Link></li>
                       
                        <li className="mx-1"><Link href={"localhost:3000/works"}>Pricing </Link></li>
                    </ul>

                </div>
        


                <div className="mx-5 "> 
                    <h3 className="text-neutral-500 mb-3 mt-2">
                        Locate Us
                    </h3>
                    <span className="text-sm text-neutral-400">
                    416, Laxmi Tower, Commercial Complex, <br /> 
                    Gopal Nagar, Azadpur,<br/>
                    Delhi, 110033
                    </span>


                </div>

                <div className=" items-center col-span-1 px-20">
                    <h3 className=" text-neutral-500 mb-3 mt-2">Sitemap</h3>
                    <ul className="list-none text-neutral-400 text-sm ">
                        <li className="mb-1"><Link href={"localhost:3000/works"}>Terms of Service</Link></li>
                        <li className="mb-1"><Link href={"localhost:3000/works"}>Privacy Policy </Link></li>
                    </ul>

                </div>

            </div>
            <hr className="w-64 h-0.5 mx-auto my-4 bg-neutral-300 border-0 rounded dark:bg-gray-700"/>
            <div className=" flex flex-row justify-center pb-4 text-neutral-400">
              <Link href={"#"}>
                <FaFacebook className="h-10 w-10 py-2 px-2 mx-auto"/>
              </Link>
              <Link href={"#"}>
                <FaInstagram className="h-10 w-10 py-2 px-2 mx-auto"/>
              </Link>
              <Link href={"#"}>
                <FaTwitter className="h-10 w-10 py-2 px-2 mx-auto"/>
              </Link>
              <Link href={"#"}>
                <FaLinkedin className="h-10 w-10 py-2 px-2 mx-auto"/>
              </Link>
          </div>
                <div className="flex items-center justify-center space-x-1 py-2">
                    <span className="text-sm text-slate-400">© 2024 Quite Good</span>
                </div>
        </div>
      );
}
