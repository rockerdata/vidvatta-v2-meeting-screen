import React, { useEffect, useState, useRef } from 'react';
import { useOthers } from '../../../liveblocks.config';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "src/components/ui/popover"


const Collaborators = ({ providerState, username, toast }) => {
    const [collaborators, setCollaborators] = useState([]);
    const collaboratorsCount = useRef(0);
    const others = useOthers();

    useEffect(() => {
        console.log('others:');
        console.log(others);
    }, [others]);


    useEffect(() => {
        console.log(collaboratorsCount.current, collaborators.length);
        if(collaborators.length > collaboratorsCount.current){
            toast({
                title: "Collaborators Status",
                description: "New Collaborator Has Joined",
            });            
        }
        if(collaborators.length < collaboratorsCount.current){
            toast({
                title: "Collaborators Status",
                description: "Collaborator Has Left",
            });            
        }        
        collaboratorsCount.current = collaborators.length;
    }, [collaborators])

    useEffect(() => {
        if (providerState.awareness) {
            
            setCollaborators(Array.from(providerState.awareness.getStates().values()));
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
    {collaborators.length> 0 && <Popover>
        <PopoverTrigger>
            <button className=" bg-orange-300 rounded-md pl-4 pr-4 pt-2 pb-2 hover:bg-orange-400">
            <div className="w-6 h-6 font-medium">{collaborators.length}</div>
            </button>
        </PopoverTrigger>
        <PopoverContent>{
                    collaborators.map((collaborator, index) => (
                        <div className="mb-2" key={index}>
                            {'user' in collaborator && collaborator.user.name ? collaborator.user.name : username}
                        </div>
                    ))
        }</PopoverContent>
    </Popover>}
        </>
    );
};

export default Collaborators;