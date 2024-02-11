"use client"

import Editor from 'src/components/codeeditor/editor'; 
import React, { useEffect, useState, useReducer, useRef } from 'react';

import Collaborators from 'src/components/codeeditor/collaborators';
import YjsManager from 'src/utils/yjs/manager';
import {actionTypes, editorReducer} from 'src/components/codeeditor/editorReducer';
import { useRoom } from "../../../liveblocks.config";
import EditorControl from './control'
import KernelManager from 'src/utils/kernel/manager'
import { useJupyterKernelManager } from 'src/utils/kernel/managerHook';

const initialEditors = [];

const Ide = ({username}) => {
    const room = useRoom();
    console.log('room:', room  );

    // const [editors, setEditors] = useState([]);
    // const [counter, setCounter] = useState(0);
    const counter = useRef(0);
    const [focusedEditor, setFocusedEditor] = useState(-1);
    const [yjsManagerState, setYjsManagerState] = useState(null);
    const [yjsConnectionStatus, setYjsConnectionStatus] = useState(false);
    const kernelManagerRef = useRef(null);
    const yjsManagerRef = useRef(null);
    const {kernelDetails, kernelStatus} = useJupyterKernelManager()

    const [editors, dispatch] = useReducer(
        editorReducer,
        initialEditors
      );

    useEffect(() => {
        // const username = username;
        const yjsManager = new YjsManager('test-room-8', room, username, setYjsConnectionStatus);
        setYjsManagerState(yjsManager);
        yjsManagerRef.current = yjsManager;

        if (!kernelManagerRef.current) {
            // Initialize KernelManager only once
            kernelManagerRef.current = new KernelManager();
        }


        if(yjsManagerRef.current.cells){
            yjsManagerRef.current.cells.observe(event => {
                console.log('delta:', event.changes.delta);
                console.log('delta:', event.changes.delta.length);
                
                let index = 0;

                event.changes.delta.forEach(change => {
                    if (change.retain) {
                        index += change.retain;
                    }

                    else if (change.insert) {
                        console.log('chang`e.insert:', change.insert)
                        change.insert.forEach(item => {
                            if (item.counter > counter.current){
                                counter.current = item;
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
                                    yjsManager={yjsManagerRef.current}
                                    counter={item}
                                    kernelManagerRef={kernelManagerRef.current}
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
                    if(yjsManagerRef.current.cells.length === 0){
                        yjsManagerRef.current.cells.push([1])
                    }
                });
            })
        }
    
        return () => yjsManagerRef.current.destroyProvider();
    }, []);

    return (
        <div>
        {yjsManagerRef.current && <EditorControl yjsManagerState={yjsManagerRef.current} username={username} kernelManagerRef={kernelManagerRef.current}/>}

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