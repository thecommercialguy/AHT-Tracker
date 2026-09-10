import { redirect, useLoaderData, useRevalidator, Await, useAsyncValue } from "react-router";
import type { DashboardData } from '../types/callTypes';
import { CSSProperties, useEffect, useState, Suspense } from "react";
import { msToHours } from '../helpers/timeHelpers'
import { getUserDashboard, getAgentSession, getTaskLegs, getDashboardData } from '../loaders/dashboardLoaders'
import { auth } from "../src/firebase";
import { useAuth } from "../context/authContext";
import { motion } from "motion/react";


export async function loader() {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) return redirect("/login");

    const token = await user.getIdToken();
    const data = getUserDashboard(token);
console.log(data instanceof Promise, 'akfpppppppp');
    // const data = await getDashboardData();
    return { data };    

   
    
}

// button animations

// const INTERVAL: number = 4*60*1000;

export default function Dashboard() { 
    const { data } = useLoaderData();  // Difference between destructuring and just using the response
    // const [dashboardData, setDashboardData] = useState<DashboardData>(data);
    // const [revalidating, setRevalidating] = useState<boolean>(false);
    // const revalidator = useRevalidator(); 
 
    
    // console.log(data)
    // console.log(dashboardData)
    // const { user, initializing } = useAuth();
    // useEffect(() => {
    //     if (revalidator.state !== "idle") return;
    //     const timeoutId = setTimeout(() => {
    //         revalidator.revalidate()
    //         console.log("effect ran, state:", revalidator.state);
    //     }, INTERVAL);
        
    //     return () => clearTimeout(timeoutId)
    // }, [revalidator.state])

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <Await
                resolve={data}
                
            >
                <DashboardComponent />
            </Await>

        </Suspense>
    
    )
}


const getErrorMessage = (error: any) => {
    if (error.status == 401) {
        return 'API Key expired :(. Contact william.walter1@loves.com for update';
    }
    if (error.status == 404) {
        return 'Call data available after first call';
    }

    return 'Issue getting call data :/'


}


const getCallTimeGradient = (callDuration?: number | null, connectedDuration?: number | null): CSSProperties => {

    if (!connectedDuration) return {} as CSSProperties;
    if (!callDuration) return {} as CSSProperties;

    
    const callPercentage = `${(connectedDuration / callDuration)*100}%`


    return {
        background: `linear-gradient(to right, #FF7B00 ${callPercentage}, #57AEFB)`
    } as CSSProperties
}

function DashboardComponent() {
    const data = useAsyncValue();

    console.log(data, 'alfkjdslfj')

    const [dashboardData, setDashboardData] = useState<DashboardData>(data);

    if (data?.error) {
        const errorMessage = getErrorMessage(data);

        return (
            <main className="dashboard-container">
                <div className="dashboard-header">
                    <h2 className="dashboard-header-text">{errorMessage}</h2>
                    
                </div>
                <div className="call-stats-container">
                    <motion.div 
                        className="call-stats-item recent-call-container"
                        style={{overflow: 'clip'}}

                    >   
                        <div className="call-stats-label">Most Recent Call Time</div>
                        <div className="call-stats-value"></div>
            
                    </motion.div>
                    <div className="call-stats-item total-connected-container">
                        <div className="call-stats-label">Total Connected Time</div>
                        <div className="call-stats-value"></div>
                    </div>
                    <div className="call-stats-item last-five-average-container">
                        <div className="call-stats-label">Total Connected Calls</div>
                        <div className="call-stats-value"></div>
                    </div>
                    <div className="call-stats-item fastest-call-container">
                        <div className="call-stats-label">Fastest Call Time</div>
                        <div className="call-stats-value"></div>
                    </div>
                    <div className="call-stats-item longest-call-container">
                        <div className="call-stats-label">Longest Call Time</div>
                        <div className="call-stats-value"></div>
                    </div>
                    <div className="call-stats-item average-time-container">
                        <div className="call-stats-label">Average Handle Time</div>
                        <div className="call-stats-value"></div>

                    </div>
                </div>
                <div>
                </div>
            </main>
        )
}

    return (
         <main className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-header-text">Today's metrics</h2>
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
    )
}

function DashboardSkeleton() {

    return (
            <main className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-header-text"></h2>
                
            </div>
            <div className="call-stats-container">
                <div className="call-stats-item recent-call-container">
                    <div className="call-stats-label">Most Recent Call Time</div>
                    <div className="call-stats-value"></div>
        
                </div>
                <div className="call-stats-item total-connected-container">
                    <div className="call-stats-label">Total Connected Time</div>
                    <div className="call-stats-value"></div>
                </div>
                <div className="call-stats-item last-five-average-container">
                    <div className="call-stats-label">Total Connected Calls</div>
                    <div className="call-stats-value"></div>
                </div>
                <div className="call-stats-item fastest-call-container">
                    <div className="call-stats-label">Fastest Call Time</div>
                    <div className="call-stats-value"></div>
                </div>
                <div className="call-stats-item longest-call-container">
                    <div className="call-stats-label">Longest Call Time</div>
                    <div className="call-stats-value"></div>
                </div>
                <div className="call-stats-item average-time-container">
                    <div className="call-stats-label">Average Handle Time</div>
                    <div className="call-stats-value"></div>
  
                </div>
            </div>
            <div>
            </div>
        </main>
        ) 
}


// <div 
//                             style={{
//                                 height: '248.867px',
//                                 width: '100%',
//                                 position: 'absolute',
//                                 background: 'linear-gradient(to right, hsla(0, 100%, 50%, .75), hsla(0, 0%, 100%, .75) 50%, hsla(0, 100%, 50%, .75) 100%)',
//                                 top: 0, 
//                                 zIndex:-1
//                             }}
//                         />