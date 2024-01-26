"use client"

import Editor from 'src/components/codeeditor/editor'; 
import React, { useEffect, useState, useReducer } from 'react';

import Collaborators from 'src/components/codeeditor/collaborators';
import YjsManager from 'src/utils/yjs/manager';
import {actionTypes, editorReducer} from 'src/components/codeeditor/editorReducer';
import { useRoom } from "../../../liveblocks.config";
import { setRoomMetadata } from '@liveblocks/react';

const initialEditors = [];

const Ide = ({username}) => {
    const room = useRoom();
    console.log('room:', room  );

    // const [editors, setEditors] = useState([]);
    const [counter, setCounter] = useState(0);
    const [focusedEditor, setFocusedEditor] = useState(-1);
    const [yjsManagerState, setYjsManagerState] = useState(null);
    const [yjsConnectionStatus, setYjsConnectionStatus] = useState(false);

    const [editors, dispatch] = useReducer(
        editorReducer,
        initialEditors
      );

    useEffect(() => {
        // const username = username;
        const yjsManager = new YjsManager('test-room-8', room, username, setYjsConnectionStatus);
        setYjsManagerState(yjsManager);


        if(yjsManager.cells){
            yjsManager.cells.observe(event => {
                console.log('delta:', event.changes.delta);
                console.log('delta:', event.changes.delta.length);
                
                let index = 0;

                event.changes.delta.forEach(change => {
                    if (change.retain) {
                        index += change.retain;
                    }

                    else if (change.insert) {
                        console.log('change.insert:', change.insert)
                        change.insert.forEach(item => {
                            if (item.counter > counter){
                                setCounter(item );
                            }
                            // cells.delete(cells.length - 1, 1);
                            console.log('item.counter:', item)
                            // Add a new CodeEditor component for this counter value

                            dispatch({
                              type: actionTypes.INSERT,
                              payload: {
                                index: index,
                                item: (
                                  <Editor
                                    setFocusedEditor={setFocusedEditor}
                                    key={item}
                                    yjsManager={yjsManager}
                                    counter={item}
                                  />
                                ),
                              },
                            });
                            index = index + 1;
                        });
                    }

                    else if (change.delete) {
                        console.log('change.delete:', change.delete)
                        // Delete elements from the array
                        console.log('index:', index)
                        dispatch({
                            type: actionTypes.REMOVE,
                            payload: index
                        });
                        index -= change.delete;
                        if (index < 0) {
                            index = 0;
                        }
                    }
                    if(yjsManager.cells.length === 0){
                        yjsManager.cells.push([1])
                    }
                });
            })
        }
    
        return () => yjsManager.destroyProvider();
    }, []);

    return (
        <div>
        <div className='flex gap-4 m-5'>
            <button className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                </svg>
            </button>
            <button className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 01-1.313-1.313V9.564z" clipRule="evenodd" />
                </svg>                
            </button>
            <button className=" bg-blue-400 rounded-md pl-4 pr-4 pt-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                </svg>
            </button>
            <div className='flex justify-center items-center'>
                <div className=' items-center bg-black  w-7 h-7 rounded-full'>
                </div>
            </div>
            <div className='text-center'>Collaborators</div>
            <div className=' w-3/12 border-solid border-2'>
                {yjsConnectionStatus && <Collaborators providerState={yjsManagerState.provider} username={username}/>}
            </div>

        </div>

        <div className='flex gap-3 ml-2 mr-2'>
            <div className=' w-11/12'>
                {editors.map((editor, index) => (
                    <div className=' mb-3' key={index}>{editor}</div>
                ))}
            </div>

        </div>
        </div>
    );

}

export default Ide;