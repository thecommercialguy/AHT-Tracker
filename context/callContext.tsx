import { createContext } from "react"

interface CallData {
    recentCallTime: number,
    fastestCallTime: number,
    longestCallTime: number,
    totalCallTime: number,
    averageCallTime: number
}

const CallDataContext = createContext<CallData | null>(null);


export function CallDataProvider({ children }) {


    return (
        <CallDataContext.Provider value={{ null }}>

        </CallDataContext.Provider>
    )
}


export function useCallDataContext() {
    
}