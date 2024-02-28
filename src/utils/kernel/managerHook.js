import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { ServerConnection, KernelManager, KernelAPI } from '@jupyterlab/services';

export const useJupyterKernelManager = () => {
  const [kernelDetails, setKernelDetails] = useState(null);
  const [kernelStatus, setKernelStatus] = useState('dead');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [serverConfig, setServerConfig] = useState(null);
  const [kernelManager, setKernelManager] = useState(null);

  const kernelStatusMap = {
    dead: 'bg-gray-700',
    starting: 'bg-yellow-500',
    serverup: 'bg-blue-500',
    idle: 'bg-green-500',
    busy: 'bg-red-500',
  };

  useEffect(() => {
    if (kernelManager) {
      console.log('Kernel Manager is set:', kernelManager);
      // Perform actions that depend on kernelManager being updated
    }
  }, [kernelManager]); // Dependency array ensures this runs when kernelManager changes
  

  const startKernel = useCallback(async (res, yjsManagerState) => {
    try {
      //TODO: starting is not being set
      setKernelStatus('starting');
      const details = JSON.parse(res);
      setKernelDetails(details);
      setIpAddress(details.ipAddress);
      setPort(details.port);
  
      const response = await axios.get(`http://${details.ipAddress}:${details.port}/api`, {timeout: 2000});
      console.log("Kernel is up");
  
      const config = ServerConnection.makeSettings({
        baseUrl: `http://${details.ipAddress}:${details.port}`,
      });
      setServerConfig(config);
  
      let kernel = new KernelManager({ serverSettings: config });
      const kernelModels = await KernelAPI.listRunning(config);
      console.log(kernelModels);
  
      let connectedKernel;
      if (kernelModels.length === 1) {
        connectedKernel = kernel.connectTo({model: kernelModels[0]});
      } else {
        connectedKernel = await kernel.startNew({name: "python"});
      }
  
      setKernelManager(connectedKernel);
      yjsManagerState.kernelId.delete(0, yjsManagerState.kernelId.length);
      yjsManagerState.kernelId.insert(0, connectedKernel.id);
  
      connectedKernel.statusChanged.connect((_, status) => {
        setKernelStatus(status);
      });
  
      return connectedKernel.id;
    } catch (err) {
      setKernelStatus('dead');
      console.log("Kernel not available", err);
      setIpAddress("");
      setPort("");
      throw err;
    }
  }, []);


    const startServer = useCallback(async () => {
        try {
          console.log("Start Server is called");
          const response = await fetch('api/jupyter/start-server');
          const details = await response.json();
          setKernelDetails(details);
          console.log(details);
          setKernelStatus("serverup");
          return details;
        } catch (err) {
          console.error("Error starting server:", err);
          throw err;
        }
      }, []);

      
      const interruptKernel = useCallback(async () => {
        if (kernelManager) {
          try {
            await kernelManager.interrupt();
            console.log("Kernel Interrupted");
          } catch (err) {
            console.error("Error interrupting kernel:", err);
            throw err;
          }
        }
      }, [kernelManager]);

      
      const runCode = useCallback(async (code) => {
        console.log(kernelManager);
        if (kernelManager) {
          try {
            const future = kernelManager.requestExecute({ code });
            future.onIOPub = (msg) => {
              console.log(msg);
            };
            future.onReply = (reply) => {
              console.log("Got execute reply", reply);
            };
            await future.done;
            console.log("Execution completed");
          } catch (err) {
            console.error("Error running code:", err);
            throw err;
          }
        }
      }, [kernelManager]);


      const stopServer = useCallback(async () => {
        try {
          if (kernelDetails && kernelManager) {
            await kernelManager.shutdown();
            console.log("Kernel shutdown successfully.");
      
            const response = await fetch('api/jupyter/stop-server', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ taskArn: kernelDetails.taskArn }),
            });
      
            if (!response.ok) {
              throw new Error(`Server stop failed: ${response.status} ${response.statusText}`);
            }
      
            const details = await response.json();
            console.log("Server stopped successfully.", details);
            setKernelStatus("dead");
            setKernelDetails(null); // Clear kernel details
          }
        } catch (err) {
          console.error("Error stopping server:", err);
          throw err;
        }
      }, [kernelDetails, kernelManager]);


      return {
        kernelDetails,
        kernelStatus,
        kernelStatusMap,
        kernelManager,
        startKernel,
        startServer,
        interruptKernel,
        runCode,
        stopServer,
        // Any additional states or methods you wish to expose
      };


};
