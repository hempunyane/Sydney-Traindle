import React from 'react';
import styled from 'styled-components';

export class PieIconGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }
    
    angleToCoords(angle, isSmall){
        let size = 0
        if (isSmall) {
            size = 40
        }
        else {
            size = 100
        }
        const x0 = size / 2;
        const y0 = size / 2;
    
        // Adjust angle: 0° is up, increasing clockwise
        const rad = ((angle % 360) - 90) * Math.PI / 180;
    
        const dx = Math.cos(rad);
        const dy = Math.sin(rad);
    
        let tValues = [];
    
        // Avoid division by zero
        if (dx !== 0) {
            const tLeft = (0 - x0) / dx;
            const tRight = (size - x0) / dx;
            tValues.push(tLeft, tRight);
        }
    
        if (dy !== 0) {
            const tTop = (0 - y0) / dy;
            const tBottom = (size - y0) / dy;
            tValues.push(tTop, tBottom);
        }
    
        // Find first valid intersection point
        const validPoints = tValues
            .filter(t => t > 0)
            .map(t => [x0 + t * dx, y0 + t * dy])
            .filter(([x, y]) => x >= 0 && x <= size && y >= 0 && y <= size)
            .map(([x, y]) => [Math.floor(x), Math.floor(y)]);
    
        return validPoints[0] || null;
    }

    roundUpToNextCorner(angle) {
        const offsetAngle = (angle - 45 + 360) % 360;
        const rounded = Math.ceil(offsetAngle / 90) * 90;
        return (rounded + 45) % 360;
    }

    //takes arguments: canvas to clip, corner radius 
    clipRoundedRect(ctx, radius) {
        let margin = 0
        if (this.props.isSmall){
            margin = 2.5
        }
        else {
            margin = 5;
        }
        const x = margin;
        const y = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;
      
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        const colours = {
            "T1": `rgb(246, 145, 16)`,
            "T2": `rgb(8, 151, 209)`,
            "T3": `rgb(242, 93, 27)`,
            "T4": `rgb(30, 86, 168)`,
            "T5": `rgb(196, 17, 144)`,
            "T7": `rgb(105, 124, 138)`,
            "T8": `rgb(10, 150, 73)`,
            "T9": `rgb(210, 26, 45)`,
            "M1": `rgb(0, 150, 159)`
        } 
    
        // Set canvas dimensions
        if (this.props.isSmall){
            canvas.width = 40
            canvas.height = 40
        }
        else {
            canvas.width = 100
            canvas.height = 100
        }

        //add 'border-radius'
        if (this.props.isSmall){
            this.clipRoundedRect(ctx, 5)
        }
        else {
            this.clipRoundedRect(ctx, 10)
        }
        let middleCoords = []
        if (this.props.isSmall){
            middleCoords = [20, 20]
        }
        else {
            middleCoords = [50, 50]
        }

        // Background
        let angle = 0
        let angleIncrement = 360/this.props.lines.length
        for (let i = 0; i < this.props.lines.length; i++){
            ctx.fillStyle = colours[this.props.lines[i]]
            ctx.beginPath()
            ctx.moveTo(...middleCoords)
            ctx.lineTo(...this.angleToCoords(angle, this.props.isSmall))
            let cornerAngle = this.roundUpToNextCorner(angle)
            ctx.lineTo(...this.angleToCoords(cornerAngle, this.props.isSmall))
            if ((angle+angleIncrement-cornerAngle) > 90){
                ctx.lineTo(...this.angleToCoords(this.roundUpToNextCorner(angle+angleIncrement-90), this.props.isSmall))
            }
            ctx.lineTo(...this.angleToCoords(angle+angleIncrement, this.props.isSmall))
            ctx.fill()
            angle = angle+angleIncrement
        }

        //Lines
        angle = 0
        ctx.strokeStyle = 'rgb(255, 255, 255)'
        if (this.props.isSmall){
            ctx.lineWidth = 2
        }
        else {
            ctx.lineWidth = 4
        }
        for (let i = 0; i < this.props.lines.length; i++){
            ctx.beginPath()
            ctx.moveTo(...middleCoords)
            ctx.lineTo(...this.angleToCoords(angle, this.props.isSmall))
            ctx.stroke()
            ctx.closePath()
            angle = angle+angleIncrement
        }
    
        // Text
        if (!this.props.isSmall){
            let fontSizes = {
                1: "0",
                2: "30",
                3: "25",
                4: "25",
                5: "15",
                6: "15",
                7: "15"
            }
    
            let fontSize = fontSizes[this.props.lines.length]
            let textDistance = 0.5
            if (this.props.lines.length > 4){
                textDistance = 0.666
            }
    
            //waits for fonts to be loaded
            document.fonts.load('bold ' + fontSize + 'px "Public Sans"').then(() => {
                ctx.font = 'bold ' + fontSize + 'px "Public Sans"';
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
            
                let angle = angleIncrement / 2;
            
                for (let i = 0; i < this.props.lines.length; i++) {
                    let coords = this.angleToCoords(angle, this.props.isSmall);
                    coords[0] = (coords[0] - 50) * textDistance + 50;
                    coords[1] = (coords[1] - 50) * textDistance + 50;
                    ctx.fillText(this.props.lines[i], coords[0], coords[1]);
                    angle += angleIncrement;
                }
            });
        }
    }
    
    render() {
        return (
          <canvas ref={this.canvasRef}/>
        );
    }
}

