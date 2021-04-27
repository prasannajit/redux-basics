(function () {
    // Action creators
    const createToDoItem = (description, status, id) => {
        return {
            type: "CREATE_TODO_ITEM",
            payload: {
                description,
                status,
                id,
            }
        };
    }

    const deleteToDoItem = (id) => {
        return {
            type: "DELETE_TODO_ITEM",
            payload: { id }
        };
    }

    // Reducers
    function lastAction(state = null, action) {
        return action;
    }

    const toDoList = (oldToDoList = [], action) => {
        if (action.type === "CREATE_TODO_ITEM") {
            return [...oldToDoList, action.payload];
        }
        if (action.type === "DELETE_TODO_ITEM") {
            const filteredList = oldToDoList.filter((toDo) => {
                return toDo.id !== action.payload.id;
            });
            return filteredList;
        }
        return oldToDoList;
    }
    // combine reducers
    const combined = Redux.combineReducers({
        toDoList,
        lastAction,
    });
    // create stores
    const store = Redux.createStore(combined);
    // subscribe to events
    const unsubscribe = store.subscribe(() => {
        console.log("last action is ", store.getState().lastAction);
        if (store.getState().lastAction.type === 'DELETE_TODO_ITEM') {
            console.log("Item is deleted");
            cleanList();
            cleanTextInput();
            generateToDos();
        }
        if (store.getState().lastAction.type === 'CREATE_TODO_ITEM') {
            console.log("Item is added");
            cleanList();
            generateToDos();
        }
    });
    function generateToDos () {
        const rootElem = document.querySelector('#list');
        const list = store.getState().toDoList;
        for (let toDo of list) {
            const elem = document.createElement('li');
            elem.setAttribute('id', toDo.id);
            const text = document.createTextNode(toDo.description);
            elem.appendChild(text);
            rootElem.appendChild(elem);
        }
    }

    function cleanList() {
        const rootElem = document.querySelector('#list');
        rootElem.innerHTML = '';
    }

    function cleanTextInput () {
        const textInput = document.querySelector('#todoid');
        textInput.value = '';
    }

    function addHandler(event){
        event.preventDefault();
        const textInput = document.querySelector('#addtodoid');
        const todo = textInput.value;
        const list = store.getState().toDoList;
        let lastId=1;
        if(list.length){
            lastId=list[list.length-1].id+1;
        }
        store.dispatch(createToDoItem(todo,'NOT_DONE',lastId));
        textInput.value='';
    }
    function clickHandler (event) {
        event.preventDefault();
        const textInput = document.querySelector('#todoid');
        const idToDelete = textInput.value;
        console.log(`Deleting ${idToDelete}`)
        store.dispatch(deleteToDoItem(parseInt(idToDelete)));
    }
    function unSubscribeReduxEvents(event) {
        event.preventDefault();
        unsubscribe();
        document.getElementById('delete').removeEventListener(clickHandler);
        document.getElementById('add').removeEventListener(addHandler);
        document.querySelector('#unsubscribe').removeEventListener(unSubscribeReduxEvents);
    }

    document.getElementById('delete').addEventListener('click', clickHandler);
    document.getElementById('add').addEventListener('click', addHandler);
    document.querySelector('#unsubscribe').addEventListener('click', unSubscribeReduxEvents);
})();
