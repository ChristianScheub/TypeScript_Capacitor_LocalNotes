
# LocalNotes

Last Edit: 12.2023 <br>
Language: Typescript React Capacitor<br>

This is a simple Typescript React application which is to be used as an iOS and Android app with the help of Capacitor. 
With it, it is possible to securely save notes locally with AES encryption, edit/delete them and search through them.

<br><br><br>

Deutsche Kurzbeschreibung:
Das ist eine einfache Typescript React Anwendung welche mithilfe von Capacitor anschließend als iOS sowie Android App verwendet werden soll. 
Mit ihr ist es möglich sicher Notizen mit einer AES Verschlüsselung lokal zu speichern, diese zu bearbeiten/löschen und zu durchsuchen.

| Start Screen | Notes Overview | Note Edit |
|--------------|----------------|-----------|
| <img src="startScreen.jpeg" alt="Start Screen" height="250"> | <img src="notesOverview.jpeg" alt="Notes Overview" height="250"> | <img src="editScreen.jpeg" alt="Note Edit" height="250"> |




## Testing
The Jest testing framework is used for testing.
The tests here are always written in Typescript. 

Under modules are modules from other projects of mine for which I have not written further tests. (Otherwise we would be almost at 100% test coverage ;) )

File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
-----------------------------------|---------|----------|---------|---------|---------------------
All files                          |   92.59 |    79.72 |   85.71 |   93.58 |                     
 src                               |   66.66 |       50 |     100 |   66.66 |                     
  App.tsx                          |     100 |       50 |     100 |     100 | 16                  
  index.tsx                        |       0 |      100 |     100 |       0 | 6-9                 
 src/custom_components             |      96 |    83.33 |    87.5 |      96 |                     
  encryption_modal.tsx             |   88.88 |       50 |   66.66 |   88.88 | 85                  
  navBar.tsx                       |     100 |      100 |     100 |     100 |                     
 src/custom_components/handleNotes |     100 |      100 |     100 |     100 |                     
  editNote.tsx                     |     100 |      100 |     100 |     100 |                     
  getNotes.ts                      |     100 |      100 |     100 |     100 |                     
  viewNote.tsx                     |     100 |      100 |     100 |     100 |                     
 src/modules/app_configuration     |     100 |      100 |     100 |     100 |                     
  app_texts.ts                     |     100 |      100 |     100 |     100 |                     
 src/modules/legal                 |   87.83 |    70.45 |   72.22 |   90.27 |                     
  codeToTextParser.tsx             |     100 |      100 |     100 |     100 |                     
  cookieConsentBanner.tsx          |   79.54 |    65.78 |   54.54 |   83.33 | 23,45,50,56,198-217 
  datenschutz.tsx                  |     100 |      100 |     100 |     100 |                     
  impressum.tsx                    |     100 |      100 |     100 |     100 |                     
 src/modules/ui                    |     100 |      100 |     100 |     100 |                     
  floatingBtn.tsx                  |     100 |      100 |     100 |     100 |                    

## Architecture
The components used are divided into two categories:
- `custom_components`: Components which I only use in this project. These are on the left and in the middle of the architecture diagram.
- `modules`: Components/functions that I also use in other projects, which are therefore kept generic. (Possibly, however, slightly adapted e.g. the colors here)  These components can be seen on the right of the architecture diagram. 

As a result of the use from the modules, there is also one configuration file:
- `app_texts`: Contains texts such as the description, imprint text, data protection text etc.

![Local Notes Architecture](/LocalNotesArchitecture.jpeg)
Note: The cookie banner and footer text are already present here as they may be used in the future for the web version.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
