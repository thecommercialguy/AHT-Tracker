import {getFirestore, FieldValue, AggregateField} from "firebase-admin/firestore";
import {onRequest} from "firebase-functions/https";
import type {CallStats, DashboardData} from "../types/callTypes";
import {
    getAgentSessionsByPhoneNumber, 
    getTaskLegsByPhoneNumber, 
} from "../queryFunctions/queryFunctions";
import { getAuth } from "firebase-admin/auth";
import { BadRequestError, errorResponse, NotFoundError, UnauthorizedError } from "../errors/errors";



export const getUserDashboard = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        try {
            const header = req.headers.authorization ?? "";
            if (!header.startsWith("Bearer ")) {
                throw new UnauthorizedError("Missing token");
            }
    
            let uid: string;
            try {
                const decoded = await getAuth().verifyIdToken(header.slice(7));
                uid = decoded.uid;
            } catch {
                throw new UnauthorizedError("Invalid token");
            }
            
            const db = getFirestore();
            const userRef = db.collection('users').doc(uid);
            const userSnap = await userRef.get();
            if (!userSnap.exists) {
                throw new NotFoundError('User not found');
  
            }

            const firstName = userSnap.get('firstName');
            const lastName = userSnap.get('lastName');

            const phoneNumber = userSnap.get("agentPhoneNumber");
            if (!phoneNumber) {
                throw new BadRequestError('No agent phone number')
            }

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

    
            let taskLegResponse;
            
            try {
                taskLegResponse = await getTaskLegsByPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});
    
            } catch (error) {
                errorResponse(error, res);
                return;
            }
            
    
            let agentSessionResponse;
    
            try {
                agentSessionResponse = await getAgentSessionsByPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});
    
            } catch (error) {
                errorResponse(error, res);
                return;
            }
            
    
            // There is an agent session now
            const sessionRef = db.collection('users').doc(uid).collection('sessions');
    
            // QueryDocumentSnapshot array
            const currSessions = await sessionRef.where('startTime', '>', from).orderBy('startTime', 'desc').get();
            console.log('Curr sesh', currSessions)
            if (currSessions.empty) {
                // create session
                console.log('New one created', agentSessionResponse)
                await sessionRef.doc().create({
                    ...agentSessionResponse,
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp()
                });
            } else {
                // update session
                console.log('updated', agentSessionResponse)
                await currSessions.docs[0].ref.update({
                    ...agentSessionResponse,
                    updatedAt: FieldValue.serverTimestamp()
                });
    
            }
    
            // compare number of calls from response to number of calls from database
            if (taskLegResponse == null || taskLegResponse == undefined) {
                throw new Error();
            }
    
            const callsRef = db.collection('users').doc(uid).collection('calls')
    
            const currCalls = await callsRef.where('createdTime', '>', from).orderBy('createdTime', 'desc').get();
    
            if (currCalls.size == taskLegResponse.length) {
                // Call collection is up to date
                const data = formatDashboardData(agentSessionResponse, taskLegResponse)
                res.status(200).json({
                    ...data,
                    firstName: firstName,
                    lastName: lastName
                });
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
    
    
            res.status(200).json({
                ...dashboardData,
                firstName: firstName,
                lastName: lastName
            });
         

        } catch (error) {
            errorResponse(error, res);
            return;
        }
});


