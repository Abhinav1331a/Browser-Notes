import React from "react";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import { backend_url, state_machine_arn } from "../config";
import { getNotebooks } from "../api/notebooksAPI";

// Header component
export default function Header({ setUser, notebooks, setNotebooks, notebook_id, setNotebookId }) {
    const navigate = useNavigate();
    const email = localStorage.getItem('user');

    const fetchNotebooks = async() => {
        // Update books in sidebar 
        const output = await getNotebooks();
        console.log(output);
        if (output.statusCode === 200) {
            setNotebooks(output?.body?.notebooks);
        } else {
            console.log(output.body);
            alert('Failed to fetch notebooks');
        }
    }

    const createNewNote = async () => {
        try {
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                //     // 'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: '{"email": "' + email + '", "notebook_name":"New Untitled Notebook", "notebook_content":"" , "action":"add-notebook"}',
                    name: "ScriptExecution",
                    stateMachineArn: state_machine_arn
                })
            };
            const response = await fetch(`${backend_url}/state-machine/`, postOptions);
            // console.log("here");
            if (response.ok) {
                // console.log("here 2");
                const data = await response.json();
                // console.log(data);
                const output = JSON.parse(data.output);
                if (output.statusCode === 200) {
                    // console.log("here 3");
                    alert('Notebook Created Successfully');
                    navigate('/notebook');
                    setNotebookId(output.body.notebook_id);
                    fetchNotebooks();
                } else {
                    alert('Failed to Save');
                }
            } else {
                alert('Failed to Save');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error here
        }
        // console.log("Create new note");
    }
    return (
        <div className="flex flex-row items-center justify-between border-white-200 py-8">
            <Sidebar setUser={setUser} notebook_id={notebook_id} notebooks={notebooks} setNotebooks={setNotebooks} setNotebookId={setNotebookId} />
            <div className="w-[24rem]">
                <p className="text-gray-300 text-center text-xl">Write your beautiful notes down below...</p></div>
            <div onClick={() => { createNewNote() }}>
                <svg className="w-8 h-8 text-gray-300 cursor-pointer hover:text-black hover:bg-gray-300 rounded-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                </svg>
            </div>
        </div>
    );
}