import { Switch } from './ui/switch.tsx';
import { Label } from './ui/label.tsx';
import { useStore } from '@nanostores/react';
import { isImageGenOn } from '../store/atom.js';
import React, { useState, useEffect } from 'react';

export function SwitchImage() {
    let switchState = useStore(isImageGenOn);
    const [localSwitchState, setLocalSwitchState] = useState<boolean | undefined>(false);

    useEffect(() => {
        // Set the isImageGenOn atom to false only once when the component mounts
        isImageGenOn.set(false);

        //cleanup function when component unmounts
        return () => {
            isImageGenOn.set(false);
        };
    }, []); // Empty dependency array means this effect runs only once

    const handleToggle = () => {
        console.log('switching image toggle');
        setLocalSwitchState(!localSwitchState);
        isImageGenOn.set(!switchState);
    };

    return (
      <div className="py-2 flex items-center space-x-2">
        <Switch checked={localSwitchState} onCheckedChange={handleToggle} id="image-gen-toggle" />
        <Label htmlFor="image-gen-toggle">Include Generated Image: {switchState? 'On': 'Off'}</Label>
      </div>
    )
  }



