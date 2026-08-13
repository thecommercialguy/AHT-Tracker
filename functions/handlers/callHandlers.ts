import { getFirestore, FieldValue  } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/https";
import type { ChannelInfoResponse } from '../../types/callTypes';
import { agentSessionWebexQuery, taskLegsWebexQuery } from "../queryFunctions/queryFunctions";
import { collection, writeBatch, updateDoc } from "firebase/firestore";


const db = getFirestore('AHT-Trakcer-0');

export const getCallDashboard = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200
    },
    async (req, res) => {
        //
        const userId = req.query.text as string | undefined | null;
        if (userId == null || userId == undefined) {
            res.status(400);
            res.json({result: 'No user id provided'});
            return;
        }
        //

        const to = Date.now();
        const from = to - 24 * 60 * 60 * 1000;
        //
        // Get Current "time"
        // const currInstantMS = Date.now();
        // const currInstant = new Date(currInstantMS);
        // const currInstantIso = currInstant.toUTCString();
        
        // const currDateSlice = currInstantIso.slice(0, -15);
        // const currDate = new Date(currDateSlice);
        // const currDateMS = currDate.getTime() -  (6 * 60 * 60 * 1000);

        // const from = currDateMS;
        // const to = currDateMS;
        //
        
        // const query = taskLegQuery;

        let taskLegResponse;
        
        try {
            taskLegResponse = await taskLegsWebexQuery(from, to);
            
        } catch (error) {
            res.status(500);
            res.json({result: error.message});
        }
        

        let agentSessionResponse;

        try {
            agentSessionResponse = await agentSessionWebexQuery(from, to);

        } catch (error) {
            res.status(500);
            res.json({result: error.message});
            return;
        }

        

        // There is an agent session now
        const sessionRef = db.collection('users').doc(userId).collection('sessions');
        
        const currSessions = await sessionRef.where('startTime', '>', from).orderBy('startTime', 'desc').get();
        if (currSessions.empty) {
            // create session
            await sessionRef.doc()create(agentSessionResponse);
        } else {
            // update session
            await currSessions.docs[0].refupdate(agentSessionResponse);

        }

        const currSessionId = currSessions.docs[0].id;

        session
        
        await updateDoc(currSessions.docs[0], agentSessionResponse)



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
        taskLegResponse.slice(0, taskLegResponse.length - currCalls.size).forEach((item) => {
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