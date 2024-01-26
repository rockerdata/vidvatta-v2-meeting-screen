import React, { useEffect, useState } from 'react';
import { useOthers } from '../../../liveblocks.config';

const Collaborators = ({ providerState, username }) => {
    const [collaborators, setCollaborators] = useState([]);
    const others = useOthers();

    useEffect(() => {
        console.log('others:');
        console.log(others);
    }, [others]);

    useEffect(() => {
        if (providerState.awareness) {
            
            setCollaborators(Array.from(providerState.awareness.getStates().values()));
            console.log(collaborators);
            const updateCollaborators = () => {
                console.log("update is called");
                console.log(Array.from(providerState.awareness.getStates().values()));
                setCollaborators(Array.from(providerState.awareness.getStates().values()));
            };

            providerState.awareness.on('change', updateCollaborators);

            return () => {
                providerState.awareness.off('change', updateCollaborators);
            };
        }
    }, [providerState.awareness]);

    return (
        <>
        <div className='text-lg'>Collaborators</div>
        <ul className="list-disc list-inside bg-white p-4">
        {
            collaborators.map((collaborator, index) => (
                <li className="mb-2" key={index}>
                    {'user' in collaborator && collaborator.user.name ? collaborator.user.name : username}
                </li>
            ))
        }
        </ul>
        </>
    );
};

export default Collaborators;