import "./Question.css"
import { nanoid } from "nanoid"

export default function Question(props) {

    const parser = new DOMParser();

    function parseProps(stringToParse) {
        return parser
            .parseFromString(`<!doctype html><body>${stringToParse}`,
                'text/html')
            .body.textContent
    }

    function renderAnswer(answer) {
        let answerClass = "question--answer-btn"
        if (answer.isCorrect && props.gameEnded) {
            answerClass = "question--answer-btn question--answer-btn-correct"
        } else if (answer.isSelected && !answer.isCorrect && props.gameEnded) {
            answerClass = "question--answer-btn question--answer-btn-incorrect"
        } else if (answer.isSelected) {
            answerClass = "question--answer-btn question--answer-btn-selected"
        } else if (props.gameEnded) {
            answerClass = "question--answer-btn \
            question--answer-btn-not-selected"
        }
        return (
            <button
                className={answerClass}
                key={nanoid()}
                onClick={props.gameEnded ? () => { } : props.selectAnswer}
            >
                {parseProps(answer.answer)}
            </button>
        )
    }

    function renderAnswers(answers) {
        return (answers.map(
            answer => renderAnswer(answer)
        ))
    }

    return (
        <div className="question">
            <h2 className="question--text">{parseProps(props.questionText)}</h2>
            <div className="question--answers">
                {renderAnswers(props.answers)}
            </div>
        </div>
    )
}