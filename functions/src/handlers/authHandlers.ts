import {onRequest} from "firebase-functions/https";
// import type { Response } from 'express';
import { getAgentSessionsByPhoneNumber, getAgentSessionsByWebexId } from "../queryFunctions/queryFunctions";

export const verifyWebexPhoneNumber = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res): Promise<void> => {
        const webexPhoneNumber = req.params.webexPhoneNumber as string | null | undefined;
        if (!webexPhoneNumber) {
            res.status(400).json({
                errorMessage: 'webexPhoneNumber undefined'
            });
            return;
        }

        const webexPhoneNumberTrimmed = webexPhoneNumber.trim();
        if (webexPhoneNumberTrimmed.length > 12 || webexPhoneNumberTrimmed.length < 10) {
            res.status(400).json({
                errorMessage: 'webexPhoneNumber invalid'
            });
            return;
        }

        let phoneNumber;

        if (webexPhoneNumber.length === 10) {
            if (webexPhoneNumber.slice(0,2) == '+1') {
                res.status(400).json({
                    errorMessage: 'webexPhoneNumber invalid'
                });
                return;
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
            res.status(404).json({
                error: 'webexPhoneNumber not found'
            });
            return;
        }


       

        res.status(200).json({
            message: 'Success, webexPhoneNumber valid.'
        });
     
});

export const verifyWebexId = onRequest(
    {   
        cors: true,
        region: "us-central1", 
        timeoutSeconds: 1200,
    },
    async (req, res) => {
        const webexId = req.params.webexId as string | null | undefined;
        if (!webexId) {
            res.status(400).json({
                errorMessage: 'webex id undefined'
            });
            return;
        }

        const to = Date.now();
        const from = to - 14 * 24 * 60 * 60 * 1000;

        // let agentSessionResponse;

        try {
            await getAgentSessionsByWebexId({from: from, to: to, webexId: webexId});

        } catch (error) {
            res.status(404).json({
                error: 'webex id not found'
            });
            return;
        }


        res.status(200).json({
            message: 'Success, valid webex id'
        });
     
});
