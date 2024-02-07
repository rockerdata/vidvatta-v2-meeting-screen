//create a service to start a task in ecs cluster using aws sdk

import { ECSClient, RunTaskCommand, DescribeTasksCommand, StopTaskCommand } from "@aws-sdk/client-ecs";
import { EC2Client, DescribeNetworkInterfacesCommand } from '@aws-sdk/client-ec2';

const ecs = new ECSClient({ region: 'ap-south-1'}); // Adjust the region accordingly
const ec2 = new EC2Client({ region: 'ap-south-1' });


const waitForTaskToStart = async (taskArn) => {
    let retries = 10; // Maximum number of retries
    let delay = 10000; // Delay in milliseconds (10 seconds)

    while (retries > 0) {
        const response = await ecs.send(new DescribeTasksCommand({
            tasks: [taskArn],
            cluster: 'jupyter-kernel'
        }));

        const taskStatus = response.tasks[0].lastStatus;
        if (taskStatus === 'RUNNING' || taskStatus === 'STOPPED') {

            const eniId = response.tasks[0].attachments[0].details.find(detail => detail.name === 'networkInterfaceId').value;
    
            // Step 2: Describe the network interface to get the public IP
            const describeNetworkInterfacesResponse = await ec2.send(
              new DescribeNetworkInterfacesCommand({
                NetworkInterfaceIds: [eniId],
              })
            );
        
            const publicIp = describeNetworkInterfacesResponse.NetworkInterfaces[0].Association.PublicIp;
    
            return {
              clusterName: 'jupyter-kernel',
              taskArn: taskArn,
              port: 8888,
              ipAddress: publicIp,
              taskArn: taskArn
            };
        }

        await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
        retries--;
    }

    throw new Error("Task did not transition to the expected state in the given time.");
  };

export async function GET(request) {
    try {
        const params = {
            cluster: 'arn:aws:ecs:ap-south-1:788446224555:cluster/jupyter-kernel', // Replace with your cluster name
            launchType: 'FARGATE',       // or 'EC2' depending on your setup
            taskDefinition: 'jupyter-kernel-task', // Replace with your task definition name
  
            // Add the network configuration
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: ["subnet-0a602c4b978b4581a", "subnet-09e074007910c59bf", "subnet-0749f264ce91046b5"], // Replace with your subnet IDs
                    securityGroups: ["sg-0bc1b849eb1ced8d8"], // Replace with your security group IDs
                    assignPublicIp: "ENABLED" // Use "DISABLED" if you don't want a public IP
                }
            }
        };
        const data = await ecs.send(new RunTaskCommand(params));
        console.log(data);
        const status = await waitForTaskToStart(data.tasks[0].taskArn)
        console.log(status);
        return new Response(JSON.stringify(status), { status: 200 });
    } catch (error) {
        console.log(error);
    }
    return new Response( {status:500  });
}