export const getUserCallRecord = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        try {
            const header = req.headers.authorization ?? "";
            if (!header.startsWith("Bearer ")) {
                throw new UnauthorizedError("Missing token");
            }
    
            let uid: string;
            try {
                const decoded = await getAuth().verifyIdToken(header.slice(7));
                uid = decoded.uid;
            } catch {
                throw new UnauthorizedError("Invalid token");
            }
            
            const db = getFirestore();
            const userRef = db.collection('users').doc(uid);
            const userSnap = await userRef.get();
            if (!userSnap.exists) {
                console.log('HERE')
                throw new NotFoundError('User not found');
            }

            const sessionsRef = db.collection('users').doc(uid).collection('sessions');
            const aggregateQuery = sessionsRef.aggregate({
                totalConnectedTime: AggregateField.sum("connectedDuration")
            });
            const aggregateSnap = await aggregateQuery.get();
            const { totalConnectedTime } = aggregateSnap.data();

            if (totalConnectedTime < 1) {
                console.log("Ohhhh")
                throw new NotFoundError("User has no call data.");
            }

            console.log("A")

            const averageHandleTimeSnap = await sessionsRef.get();
            const averageHandleTimeDocs = averageHandleTimeSnap.docs; 

            console.log("B")

            const fastestSession = averageHandleTimeDocs.sort((a: any, b: any) => {
                const sessionA = a.data();
                const sessionB = b.data();
                const averageA = (sessionA.connectedDuration + sessionA.wrapupDuration) / sessionA.connectedCount;
                const averageB = (sessionB.connectedDuration + sessionB.wrapupDuration) / sessionB.connectedCount;

                return averageA < averageB ? a : b;
            })[0].data();
            
            console.log("C", fastestSession)


            const callsRef = db.collection('users').doc(uid).collection('calls');

            console.log("D")

            const totalCallsSnap = await callsRef.count().get();
            const totalCalls =  totalCallsSnap.data().count;

            console.log("E", totalCalls)
            
            const longestCallQuery = callsRef.where("isOutdial", "==", false).orderBy("connectedDuration", "desc").limit(1);
            console.log("F", longestCallQuery)

            const longestCallSnap = await longestCallQuery.get();
            console.log("G", longestCallSnap)
            const longestCall = longestCallSnap.docs[0]?.data() ?? null;
            console.log("F", longestCallSnap.docs)
            console.log("F", longestCall)
            if (!longestCall) {
                throw new NotFoundError("User has no call data.");
            }
            console.log("H", longestCall)
            
            console.log("I", longestCall)

            
            const fastestCallQuery = callsRef.where("isOutdial", "==", false).orderBy("connectedDuration", "asc").limit(1);
            const fastestCallSnap = await fastestCallQuery.get();
            const fastestCall = fastestCallSnap.docs[0]?.data() ?? null;
            if (!fastestCall) {
                throw new NotFoundError("User has no call data.");
            }
            
            





            const callStats = {
                totalCallCount: totalCalls, 
                totalConnectedDuration: totalConnectedTime,
                averageHandleTime: {
                    ahtDuration: Math.floor((fastestSession.connectedDuration + fastestSession.connectedDuration) / fastestSession.connectedCount),
                    duration: fastestSession.connectedDuration + fastestSession.connectedDuration,
                    connectedDuration: fastestSession.connectedDuration,
                    wrapupDuration: fastestSession.wrapupDuration,
                    connectedCount: fastestSession.connectedCount,
                    date: fastestSession?.createdAt
                },
                fastestCall: {
                    duration: fastestCall.connectedDuration + fastestCall.wrapupDuration,
                    connectedDuration: fastestCall.connectedDuration, 
                    wrapupDuration: fastestCall.wrapupDuration,
                    date: fastestCall.createdAt
                }, 
                longestCall: {
                    duration: longestCall.connectedDuration + longestCall.wrapupDuration,
                    connectedDuration: longestCall.connectedDuration, 
                    wrapupDuration: longestCall.wrapupDuration,
                    date: longestCall.createdAt
                }
        
            } as CallStats;

            
            res.status(200).json(callStats);




        } catch(error) {
            console.log(error)
            errorResponse(error, res);
            return;
        }
    }
)




const formatDashboardData = (agentSessionResponse: any, taskLegResponse: any) => {

        
        
        const recentCall = taskLegResponse[0];

        const connectedDuration = agentSessionResponse.connectedDuration || 0;
        const wrapupDuration = agentSessionResponse.wrapupDuration || 0;
        const connectedCount = agentSessionResponse.connectedCount || -1;


        const ahtDuration = Math.floor((connectedDuration + wrapupDuration) / connectedCount);
        
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