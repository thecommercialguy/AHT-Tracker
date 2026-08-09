import type { ChannelInfo, ChannelInfoResponse } from '../types/callTypes';


const taskLegQuery = `
query TaskLegs($from: Long!, $to: Long!) {
    # Query to fetch CLR attributes for a specific queue.
    taskLegDetails(
        from: $from
        to: $to
        # Use Filter arguments to apply filter
        filter: { 
            owner: { phoneNumber: { equals: "+14058472700" } }
        }
    ) {
        taskLegs {
            id
            createdTime
            channelType
            connectedDuration
            wrapupDuration
            isOutdial
            outdialConsultDuration
            queue {
                id
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

export const getAgentSession = async () => {
    const to = Date.now();
    const from = to - 48 * 60 * 60 * 1000;
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
        return {data: 'error'};
    }

    const queryData = await response.json();
    console.log(JSON.stringify(queryData, null, 2));

    // queryData.agentSession.agentSessions[0].channelInfo[0]

    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0]);
    console.log('Call Logs:', queryData.data.agentSession.agentSessions[0].channelInfo[0]);
    
    const channelInfo = queryData.data.agentSession.agentSessions[0].channelInfo[0] as ChannelInfoResponse;
    // return queryData
    console.log('Call Logs:', channelInfo);
    return channelInfo;
}

export const getTaskLegs = async () => {
    const to = Date.now();
    const from = to - 48 * 60 * 60 * 1000;
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
    

    console.log(queryData)

    // queryData.agentSession.agentSessions[0].channelInfo[0]

    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0]);
    // console.log('Call Logs:', queryData.data.agentSession.agentSessions[0].channelInfo[0]);
    
    // const channelInfo = queryData.data.agentSession.agentSessions[0].channelInfo[0] as ChannelInfoResponse;
    // return queryData
    // console.log('Call Logs:', channelInfo);
    // return channelInfo;
}