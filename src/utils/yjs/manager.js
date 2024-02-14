import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket'
import { useRoom } from "../../../liveblocks.config";
import LiveblocksProvider from "@liveblocks/yjs";

class YjsManager {
    constructor(roomName, room, username, setYjsConnectionStatus) {
        // this.room = useRoom();
        this.yjsStatus = false
        this.ydoc = new Y.Doc();
        this.cells = this.ydoc.getArray('cells');
        this.kernel = this.ydoc.getText('kernel');
        this.kernelId = this.ydoc.getText('kernelId');
        this.status = this.ydoc.getText('kernelstatus');
        // this.provider = new WebsocketProvider('ws://localhost:1234', roomName, this.ydoc);
        this.provider = new LiveblocksProvider(room, this.ydoc);

        console.log("inside manager", this.provider);
        // this.provider.on('status', event => {
        //     if (event.status === 'connected'){
        //         this.setupProvider(event, username);
        //         setYjsConnectionStatus(true);
        //         console.log("Connected")
        //     }
        // })

        this.provider.on("sync", (isSynced) => {
            if (isSynced === true) {
              // Yjs content is synchronized and ready
                console.log("Connected")
                this.yjsStatus = true
                this.setupProvider(username);
                setYjsConnectionStatus(true);
            } else {
              // Yjs content is not synchronized
              console.log("Failed");
              this.yjsStatus = false;
            }
          });

    }

    setupProvider(username){
        // console.log(event.status); // logs "connected" or "disconnected"
        console.log("username", username); // logs the event object

        if(this.provider.awareness){
            this.provider.awareness.on('change', changes => {
                console.log(Array.from(this.provider.awareness.getStates().values()));
            });
            this.provider.awareness.setLocalStateField('user', { name: username });
        }

        setTimeout(() => {
            console.log("cells length:", this.cells.length   );
            if(this.cells.length === 0){
                this.cells.push([1])
            }
        }, 100);
    }

    createEditorAtIndex(editorIndex) {
        let maxCounter = this.cells.length === 0 ? 0 : Math.max(...this.cells);
        this.cells.insert(this.cells.toArray().indexOf(editorIndex) + 1, [maxCounter + 1]);
    }

    deleteEditorAtIndex(editorIndex) {
        this.cells.delete(this.cells.toArray().indexOf(editorIndex), 1);
        this.ydoc.getText(`counter-${editorIndex}`).insert(0, "");
        this.ydoc.getText(`output-${editorIndex}`).insert(0, "");
        this.ydoc.getText(`cellid-${editorIndex}`).insert(0, "");
    }

    destroyProvider() {
        this.provider.destroy();
        this.ydoc.destroy();
    }
}

export default YjsManager