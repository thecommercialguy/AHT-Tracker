import { useLoaderData } from "react-router";
import type { ChannelInfo, ChannelInfoResponse } from '../types/callTypes';
import { Temporal } from "@js-temporal/polyfill";
import { useState } from "react";
import { msToTime } from '../helpers/timeHelpers'


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
const query = `
query AgentSession($from: Long!, $to: Long!) {
  agentSession(from: $from, to: $to 
    filter: {
        and : [
            {
                channelInfo: {
                    connectedDuration: {notequals: 0}
                    connectedCount: {notequals: 0}
                    channelType: {equals: "telephony"}
                    agentPhoneNumber: {equals: "+14058472700"}
                    #currentState: {equals: available}
                }
            }
            {agentId: {equals: "b4c5ed82-ccd0-4a09-9dd9-94535c021b47"}}
        ]
    }) {
    agentSessions {
      agentSessionId
      agentId
      agentName
      userLoginId
      siteId
      siteName
      channelInfo {
        channelId
        channelType
        connectedDuration
        postCallDuration
        connectedCount
        wrapupDuration
        notRespondedCount
        reservationCount
        totalDuration
        currentState
        agentPhoneNumber
        wordRatioCount
        ronaCount
        overallEvalScore
        outdialCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`



// a11e3db7-67ce-4bea-9f36-09d4686c6470

export async function loader() {
    const to = Date.now();
    const from = to - 24 * 60 * 60 * 1000;
    // const endTime = Date.now();
    // const startTime = endTime - 24 * 60 * 60 * 1000;




    const response = await fetch('/api/webex', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query,
            variables: { from, to}
            // variables: { startTime, endTime}
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        return {data: 'error'};
    }

    const queryData = await response.json();

    // queryData.agentSession.agentSessions[0].channelInfo[0]

    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0]);
    console.log('Call Logs:', queryData.data.agentSession.agentSessions[0].channelInfo[0]);
    
    const channelInfo = queryData.data.agentSession.agentSessions[0].channelInfo[0] as ChannelInfoResponse;
    // return queryData
    console.log('Call Logs:', channelInfo);
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