import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/https";

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

const db = getFirestore('AHT-Trakcer-0');

const webexQuery = async (from: number, to: number, query: any) => {
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

    return queryData.data;

};

export const getCallDashboard = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200
    },
    async (req, res) => {

        const userId = req.query.text as string | undefined | null;
        if (userId == null || userId == undefined) {
            res.status(400);
            res.json({result: 'No user id provided'});
            return;
        }

        // Get Current "time"
        const currInstantMS = Date.now();
        const currInstant = new Date(currInstantMS);
        const currInstantIso = currInstant.toUTCString();
        
        const currDateSlice = currInstantIso.slice(0, -15);
        const currDate = new Date(currDateSlice);
        const currDateMS = currDate.getTime() -  (6 * 60 * 60 * 1000);

        const from = currDateMS;
        const to = currDateMS;
        
        // const query = taskLegQuery;

        let taskLegResponse;
        
        try {
            taskLegResponse = await webexQuery(from, to, taskLegQuery);
            
        } catch (error) {
            res.status(500);
            res.json({result: error.message});
        }
        

        let agentSessionResponse;

        try {
            agentSessionResponse = await webexQuery(from, to, agentSessionQuery);

        } catch (error) {
            res.status(500);
            res.json({result: error.message});
        }

        // compare number of calls from response to number of calls from database

        const taskLegs = taskLegResponse.taskLegDetails.taskLegs;
        if (!taskLegs) {
            res.status(400);
            res.json({result: 'No task legs'});
            return;
        }


        const currCalls = await db.collection('users')
            .doc(userId)
            .collection('calls')
            .where('createdTime', '>', from)
            .orderBy('createdTime', 'desc')
            .get();

        
        if (currCalls.size == taskLegs.size()) {
            res.status(206);
            res.json({result: 'No task legs'});
            return;
        }
        
        




        const previousCall = await db.collection('users').doc(userId).collection('calls')



        const previousSession = await db.collection('users').doc(userId).collection('calls')


         



        


       






        
        res.json({
            averageHandleTime: {
                duration: '',
                connectedDuratoin: '',
                wrapupDuration: ''
            },
            totalCount: '',
            connectedCount: '',
            connectedDuration: '',
            fastestCall: '',
            slowestCall: '',
            recentCall: {
                duration: '',
                connectedDuration: '',
                wrapupDuration: '',
            },
        })
    


    
})