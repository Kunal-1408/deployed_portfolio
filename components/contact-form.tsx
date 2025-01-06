'use client'

import { useState, FormEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function ContactForm() {
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
  
      const res = await fetch('/api/postquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success('Query submitted successfully!', { 
          position: "bottom-left",
          autoClose: 2000,
          theme: "light",
        });
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
    <div className="max-w-md w-full mx-auto border-2 border-slate-400 border-dashed md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <p className="text-3xl font-bold text-slate-700 text-bold py-5">Let us know your requirements!!</p>
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
        </button>
      </form>
      <div className="bg-gradient-to-r from-transparent via-orange-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      <ToastContainer />
    </div>
  );
}

