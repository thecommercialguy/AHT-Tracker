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

export const validateWebexId = async (webexId: string) => {
    try {
        const response = await fetch(`https://verifywebexid-tnype6eiha-uc.a.run.app?webexId=${encodeURIComponent(webexId)}`);
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