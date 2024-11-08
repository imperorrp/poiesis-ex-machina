"use client";
 
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input.tsx";
import { toast } from "sonner"
import { useStore } from '@nanostores/react';
import { currentPrompt } from '../store/atom.js';
import React, { useState, useEffect } from 'react';
 
export function PromptPicker() {
  const [toastId, setToastId] = useState<string | number | undefined>(undefined);

  const [localCurrentPrompt, setLocalCurrentPrompt] = useState<string>("");
  const [localIsPromptSet, setLocalIsPromptSet] = useState(false);

  let $currentPrompt = useStore(currentPrompt);

  useEffect(() => {

    return () => {
        //cleanup function when component unmounts
        if(localCurrentPrompt!=""){
          currentPrompt.set(localCurrentPrompt);
        }
    };
  }, []); // Empty dependency array means this effect runs only once


  const placeholders = [
    "Life, the Universe, and Everything",
    "The Human Condition",
    "Dreams", //and symbolism
    "Cities",
    "Civilization",
    "The Unknown",
    "Consciousness",
    "Transcendence",
    "Cosmic Horror",
    "Death and Immortality",
    "War and Peace",
    "Nature",
    "Love",
    "Meaning",
    "Aliens",
    "Hope",
    "The Future",
  ];

  // constraints for prompt 
  const MAX_LENGTH = 50; 
  const MIN_LENGTH = 3;  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic validation for string length
    if (value.length < MIN_LENGTH) {
      if(toastId!=undefined){
        toast.error("Input too short", {
          id: toastId,
          description: `Input should be at least ${MIN_LENGTH} characters.`,
          duration: 2000,
        });
      }
      else
      {
        const toastId = toast.error("Input too short", {
          description: `Input should be at least ${MIN_LENGTH} characters.`,
          duration: 2000,
        });
        setToastId(toastId);
      }
    }
    else if (value.length > MAX_LENGTH) {
      if(toastId!=undefined){
        toast.error("Input too long", {
          id: toastId,
          description: `Input should not exceed ${MAX_LENGTH} characters.`,
          duration: 2000,
        });
      }
      else
      {
        const toastId = toast.error("Input too long", {
          description: `Input should not exceed ${MAX_LENGTH} characters.`,
          duration: 2000,
        });
        setToastId(toastId);
      }
    }
    else {
      if(toastId!=undefined){
        toast.dismiss(toastId);
        setToastId(undefined);
      }
    }
    //console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    const inputValue = input?.value || "";
    //console.log("Input Value Submitted.");
    const toastText = `Set Prompt: ${inputValue}`;
    console.log(`Setting Prompt : ${inputValue}`);
    setLocalCurrentPrompt(inputValue);
    setLocalIsPromptSet(true);
    console.log("local prompts set")
    setTimeout(() => {
      const toastId = toast("Prompt Added:", {
          description: inputValue,
          duration: 3000,
          action: {
            label: "X",
            onClick: () => { 
              console.log("Closing Toast"); 
              toast.dismiss(toastId);
            },
          },
        });
    }, 1000);
    console.log(toastText);
    currentPrompt.set(inputValue);  
    console.log(`Current prompt updated : ${inputValue}`);
  };

  console.log(`PromptPicker.tsx | currentPrompt = ${$currentPrompt}`);
  return (
    <div className="p-2 xl:w-1/2 lg:w-1/2 w-full">
        <p id="showprompt" className="p-4 pb-6 ascii-font text-base text-center">
            {$currentPrompt!="" ? (
              <>
                Current Prompt:  <span className="ascii-font cool-font-color rounded-sm shadow-sm"> "{$currentPrompt}"</span> | Enter a new topic/prompt:
              </>
            ) : (
                 "Enter a topic/prompt: "
            )}
        </p>
        <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
        />
        <p className="p-4 pt-6 ascii-font text-base text-center">
          <span className="inline-block lg:hidden xl:hidden">↓</span>
          <span className="hidden lg:inline-block xl:inline-block">←</span>
          Then pick an archetype <sup className="text-lg cool-font-color"> 3 </sup>
        </p>
    </div>
  );
}