export class TrainlinePopout extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showPopout: false
        }
    }

    calcHeight(){
        if (this.props.trainlines.length === 1){
            return '40px'
        }
        if (this.props.trainlines.length === 2){
            return '87.5px' 
        }
        return '135px'
    }

    makeContainer(){
        let trainlines = []
        for (let i = 0; i < this.props.trainlines.length; i ++){
            trainlines.push(
                <img className="popout-trainline-img" src={"./Trainlines/"+this.props.trainlines[i]+".svg"}></img>
            )
        }

        const PopoutTrainlineContainer = styled.div`
            display: grid;
            grid-auto-flow: column;
            grid-template-rows: repeat(3, 40px);
            gap: 7.5px;
            padding: 7.5px;
            border-radius: 10px;
            align-content: start;
            height: ${({ height }) => height};
        `;

        return <PopoutTrainlineContainer className={"shadow "+this.props.colour} height={this.calcHeight()}>
            {trainlines}
        </PopoutTrainlineContainer>
    }

    updatePopout = (show) => {
        if (show) {
            this.setState({
                showPopout: true
            })
        }
        else {
            this.setState({
                showPopout: false
            })
        }
    }

    calcLeftDist() {
        let width = -95;
        const count = this.props.trainlines.length;
    
        if (count > 3) {
            const extraGroups = Math.ceil((count - 3) / 3);
            width -= 47.5 * extraGroups;
        }
    
        return width + 'px';
    }

    render(){
        if (this.state.showPopout) {
            const PopoutContainer = styled.div`
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: -180px;
                left: ${({ left}) =>left};
            `;

            return <PopoutContainer left={this.calcLeftDist()}>
                {this.makeContainer()}
                <div className={"triangle "+this.props.colour}></div>
            </PopoutContainer>
        }
        return null
    }
}

export class BarDisplay extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showPopout: true
        }
    }

    createColourCombination(trainlines){
        if (!trainlines){
            return
        }
        const BarColour = styled.div`
                width: 11.11111111111111%;
                height: 100%;
                background-color: ${({ colour }) => colour};
        `
        const colours = {
            "T1": `rgb(246, 145, 16)`,
            "T2": `rgb(8, 151, 209)`,
            "T3": `rgb(242, 93, 27)`,
            "T4": `rgb(30, 86, 168)`,
            "T5": `rgb(196, 17, 144)`,
            "T7": `rgb(105, 124, 138)`,
            "T8": `rgb(10, 150, 73)`,
            "T9": `rgb(210, 26, 45)`,
            "M1": `rgb(0, 150, 159)`
        } 
        let selectedColourDivs = []
        for (let i = 0; i < trainlines.length; i++){
            selectedColourDivs.push(
                <BarColour key={i} colour={colours[trainlines[i]]}/>
            )
        }
        return selectedColourDivs
    }

    render(){
        if (this.state.showPopout) {
            const BarContainer = styled.div`
                display: flex;
                position: absolute;
                align-items: center;
                height: 6px;
                width: 100%;
                bottom: 0;
            `;

            return <BarContainer>
                {this.createColourCombination(this.props.trainlines)}
            </BarContainer>
        }
        return null
    }
}

export class BoxDisplay extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        
    }
}