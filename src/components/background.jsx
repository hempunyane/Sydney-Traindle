import React from 'react'
import {motion} from 'framer-motion'
import {rails1} from "../helper/RailSVGNodes.js";
import {rails2} from "../helper/RailSVGNodes.js";

const randSeed = Math.floor(Math.random()*100)
const today = new Date()

function getCurrentDaySeed(index) { 
    let seed = today.getDate()+today.getMonth()+today.getFullYear()+(index*1000)
    return (Math.sin(10000*(seed+randSeed))/2)+0.5
}

class Train extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            color: Math.floor(Math.random() * 3),
            rotation: 2, //int from 0-7 for clockwise rotation (0 is top)
            posNodes: [[0,0], [0,0], [0,0]],  //previous location node XY, current, next (relative to svg)
            bgTile: [0,0] //XY of background tile train is displayed on
        }
    }    
    
    getRandomNode(railObject) {
        //get the nodes from the map
        const nodes = railObject.nodes;
        if (nodes.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * nodes.length);
        return nodes[randomIndex];
    }
    
    getRandomConnectedNode(node, graph) {
        //find edges connected to the input node
        const connectedEdges = graph.edges.filter(edge => 
            edge.from === node.id || edge.to === node.id
        );
    
        if (connectedEdges.length === 0) {
            return null;
        }
    
        //get connected node ids
        const connectedNodeIds = connectedEdges.map(edge => 
            edge.from === node.id ? edge.to : edge.from
        );
    
        //pick node from list of connected nodes at random
        const randomNodeId = connectedNodeIds[Math.floor(Math.random() * connectedNodeIds.length)];
        return graph.nodes.find(n => n.id === randomNodeId) || null;
    }
    
    getNodeDirection(currentNode, targetNode) {
        //calculate vector from currentNode to targetNode
        const dx = targetNode.x - currentNode.x;
        const dy = currentNode.y - targetNode.y; //flipped for inverted coordinates
        
        //calculate the angle
        let angle = Math.atan2(dx, dy) * (180 / Math.PI);
        
        //normalize to 360deg
        angle = (angle + 360) % 360;
        
        //map angle to 8 directions
        const direction = Math.round(angle / 45) % 8;
        return direction;
    }
    
    setStartingPos() {
        //gets random tile on the screen and saves to bgTile
        this.state.bgTile = [Math.floor(Math.random()*5), 
        Math.floor(Math.random()*Math.ceil(this.state.height/(this.state.width*0.2)))] 

        //get background seed to find correct bg image
        let tileSeed = getCurrentDaySeed(this.state.bgTile[1]*5+this.state.bgTile[0]) 

        //turns correct svg into graph of nodes representing rails
        let railGraph = tileSeed >= 0.5 ? rails1 : rails2

        //set get and set positions of random node and node connected to random node
        let currentNode = this.getRandomNode(railGraph)
        let nextNode = this.getRandomConnectedNode(currentNode, railGraph)
        
        //update state with relevant nodes and rotation
        this.state.posNodes = [[null,null], [currentNode.x, currentNode.y], [nextNode.x, nextNode.y]]
        this.state.rotation = this.getNodeDirection(currentNode, nextNode)
    }
    
    getTrainImage() {
        return <img src={"/Trains/"+this.state.color+"/"+this.state.rotation+".svg"}></img>
    }
    
    updateDimensions = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }
    
    componentDidMount() {
        //listen for window resizes
        window.addEventListener("resize", this.updateDimensions)
    }
    
      
    componentWillUnmount() {
        //listen for resizes
        window.removeEventListener("resize", this.updateDimensions)
    
        //clear interval when the component unmounts
        clearInterval(this.interval)
    }

    scaleCoordinate(value, svgSize) {
        let scaleFactor = this.state.width / (5*svgSize); //scale svg img size to 1/5 of pageWidth
        return value * scaleFactor;
    }

    render() {
        this.setStartingPos()
        //position of tile top left on screen
        let xTilePos = this.state.bgTile[0]*(this.state.width*0.2)
        let yTilePos = this.state.bgTile[1]*(this.state.width*0.2)
        //position of train relative to top left of tile scaled by view width
        let xRailOffset = this.scaleCoordinate(this.state.posNodes[1][0], 500)
        let yRailOffset = this.scaleCoordinate(this.state.posNodes[1][1], 500)
        //render train at position
        return <motion.div className="train" style={{
            x: xTilePos+xRailOffset-this.state.width*0.0125, 
            y: yTilePos+yRailOffset-this.state.width*0.0125
        }}> {this.getTrainImage()} </motion.div>
    }
}

class Background extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    updateDimensions = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions)
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions)
    }

    render() {
        let width = document.documentElement.clientWidth
        let height = document.documentElement.clientHeight
        let images = []
        for (let i = 0; i < Math.ceil(height/(width*0.2))*5; i++){
            if (getCurrentDaySeed(i) >= 0.5){
                images.push(<img src='/Rails/rails.svg' className="background" key={"bg-tile-"+i}></img>)
            }
            else {
                images.push(<img src='/Rails/rails2.svg' className="background" key={"bg-tile-"+i}></img>)
            }
        }
        return <div className="background-container">
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            <Train/>
            {images}
        </div>
    }
  }

export default Background