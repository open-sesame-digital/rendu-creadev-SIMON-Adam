import GlobalContext from "../GlobalContext";
import DomElement from "../utils/DomElement";
import { deg2rad } from "../utils/MathUtils";

export default class Scene {
    constructor(id = "canvas-scene") {
        this.id = id;
        this.globalContext = new GlobalContext();
        this.globalContext.pushScene(this);

        // debug
        this.params = {
            'is-update': true
        };
        this.debug = this.globalContext.debug;
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(this.id);
            this.debugFolder.add(this.params, 'is-update');
        }

        // canvas
        this.domElement = new DomElement(id);
        this.canvas = this.domElement.instance;
        this.context = this.canvas.getContext('2d');
        this.resize();

        // Event listeners for interactivity
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    }

    get width() { return this.domElement.width }
    get height() { return this.domElement.height }
    get position() { return this.domElement.position }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    update() {
        return this.params['is-update'];
    }

    resize() {
        this.domElement.setSize();
        this.canvas.width = this.domElement.width * this.globalContext.windowSize.pixelRatio; // set dimensions
        this.canvas.height = this.domElement.height * this.globalContext.windowSize.pixelRatio;
        this.context.scale(this.globalContext.windowSize.pixelRatio, this.globalContext.windowSize.pixelRatio);
    }

    destroy() { }

    drawClockHands() {
        this.clear();

        // Calculate the center of the canvas
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Save the current state of the canvas context
        this.context.save();

        // Translate the context to the center of the canvas
        this.context.translate(centerX, centerY);

        // Draw the clock face
        this.drawClockFace();

        // Draw the hour marks
        this.drawHourMarks();

        // Draw the numbers
        this.drawNumbers();

        // Draw the clock hands
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Calculate positions for hours, minutes, and seconds hands
        const hourHandPosition = this.calculateHandPosition(hours, 12, 360);
        const minuteHandPosition = this.calculateHandPosition(minutes, 60, 360);
        const secondHandPosition = this.calculateHandPosition(seconds, 60, 360);

        // Draw the hands
        this.drawHand(hourHandPosition, 100 * (320 / 200), 'white');
        this.drawHand(minuteHandPosition, 150 * (320 / 200), 'blue');
        this.drawHand(secondHandPosition, 320, 'red');

        // Restore the original state of the canvas context
        this.context.restore();
    }

    drawClockFace() {
        this.context.beginPath();
        this.context.arc(0, 0, 350, 0, 2 * Math.PI); // Increase the radius to 150
        this.context.strokeStyle = 'green'; // Change the color to green
        this.context.lineWidth = 5;
        this.context.stroke();
    }

    drawHourMarks() {
        for (let i = 0; i < 12; i++) {
            this.context.beginPath();
            this.context.moveTo(0, -320); // Start at the edge of the clock face
            this.context.lineTo(0, -330); // End slightly outside the clock face
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 2;
            this.context.stroke();
            this.context.rotate(Math.PI / 6); // Rotate by 30 degrees for the next mark
        }
    }

    drawNumbers() {
        const romanianNumbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const radius = 380; // Adjust this value based on your clock face radius

        this.context.save();

        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI / 6) - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            const romanianNumber = romanianNumbers[i];

            this.context.beginPath();
            switch (romanianNumber) {
                // Your existing switch cases for drawing numbers
            }

            this.context.strokeStyle = 'white';
            this.context.lineWidth = 2;
            this.context.stroke();
        }

        this.context.restore();
    }

    calculateHandPosition(value, maxValue, totalDegrees) {
        const degreesPerUnit = totalDegrees / maxValue;
        return (value * degreesPerUnit) - 90; // Subtract 90 to align the 0 position with the top of the clock
    }

    drawHand(angle, length, color) {
        this.context.save();
        this.context.beginPath();
        this.context.rotate(angle * Math.PI / 180); // Convert angle to radians
        this.context.moveTo(0, 0);
        this.context.lineTo(0, -length);
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Shadow color
        this.context.lineWidth = 7; // Adjust the line width for the shadow
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.rotate(angle * Math.PI / 180); // Convert angle to radians again
        this.context.moveTo(0, 0);
        this.context.lineTo(0, -length);
        this.context.strokeStyle = color;
        this.context.lineWidth = 5;
        this.context.stroke();
        this.context.restore();
    }

    // Interactivity methods
    handleMouseDown(event) {
        this.isMouseDown = true;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    handleMouseMove(event) {
        if (!this.isMouseDown) return;
        const dx = event.clientX - this.mouseX;
        const dy = event.clientY - this.mouseY;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.updateHands(dx, dy);
    }

    handleMouseUp() {
        this.isMouseDown = false;
    }

    updateHands(dx, dy) {
        // Update the hands based on the mouse movement
        // This is a simplified example. You'll need to calculate the new angles based on the mouse movement.
        // You might also want to add some logic to ensure the hands don't move outside the clock face.
        const hourHandAngle = this.hourHandAngle + dx * 0.01; // Adjust the multiplier as needed
        const minuteHandAngle = this.minuteHandAngle + dy * 0.01; // Adjust the multiplier as needed
        this.drawHand(hourHandAngle, 100 * (320 / 200), 'white');
        this.drawHand(minuteHandAngle, 150 * (320 / 200), 'blue');
    }
}