```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Selain siirtyy suorittamaan spa.js-tiedoston takaisinkutsufunktiota

    Note right of browser: Selain tyhjentää input-kentän ja lisää uuden muistiinpanon sivulle

    Note right of browser: Takaisinkutsufunktio saa selaimen tekemään POST-pyynnön uuden muistiin panon lisäämiseksi palvelimelle

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server

    Note left of server: Palvelin lisää uuden muistiinpanon muistiinsa
    
    server->>browser: HTTP vastaus (Statuskoodi: 201 Created)
    deactivate server
```