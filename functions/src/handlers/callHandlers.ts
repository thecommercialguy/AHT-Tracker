import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {onRequest} from "firebase-functions/https";
import type {DashboardData} from "../types/callTypes";
import {
    agentSessionWebexQuery, 
    taskLegsWebexQuery
} from "../queryFunctions/queryFunctions";



export const getUserDashboard = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        const db = getFirestore("AHT-Trakcer-0");
        //
        // const userId = req.query.text as string | undefined | null;
        // if (userId == null || userId == undefined) {
        //     res.status(400);
        //     res.json({result: 'No user id provided'});
        //     return;
        // }
        //

        // const to = Date.now();
        // const from = to - 24 * 60 * 60 * 1000;
        //
        // Get Current "time"
        const currInstantMS = Date.now();
        const currInstant = new Date(currInstantMS);
        const currInstantIso = currInstant.toUTCString();
        
        const currDateSlice = currInstantIso.slice(0, -15);
        const currDate = new Date(currDateSlice);
        const currDateMS = currDate.getTime() -  (6 * 60 * 60 * 1000);

        const from = currDateMS;
        const to = currInstantMS;
        //
        
        // const query = taskLegQuery;

        let taskLegResponse;
        
        try {
            taskLegResponse = await taskLegsWebexQuery(from, to);
            
        } catch (error) {
            let errorMessage = 'An unexpected error has occured';
            if (error instanceof Error) {
               errorMessage = error.message
            }
            res.status(500);
            res.json({result: errorMessage});
        }
        

        let agentSessionResponse;

        try {
            agentSessionResponse = await agentSessionWebexQuery(from, to);

        } catch (error) {
            let errorMessage = 'An unexpected error has occured';
            if (error instanceof Error) {
               errorMessage = error.message
            }
            res.status(500);
            res.json({result: errorMessage});
        }

        

        // There is an agent session now
        const sessionRef = db.collection('users').doc(userId).collection('sessions');

        // QueryDocumentSnapshot array
        const currSessions = await sessionRef.where('startTime', '>', from).orderBy('startTime', 'desc').get();
        if (currSessions.empty) {
            // create session
            await sessionRef.doc().create({
                ...agentSessionResponse,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
        } else {
            // update session
            // DocumentReference — has .update(), .set(), .delete(), .get(
            await currSessions.docs[0].ref.update({
                ...agentSessionResponse,
                updatedAt: FieldValue.serverTimestamp()
            });

        }



        // compare number of calls from response to number of calls from database
        if (!taskLegResponse) {
            res.status(400);
            res.json({result: 'No task legs'});
            return;
        }

        const callsRef = db.collection('users').doc(userId).collection('calls')

        const currCalls = await callsRef.where('createdTime', '>', from).orderBy('createdTime', 'desc').get();

        if (currCalls.size == taskLegResponse.length) {
            // Call collection is up to date
            res.status(206);
            res.json({result: 'Up to date'});
            return;
        }

        // New calls can be added
        const taskLegBatch = db.batch();
        taskLegResponse.slice(0, taskLegResponse.length - currCalls.size).forEach((item: any) => {
            const taskLeg =  {
                callId: item.id,
                createdTime: item.createdTime,
                connectedDuration: item.connectedDuration,
                wrapupDuration: item.wrapupDuration,
                isOutdial: item.isOutdial,
            };

            const docRef = callsRef.doc();
            taskLegBatch.set(docRef, { ...taskLeg, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()});

        });
        await taskLegBatch.commit();


        const recentCall = taskLegResponse[0]

        if (agentSessionResponse === undefined) {
            return;
        }
        // if (agentSessionResponse.connectedDuration === undefined || agentSessionResponse.wrapupDuration == undefined) return 

        const connectedDuration = agentSessionResponse.connectedDuration || 0
        const wrapupDuration = agentSessionResponse.wrapupDuration || 0
        const connectedCount = agentSessionResponse.connectedCount || -1


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


        
        const dashboardData: DashboardData = {
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
        }


        res.status(200)
        res.json(dashboardData)
     
});
