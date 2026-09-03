import {onRequest} from "firebase-functions/https";
// import type { Response } from 'express';
import { getAgentSessionsByPhoneNumber, getAgentSessionsByWebexId } from "../queryFunctions/queryFunctions";
import { BadRequestError, errorResponse } from "../errors/errors";

export const verifyWebexPhoneNumber = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res): Promise<void> => {
        try {
            const webexPhoneNumber = req.params.webexPhoneNumber as string | null | undefined;
            if (!webexPhoneNumber) {
                throw new BadRequestError('webexPhoneNumber required');
            }
    
            const webexPhoneNumberTrimmed = webexPhoneNumber.trim();
            if (webexPhoneNumberTrimmed.length > 12 || webexPhoneNumberTrimmed.length < 10) {
                throw new BadRequestError('webexPhoneNumber invalid');
            }
    
            let phoneNumber;
    
            if (webexPhoneNumber.length === 10) {
                if (webexPhoneNumber.slice(0,2) == '+1') {
                    throw new BadRequestError('webexPhoneNumber invalid');
                }
                phoneNumber = `${+1}${webexPhoneNumber}`;
            } else {
                phoneNumber = webexPhoneNumberTrimmed;
            }
    
            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;
    
            // let agentSessionResponse;
    
            try {
                await getAgentSessionsByPhoneNumber({from: from, to: to, phoneNumber: phoneNumber});
            } catch (error) {
                errorResponse(error, res);
                return;
            }
    
    
           
    
            res.status(200).json({
                message: 'Success, webexPhoneNumber valid.'
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
            const webexId = req.params.webexId as string | null | undefined;
            if (!webexId) {
                throw new BadRequestError('webexId required');
            }

            const to = Date.now();
            const from = to - 14 * 24 * 60 * 60 * 1000;

            // let agentSessionResponse;

            try {
                await getAgentSessionsByWebexId({from: from, to: to, webexId: webexId});

            } catch (error) {
                errorResponse(error, res);
                return;
            }


            res.status(200).json({
                message: 'Success, valid webex id'
            });

        } catch (error) {
            errorResponse(error, res);
            return;
        }
     
});
