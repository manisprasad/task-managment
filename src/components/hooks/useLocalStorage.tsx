import React, { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [savedTask, setSavedTask] = useState<T>(() =>{
        try{
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (e){
            console.log('Error occured while fetching data from LocalStorage', e);
            return initialValue;
        }
    });

    useEffect(() =>{
        try {
            window.localStorage.setItem(key, JSON.stringify(savedTask));
        } catch (error) {
            console.log('Error occured while saving data to LocalStorage', error);
        }
    }, [key, savedTask]);

    return [savedTask, setSavedTask];
	
}