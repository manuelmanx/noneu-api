
import request from 'supertest';
import AppModule from '../../../index';
import { wrapper } from '../../../models';
import dbService from '../../../services/db';
import { userStubModel } from '../../../tests/user.stub';

const userStub = userStubModel
const rq = request(AppModule);
var UserWrapper:any = undefined;
var user:any = undefined;
describe("responds to /auth/login",()=>{
    beforeAll(async()=>{
        /** Load the test database */
        await dbService.loadDatabase(true);
        /** Load the user collection wrapper */
        UserWrapper = new wrapper.user();
        /** Create a user for testing */
        user = await UserWrapper.create(userStub)
        return;
    })
    /** delete user already created for testing */
    afterAll(async()=>{
        return await UserWrapper.delete({email:userStub.email});
    })
    /** Test user login without verified email */
    it("Login without validating email", async()=>{
        const TokenWrapper = new wrapper.token()
        const refreshToken:any = await TokenWrapper.updateRefreshToken({email:user?.email||'', _id:user?._id||''}, user?._id||'');
        const res = await rq.post("/auth/token/refresh").send({refreshToken:refreshToken});
        /** check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** check the response status code */
        expect(res.statusCode).toBe(200);
        /** check the body response */
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toEqual(refreshToken);
    })
})