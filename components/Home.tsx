import { useLoaderData } from "react-router";
import type { ChannelInfo, ChannelInfoResponse, DashboardData } from '../types/callTypes';
import { Temporal } from "@js-temporal/polyfill";
import { useState } from "react";
import { msToTime } from '../helpers/timeHelpers'
import { getAgentSession, getTaskLegs } from '../loaders/dashboardLoaders'


// totalDuration -- Total time logged in
// connectedDuration -- Total time connected / engaged in a call 
// channelType -- Medium of communication
// connectedCount -- Amount of "connections"
// wrapupDuration -- Amount of time spent in wrap up

// const query = `
// {
//   taskLegDetails(
//     from: 1696118400000, 
//     to: 1698796800000,
//     filter: {
//       status: { equals: "ended" } 
//     }
//     pagination: {
//       cursor: "NA" 
//     }
//   ) {
//     taskLegs {
//       id
//       queueCount
//       ringingDuration
//       queue {
//         id 
//         name
//       }
//       entryPoint {
//         id 
//         name
//       }
//       team {
//         id 
//         name
//       }
//     }
//     pageInfo {
//       hasNextPage
//       endCursor
//     }
//   }
// }
// `;
// const query = `
//     query TaskLegDetails($startTime: Long!, $endTime: Long!) {
//         taskLegDetails(
//             from: $startTime
//             to: $endTime
//             filter: { 
//                     agentId: {
//                         equals: "a11e3db7-67ce-4bea-9f36-09d4686c6470"
//                     }
//             }
//             pagination: { cursor: "0" }
//         ) {
//             taskLegs {
//                 id
//                 queueCount
//                 ringingDuration
//                 queue { id name }
//                 entryPoint { id name }
//                 team { id name }
//             }
//             pageInfo {
//             hasNextPage
//             endCursor
//             }
//         }
//     }
// `;
// const query = `
//     query TaskLegDetails($startTime: Long!, $endTime: Long!) {
//         taskLegDetails(
//             from: $startTime
//             to: $endTime
//             filter: { 
//                 and: [
//                     status: { 
//                         equals: "ended" 
//                     } 
//                     name: {
//                         equals: "a11e3db7-67ce-4bea-9f36-09d4686c6470"
//                     }
//                 ]
//             }
//             pagination: { cursor: "0" }
//         ) {
//             taskLegs {
//                 id
//                 queueCount
//                 ringingDuration
//                 queue { id name }
//                 entryPoint { id name }
//                 team { id name }
//             }
//             pageInfo {
//             hasNextPage
//             endCursor
//             }
//         }
//     }
// `;
// const query = `
//   query MySessions($startTime: Long!, $endTime: Long!, $agentId: String!) {
//     agentSession(
//       from: $startTime
//       to: $endTime
//       filter: {
//         agentId: { equals: "a11e3db7-67ce-4bea-9f36-09d4686c6470"f }
//       }
//     ) {
//       agentSessions {
//         agentId
//         agentName
//         agentSessionId
//         teamName
//       }
//       pageInfo { hasNextPage endCursor }
//     }
//   }
// `;




// a11e3db7-67ce-4bea-9f36-09d4686c6470


export async function loader() {
    const channelInfo = await getAgentSession();
    const taskLegs = await getTaskLegs();


    const recentCall = taskLegs[0]

    const ahtDuration = (channelInfo.connectedDuration + channelInfo.wrapupDuration) / channelInfo.connectedCount;
    const ahtConnected = channelInfo.connectedDuration
    const ahtWrapup = channelInfo.wrapupDuration
    
    const fastestCall = taskLegs.reduce((min, current) => (current.connectedCount + current.wrapupDuration) < (min.connectedCount + min.wrapupDuration) ? current : min)
    const slowerstCall = taskLegs.reduce((max, current) => (current.connectedCount + current.wrapupDuration) > (max.connectedCount + max.wrapupDuration) ? current : max)





    const data: DashboardData = {
        averageHandleTime: {
            duration: ahtDuration,
            connectedDuration: ahtConnected,
            wrapupDuration: ahtWrapup
        },
        totalCount: taskLegs.length,
        connectedCount: channelInfo.connectedCount,
        connectedDuration: channelInfo.connectedDuration,
        fastestCall: fastestCall.connectedDuration + fastestCall.wrapupDuration,
        slowestCall: slowerstCall.connectedDuration + slowerstCall.wrapupDuration,
        recentCall: {
            duration: recentCall.connectedDuration + recentCall.wrapupDuration,
            connectedDuration: recentCall.connectedDuration,
            wrapupDuration: recentCall.wrapupDuration,
        },
    }

    console.log(data)

    return channelInfo;
    
}

export default function Home() { 
    const data: ChannelInfoResponse = useLoaderData();  // Difference between destructuring and just using the response
    Temporal.PlainTime.from({ millisecond: data.connectedCount}).minute
    const [channelInfo, setChannelInfo] = useState<ChannelInfo>({
        agentPhoneNumber: data.agentPhoneNumber,
        channelId: data.channelId,
        channelType: data.channelType,
        connectedCount: data.connectedCount.toString(),
        connectedDuration: msToTime(data.connectedDuration),
        currentState: data.currentState,
        notRespondedCount: data.notRespondedCount.toString(),
        outdialCount: data.outdialCount.toString(),
        overallEvalScore: data.overallEvalScore ? data.overallEvalScore.toString() : null,
        postCallDuration: data.postCallDuration.toString(),
        reservationCount: data.reservationCount.toString(),
        ronaCount: data.ronaCount.toString(),
        totalDuration: data.totalDuration.toString(),
        wordRatioCount: data.wordRatioCount.toString(),
        wrapupDuration: data.wrapupDuration.toString()
    })

    
    console.log(data)
    console.log(channelInfo)
    // console.log(queryData.data)

    return (
        <main className="dashboard-container">
            <div className="dashboard-header">
                <h2 className="dashboard-header-text">Welcome back, William Walter</h2>
                <div className="call-count-container">
                    <span className="call-count-header">Total Calls</span>
                    <span className="call-count">{channelInfo.connectedCount}</span>
                </div>
            </div>
            <div className="call-stats-container">
                <div className="call-stats-item recent-call-container">
                    <div className="call-stats-label">Most Recent Call Time</div>
                    <div className="call-stats-value">{'1:00:00'}</div>
                </div>
                <div className="call-stats-item total-connected-container">
                    <div className="call-stats-label">Total Connected Time</div>
                    <div className="call-stats-value">{channelInfo.connectedDuration}</div>
                </div>
                <div className="call-stats-item last-five-average-container">
                    <div className="call-stats-label">Last Five Call Average</div>
                    <div className="call-stats-value">{'1:00:00'}</div>
                </div>
                <div className="call-stats-item fastest-call-container">
                    <div className="call-stats-label">Fastest Call Time</div>
                    <div className="call-stats-value">{'1:00:00'}</div>
                </div>
                <div className="call-stats-item longest-call-container">
                    <div className="call-stats-label">Longest Call Time</div>
                    <div className="call-stats-value">{'1:00:00'}</div>
                </div>
                <div className="call-stats-item average-time-container">
                    <div className="call-stats-label">Average Handle Time</div>
                    <div className="call-stats-value">{'1:00:00'}</div>
                </div>
            </div>
            <div>

            </div>
        </main>
    ); 
}