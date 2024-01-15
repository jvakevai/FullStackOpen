0.4: Uusi muistiinpano

```mermaid

sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: Browser sends a POST request to server
    browser->>server: POST note="fsdfksdfk" to https://studies.cs.helsinki.fi/exampleapp/new_note as a form
    activate server
    Note left of server: server handles and saves the data of the form and requests the browser to redirect to "/notes"
    server-->>browser: Server redirects to https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "fsdfksdfk", "date": "2024-01-09T08:52:29.323Z"} ... ]
    deactivate server    

    Note right of browser: The browser executes the callback function that renders the notes 

```
***
0.5: Single Page App

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [  { "content": "...........", "date": "2024-01-09T09:45:52.258Z" }... ]
    deactivate server    

    Note right of browser: The browser executes the callback function that renders the notes 

```
***
0.6: Uusi muistiinpano
```mermaid

sequenceDiagram
    participant browser
    participant server
    Note right of browser: Browser sends a JSON formatted POST request to the server
    browser->>server: POST note = {"content":"noi","date":"2024-01-09T12:10:38.809Z"} to https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: The server receives a JSON formatted note that includes content and date
    server-->>browser: 201 created
    Note left of server: The server sends status code 201 created, i.e. a note has been created
    deactivate server
    

```
