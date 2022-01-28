const apiEndPoint='https://z9ym4hobkb.execute-api.us-east-1.amazonaws.com/prod/';
export const Config = {
    REGION:'us-east-1',
    USER_POOL_ID:'us-east-1_PsL2fDE44',
    APP_CLIENT_ID:'6n65p0532shng7hjuo9lhlh6j2',
    IDENTITY_POOL_ID:'us-east-1:90f61513-6cb6-41ac-a722-f2ee20bce693',
    PHOTO_BUCKET:'space-photos-1216df61bb73',
    api:{
        baseURL:apiEndPoint,
        spaceURL:`${apiEndPoint}spaces`
    },
    TEST_USER_NAME:'findspaceapp',
    TEST_USER_PASSWORD:'zaq1@WSX'
}