import { useLoaderData, useRevalidator } from "react-router";
import type { DashboardData } from '../types/callTypes';
import { CSSProperties, useEffect, useState } from "react";
import { msToHours } from '../helpers/timeHelpers'
import { getUserDashboard, getAgentSession, getTaskLegs, getDashboardData } from '../loaders/dashboardLoaders'


export async function loader() {
    const data = await getUserDashboard();
    // const data = await getDashboardData();
    
    return data;    
}



// const INTERVAL: number = 4*60*1000;

export default function Home() { 
    const data = useLoaderData();  // Difference between destructuring and just using the response
    const [dashboardData, setDashboardData] = useState<DashboardData>(data);
    // const [revalidating, setRevalidating] = useState<boolean>(false);
    const revalidator = useRevalidator(); 
 
    
    console.log(data)
    console.log(dashboardData)
    // useEffect(() => {
    //     if (revalidator.state !== "idle") return;
    //     const timeoutId = setTimeout(() => {
    //         revalidator.revalidate()
    //         console.log("effect ran, state:", revalidator.state);
    //     }, INTERVAL);
        
    //     return () => clearTimeout(timeoutId)
    // }, [revalidator.state])

    return (
        <main className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-header-text">Welcome back, William Walter</h2>
                <div className="call-count-container">
                    <span className="call-count-header">Total Calls</span>
                    <span className="call-count">{dashboardData.totalCount}</span>
                </div>
            </div>
            <div className="call-stats-container">
                <div className="call-stats-item recent-call-container">
                    <div className="call-stats-label">Most Recent Call Time</div>
                    <div className="call-stats-value">{msToHours(dashboardData?.recentCall.duration)}</div>
                    <div className="call-time-split" style={getCallTimeGradient(dashboardData.recentCall.duration, dashboardData.recentCall.connectedDuration)}></div>
                </div>
                <div className="call-stats-item total-connected-container">
                    <div className="call-stats-label">Total Connected Time</div>
                    <div className="call-stats-value">{msToHours(dashboardData?.connectedDuration)}</div>
                </div>
                <div className="call-stats-item last-five-average-container">
                    <div className="call-stats-label">Total Connected Calls</div>
                    <div className="call-stats-value">{dashboardData.connectedCount}</div>
                </div>
                <div className="call-stats-item fastest-call-container">
                    <div className="call-stats-label">Fastest Call Time</div>
                    <div className="call-stats-value">{msToHours(dashboardData.fastestCall)}</div>
                </div>
                <div className="call-stats-item longest-call-container">
                    <div className="call-stats-label">Longest Call Time</div>
                    <div className="call-stats-value">{msToHours(dashboardData.longestCall)}</div>
                </div>
                <div className="call-stats-item average-time-container">
                    <div className="call-stats-label">Average Handle Time</div>
                    <div className="call-stats-value">{msToHours(dashboardData.averageHandleTime.duration)}</div>
                    <div className="call-time-split" style={getCallTimeGradient(dashboardData.averageHandleTime.duration, dashboardData.averageHandleTime.connectedDuration)}></div>
                </div>
            </div>
            <div>
            </div>
        </main>
    ); 
}


const getCallTimeGradient = (callDuration?: number | null, connectedDuration?: number | null): CSSProperties => {

    if (!connectedDuration) return {} as CSSProperties;
    if (!callDuration) return {} as CSSProperties;

    
    const callPercentage = `${(connectedDuration / callDuration)*100}%`


    return {
        background: `linear-gradient(to right, #FF7B00 ${callPercentage}, #57AEFB)`
    } as CSSProperties
}
