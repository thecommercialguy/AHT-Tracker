import { useLoaderData } from "react-router";
import type { DashboardData } from '../types/callTypes';
import { useState } from "react";
import { msToHours } from '../helpers/timeHelpers'
import { getAgentSession, getTaskLegs, getUserDashboard } from '../loaders/dashboardLoaders'


export async function loader() {
    const data = await getUserDashboard()
    
    return data;
    
}

export default function Home() { 
    const data = useLoaderData();  // Difference between destructuring and just using the response

    const [dashboardData, setDashboardData] = useState<DashboardData>(data)

    
    console.log(data)
    console.log(dashboardData)
    // console.log(channelInfo)
    // console.log(queryData.data)

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
                </div>
            </div>
            <div>

            </div>
        </main>
    ); 
}