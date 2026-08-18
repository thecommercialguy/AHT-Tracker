import type { ChannelInfoResponse } from '../types/callTypes';


const taskLegQuery = `
query TaskLegs($from: Long!, $to: Long!) {
    # Query to fetch CLR attributes for a specific queue.
    taskLegDetails(
        from: $from
        to: $to
        # Use Filter arguments to apply filter
        filter: {
            and : [
                {isActive: {equals: false}}
                {owner: { phoneNumber: { equals: "+14058472700" }}}
            ]

        }
    ) {
        taskLegs {
            id
            createdTime
            channelType
            connectedDuration
            wrapupDuration
            isOutdial
            queue {
                id
                name
            }
            owner {
                id
                phoneNumber
                channelId
                sessionId
                signInId
                name
            }
            entryPoint {
                id
                name
            }
            endedTime
        }
    }
}
`
const agentSessionQuery = `
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
      startTime
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

export const getUserDashboard = async () => {
    try {
        const response = await fetch('https://getuserdashboard-tnype6eiha-uc.a.run.app');

        if (!response.ok) {
            throw Error(response.statusText);
        }

        const data = await response.json();
        if (!data) {
            throw Error('Failed to get dashboard')
        }

        return data

    } catch (error) {
        let message;
        if (error instanceof Error) {message = error.message;}
        else {message = 'Failed to get dashboard'};

        console.error(message);
        throw Error(message);
        
    }

}

export const getAgentSession = async () => {
    //
    // const currInstantMS = Date.now();
    // const currInstant = new Date(currInstantMS);
    // const currInstantIso = currInstant.toISOString();

    // console.log([currInstantMS, currInstant, currInstantIso])
    

    // // const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }); // "2026-08-10"
    // const currDateSlice = currInstantIso.slice(0, 10);
    // const currDate = new Date(`${currDateSlice}`);

    // const currDateMS = currDate.getTime() - (6 * 60 * 60 * 1000);
    // const currDate2 = new Date(currDateMS);

    // console.log([currDateSlice, currDate, currDateMS, currDate2])

    // const to = currInstantMS;
    // const from = currDateMS;
    //
    const to = Date.now();
    const from = to - 24 * 60 * 60 * 1000;
    // const endTime = Date.now();
    // const startTime = endTime - 24 * 60 * 60 * 1000;
    const query = agentSessionQuery;



    const response = await fetch('/api/webex', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query,
            variables: { from, to }
            // variables: { startTime, endTime}
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        // return {data: 'error'};
    }

    const queryData = await response.json();

    const agentSessions = queryData.data.agentSession.agentSessions
    console.log(agentSessions) 

    const channelInfos = agentSessions.flatMap((session) => {
        
        if (!session.channelInfo) return [];
        return session.channelInfo;
        

    })

    console.log(channelInfos)
    
    const reduced = channelInfos.reduce((a, b) => {
        return {
            agentPhoneNumber: a.agentPhoneNumber,
            channelId: a.channelId,
            channelType: "telephony",
            connectedCount: a.connectedCount + b.connectedCount,
            connectedDuration: a.connectedDuration + b.connectedDuration,
            currentState: a.currentState,
            notRespondedCount: a.notRespondedCount + b.notRespondedCount,
            outdialCount: a.outdialCount + b.outdialCount,
            overallEvalScore: null,
            postCallDuration: a.postCallDuration + b.postCallDuration,
            reservationCount: a.reservationCount + b.reservationCount,
            ronaCount: a.ronaCount + b.ronaCount,
            totalDuration: a.totalDuration + b.totalDuration,
            wordRatioCount: 0,
            wrapupDuration: a.wrapupDuration + b.wrapupDuration
        }
        
    })
    
    const startTime = agentSessions.reduce((a, b) => a.startTime < b.startTime ? a : b)

    console.log(reduced) 

    
    const channelInfo = {...queryData.data.agentSession.agentSessions[0].channelInfo[0], startTime: startTime} as ChannelInfoResponse;
    // return queryData
    console.log('Call Logs:', channelInfo);
    return reduced;
}

export const getTaskLegs = async () => {
    const to = Date.now();
    const from = to - 24 * 60 * 60 * 1000;
    // const from = to - 48 * 60 * 60 * 1000;
    // const endTime = Date.now();
    // const startTime = endTime - 24 * 60 * 60 * 1000;

    const query = taskLegQuery;


    const response = await fetch('/api/webex', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query,
            variables: { from, to }
            // variables: { startTime, endTime}
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        return {data: 'error'};
    }

    const queryData = await response.json();
    console.log(JSON.stringify(queryData, null, 2));
    

   const taskLegData = queryData.data.taskLegDetails.taskLegs;

   const taskLegsSorted = taskLegData.sort((a, b) => b.createdTime - a.createdTime);

   console.log(taskLegsSorted);


   return taskLegsSorted
    // queryData.agentSession.agentSessions[0].channelInfo[0]

    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0]);
    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0].channelInfo[0]);
    
    // const channelInfo = queryData.data.agentSession.agentSessions[0].channelInfo[0] as ChannelInfoResponse;
    // return queryData
    // console.log('Call Logs:', channelInfo);
    // return channelInfo;
}


export const getDashboardData = async () => {


        const taskLegResponse = await getTaskLegs();
        const agentSessionResponse = await getAgentSession();

        
        
        const recentCall = taskLegResponse[0];

        const connectedDuration = agentSessionResponse.connectedDuration || 0;
        const wrapupDuration = agentSessionResponse.wrapupDuration || 0;
        const connectedCount = agentSessionResponse.connectedCount || -1;


        const ahtDuration = Math.floor((connectedDuration + wrapupDuration) / connectedCount);
        // const ahtConnected = agentSessionResponse.connectedDuration || 
        // const ahtWrapup = agentSessionResponse.wrapupDuration
        
        const fastestCall = taskLegResponse.reduce((min: any, current: any) => {
            let a = current.connectedDuration + current.wrapupDuration;
            let b = min.connectedDuration + min.wrapupDuration;
            if (a == 0) a = Infinity;
            if (b == 0) b = Infinity;

            return a < b ? current : min
        })
        const longestCall = taskLegResponse.reduce((max: any, current: any) => {
            let a = current.connectedDuration + current.wrapupDuration;
            let b = max.connectedDuration + max.wrapupDuration;
            if (a == 0 || current.isOutdial == true) a = -1;
            if (b == 0 || max.isOutdial == true) b = -1;
            return a > b ? current : max;
        })


        
        return {
            averageHandleTime: {
                duration: ahtDuration,
                connectedDuration: connectedDuration,
                wrapupDuration: wrapupDuration
            },
            totalCount: taskLegResponse.length,
            connectedCount: connectedCount,
            connectedDuration: connectedDuration,
            fastestCall: fastestCall.connectedDuration + fastestCall.wrapupDuration,
            longestCall: longestCall.connectedDuration + longestCall.wrapupDuration,
            recentCall: {
                duration: recentCall.connectedDuration + recentCall.wrapupDuration,
                connectedDuration: recentCall.connectedDuration,
                wrapupDuration: recentCall.wrapupDuration,
            }
        } as DashboardData;

    
}