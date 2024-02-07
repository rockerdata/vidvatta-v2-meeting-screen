
import { ECSClient, RunTaskCommand, DescribeTasksCommand, StopTaskCommand } from "@aws-sdk/client-ecs";

const ecs = new ECSClient({ region: 'ap-south-1'}); // Adjust the region accordingly

export async function POST(request) {
    console.log(request);
    const { taskArn } = await request.json();
    const params = {
      cluster: 'jupyter-kernel', // Change this if you're using a non-default cluster
      task: taskArn,
      reason: 'Stopping based on users request' // Provide an appropriate reason
    };

    try {
        const data = await ecs.send(new StopTaskCommand(params));
        console.log('Task stopped successfully:', data);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error('Error stopping task:', err);
        return new Response({ status: 500 });
    }
}