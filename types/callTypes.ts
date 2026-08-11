export interface ChannelInfoResponse {
    agentPhoneNumber: string;
    channelId: string | null;
    channelType: string | null;
    connectedCount: number | null;
    connectedDuration: number | null;
    currentState: string | null;
    notRespondedCount: number | null;
    outdialCount: number | null;
    overallEvalScore: null | number;
    postCallDuration: number | null;
    reservationCount: number | null;
    ronaCount: number | null;
    totalDuration: number | null;
    wordRatioCount: number | null;
    wrapupDuration: number | null;
}
export interface ChannelInfo {
    agentPhoneNumber: string;
    channelId: string | null;
    channelType: string | null;
    connectedCount: string | null;
    connectedDuration: string | null;
    currentState: string | null;
    notRespondedCount: string | null;
    outdialCount: string | null;
    overallEvalScore: string | null;
    postCallDuration: string | null;
    reservationCount: string | null;
    ronaCount: string | null;
    totalDuration: string | null;
    wordRatioCount: string | null;
    wrapupDuration: string | null;
}

export interface DashboardData {
    averageHandleTime: {
        duration: number | null,
        connectedDuration: number | null,
        wrapupDuration: number | null
    },
    totalCount: number | null,
    connectedCount: number | null,
    connectedDuration: number | null,
    fastestCall: number | null,
    slowestCall: number | null,
    recentCall: {
        duration: number | null,
        connectedDuration: number | null,
        wrapupDuration: number | null,
    },
}