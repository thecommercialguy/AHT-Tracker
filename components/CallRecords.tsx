import { redirect, useLoaderData } from "react-router";
import { auth } from "../src/firebase";
import { getCallTimeGradient } from "./Dashboard"
import { getCallRecords } from "../loaders/callRecordLoaders"
import { msToHours, formatDurationStringFromSeconds, getDateStringFromSeconds } from '../helpers/timeHelpers'

export async function CallRecordsLoader() {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) return redirect("/login");

    const token = await user.getIdToken();
    const data = await getCallRecords(token);

    return data
}


export default function CallRecords() {

    const data = useLoaderData();
    console.log(data);


    return (
        <div className="call-records">

            <h1 className="call-records-header">Call Record</h1>

         
            <div className="call-records-details fastest-aht">
                <div className="time">
                    <span className="call-records-label">fastest average handle time</span>
                    <span className="call-records-value">{msToHours(data?.averageHandleTime.ahtDuration)}</span>
                    <div className="call-time-split" style={getCallTimeGradient(data?.averageHandleTime.connectedDuration, data?.averageHandleTime.wrapupDuration)}></div>

                </div>
                <div className="details">
                    <span className="session-details"><span className="session-details-value">{data?.averageHandleTime.connectedCount}</span> calls</span>
                    <span className="session-details"><span className="session-details-value">{msToHours(data?.averageHandleTime.connectedDuration)}</span> connected duration</span>
                    <span className="session-details"><span className="session-details-value">{msToHours(data?.averageHandleTime.wrapupDuration)}</span> wrap-up duration</span>
                    <span className="session-details">{getDateStringFromSeconds(data?.averageHandleTime.date._seconds)}</span>
                </div>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">total calls</span>
                <span className="call-records-value">{data?.totalCallCount}</span>

            </div>
            <div className="call-records-details">
                <span className="call-records-label">total connected duration</span>
                <span className="call-records-value">{formatDurationStringFromSeconds(data?.totalConnectedDuration._seconds)}</span>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">fastest call</span>
                <span className="call-records-value">{msToHours(data?.fastestCall.duration)}</span>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">longest call</span>
                <span className="call-records-value">{msToHours(data?.longestCall.duration)}</span>
            </div>
     
        </div>
    )
}