import { Component, ReactNode } from "react";
import defaultImage from '../../assets/images/defaultBuilding.jpg';
import './spaceComponent.css'
interface SpaceComponentProps {
    spaceId:string,
    name:string,
    location:string,
    photoUrl?:string,
    reserveSpace:(spaceId:string)=>void
};

export class SpaceComponent extends Component <SpaceComponentProps> {

    private renderImage(){
        if (this.props.photoUrl) {
            return <img src={this.props.photoUrl} alt={this.props.name} />
        } else {
            return <img src={defaultImage} alt={this.props.name} />
        }
    }
    render(): ReactNode {
        return <div className="spaceComponent">
            {this.renderImage()}
            <label className="name">{this.props.name}</label><br/>
            <label className="spaceId">{this.props.spaceId}</label><br/>
            <label className="location">{this.props.location}</label><br/>
            <button onClick={()=>this.props.reserveSpace(this.props.spaceId)} >Reserve</button><br/>

        </div>
    }
}