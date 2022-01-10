import { Component, ReactNode } from "react"
import './confirmModalComponent.css';

interface ConfirmModalComponentProp{
    show:boolean,
    content:string,
    close:()=>void
}
export class ConfirmModalComponent extends Component<ConfirmModalComponentProp>{

    render(): ReactNode {
        if (!this.props.show) {
            return null;
        } else {
            return <div className="modal">
                <div className="modal-content">
                    <h2>You tried to reserve and ...</h2>
                    <h3 className="modalText">{this.props.content}</h3>
                    <button onClick={()=>this.props.close()}>Ok. Close</button>
                </div>
            </div>
        }
    }
}