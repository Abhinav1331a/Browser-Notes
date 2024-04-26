import { useNavigate } from "react-router-dom";
import { backend_url, state_machine_arn } from "../config";
import { useState } from 'react';

export default function Auth({ user, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                //     'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: '{"email": "' + email + '", "password": "' + password + '", "action":"login"}',
                    name: "ScriptExecution",
                    stateMachineArn: state_machine_arn
                })
            };
            const response = await fetch(`${backend_url}/state-machine/`, postOptions);
            if (response.ok) {
                const data = await response.json();
                const output = JSON.parse(data.output);
                console.log(output);
                if (output.statusCode === 200) {
                    console.log('user', 'Login successful');
                    localStorage.setItem('user', output.body.email);
                    setUser(output.body.email);
                    alert('Login Successful');
                    navigate('/notebook');
                } else {
                    alert('Failed to Login');
                }
            } else {
                alert('Failed to Login');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error here
        }
    }
    return (
        <div className="flex flex-col h-full justify-center items-center">
            <form className="container" onSubmit={handleSubmit} >
                <p className="text-gray-300 text-2xl text-center font-bold">Login</p>
                <div className="mb-3">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300 dark:text-gray-300">Your email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id="emailAddress" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the name for your notebook..." />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300 dark:text-gray-300">Your password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the name for your notebook..." />
                </div>
                <div className="flex items-start mb-3">
                    <div className="flex items-center h-5">
                        <a onClick={() => navigate('/register')} className="ms-2 text-sm font-medium text-gray-100 cursor-pointer">New? Click here to register!</a>
                    </div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>

    )
}