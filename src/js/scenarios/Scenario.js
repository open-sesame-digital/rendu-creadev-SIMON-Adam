import Scene from "../canvas/Scene"
import { deg2rad } from "../utils/MathUtils"
import { RotatingArc } from "../canvas/shapes/arcs"

const drawLine = (context, x, y, length, angle) => {
    context.save()
    context.beginPath()

    // offset + rotate
    context.translate(x, y)
    context.rotate(angle) // ! radian

    // draw line
    context.moveTo(-length / 2, 0)
    context.lineTo(length / 2, 0)
    context.stroke()

    context.closePath()
    context.restore()
}

export default class Scenario extends Scene {
    constructor(id) {
        super(id)

        // gradations
        this.drawGradation()

        // arcs
        this.arcs = []
        this.nArcs = 10
        for (let i = 0; i < this.nArcs; i++) {
            const arc_ = new RotatingArc(
                this.width / 2,
                this.height / 2,
                this.mainRadius + (i - this.nArcs / 2) * this.deltaRadius,
                i != 0 && i != this.nArcs - 1 ? deg2rad(Math.random() * 360) : 0,
                i != 0 && i != this.nArcs - 1 ? deg2rad(Math.random() * 360) : deg2rad(360)
            )
            this.arcs.push(arc_)
        }

        // debug
        this.params['line-width'] = 2
        this.params.speed = 1
        this.params.color = "#ffffff"
        if (this.debug.active) {
            this.debugFolder.add(this.params, 'line-width', 1, 10).onChange(() => this.drawUpdate())
            this.debugFolder.add(this.params, 'speed', -2, 2, .25)
            this.debugFolder.addColor(this.params, 'color')
        }
    }

    resize() {
        super.resize()

        // main dimensions
        this.mainRadius = this.width < this.height ? this.width : this.height
        this.mainRadius *= .5
        this.mainRadius *= .65
        this.deltaRadius = this.mainRadius * .075

        // shapes update
        if (!!this.arcs) {
            this.arcs.forEach((e, index) => {
                e.x = this.width / 2
                e.y = this.height / 2
                e.radius = this.mainRadius + (index - this.arcs.length / 2) * this.deltaRadius
            })
        }

        // refresh
        this.drawUpdate()
    }

    update() {
        if (!super.update()) return
        this.drawUpdate()
    }

    // drawUpdate() {
    //     this.clear()

    //     // style
    //     this.context.lineCap = 'round'
    //     this.context.strokeStyle = this.params.color
    //     this.context.lineWidth = this.params['line-width']

    //     // draw
    //     this.drawGradation()
    //     if (!!this.arcs) {
    //         this.arcs.forEach(arc => {
    //             if (this.params["is-update"]) arc.update(this.globalContext.time.delta / 1000, this.params.speed)
    //             arc.draw(this.context)
    //         })
    //     }
    // }

    drawUpdate() {
        this.clear();
        this.drawClockHands();
    }

    drawGradation() {
        const nGradation_ = 12
        for (let i = 0; i < nGradation_; i++) {
            const angle_ = 2 * Math.PI * i / nGradation_ + Math.PI / 2
            const x_ = this.width / 2 + (this.mainRadius - this.deltaRadius / 2) * Math.cos(angle_)
            const y_ = this.height / 2 + (this.mainRadius - this.deltaRadius / 2) * Math.sin(angle_)
            const length_ = this.deltaRadius * (this.nArcs - 1)
            drawLine(this.context, x_, y_, length_, angle_)
        }
    }
}