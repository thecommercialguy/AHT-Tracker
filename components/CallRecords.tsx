import { Suspense } from "react";
import { redirect, useLoaderData, useRevalidator, Await, useAsyncValue } from "react-router";
import { auth } from "../src/firebase";
import { getCallTimeGradient } from "./Dashboard"
import { getCallRecords } from "../loaders/callRecordLoaders"
import { msToHours, formatDurationStringFromSeconds, getDateStringFromSeconds, msToMinutes } from '../helpers/timeHelpers'
import { motion } from "motion/react";

export async function CallRecordsLoader() {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) return redirect("/login");

    const token = await user.getIdToken();
    console.log(user.uid)


    const data = getCallRecords(token);

    return { data }
}

export default function CallRecords() {

    const { data } = useLoaderData();
    console.log(data);

    return (
        <Suspense fallback={<CallRecordsSkeleton />}>
            <Await
                resolve={data}
            >
                <CallRecordsComponent />
            </Await>

        </Suspense>
    )
}

export function CallRecordsComponent() {
    const data = useAsyncValue();
    console.log(data);
    console.log(new Date(1788757200000).toISOString());

    return (
        <div className="call-records">

            <h1 className="call-records-header">Call Record</h1>

         
            <div className="call-records-details fastest-aht">
                <div className="time">
                    <span className="call-records-label">fastest average handle time</span>
                    <span className="call-records-value">{msToMinutes(data?.averageHandleTime.ahtDuration)}</span>
                    <div className="call-time-split" style={getCallTimeGradient(data?.averageHandleTime.connectedDuration, data?.averageHandleTime.wrapupDuration)}></div>

                </div>
                <div className="details">
                    <span className="session-details"><span className="session-details-value">{data?.averageHandleTime.connectedCount}</span> calls</span>
                    <span className="session-details"><span className="session-details-value">{msToHours(data?.averageHandleTime.connectedDuration)}</span> connected duration</span>
                    <span className="session-details"><span className="session-details-value">{msToHours(data?.averageHandleTime.wrapupDuration)}</span> wrap up duration</span>
                    <span className="session-details">{getDateStringFromSeconds(data?.averageHandleTime.date._seconds)}</span>
                </div>
            </div>
            <div className="call-records-details">
                <span className="call-records-label">total calls</span>
                <span className="call-records-value">{data?.totalCallCount}</span>

            </div>
            <div className="call-records-details">
                <span className="call-records-label">total connected duration</span>
                <span className="call-records-value">{formatDurationStringFromSeconds(data?.totalConnectedDuration)}</span>
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

const bgvar01 = 'linear-gradient(90deg, hsla(255, 10%, 50%, 0.35) 25%, hsla(0, 0%, 100%, 0.35) 75%, hsla(255, 10%, 50%, 0.35) 100%'
const SKEL_TRANSITION_DURATION = 1.3;

export function CallRecordsSkeleton() {
    return (
         <div className="call-records">

            <h1 className="call-records-header">Call Record</h1>

         
            <div className="call-records-details fastest-aht">
                <div className="time">
                    <motion.span 
                        className="call-records-label"
                        style={{
                            width: "248px",
                            height: "26px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                    <motion.span 
                        className="call-records-value"
                        style={{
                            width: "97px", 
                            height: "26px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                    <div className="call-time-split" style={getCallTimeGradient(100, 20)}></div>

                </div>
                <div className="details">
                    <motion.span 
                        className="session-details"
                        style={{
                            width: "69px", 
                            height: "18px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                    <motion.span 
                        className="session-details"
                        style={{
                            width: "232px", 
                            height: "18px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                    <motion.span 
                        className="session-details"
                        style={{
                            width: "224px", 
                            height: "18px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                    <motion.span 
                        className="session-details"
                        style={{
                            width: "224px", 
                            height: "18px",
                            overflow: "clip",
                            backgroundAttachment: "fixed",
                            backgroundImage: bgvar01,
                            backgroundOrigin: "0% 0%",
                            backgroundSize: "100vw 100%",
                            borderRadius: "4px"
                        }}
                        animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    ></motion.span>
                </div>
            </div>
            <div className="call-records-details">
                <motion.span 
                    className="call-records-label"
                    style={{
                        width: "87px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>
                <motion.span 
                    className="call-records-value"
                    style={{
                        width: "45px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>

            </div>
            <div className="call-records-details">
                <motion.span 
                    className="call-records-label"
                    style={{
                        width: "222px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>
                <motion.span 
                    className="call-records-value"
                    style={{
                        width: "168px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>
            </div>
            <div className="call-records-details">
                <motion.span 
                    className="call-records-label"
                    style={{
                        width: "97px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>
                <motion.span 
                    className="call-records-value"
                    style={{
                        width: "77px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                        backgroundPosition: ["0 0", "100vw 0"]
                    }}
                    transition={{
                        duration: SKEL_TRANSITION_DURATION,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                ></motion.span>
            </div>
            <div className="call-records-details">
                <motion.span 
                    className="call-records-label"
                    style={{
                        width: "102px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    
                ></motion.span>
                <motion.span 
                    className="call-records-value"
                    style={{
                        width: "77px", 
                        height: "26px",
                        overflow: "clip",
                        backgroundAttachment: "fixed",
                        backgroundImage: bgvar01,
                        backgroundOrigin: "0% 0%",
                        backgroundSize: "100vw 100%",
                        borderRadius: "4px"
                    }}
                    animate={{
                            backgroundPosition: ["0 0", "100vw 0"]
                        }}
                        transition={{
                            duration: SKEL_TRANSITION_DURATION,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                ></motion.span>
            </div>
     
        </div>
    )
}