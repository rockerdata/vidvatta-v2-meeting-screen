"use client"
import React, {useState, useEffect} from 'react';
import Collaborators from 'src/components/codeeditor/collaborators';
import KernelManager from 'src/utils/kernel/manager'
import { useJupyterKernelManager } from 'src/utils/kernel/managerHook';
import { useSharedJupyterKernelManager } from './kernelContext';
import { useToast } from "src/components/ui/use-toast"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "src/components/ui/tooltip"
import {Button} from "src/components/ui/button"


const EditorKernel = ({yjsManagerState, username, kernelManagerRef}) => {
    const { toast } = useToast()
    // const [kernelStatus, setKernelStatus] = useState('dead');
    const { kernelStatus, kernelStatusMap, startKernel, startServer, stopServer, interruptKernel } = useSharedJupyterKernelManager();

    // const [kernel, setKernel] = useState(null)

    useEffect(() => {
        if(yjsManagerState.provider){
            yjsManagerState.kernel.observe(event => {
                console.log('kernel delta:', event.changes.delta);
                console.log('kernel delta:', event.changes.delta.length);

                event.changes.delta.forEach(change => {
                    if (change.insert){
                        console.log('change insert', change.insert);
                        if(change.insert.length != 0){

                        startKernel(change.insert, yjsManagerState).then((res) => {
                            toast({
                                title: "Kernel Status",
                                description: "Kernel Started Successfully",
                              })
                            
                        }).catch((error) => {
                            console.error("Error starting kernel", error);
                            toast({
                                title: "Kernel Status",
                                description: "Kernel Start Failed - " + toString(error)
                            });
                            yjsManagerState.kernel.delete(0, yjsManagerState.kernel.length);
                        })
                    }
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

        } catch (error) {
            console.error(error);
    
            // Handle errors and notify the user
            toast({
                title: "Kernel Status",
                description: "Error starting the Server",
            });
        }
    };
    

    const interruptKernelServer = async () =>{
        if (kernelStatus === 'dead'){
            toast({
                title: "Kernel Status",
                description: "Kernel Not Available",
            });
            return;
        }
        try {
            toast({
                title: "Kernel Status",
                description: "Kernel Interrupt Initiated"
            });

            const res = await interruptKernel();
            console.log(res);

            toast({
                title: "Kernel Status",
                description: "Kernel Interrupted Successfully"
            });

        } catch (error) {
            console.log(error);
            toast({
                title: "Kernel Status",
                description: "Kernel Interrupt Failed"
            })
        }
    }

    const stopKernel = async () => {
        if (kernelStatus === 'dead'){
            toast({
                title: "Kernel Status",
                description: "Kernel Not Available",
            });
            return;
        }
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
    <div className='flex flex-row gap-3 shadow-lg rounded-md p-3 justify-center' >

    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger>
        <div onClick={startKernelServer} className=" bg-blue-300 rounded-md pl-4 pr-4 pt-2 pb-2 hover:bg-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
            </svg>
        </div>
        </TooltipTrigger>
        <TooltipContent>
        <p>Start Kernel</p>
        </TooltipContent>
    </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger>
        <div onClick={stopKernel} className=" bg-blue-300 rounded-md pl-4 pr-4 pt-2 pb-2 hover:bg-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 01-1.313-1.313V9.564z" clipRule="evenodd" />
            </svg>                
        </div>
        </TooltipTrigger>
        <TooltipContent>
        <p>Stop Kernel</p>
        </TooltipContent>
    </Tooltip>
    </TooltipProvider>


    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger>
        <div onClick={interruptKernelServer} className=" bg-blue-300 rounded-md pl-4 pr-4 pt-2 pb-2 hover:bg-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
        </div>
        </TooltipTrigger>
        <TooltipContent>
        <p>Interrupt Kernel</p>
        </TooltipContent>
    </Tooltip>
    </TooltipProvider>


    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger>
    <div >
        {yjsManagerState && <Collaborators providerState={yjsManagerState.provider} username={username} toast={toast}/>}
    </div>
        </TooltipTrigger>
        <TooltipContent>
        <p>Collaborators</p>
        </TooltipContent>
    </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger>
        <div className={` items-center ${kernelStatusMap[kernelStatus]} w-7 h-7 rounded-full`}></div>
        </TooltipTrigger>
        <TooltipContent>
        <p>Kernel Status - {kernelStatus}</p>
        </TooltipContent>
    </Tooltip>
    </TooltipProvider>
 
</div>
  )
}

export default EditorKernel