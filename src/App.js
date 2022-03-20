import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import StartScreen from './components/StartScreen';
import Question from './components/Question';

const apiUrl = 'https://opentdb.com/api.php?amount=10&category=16&difficulty=\
medium&type=multiple'

export default function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)

  const parser = new DOMParser();

  function parseProps(stringToParse) {
    return parser
      .parseFromString(`<!doctype html><body>${stringToParse}`,
        'text/html')
      .body.textContent
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function createAnswers(question) {
    let answers = []
    question.incorrect_answers.forEach(answer => {
      answers.push({
        answer: parseProps(answer.trim()),
        isSelected: false,
        isCorrect: false
      })
    })
    answers.push({
      answer: parseProps(question.correct_answer.trim()),
      isSelected: false,
      isCorrect: true
    })
    shuffleArray(answers)
    return answers
  }

  function selectAnswer(event, questionText) {
    const currentQuestion = questions.filter(question => question.question ===
      questionText)[0]
    const prevAnswer = currentQuestion.answers.filter(answer =>
      answer.isSelected)[0]
    const selectedAnswer = currentQuestion.answers.filter(answer =>
      answer.answer === event.target.innerText)[0]

    if (prevAnswer && prevAnswer.isCorrect) {
      setScore(prevScore => prevScore - 1)
    } else if (selectedAnswer.isCorrect) {
      setScore(prevScore => prevScore + 1)
    }

    setQuestions(prevQuestions => prevQuestions.map(question => {
      return (
        question.question === questionText ?
          {
            ...question,
            answers: question.answers.map(answer =>
              answer.answer === event.target.innerText ?
                {
                  ...answer,
                  isSelected: true,
                } :
                {
                  ...answer,
                  isSelected: false
                }
            )
          } :
          question
      )
    }
    ))
  }

  function renderQuestions() {
    return questions.map(question =>
      <Question
        questionText={question.question}
        answers={question.answers}
        selectAnswer={(event) => selectAnswer(event, question.question)}
        gameEnded={gameEnded}
        key={nanoid()} />)
  }

  function endGame() {
    if (!questions.every(question => question.answers
      .filter(answer => answer.isSelected).length != 0)) {
      alert('Please answer  on all questions')
      return
    }
    setGameEnded(true)
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }

  useEffect(
    () => {
      if (gameStarted) {
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => setQuestions(
            data.results.map(question => ({
              ...question,
              question: parseProps(question.question),
              answers: createAnswers(question)
            })
            )
          )
          )
      }
    }, [gameStarted]
  )

  function restart() {
    setGameStarted(false)
    setGameEnded(false)
    setScore(0)
  }

  return (
    <main className='app'>
      {!gameStarted &&
        <StartScreen startGame={() => setGameStarted(true)} />
      }
      {gameStarted &&
        <div className='app--question-list'>{renderQuestions()}
        </div>
      }
      {!gameEnded && gameStarted &&
        <button className='app--btn' onClick={endGame}>Check answers</button>
      }
      {gameEnded && gameStarted &&
        <div className='app--score'>
          <p>You scored {score}/{questions.length} correct answers</p>
          <button
            className='app--btn'
            onClick={restart}>
            Play again
          </button>
        </div>
      }
    </main>
  );
}