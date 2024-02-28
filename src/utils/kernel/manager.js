import {
    ServerConnection,
    KernelManager,
    KernelAPI,
} from "@jupyterlab/services";
import { ConsoleLogger } from "aws-amplify/utils";
import axios from 'axios';

export default class JupyterKernelManager {
    constructor() {
        // basic initialization
        this.kernelDetails = null;
        this.kernelStatus = "dead";
        this.ipAddress = "";
        this.port = "";
        this.serverConfig = null;
        this.kernelManager = null;
        this.kernelStatusMap = {
            "dead": "bg-gray-700",
            "starting" : "bg-yellow-500",
            "serverup": "bg-blue-500",
            "idle": "bg-green-500",
            "busy": "bg-red-500",
        }
    }

    async startKernel(res, yjsManagerState){
        try {
            this.kernelStatus = "starting"
            this.kernelDetails = JSON.parse(res);
            this.ipAddress = this.kernelDetails.ipAddress;
            this.port = this.kernelDetails.port;
    
            const response = await axios.get('http://' + this.ipAddress  + ":" + this.port + '/api', {timeout: 2000});
            console.log("Kernel is up");
    
            this.serverConfig = ServerConnection.makeSettings({
                baseUrl: 'http://' + this.ipAddress  + ":" + this.port,
            });
    
            let kernel = new KernelManager({
                serverSettings: this.serverConfig,
            });
    
            const kernelModels = await KernelAPI.listRunning(this.serverConfig);
            console.log(kernelModels);
            if (kernelModels.length === 1) {
                this.kernelManager = kernel.connectTo({model: kernelModels[0]});
            } else {
                this.kernelManager = await kernel.startNew({name: "python"});
                // console.log(k);
                // yjsManagerState.kernelId.delete(0, yjsManagerState.kernelId.length);
                // yjsManagerState.kernelId.insert(0, k.id);
                // // this.kernelManager = k;
                // console.log("Kernel Started", k);
                // this.kernelManager.statusChanged.connect(trackStatusChanges);
                // return k.id;
            }
            yjsManagerState.kernelId.delete(0, yjsManagerState.kernelId.length);
            yjsManagerState.kernelId.insert(0, this.kernelManager.id);
            this.kernelManager.statusChanged.connect(this.trackStatusChanges);
            return this.kernelManager.id;

        } catch (err) {
            this.kernelStatus = "dead";
            console.log("Kernel not available", err);
            this.ipAddress = "";
            this.port = "";
            // Ensure to handle or propagate error appropriately
            throw err; // or return an error indication
        }        
    }
    

    trackStatusChanges = (_, status) => {
        console.log('kernel status', status);
        this.kernelStatus = status;
    }    

    async startServer() {
        console.log("Start Server is called");
        const res = await fetch('http://localhost:3000/api/jupyter/start-server');
        this.kernelDetails = await res.json();
        console.log(this.kernelDetails);
        this.kernelStatus = "serverup"
        // this.startKernel()
        return this.kernelDetails
    }

    async interruptKernel() {
        this.kernelManager.interrupt().then(() => {
            console.log("Kernel Interrupted");
        });
    }

    async runCode(code){
        if(this.kernelManager){
            const future = this.kernelManager.requestExecute(code);
            this.kernelManager.request

            future.onIOPub = (msg) => {
                console.log(msg);
            }

            future.onReply = (reply) => {
                console.log("Got execute reply ", reply);
            }

            future.done.then(() => {
                console.log("Future is fulfilled");
            })
        }
    }

    async stopServer() {
        console.log(this.kernelDetails);
        
        try {
            // First, shut down the kernel manager
            await this.kernelManager.shutdown();
            console.log("Kernel shutdown successfully.");
    
            // Then, send a request to stop the server
            const response = await fetch('http://localhost:3000/api/jupyter/stop-server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({taskArn: this.kernelDetails.taskArn})
            });
    
            // Check if the fetch request was successful
            if (!response.ok) {
                // You can throw an error or handle it accordingly
                throw new Error(`Server stop failed: ${response.status} ${response.statusText}`);
            }
    
            // Parse the JSON response
            this.kernelDetails = await response.json();
            console.log("Server stopped successfully.", this.kernelDetails);
            this.kernelStatus = "dead";
    
            // Optionally, return the kernelStatus for further processing
            return this.kernelDetails;
        } catch (err) {
            console.error("Error stopping server:", err);
            // Depending on your error handling strategy, you might want to rethrow the error or handle it here
            throw err; // Or return a specific error object/message
        }
    }
    

}