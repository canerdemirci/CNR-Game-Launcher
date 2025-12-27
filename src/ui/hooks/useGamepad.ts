import { useEffect, useRef, useState } from 'react'

type ButtonState = {
    index: number
    name: ButtonName
    pressed: boolean
    value: number
    analog: boolean
}

type StickState = {
    x: number  // -1 (left) to 1 (right)
    y: number  // -1 (up) to 1 (down)
    direction: StickDirection
    magnitude: number
    isActive: boolean
}

export type StickDirection = 'neutral' | 'up' | 'down' | 'left' | 'right' | 
    'up-left' | 'up-right' | 'down-left' | 'down-right'

export type ButtonName = 'A' | 'B' | 'X' | 'Y' | 'LB' | 'RB' | 'LT' | 'RT' |
    'View' | 'Menu' | 'LS' | 'RS' | 'Up' | 'Down' | 'Left' | 'Right'

export function useGamepad() {
    const [connected, setConnected] = useState(false)
    const [buttons, setButtons] = useState<ButtonState[]>([])
    const [leftStick, setLeftStick] = useState<StickState>({
        x: 0, y: 0, direction: 'neutral', magnitude: 0, isActive: false
    })
    const [rightStick, setRightStick] = useState<StickState>({
        x: 0, y: 0, direction: 'neutral', magnitude: 0, isActive: false
    })
    
    const animationRef = useRef<number>(null)
    const DEAD_ZONE = 0.15
    
    // Xbox layout (most common fallback)
    const buttonMap = [
        'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
        'View', 'Menu', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right'
    ] as const
    
    const getStickDirection = (x: number, y: number): StickDirection => {
        const magnitude = Math.sqrt(x * x + y * y)
        
        if (magnitude < DEAD_ZONE) {
            return 'neutral'
        }
        
        // Normalize
        const normX = x / magnitude
        const normY = y / magnitude
        
        const angle = Math.atan2(normY, normX) * (180 / Math.PI)
        const adjustedAngle = angle < 0 ? angle + 360 : angle
        
        // 8-direction detection
        if (adjustedAngle >= 337.5 || adjustedAngle < 22.5) return 'right'
        if (adjustedAngle >= 22.5 && adjustedAngle < 67.5) return 'down-right'
        if (adjustedAngle >= 67.5 && adjustedAngle < 112.5) return 'down'
        if (adjustedAngle >= 112.5 && adjustedAngle < 157.5) return 'down-left'
        if (adjustedAngle >= 157.5 && adjustedAngle < 202.5) return 'left'
        if (adjustedAngle >= 202.5 && adjustedAngle < 247.5) return 'up-left'
        if (adjustedAngle >= 247.5 && adjustedAngle < 292.5) return 'up'
        if (adjustedAngle >= 292.5 && adjustedAngle < 337.5) return 'up-right'
        
        return 'neutral'
    }
    
    const updateSticks = (gamepad: Gamepad) => {
        if (gamepad.axes.length >= 4) {
            const leftX = gamepad.axes[0]
            const leftY = gamepad.axes[1]
            const rightX = gamepad.axes[2]
            const rightY = gamepad.axes[3]
            
            const leftMagnitude = Math.sqrt(leftX * leftX + leftY * leftY)
            const rightMagnitude = Math.sqrt(rightX * rightX + rightY * rightY)
            
            setLeftStick({
                x: leftX,
                y: leftY,
                direction: getStickDirection(leftX, leftY),
                magnitude: leftMagnitude,
                isActive: leftMagnitude > DEAD_ZONE
            })
            
            setRightStick({
                x: rightX,
                y: rightY,
                direction: getStickDirection(rightX, rightY),
                magnitude: rightMagnitude,
                isActive: rightMagnitude > DEAD_ZONE
            })
        } else if (gamepad.axes.length >= 2) {
            // Some controllers only have one stick
            const leftX = gamepad.axes[0]
            const leftY = gamepad.axes[1]
            const leftMagnitude = Math.sqrt(leftX * leftX + leftY * leftY)
            
            setLeftStick({
                x: leftX,
                y: leftY,
                direction: getStickDirection(leftX, leftY),
                magnitude: leftMagnitude,
                isActive: leftMagnitude > DEAD_ZONE
            })
        }
    }
    
    const checkGamepad = () => {
        const gamepads = navigator.getGamepads()
        const gamepad = gamepads[0] // First connected gamepad
        
        if (gamepad) {
            const buttonStates: ButtonState[] = []
            
            gamepad.buttons.forEach((button, index) => {
                const isPressed = typeof button === 'object' ? button.pressed : button
                const value = typeof button === 'object' ? button.value : (isPressed ? 1 : 0)
                
                buttonStates.push({
                    index,
                    name: buttonMap[index] as ButtonName || 'A' as ButtonName,
                    pressed: isPressed,
                    value,
                    analog: value !== 1.0 && value !== 0
                })
            })
            
            setButtons(buttonStates)
            updateSticks(gamepad)
        }
    }
    
    useEffect(() => {
        const handleGamepadConnected = (e: GamepadEvent) => {
            console.log('Gamepad connected:', e.gamepad.id)
            console.log('Axes count:', e.gamepad.axes.length)
            setConnected(true)

            const loop = () => {
                checkGamepad()
                animationRef.current = requestAnimationFrame(loop)
            }

            animationRef.current = requestAnimationFrame(loop)
        }
        
        const handleGamepadDisconnected = () => {
            setConnected(false)

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            
            // Reset stick states
            setLeftStick({ x: 0, y: 0, direction: 'neutral', magnitude: 0, isActive: false })
            setRightStick({ x: 0, y: 0, direction: 'neutral', magnitude: 0, isActive: false })
            setButtons([])
        }
        
        window.addEventListener('gamepadconnected', handleGamepadConnected)
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)
        
        // Initial check
        if (navigator.getGamepads()[0]) {
            handleGamepadConnected({ gamepad: navigator.getGamepads()[0]! } as GamepadEvent)
        }
        
        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnected)
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])
    
    // Helper to check if a specific button is pressed
    const isButtonPressed = (buttonName: ButtonName): boolean => {
        return buttons.some(btn => btn.name === buttonName && btn.pressed)
    }
    
    // Helper to check if stick is moved in a specific direction
    const isStickMoved = (stick: 'left' | 'right', direction: StickDirection): boolean => {
        const stickState = stick === 'left' ? leftStick : rightStick
        return stickState.isActive && stickState.direction === direction
    }
    
    // Helper to check if stick is moved in cardinal direction
    const isStickMovedCardinal = (stick: 'left' | 'right', direction: 'up' | 'down' | 'left' | 'right'): boolean => {
        const stickState = stick === 'left' ? leftStick : rightStick
        if (!stickState.isActive) return false
        
        switch (direction) {
            case 'up': return stickState.y < -DEAD_ZONE
            case 'down': return stickState.y > DEAD_ZONE
            case 'left': return stickState.x < -DEAD_ZONE
            case 'right': return stickState.x > DEAD_ZONE
            default: return false
        }
    }
    
    // Get stick movement as vector (for smooth movement)
    const getStickVector = (stick: 'left' | 'right') => {
        const stickState = stick === 'left' ? leftStick : rightStick
        
        if (!stickState.isActive) {
            return { x: 0, y: 0 }
        }
        
        // Apply radial dead zone correction
        const magnitude = Math.max(0, stickState.magnitude - DEAD_ZONE) / (1 - DEAD_ZONE)
        const normalizedX = (stickState.x / stickState.magnitude) * magnitude
        const normalizedY = (stickState.y / stickState.magnitude) * magnitude
        
        return { x: normalizedX, y: normalizedY }
    }
    
    return {
        connected,
        buttons,
        leftStick,
        rightStick,
        isButtonPressed,
        isStickMoved,
        isStickMovedCardinal,
        getStickVector
    }
}