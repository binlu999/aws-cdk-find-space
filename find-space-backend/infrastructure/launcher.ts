import {SpaceStack} from './spaceStack';
import { App } from 'aws-cdk-lib';

const app = new App();

new SpaceStack(app , 'Space-finder',
{
    stackName:"SpaceFinder"
})
