"use client"
import React, {useState, useEffect} from 'react';
import Collaborators from 'src/components/codeeditor/collaborators';
import KernelManager from 'src/utils/kernel/manager'
import { useJupyterKernelManager } from 'src/utils/kernel/managerHook';
import { useSharedJupyterKernelManager } from './kernelContext';
import { useToast } from "src/components/ui/use-toast"

const EditorKernel = ({yjsManagerState, username, kernelManagerRef}) => {
    const { toast } = useToast()
    // const [kernelStatus, setKernelStatus] = useState('dead');
    const { kernelDetails, kernelStatus, kernelStatusMap, startKernel, startServer, stopServer } = useSharedJupyterKernelManager();

    // const [kernel, setKernel] = useState(null)

    useEffect(() => {
        if(yjsManagerState.provider){
            yjsManagerState.kernel.observe(event => {
                console.log('kernel delta:', event.changes.delta);
                console.log('kernel delta:', event.changes.delta.length);

                event.changes.delta.forEach(change => {
                    if (change.insert){
                        console.log('change insert', change.insert);
                        // kernelManagerRef.startKernel(change.insert, yjsManagerState).then((res) => {
                        //     toast({
                        //         title: "Kernel Status",
                        //         description: "Kernel Started Successfully",
                        //       })
                        // }).catch((error) => {
                        //     console.error("Error starting kernel", error);
                        // });
                        startKernel(change.insert, yjsManagerState).then((res) => {
                            toast({
                                title: "Kernel Status",
                                description: "Kernel Started Successfully",
                              })
                        }).catch((error) => {
                            console.error("Error starting kernel", error);
                        })
                    }
                });
            })
        }
    }, []);

    const startKernelServer = async () => {
        toast({
            title: "Kernel Status",
            description: "Kernel Start Initiated",
        });
    
        try {
            // Await the resolution of startServer and then proceed
            const kDetails = await startServer();
            // Assuming kernelManagerRef.startServer updates kernelDetails internally
    
            // Update yjsManagerState with the new kernel status
            console.log("Kernel Details", kDetails);
            yjsManagerState.kernel.delete(0, yjsManagerState.kernel.length);
            yjsManagerState.kernel.insert(0, JSON.stringify(kDetails));
    
            // Notify the user of successful start
            // toast({
            //     title: "Kernel Status",
            //     description: "Started Successfully",
            // });
        } catch (error) {
            console.error(error);
    
            // Handle errors and notify the user
            toast({
                title: "Kernel Status",
                description: "Error starting the kernel",
            });
        }
    };
    

    const stopKernel = async () => {
        try {
            toast({
                title: "Kernel Status",
                description: "Kernel Stop Initiated",
            });
    
            // Attempt to stop the server and wait for the operation to complete
            const res = await stopServer();
            console.log(res);
    
            // Optionally, update the state or perform other actions after stopping the kernel
            // For example, clearing kernel status from yjsManagerState if needed
            yjsManagerState.kernel.delete(0, yjsManagerState.kernel.length); // Adjust as per your state management logic
    
            // Notify the user of successful stop
            toast({
                title: "Kernel Status",
                description: "Stopped Successfully",
            });
        } catch (error) {
            console.log(error);
    
            // Handle errors and notify the user
            toast({
                title: "Kernel Status",
                description: "Stopping failed: " + error.toString(),
            });
        }
    };
    
  return (
    <div className='flex gap-4 m-5'>
    <button onClick={startKernelServer} className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
        </svg>
    </button>
    <button onClick={stopKernel} className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 01-1.313-1.313V9.564z" clipRule="evenodd" />
        </svg>                
    </button>
    <button className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
        </svg>
    </button>
    <div className='flex justify-center items-center'>
        <div className="group relative">
            <div className={` items-center ${kernelStatusMap[kernelStatus]} w-7 h-7 rounded-full`}></div>

            <div className="absolute bottom-full mb-2 hidden group-hover:block">
            <div className="bg-gray-700 text-white text-xs rounded p-2">
                {kernelStatus}
            </div>
            <div className="w-3 h-3 bg-gray-700 absolute left-1/2 transform -translate-x-1/2 rotate-45 bottom-[-8px]"></div>
            </div>
        </div>
    </div>
    <div className='text-center'>Collaborators</div>
    <div className=' w-3/12 border-solid border-2'>
        {yjsManagerState && <Collaborators providerState={yjsManagerState.provider} username={username}/>}
    </div>

</div>
  )
}

export default EditorKernel