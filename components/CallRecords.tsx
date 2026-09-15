import { getCallTimeGradient } from "./Dashboard"

export function CallRecordsLoader() {
    return
}


export default function CallRecords() {




    return (
        <div className="call-records">

            <h1 className="call-records-header">Call Record</h1>

         
            <div className="call-records-details fastest-aht">
                <div className="time">
                    <span className="call-records-label">fastest average handle time</span>
                    <span className="call-records-value">1:00:00</span>
                    <div className="call-time-split" style={getCallTimeGradient(100, 1)}></div>

                </div>
                <div className="details">
                    <span className="session-details"><span className="session-details-value">67</span> calls</span>
                    <span className="session-details"><span className="session-details-value">4:20:67</span> connected duration</span>
                    <span className="session-details"><span className="session-details-value">4:20:67</span> wrap-up duration</span>
                    <span className="session-details">April 20, 2067</span>
                </div>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">total calls</span>
                <span className="call-records-value">67420</span>

            </div>
            <div className="call-records-details">
                <span className="call-records-label">total connected duration</span>
                <span className="call-records-value">67 day 10hr 18min</span>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">fastest call</span>
                <span className="call-records-value">00:00:67</span>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">longest call</span>
                <span className="call-records-value">00:42:00</span>
            </div>
     
        </div>
    )
}