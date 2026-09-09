export const validateAgentPhoneNumber = async (phoneNumber: string) => {
    try {
        const response = await fetch('https://verifywebexphonenumber-tnype6eiha-uc.a.run.app',{
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                phoneNumber,
            })
        });
        if (!response.ok) {
            throw new Error('Issue validating phone number')
        }

        const {isValid} = response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}

export const validateWebexId = async () => {
    try {
        const response = await fetch('https://verifywebexid-tnype6eiha-uc.a.run.app',{
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
            throw new Error('Issue validating webex id')
        }

        const {isValid} = response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}