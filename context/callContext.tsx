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
        <Defi
    )
}