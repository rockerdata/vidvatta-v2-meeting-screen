"use client"
import React, {useState, useEffect} from 'react';
import Collaborators from 'src/components/codeeditor/collaborators';
import KernelManager from 'src/utils/kernel/manager'
import { useToast } from "src/components/ui/use-toast"

const EditorKernel = ({yjsManagerState, username, kernelManagerRef}) => {
    const { toast } = useToast()
    // const [kernel, setKernel] = useState(null)

    useEffect(() => {
        if(yjsManagerState.provider){
            yjsManagerState.kernel.observe(event => {
                console.log('kernel delta:', event.changes.delta);
                console.log('kernel delta:', event.changes.delta.length);

                event.changes.delta.forEach(change => {
                    if (change.insert){
                        console.log('change insert', change.insert);
                        kernelManagerRef.startKernel(change.insert, yjsManagerState);

                        // yjsManagerState.kernelId.delete(0, yjsManagerState.kernelId.length);
                        console.log(kernelManagerRef.kernelId);
                        // yjsManagerState.kernelId.insert(0, kernelManagerRef.kernelId);
                    }
                });
            })

            yjsManagerState.kernelId.observe(event => {
                event.changes.delta.forEach(change => {
                    if (change.insert){
                        console.log("kernel id change detected", change.insert);
                        // kernelManagerRef.startKernelById(change.insert).then(kernelId => {
                        //     console.log('kernelId', kernelId);
                        //     toast({
                        //         title: "Kernel Status",
                        //         description: "Existing Kernel Initiated",
                        //       })
                        // })
                    }
                })
            });
        }
    }, []);

    const startServer = async () =>{
        
        toast({
            title: "Kernel Status",
            description: "Kernel Start Initiated",
          })

          kernelManagerRef.startServer()
        .then((res) => {
            // console.log(res);
            yjsManagerState.kernel.delete(0,yjsManagerState.kernel.length);
            yjsManagerState.kernel.insert(0, JSON.stringify(kernelManagerRef.kernelStatus));
            toast({
                title: "Kernel Status",
                description: "Started Successfully",
              })
            // The instance is fully initialized and ready to use
        })
        .catch(error => {
            console.log(error);
            // Handle errors
        });
    }

    const stopKernel = () =>{
        kernelManagerRef.stopServer()
        .then((res) => {
            console.log(res);
            toast({
                title: "Kernel Status",
                description: "Stopped Successfully",
              })
            // The instance is fully initialized and ready to use
        })
        .catch(error => {
            console.log(error);
            // Handle errors
            toast({
                title: "Kernel Status",
                description: error,
              })
        });
    }

  return (
    <div className='flex gap-4 m-5'>
    <button onClick={startServer} className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
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
        <div className=' items-center bg-black  w-7 h-7 rounded-full'>
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