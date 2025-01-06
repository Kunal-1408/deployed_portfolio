'use client'
import Hero  from "../components/hero";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import  {Marquee}  from "@/components/ui/marquee";
import Cards from "@/components/service_cards";
import Infor from "@/components/info";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Choose from "@/components/choose";
import { FormEvent, useState } from "react";
import { fetchContent } from "@/lib/content-fetch";




  
// const BottomGradient = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </>
//   );
// };

const LabelInputContainer = ({
  children,
  className, 
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};



export default  function Home() {
  // const content = await fetchContent();

  console.log(content)
  
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Mobile: '',
    E_mail: '',
    Query: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };
  
  const addQuery = async (e: FormEvent) => {
    e.preventDefault();
    try {
      toast.info('Submitting...', { 
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
  
      // Fetch request
      const res = await fetch('/api/postquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Handle response
      const data = await res.json();
  
      if (res.ok) {
        // Show success toast after query is successfully sent
        toast.success('Query submitted successfully!', { 
          position: "bottom-left",
          autoClose: 2000,
          theme: "light",
        });
        // Reset form
        setFormData({
          First_Name: '',
          Last_Name: '',
          Mobile: '',
          E_mail: '',
          Query: ''
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      // Assert error as Error type to access the message
      const errorMessage = (error as Error).message || 'Unknown error occurred';
      toast.error(`Error: ${errorMessage}`, { 
        position: "bottom-left",
        autoClose: 2000,
        theme: "light",
      });
      console.error(error);
    }
  };

 
  return (
    <main className="bg-white dark:bg-neutral-900 items-center">
      <Hero/>
      
      <Infor />
      <h1 className=" text-slate-900 font-bold text-5xl ml-28">Why Choose us?</h1>
      <div className="pt-8 flex flex-col items-center">
          
          <Choose/>
      </div>

      <div className="flex flex-col bg ml-16 pt-20">
          <h2 className=" text-slate-900 font-bold text-5xl pb-2 " >Solutions</h2>  
          <h3 className=" text-slate-900  text-3xl  " >Others are okay but we are <span className="text-orange-400 font-bold">Quite Good</span></h3>  
      </div>
      <Cards/>

      <div className="flex flex-col bg ml-16 mt-16 pb-6">
          <h2 className=" text-slate-900 font-extrabold text-5xl " >Our Clients </h2>  
      </div>
      <div className="w-full pb-12 pt-4">
        <Marquee logos={images} />
      </div>
      
   
      <div className=" bg-white flex flex-row justify-between py-12 border-4 border-slate-100 ">
        <div className="place-items-center flex-row px-5 py-5 mx-auto ">
            <h1 className="font-bold text-5xl text-orange-500 dark:text-neutral-200 justify-center py-10 mb-10">
              Want better Reach?
            <p className="text-slate-700 text-lg max-w-sm mt-2 dark:text-neutral-300 flex flex-col">
            <>Connect with us!!</>
             <>Drop us a line and we&apos;ll get back!!!</>
            </p>
          </h1>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13997.190483309128!2d77.178936!3d28.7106503!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0354091c469d%3A0x6f369bf3f44dcee0!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1729075828599!5m2!1sen!2sin" width="450" height="250"  loading="lazy" ></iframe>
        </div>
          <div className="max-w-md w-full mx-auto border-2 border-slate-400 border-dashed md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
              <p className="text-3xl font-bold text-slate-700 text-bold py-5 ">Let us know your requirements!!</p>
              <form className="my-8" onSubmit={addQuery}>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="First_Name">First name</Label>
          <Input
            id="First_Name"
            placeholder="First"
            type="text"
            value={formData.First_Name}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="Last_Name">Last name</Label>
          <Input
            id="Last_Name"
            placeholder="Last"
            type="text"
            value={formData.Last_Name}
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>
      </div>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="Mobile">Mobile number</Label>
        <Input
          id="Mobile"
          placeholder="+91 000 000 0000"
          type="tel"
          value={formData.Mobile}
          onChange={handleInputChange}
          required
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="E_mail">Email Address</Label>
        <Input
          id="E_mail"
          placeholder="project@example.com"
          type="email"
          value={formData.E_mail}
          onChange={handleInputChange}
          required
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4 box-content">
        <Label htmlFor="Query">Query</Label>
        <textarea
          id="Query"
          rows={5}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
          placeholder="..."
          value={formData.Query}
          onChange={handleInputChange}
          required
        ></textarea>
      </LabelInputContainer>

      <button
        className="bg-gradient-to-br relative group/btn from-orange-400 dark:from-zinc-900 dark:to-zinc-900 to-orange-300 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Submit &rarr;
        {/* <BottomGradient /> */}
      </button>
    </form>
    <div className="bg-gradient-to-r from-transparent via-orange-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </div>
    </div>

    </main>
  );
}


  
    
  const images =[
    {
      src:'https://logowik.com/content/uploads/images/budweiser-beer5343.jpg',
      alt:'second photo',
  
      
    },    {
      src:'https://logowik.com/content/uploads/images/572_samuel_adams_logo.jpg',
      alt:'first photo',
  
      
    },    {
      src:'https://logowik.com/content/uploads/images/493_carlsberg.jpg',
      alt:'third photo',
  
      
    },    {
      src:'https://logowik.com/content/uploads/images/480_jagermeister_logo.jpg',
      alt:'fourth photo',
  
      
    },    {
      src:'https://logowik.com/content/uploads/images/125_redbull.jpg',
      alt:'fifth photo',
  
      
    },    {
      src:'https://logowik.com/content/uploads/images/867_heineken_14.jpg',
      alt:'sixth photo',
  
      
    },
    {
      src:'https://logowik.com/content/uploads/images/little-caesars.jpg',
      alt:'sixth photo',
  
      
    },
    {
      src:'https://logowik.com/content/uploads/images/586_iron_horse_logo.jpg',
      alt:'sixth photo',
  
      
    },
    {
      src:'https://logowik.com/content/uploads/images/587_brahma_logo.jpg',
      alt:'sixth photo',
  
      
    },
    
  ];
