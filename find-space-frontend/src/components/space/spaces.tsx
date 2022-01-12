import { Component, ReactNode } from "react"
import {Space} from '../../models/model';
import { DataService } from "../../services/dataService";
import { SpaceComponent } from "./spaceComponent";
import { ConfirmModalComponent } from './confirmModalComponent'

interface SpacesState {
    spaces:Space[],
    showModal:boolean,
    modalContent:string
};

interface SpacesProps {
    dataService:DataService
};

export default class Spaces extends Component<SpacesProps,SpacesState>{

    constructor(props:SpacesProps){
        super(props);
        this.state={
            spaces:[],
            showModal:false,
            modalContent:''
        }
        this.reserveSpace=this.reserveSpace.bind(this);
        this.closeModal=this.closeModal.bind(this)
    }

    async componentDidMount(){
        const spaces=await this.props.dataService.getSpaces();
        this.setState({
            spaces:spaces
        });
    }

    private async reserveSpace(spaceId:string){
        const resered = await this.props.dataService.reserveSpace(spaceId);
        if(resered){
            this.setState({
                showModal:true,
                modalContent:`You reserved space id ${spaceId} and confimed number ${resered}`  
            })
        }else{
            this.setState({
                showModal:true,
                modalContent:`You can not reserve space id ${spaceId}`
            })
        }

    };

    private closeModal(){
        this.setState({
            showModal:false,
            modalContent:''
        })
    }
    private renderSpaces(){
        const rows:any[]=[];
        for (const space of this.state.spaces) {
            rows.push(
                <SpaceComponent 
                    spaceId={space.spaceId}
                    name={space.name}
                    location={space.location}
                    photoUrl={space.photoUrl}
                    reserveSpace={this.reserveSpace}
                />
            )
        }
        return rows;
    }
    render(): ReactNode {
        return <div>
            <h2>Welcome to the spaces page</h2>
            {this.renderSpaces()}
            <ConfirmModalComponent 
                show={this.state.showModal}
                content={this.state.modalContent}
                close={this.closeModal}
            />
        </div>
    }

}