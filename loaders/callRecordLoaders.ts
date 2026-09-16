import type { CallStats } from "../types/callTypes";

export const getCallRecords = async (token: string) => {
     try {
        const response = await fetch('https://getusercallrecord-tnype6eiha-uc.a.run.app', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                return {
                    status: 401,
                    error: 'Unauthorized'
                };
            } else if (response.status === 404) {
                return {
                    status: 404,
                    error: 'No call records'
                }
            } else {
                return {
                    status: 400,
                    error: 'Unable to get call records'
                }
            }
        }

        const data = await response.json();
        if (!data) {
            throw Error('Failed to get call records');

        }

        return data as CallStats;

    } catch (error) {
        let message;
        if (error instanceof Error) {message = error.message;}
        else {message = 'Failed to get dashboard'};

        console.error(message);
        throw Error(message);
        
    }

}