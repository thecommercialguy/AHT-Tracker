import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {onRequest} from "firebase-functions/https";
import type {DashboardData} from "../types/callTypes";
import {
    getAgentSessionsByPhoneNumber, 
    getTaskLegsByPhoneNumber, 
} from "../queryFunctions/queryFunctions";
import { getAuth } from "firebase-admin/auth";



export const getUserDashboard = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        const header = req.headers.authorization ?? "";
            if (!header.startsWith("Bearer ")) {
                res.status(401).json({ error: "Missing token" });
                return;
        }

        let uid: string;
        try {
            const decoded = await getAuth().verifyIdToken(header.slice(7));
            uid = decoded.uid;
        } catch {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        
        const db = getFirestore();
        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const phoneNumber = userSnap.get("agentPhoneNumber");
        if (!phoneNumber) {
            res.status(400).json({ error: "Invalid user" });
            return;
        }






        //
        // const userId = req.query.text as string | undefined | null;
        // if (userId == null || userId == undefined) {
        //     res.status(400);
        //     res.json({result: 'No user id provided'});
        //     return;

        // }
        //
        // const userId = 'AMCBCD3DdpQOfYpUAWc5';

        // const to = Date.now();
        // const from = to - 24 * 60 * 60 * 1000;
        //
        // Get Current "time"
        const currInstantMS = Date.now();
        const currInstant = new Date(currInstantMS);
        const currInstantHours = currInstant.getUTCHours();
        const currInstantIso = currInstant.toUTCString();
        console.log([currInstantMS, currInstant, currInstantHours, currInstantIso]);
        
        
        const currDateSlice = currInstantIso.slice(0, -12);
        const currDate = new Date(currDateSlice);
        let currDateMS = currDate.getTime();
        if (currInstantHours < 5) {
            currDateMS -= (19 * 60 * 60 * 1000);
        } else {
            currDateMS += (5 * 60 * 60 * 1000)
        }
        console.log([currDateSlice, currDate, currDateMS])

        const from = currDateMS;
        const to = currInstantMS;
        //

        // const to = Date.now();
        // const from = to - 24 * 60 * 60 * 1000;
        
        // const query = taskLegQuery;

        let taskLegResponse;
        
        try {
            taskLegResponse = await getTaskLegsByPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});

        } catch (error) {
            let errorMessage = 'An unexpected error has occured';
            if (error instanceof Error) {
               errorMessage = error.message
            }
            res.status(500);
            res.json({result: errorMessage});
            return
        }
        

        let agentSessionResponse;

        try {
            agentSessionResponse = await getAgentSessionsByPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});

        } catch (error) {
            let errorMessage = 'An unexpected error has occured';
            if (error instanceof Error) {
               errorMessage = error.message
            }
            res.status(500);
            res.json({result: errorMessage});
            return
        }



        

        // There is an agent session now
        const sessionRef = db.collection('users').doc(uid).collection('sessions');

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
        if (taskLegResponse == null || taskLegResponse == undefined) {
            res.status(400);
            res.json({result: 'No task legs'});
            return;
        }

        const callsRef = db.collection('users').doc(uid).collection('calls')

        const currCalls = await callsRef.where('createdTime', '>', from).orderBy('createdTime', 'desc').get();

        if (currCalls.size == taskLegResponse.length) {
            // Call collection is up to date
            const data = formatDashboardData(agentSessionResponse, taskLegResponse)
            res.status(200).json(data);
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



        
        const dashboardData: DashboardData = formatDashboardData(agentSessionResponse, taskLegResponse);


        res.status(200)
        res.json(dashboardData)
     
});


const formatDashboardData = (agentSessionResponse: any, taskLegResponse: any) => {

        
        
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