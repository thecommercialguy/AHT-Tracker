import {onRequest} from "firebase-functions/https";
// import type { Response } from 'express';
import { verifyAgentPhoneNumber, verifyWebexIdWebex } from "../queryFunctions/queryFunctions";
import { BadRequestError, ConflictError, errorResponse, ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/errors";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const verifyWebexPhoneNumber = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res): Promise<void> => {
        try {
            const webexPhoneNumber = req.query.agentPhoneNumber as string | null | undefined;
            if (!webexPhoneNumber) {
                throw new BadRequestError('webex phone number required');
            }

            const db = getFirestore();
            const usersRef = db.collection('users');
            const userExists = await usersRef.where('agentPhoneNumber', '==', webexPhoneNumber).get();
            if (!userExists.empty) {
                throw new ConflictError('webex phone number already in use');
            }
    
            const webexPhoneNumberTrimmed = webexPhoneNumber.trim();
            if (webexPhoneNumberTrimmed.length > 12 || webexPhoneNumberTrimmed.length < 10) {
                throw new BadRequestError('webex phone number invalid');
            }
            
            let phoneNumber;
    
            if (webexPhoneNumber.length === 10) {
                if (webexPhoneNumber.slice(0,2) == '+1') {
                    throw new BadRequestError('webex phone number invalid');
                }
                phoneNumber = `$+1${webexPhoneNumber}`;
            } else {
                phoneNumber = webexPhoneNumberTrimmed;
            }
    
            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;
    
            // let agentSessionResponse;
            let isPhoneNumberValid;
            try {
                isPhoneNumberValid = await verifyAgentPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});
            } catch (error) {
                errorResponse(error, res);
                return;
            }
    
    
           
    
            res.status(200).json({
                message: 'Success.',
                isValid: isPhoneNumberValid
            });

        } catch (error) {
            errorResponse(error, res);
            return;
        }
});

export const verifyWebexId = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        try {
            const webexId = req.query.webexId as string | null | undefined;
            if (!webexId) {
                throw new ConflictError('webexId required');
            }

            const db = getFirestore();
            const usersRef = db.collection('users');
            const userExists = await usersRef.where('webexId', '==', webexId).get();

            if (!userExists.empty) {
                throw new ForbiddenError('webex id already in use');
            }

            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;

            let isWebexIdValid;

            try {
                isWebexIdValid = await verifyWebexIdWebex({from: from, to: to, webexId: webexId});

            } catch (error) {
                errorResponse(error, res);
                return;
            }


            res.status(200).json({
                message: 'Success',
                isValid: isWebexIdValid
            });

        } catch (error) {
            errorResponse(error, res);
            return;
        }
     
});


export const verifyWebexPhoneNumberUpdate = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res): Promise<void> => {
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

            const userPhoneNumber = userSnap.get("agentPhoneNumber");
            if (!userPhoneNumber) {
                throw new BadRequestError('No agent phone number')
            }
            const webexPhoneNumber = req.query.agentPhoneNumber as string | null | undefined;
            if (!webexPhoneNumber) {
                throw new BadRequestError('webex phone number required');
            }

            if (userPhoneNumber == webexPhoneNumber) {
                res.status(200).json({
                    message: 'Success.',
                    isValid: true
                });
            }


            const usersRef = db.collection('users');
            const userExists = await usersRef.where('agentPhoneNumber', '==', webexPhoneNumber).get();
            if (!userExists.empty) {
                throw new ConflictError('webex phone number already in use');
            }
    
            const webexPhoneNumberTrimmed = webexPhoneNumber.trim();
            if (webexPhoneNumberTrimmed.length > 12 || webexPhoneNumberTrimmed.length < 10) {
                throw new BadRequestError('webex phone number invalid');
            }
            
            let phoneNumber;
    
            if (webexPhoneNumber.length === 10) {
                if (webexPhoneNumber.slice(0,2) == '+1') {
                    throw new BadRequestError('webex phone number invalid');
                }
                phoneNumber = `$+1${webexPhoneNumber}`;
            } else {
                phoneNumber = webexPhoneNumberTrimmed;
            }
    
            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;
    
            // let agentSessionResponse;
            let isPhoneNumberValid;
            try {
                isPhoneNumberValid = await verifyAgentPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});
            } catch (error) {
                errorResponse(error, res);
                return;
            }
    
    
           
    
            res.status(200).json({
                message: 'Success.',
                isValid: isPhoneNumberValid
            });

        } catch (error) {
            errorResponse(error, res);
            return;
        }
});

export const verifyWebexIdUpdate = onRequest(
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

            const userWebexId = userSnap.get("webexId");

            const webexId = req.query.webexId as string | null | undefined;
            if (userWebexId == webexId) {
                res.status(200).json({
                    message: 'Success.',
                    isValid: true
                });
            }
            if (!userWebexId && !webexId) {
                res.status(200).json({
                    message: 'Success.',
                    isValid: true
                });
            }

            if (!webexId) {
                throw new BadRequestError('webexId required');
            }

            const usersRef = db.collection('users');
            const userExists = await usersRef.where('webexId', '==', webexId).get();

            if (!userExists.empty) {
                throw new ForbiddenError('webex id already in use');
            }

            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;

            let isWebexIdValid;

            try {
                isWebexIdValid = await verifyWebexIdWebex({from: from, to: to, webexId: webexId});

            } catch (error) {
                errorResponse(error, res);
                return;
            }


            res.status(200).json({
                message: 'Success',
                isValid: isWebexIdValid
            });

        } catch (error) {
            errorResponse(error, res);
            return;
        }
     
});