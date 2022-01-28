import { ICreateSpaceState } from './../components/space/createSpace';
import { Space } from './../models/model';
import {Config as AppConfig} from './config';
import {S3,config} from 'aws-sdk';
import {generateRandomId} from '../utils/utils';

config.update({
    region:AppConfig.REGION
})
export class DataService{
    public async getSpaces():Promise<Space[]>{
        const requestURL = AppConfig.api.spaceURL;
        const requestResult= await fetch(
            requestURL,{
                method:'GET'
            }
        );
        const responseJSON=await requestResult.json();
        console.log(JSON.stringify(responseJSON));
        return responseJSON;
    }

    public async reserveSpace(spaceId:string):Promise<string|undefined>{
        if(spaceId === '1234'){
            return "555";
        }else{
            return undefined;
        }
    }

    public async createSpace(createSpace:ICreateSpaceState) :Promise<string> {
        if(createSpace.photo){
            const photoURL = await this.uploadPublicFile(createSpace.photo,AppConfig.PHOTO_BUCKET);
            createSpace.photoURL=photoURL;
            createSpace.photo=undefined;
        }
        const requestURL=AppConfig.api.spaceURL;
        const requestOptions:RequestInit = {
            method:'POST',
            body:JSON.stringify(createSpace)
        };
        const result=await fetch(requestURL,requestOptions);
        console.log(result);
        const resultJson=await result.json();
        console.log(resultJson);
        return JSON.stringify(resultJson.spaceid);
    }

    private async uploadPublicFile(file:File, bucket:string) {
        const fileName=generateRandomId()+ file.name;
        try {
            const s3Client=new S3({
                region:AppConfig.REGION
            });
            const uploadResult = await s3Client.upload({
                Bucket:bucket,
                Key:fileName,
                Body:file,
                ACL:'public-read'
            }).promise();
            return uploadResult.Location;
        } catch (error) {
            throw error;
        }
    }
}