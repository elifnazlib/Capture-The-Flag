export function createScoreUI() {
    const scoreElement = document.createElement('div')

    scoreElement.style.position = 'absolute'
    scoreElement.style.top = '20px'
    scoreElement.style.left = '20px'
    scoreElement.style.color = 'white'
    scoreElement.style.fontSize = '24px'
    scoreElement.style.fontFamily = 'Arial'

    scoreElement.textContent = 'Score: 0'

    document.body.appendChild(scoreElement)

    return scoreElement
}