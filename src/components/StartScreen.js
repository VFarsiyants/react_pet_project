import './StartScreen.css'

export default function StartScreen(props) {
    return (
        <div className='start-screen'>
            <h1 className='start-screen--header'>Quizzical</h1>
            <p className='start-screen--description'>
                Let's check your knowledge about tabletop games. You are going
                to be asked 10 questions; try to provide correct answers.
            </p>
            <button
                className='start-screen--button'
                onClick={props.startGame}
            >Start quiz</button>
        </div>
    )
}