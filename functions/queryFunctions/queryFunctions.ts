import type { ChannelInfoResponse } from '../../types/callTypes';

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



export const taskLegsWebexQuery = async (from: number, to: number) => {
    const query = taskLegQuery;
    const response = await fetch('/api/webex', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query,
            variables: { from, to }
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        throw Error(response.statusText);
        // return {data: 'error', status: response.status};
    }

    const queryData = await response.json();

    const taskLegData = queryData.data.taskLegDetails.taskLegs;
    const taskLegsSorted = taskLegData.sort((a, b) => b.createdTime - a.createdTime);

    return taskLegsSorted;

};

export const agentSessionWebexQuery = async (from: number, to: number) => {
    const query = agentSessionQuery;
    const response = await fetch('/api/webex', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query,
            variables: { from, to }
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        throw Error(response.statusText);
        // return {data: 'error', status: response.status};
    }

    const queryData = await response.json();

    const channelInfo = queryData.data.agentSession.agentSessions[0].channelInfo[0] as ChannelInfoResponse;

    return channelInfo;

};