import { backend_url, state_machine_arn } from "../config";

export async function getNotebooks(){
    const email = localStorage.getItem('user');
    try {
        const postOptions = {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            //     // 'Access-Control-Allow-Origin': '*'
            // },
            body: JSON.stringify({
                input: '{"email": "' + email + '", "action":"get-notebooks"}',
                name: "ScriptExecution",
                stateMachineArn: state_machine_arn
            })
        };
        const response = await fetch(`${backend_url}/state-machine/`, postOptions);
        if (response.ok) {
            const data = await response.json();
            // console.log(data);
            const output = JSON.parse(data.output);
            // console.log(output);
            return output;
        } else {
            alert('Failed to fetch notebooks');
        }
        return {};
    } catch (error) {
        console.error('Error:', error);
        // Handle error here
    }
}