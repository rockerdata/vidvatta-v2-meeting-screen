"use client"
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import {UndoManager} from 'yjs';
import { yCollab } from 'y-codemirror.next';

const YjsCodeMirror = ({yjsManager, setFocusedEditor, counter}) => {
  const [value, setValue] = useState('');
  const [yjsExtension, setYjsExtension] = useState(null);
  const [output, setOutput] = useState('');
  const [yOutputState, setyOutputState] = useState('');
  const [enableOutput, setEnableOutput] = useState(false);

    useEffect(() => {
        
        const ytext = yjsManager.ydoc.getText(`counter-${counter}`);
        const yOutput = yjsManager.ydoc.getText(`output-${counter}`);
        const undoManager = new UndoManager(ytext);
        setValue(ytext.toString());
        setYjsExtension(yCollab(ytext, yjsManager.provider.awareness, { undoManager }));
        setyOutputState(yOutput);

        yOutput.observe(event => {
          if(yOutput.length != 0){
            setEnableOutput(true);
            console.log('output:', event.changes.delta);
            console.log('output:', yOutput.toString());
            setOutput(yOutput.toString());
          }
        });

    }, [yjsManager.ydoc, yjsManager.provider, counter]);


  const onChange = (val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  };

  const deleteCell = () => {
    console.log('deleteCell' + counter);
    yjsManager.deleteEditorAtIndex(counter);
  };

  const addBelowCell = () => {
    console.log('addBelowCell' + counter);
    yjsManager.createEditorAtIndex(counter);
  }

  const detectFocus = (e) => {
    console.log('detectFocus'+ counter);
    setFocusedEditor(counter);
  }

  const runCode = () => {
    console.log('runCode');
    yOutputState.delete(0, yOutputState.length);
    yOutputState.insert(0, 'Running...')
    setTimeout(() => {
      yOutputState.delete(0, yOutputState.length);
      yOutputState.insert(0, 'Hello World')
    }, 1000);
  };

  return (
    <>
    {yjsExtension && 
    <div className=' '>
      <div className='p-2 flex gap-3 border-solid border-2 text-lg'>
        <div className=' '>
          <div className=' cursor-pointer' onClick={runCode}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-green-600 shadow-sm hover:shadow-lg">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </div>
          <div >In [{counter}]</div>
        </div>

        <CodeMirror 
          className='w-full overflow-auto'
          onFocus={detectFocus}
          value={value}
          height="auto"
          extensions={[python(), yjsExtension]}
          onChange={onChange}
        />

        <div className=' cursor-pointer' onClick={addBelowCell}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-500">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className=' cursor-pointer' onClick={deleteCell}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-red-700">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>
                
        </div>
        </div>
        {enableOutput && <div className='p-2 flex gap-3 border-solid border-x-2 border-b-2 text-lg '>

          <div className='flex flex-row gap-1 w-18 '>
            <div >Out [{counter}]</div>
          </div>
          {output}
        </div>}
    </div>
    }
    </>
  );
};

export default YjsCodeMirror;