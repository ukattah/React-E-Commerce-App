import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const jsonvalue = localStorage.getItem(key)

        if (jsonvalue != null)  return JSON.parse(jsonvalue)

        if (typeof initialValue === "function")
            return (initialValue as () => T)()
        else 
            return initialValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue] as [typeof value, typeof setValue]
}