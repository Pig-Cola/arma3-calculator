const StrictMode = await import( 'react' ).then( ( { StrictMode } ) => StrictMode )
const createRoot = await import( 'react-dom/client' ).then( ( { createRoot } ) => createRoot )
const App = await import( './App' ).then( ( { default: App } ) => App )

import './styles/tailwind.css'
import './styles/variables.scss'

createRoot( document.getElementById( 'root' )! ).render( <StrictMode>{<App />}</StrictMode> )
