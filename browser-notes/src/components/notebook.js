import { React, useState, useEffect } from "react";
import { backend_url, state_machine_arn } from "../config";
import { getNotebooks } from "../api/notebooksAPI";

export default function Notebook({ setNotebooks, notebook_id, setNotebookId }) {
    const [notebookName, setNotebookName] = useState('New Untitled Notebook');
    const [content, setContent] = useState('');
    const email = localStorage.getItem("user");
    // console.log("notebook_id in notebook", notebook_id)

    const fetchNotebooks = async() => {
        // Update books in sidebar 
        const output = await getNotebooks();
        if (output.statusCode === 200) {
            setNotebooks(output?.body?.notebooks);
        } else {
            console.log(output.body);
            alert('Failed to fetch notebooks');
        }
    }

    // show notebook content
    useEffect(() => {        
        getNotebook(notebook_id);
    }, 
    // eslint-disable-next-line
    [notebook_id])

    const getNotebook = async() => {
        try {
            // console.log("notebook_id in notebook", notebook_id)
            // console.log("email in notebook", email)
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                //     // 'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: '{"email": "' + email + '", "notebook_id": "' + notebook_id + '", "action":"get-notebook"}',
                    name: "ScriptExecution",
                    stateMachineArn: state_machine_arn
                })
            };
            const response = await fetch(`${backend_url}/state-machine/`, postOptions);
            if (response.ok) {
                const data = await response.json();
                const output = JSON.parse(data.output);
                // console.log(output);
                if (output.statusCode === 200) {
                    setNotebookName(output.body.notebook.notebook_name.S);
                    setContent(output.body.notebook.notebook_content.S);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error here
        }
    }

    const handleSave = async(event) => {
        event.preventDefault();
        try {
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                //     // 'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: JSON.stringify({
                        email: email,
                        notebook_id: notebook_id,
                        notebook_name: notebookName,
                        notebook_content: content,
                        action: "save-notebook"
                    }),
                    name: "ScriptExecution",
                    stateMachineArn: state_machine_arn
                })
            };
            // console.log(postOptions);
            const response = await fetch(`${backend_url}/state-machine/`, postOptions);
            // console.log(await response.json());
            if (response.ok) {
                const data = await response.json();
                const output = JSON.parse(data.output);
                console.log(output);
                if (output.statusCode === 200) {
                    alert('Notebook Saved Successfully');
                    setNotebookId(output.body.notebook_id);
                    getNotebook(notebook_id);
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
    }

    const exportNotebook = async() => {
        try {
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                //     // 'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: JSON.stringify({
                        email: email,
                        notebook_id: notebook_id,
                        action: "export-notebook"
                    }),
                    name: "ScriptExecution",
                    stateMachineArn: state_machine_arn
                })
            };
            // console.log(postOptions);
            const response = await fetch(`${backend_url}/state-machine/`, postOptions);
            // console.log(await response.json());
            if (response.ok) {
                const data = await response.json();
                const output = JSON.parse(data.output);
                console.log(output);
                if (output.statusCode === 200) {
                    alert('Notebook Exported Successfully');
                } else {
                    alert('Failed to Export');
                }
            } else {
                alert('Failed to Export');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error here
        }
    }

    return (
        <div>
            <div className="w-full flex justify-center items-center">
                <input type="text" id="notebook_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the name for your notebook..."
                    value={notebookName} onChange={(e) => setNotebookName(e.target.value)}
                />
            </div>
            <div className="flex justify-center align-items-center mt-4 w-100">
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/2 resize"
                    value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="flex justify-center align-items-center mt-4 w-100">
                <button type="button" onClick={handleSave} className="w-1/2 mt-4 text-blue-300  hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-grayblue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">Save</button>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div className="flex float-right cursor-pointer">
                <img onClick={exportNotebook} className="w-8 h-8 " alt="Export chat to email" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACG0lEQVR4nO2YzWoUQRRG72QTwfysAuIuUcjMJHkDN6IhkCcQBHcqIvgMLkMQEhnzEi4EE8Tn0CSLJKgrNQkaRdCNmiMXKkzTTndXdXX3VIc+u/lh+h6+W7eqRqShoeFcAEwCt4EJqSPALLABvAMWzHv1kAFGgJvAFnAKHEckOsAtCRlgHLgH7NInKtEGDrTNJESAq8AKcBIRGCTxGehJSAAt0z7PgT8xgSQJbbO2hAAwZtpnh2SOB0gor4ddvxZ0JaF9bCWU5WEKXEtpnzhHKRK6yEeG1T7bFsVHJeYTJJRHVQrMmPb56iAwSOJT7PMflYxcx/ZxlVCelln8BeAO8Jb82Eic6jGlDIHLwGPgi4eArYTyqqz2+Y0/thLKUhHFj5r2eUNxuEjse43cAtsnTWI2Q0J56CPRyzl9sjgEuuYZXfM6je96GvYReR+AhLKeW8I86JL+CPCLYtCiO44Sf/Vo7yUSEZoyu/RPzzUx57AmztgsRKIgobwSymLhIjmFfCT29NJVmoiDUFziI248KF3CQujQU+KbXgEqFRkg9MFTQnkyFImYUCvlUoTlyJ2RgP5Yy7uhvpSQANZyityQkDAnA9c9Z7eSkVtBKvclRHBLRUfuRQkV7FNZlZDBLhW990xL6JCdygupA2Sncl3qAsmp7AQ5cnOkclfqBv+nchL0yHVIZUXqCv1U6jFyM1LRk/GzxC81NDRIWfwDVZ8EFewep2sAAAAASUVORK5CYII="></img>
            </div>
        </div>

    );
}