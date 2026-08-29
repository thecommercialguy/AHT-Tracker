import type {ChannelInfoResponse} from '../types/callTypes';

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
`;

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
`;

const agentSessionQueryPhoneNumber = `
query AgentSession($from: Long!, $to: Long!, $phoneNumber: String!) {
agentSession(from: $from, to: $to 
filter: {
and : [
{
channelInfo: {
connectedDuration: {notequals: 0}
connectedCount: {notequals: 0}
channelType: {equals: "telephony"}
agentPhoneNumber: {equals: $phoneNumber}
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
`;

const agentSessionQueryWebexId = `
query AgentSession($from: Long!, $to: Long!, $agentId: String!) {
agentSession(from: $from, to: $to 
filter: {
and : [
{
channelInfo: {
connectedDuration: {notequals: 0}
connectedCount: {notequals: 0}
channelType: {equals: "telephony"}
}
}
{agentId: {equals: $agentId}}
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
`;

const API_KEY_WEBEX = process.env.API_KEY_WEBEX;

export const taskLegsWebexQuery = async (from: number, to: number) => {
    const query = taskLegQuery;
    const response = await fetch('https://api.wxcc-us1.cisco.com/search?orgId=91d4badc-fd60-4ff9-81c0-b7245b3bdec4', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY_WEBEX}` 
        },
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
    if (taskLegData === undefined || taskLegData === null || taskLegData.length < 1) throw Error('No tasklegs');
    
    const taskLegsSorted = taskLegData.sort((a: any, b: any) => b.createdTime - a.createdTime);
    if (taskLegsSorted === undefined || taskLegsSorted === null || taskLegsSorted.length < 1) throw Error('No tasklegs');
    
    return taskLegsSorted;
};

export const agentSessionWebexQuery = async (from: number, to: number) => {
    const query = agentSessionQuery;
    const response = await fetch('https://api.wxcc-us1.cisco.com/search?orgId=91d4badc-fd60-4ff9-81c0-b7245b3bdec4', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY_WEBEX}` 
        },
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

    const agentSessions = queryData.data.agentSession.agentSessions

    if (agentSessions === null || agentSessions == undefined || agentSessions.lenght < 1) {
        throw Error("No agent sessions")
    }

    const channelInfos = agentSessions.flatMap((session: any) => {
        if (!session.channelInfo) return [];
        return session.channelInfo; 
    })

    console.log(channelInfos)
    
    const reduced = channelInfos.reduce((a: any, b: any) => {
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
    
    const startTime = queryData.data.agentSession.agentSessions.reduce((a: any, b: any) => a.startTime < b.startTime ? a : b)
    if (startTime == null || startTime == undefined) {  // May remove this as it kinda doesnt need that after the null check
        throw new Error('No agent sessions')
    }

    const channelInfo = {...reduced, startTime: startTime} as ChannelInfoResponse;

    return channelInfo;
};


interface GetAgentSessionsByPhoneNumberParams {
    from: number;
    to: number;
    phoneNumber: string
}

export const getAgentSessionsByPhoneNumber = async ({from, to, phoneNumber}: GetAgentSessionsByPhoneNumberParams) => {
    const query = agentSessionQueryPhoneNumber;
    const response = await fetch('https://api.wxcc-us1.cisco.com/search?orgId=91d4badc-fd60-4ff9-81c0-b7245b3bdec4', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY_WEBEX}` 
        },
        body: JSON.stringify({ 
            query,
            variables: { from, to, phoneNumber }
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        throw Error(response.statusText);
        // return {data: 'error', status: response.status};
    }

    const queryData = await response.json();

    const agentSessions = queryData.data.agentSession.agentSessions

    if (agentSessions === null || agentSessions == undefined || agentSessions.lenght < 1) {
        throw Error("No agent sessions")
    }

    const channelInfos = agentSessions.flatMap((session: any) => {
        if (!session.channelInfo) return [];
        return session.channelInfo; 
    })

    console.log(channelInfos)
    
    const reduced = channelInfos.reduce((a: any, b: any) => {
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
    
    const startTime = queryData.data.agentSession.agentSessions.reduce((a: any, b: any) => a.startTime < b.startTime ? a : b)
    if (startTime == null || startTime == undefined) {  // May remove this as it kinda doesnt need that after the null check
        throw new Error('No agent sessions')
    }

    const channelInfo = {...reduced, startTime: startTime} as ChannelInfoResponse;

    return channelInfo;
};

interface GetAgentSessionsByWebexIdParams {
    from: number;
    to: number;
    webexId: string
}
export const getAgentSessionsByWebexId = async ({from, to, webexId}: GetAgentSessionsByWebexIdParams) => {
    const query = agentSessionQueryWebexId;
    const response = await fetch('https://api.wxcc-us1.cisco.com/search?orgId=91d4badc-fd60-4ff9-81c0-b7245b3bdec4', {
    // const response = await fetch('/api/webex/v1/search', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY_WEBEX}` 
        },
        body: JSON.stringify({ 
            query,
            variables: {
                from: from, 
                to: to, 
                agentId: webexId 
            }
        })
    });

    if (!response.ok) {
        console.error('Failed to fetch call logs:', response.statusText);
        throw Error(response.statusText);
    }

    const queryData = await response.json();

    const agentSessions = queryData.data.agentSession.agentSessions

    if (agentSessions === null || agentSessions == undefined || agentSessions.lenght < 1) {
        throw Error("No agent sessions")
    }

    const channelInfos = agentSessions.flatMap((session: any) => {
        if (!session.channelInfo) return [];
        return session.channelInfo; 
    })

    console.log(channelInfos)
    
    const reduced = channelInfos.reduce((a: any, b: any) => {
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
    
    const startTime = queryData.data.agentSession.agentSessions.reduce((a: any, b: any) => a.startTime < b.startTime ? a : b)
    if (startTime == null || startTime == undefined) {  // May remove this as it kinda doesnt need that after the null check
        throw new Error('No agent sessions')
    }

    const channelInfo = {...reduced, startTime: startTime} as ChannelInfoResponse;

    return channelInfo;
};
