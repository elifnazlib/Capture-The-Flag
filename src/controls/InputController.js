// This handles: keyboard input.

export class InputController {
    constructor() {
        this.keys = {}

        window.addEventListener('keydown', (event) =>
        {
            this.keys[event.code] = true
        })

        window.addEventListener('keyup', (event) =>
        {
            this.keys[event.code] = false
        })
    }

    isKeyDown(key)
    {
        return this.keys[key]
    }
}