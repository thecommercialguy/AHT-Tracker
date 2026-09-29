export const validateAgentPhoneNumber = async (agentPhoneNumber: string) => {
    try {
        const response = await fetch(`https://verifywebexphonenumber-tnype6eiha-uc.a.run.app?agentPhoneNumber=${encodeURIComponent(agentPhoneNumber)}`);
        if (!response.ok) {     
            const { error } = await response.json();
            throw new Error(error)
        }

        const { isValid } = await response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}

export const validateWebexId = async (webexId: string, token: string) => {
    try {
const response = await fetch(`https://verifywebexid-tnype6eiha-uc.a.run.app?webexId=${encodeURIComponent(webexId)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error)
        }
        
        const { isValid } = await response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}

export const validateAgentPhoneNumberUpdate = async (agentPhoneNumber: string, token: string) => {
    try {
        const response = await fetch(`https://verifywebexphonenumberupdate-tnype6eiha-uc.a.run.app?agentPhoneNumber=${encodeURIComponent(agentPhoneNumber)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {     
            const { error } = await response.json();
            throw new Error(error)
        }

        const { isValid } = await response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}

export const validateWebexIdUpdate = async (webexId: string, token: string) => {
    try {
        const response = await fetch(`https://verifywebexidupdate-tnype6eiha-uc.a.run.app?webexId=${encodeURIComponent(webexId)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {     
            const { error } = await response.json();
            throw new Error(error)
        }

        const { isValid } = await response.json();
        return isValid;
    } catch (e) {
        throw new Error(e.message);
    }
}