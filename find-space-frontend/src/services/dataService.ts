import { Space } from './../models/model';

export class DataService{
    public async getSpaces():Promise<Space[]>{
        const result:Space[]=[];
        result.push({
            spaceId:"123",
            name:"name 1",
            location:"location 1",
        });
        result.push({
            spaceId:"1232",
            name:"name 2",
            location:"location 2",
            photoUrl:"https://cdn.cnn.com/cnnnext/dam/assets/210108101156-22-us-capitol-riots-0106-medium-plus-169.jpg"
        });
        result.push({
            spaceId:"1233",
            name:"name 3",
            location:"location 3",
        });
        result.push({
            spaceId:"1234",
            name:"name 4",
            location:"location 4",
        });
        return result;
    }

    public async reserveSpace(spaceId:string):Promise<string|undefined>{
        if(spaceId === '1234'){
            return "555";
        }else{
            return undefined;
        }
    }
}