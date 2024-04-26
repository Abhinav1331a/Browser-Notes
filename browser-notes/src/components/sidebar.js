import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_url, state_machine_arn } from "../config";
import { getNotebooks } from "../api/notebooksAPI";

export default function Sidebar({ setUser, notebooks, setNotebooks, notebook_id, setNotebookId }) {
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const email = localStorage.getItem('user');

    useEffect(() => {
        fetchNotebooks();
    },
        // eslint-disable-next-line
    [])

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

    useEffect(() => {
        // console.log("notebook_id in sidebar", notebook_id);
        setNotebookId(notebook_id);
        navigate('/notebook');
    },
        // eslint-disable-next-line 
        [notebook_id]);

    const logout = () => {
        // do something
        setUser(null);
        localStorage.removeItem("user");
        navigate('/login');
    }

    const deleteNotebook = async (id) => {
        // remove notebook from notebooks with id
        try {
            const postOptions = {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                //     // 'Access-Control-Allow-Origin': '*'
                // },
                body: JSON.stringify({
                    input: '{"email": "' + email + '", "notebook_id": "' + id + '", "action":"delete-notebook"}',
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
                    alert('Notebook Deleted Successfully');
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

    return (
        <nav>
            <section className="MOBILE-MENU flex">
                <div
                    className="HAMBURGER-ICON space-y-2 cursor-pointer"
                    onClick={() => setIsNavOpen((prev) => !prev)}
                >
                    <svg className="w-8 h-8 text-gray-300 hover:text-black hover:bg-gray-300 rounded-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                    </svg>

                </div>

                <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                    <div
                        className="absolute top-0 right-0 px-4 py-4"
                        onClick={() => setIsNavOpen(false)}
                    >
                        <svg
                            className="h-8 w-8 text-gray-300 hover:text-black hover:bg-gray-300 rounded-full cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </div>
                    <div className="flex flex-col h-full w-full items-center">
                        <h1 className="text-2xl font-bold mt-14 text-gray-300">Your Notes</h1>
                        <ul className="flex-1 flex flex-col w-[90%] mt-4 min-h-[250px] overflow-y-scroll">
                            {/* for item in a variable(which holds all the notebooks of a user, create an li) */}
                            {
                                notebooks?.map((notebook) => {
                                    return (
                                        <li key={notebook?.notebook_id} className="flex justify-between align-items-center rounded p-4 my-2 bg-gray-700">
                                            <button className="text-gray-300" onClick={() => { setNotebookId(notebook.notebook_id); setIsNavOpen(false); }} >{notebook.notebook_name}</button>
                                            <svg className="cursor-pointer rounded-full hover:bg-[#b91c1c]" onClick={() => deleteNotebook(notebook.notebook_id)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0,0,256,256">
                                                <g className='hover:fill-gray-300' fill="#b91c1c" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ "mixBlendMode": "normal" }}><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-6v2h18v-2h-6l-1,-1zM4.36523,7l1.70313,15h11.86328l1.70313,-15z"></path></g></g>
                                            </svg>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <button type="button" onClick={logout} className="w-[90%] mt-4 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Logout</button>
                    </div>
                </div>
            </section>

            <style>
                {
                    `.hideMenuNav {
                    display: none;
                    }
                    .showMenuNav {
                        display: block;
                        position: absolute;
                        height: 37.5rem;
                        top: 0;
                        left: 0;
                        background: #0F172A;
                        transition: width 5s ease-in-out;
                        width: 25%;
                        z-index: 10;
                        display: flex;
                        flex-direction: column;
                        // justify-content: space-evenly;
                        align-items: center;
                        border-right: 1px solid gray; /* Add a border to the right side of the menu */
                        box-shadow: 15px 0 20px 200vh rgba(15, 23, 42, 0.7);
                        // backdrop-filter: blur(16px);
                    }`
                }
            </style>
        </nav>
    );
}