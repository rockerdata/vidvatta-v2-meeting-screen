import {
    ServerConnection,
    KernelManager,
    KernelAPI,
} from "@jupyterlab/services";
import axios from 'axios';

export default class JupyterKernelManager {
    constructor() {
        // basic initialization
        this.kernelStatus = null;
        this.kernelId = "";
        this.ipAddress = "";
        this.port = "";
        this.serverConfig = null;
        this.kernelManager = null;
        this.kernel = null;
    }

    async startKernelById(kernelId){
        if(kernelId !== ""){
            this.serverConfig = ServerConnection.makeSettings({
                baseUrl: 'http://' + this.ipAddress  + ":" + this.port,
            })

            fetch("http://"+this.ipAddress+":"+this.port+"/api").then(res => {
                console.log("Server available")
            }).catch(err => {
                console.log("Server not available");
            })

            KernelAPI.listRunning(this.serverConfig).then((kernelModels) => {
                console.log("Insert kernel by id", kernelModels);
                console.log(this.serverConfig);
                let targetKernelId = kernelId; // Replace this with your actual kernel ID

                // Find the kernel model with the matching ID
                let targetKernelModel = kernelModels.find(
                    (kernelModel) => kernelModel.id === targetKernelId
                );
                let kernel = new KernelManager({
                    serverSettings: this.serverConfig,
                });

                if (targetKernelModel) {
                    // If a kernel model with the matching ID is found, connect to it
                    let kernelK = kernel.connectTo({
                    model: targetKernelModel,
                    });
                    this.kernelManager = kernelK;
                    return kernelK.id;
                }
            })
            .catch(err => {
                console.log('kernel by id', err);
            });
        }
        return
    }

    async startKernel(res, yjsManagerState){
        this.kernelStatus = JSON.parse(res);
        this.ipAddress = this.kernelStatus.ipAddress;
        this.port = this.kernelStatus.port;
        axios.get('http://' + this.ipAddress  + ":" + this.port + '/api', {timeout: 2000}).then((response) => {
            console.log("Kernel is up");

            this.serverConfig = ServerConnection.makeSettings({
                baseUrl: 'http://' + this.ipAddress  + ":" + this.port,
            })

            let kernel = new KernelManager({
                serverSettings: this.serverConfig,
            });

            KernelAPI.listRunning(this.serverConfig).then((kernelModels) => {
                console.log(kernelModels);
                if(kernelModels.length == 1){
                    this.kernelManager = kernel.connectTo({
                        model: kernelModels[0],
                    });
                }
                else{
                    kernel.startNew({name: "python"})
                    .then((k) => {
                        console.log(k);
                        this.kernelId = k.id;
                        yjsManagerState.kernelId.delete(0, yjsManagerState.kernelId.length);
                        yjsManagerState.kernelId.insert(0, k.id);
                        this.kernelManager = k;
                        console.log("Kernel Started", k);
                    })  
                }
            });
        })
        .catch((err) =>{
            console.log("Kernel not available");
            this.ipAddress = ""
            this.port = ""
        });        
    }

    async startServer() {
        const res = await fetch('http://localhost:3000/api/jupyter/start-server');
        this.kernelStatus = await res.json();
        // console.log(this.kernelStatus);
        // this.startKernel()
        return this.kernelStatus
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
        console.log(this.kernelStatus);
        this.kernelManager.shutdown().then(async (resp) => {
            const res = await fetch('http://localhost:3000/api/jupyter/stop-server', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicates the content 
                },
                body: JSON.stringify({taskArn: this.kernelStatus.taskArn})
            });
            this.kernelStatus = await res.json();
            return this.kernelStatus
        })
        .catch(err => {
            return err
        })

    }

}