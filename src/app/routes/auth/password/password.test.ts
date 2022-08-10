
import request from 'supertest';
import AppModule from '../../../index';
import { wrapper } from '../../../models';
import dbService from '../../../services/db';
import {userStubModel} from '../../../tests/user.stub';

const userStub = userStubModel
const rq = request(AppModule); 
var token: any = undefined;
var UserWrapper:any= undefined;
var TokenWrapper = undefined;

describe("responds to /auth/password",()=>{
    beforeAll(async()=>{
        /** Load the test database */
        await dbService.loadDatabase(true);
        /** Load the collections wrapper */
        UserWrapper = new wrapper.user();
        TokenWrapper = new wrapper.token();
        /** Create a user for testing */
        const user = await UserWrapper.create(userStub)
        /** Create a new auth token */
        token = await TokenWrapper.generateAccessToken({email:user?.email||'', _id: user?._id||''})
        return;
    })
    /** delete user already created for testing */
    afterAll(async()=>{
        return await UserWrapper.delete({email:userStub.email});
    })
    /** Test the changing password route */
    it("Change password", async()=>{
        /** define the new password */
        const newPassword = "TestAfterChangePassword01"
        /** ask for password change to the endpoint */
        const res = await rq.post('/auth/password/change').send({password:newPassword}).set({ Authorization: token });
        /** check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** check the response status code */
        expect(res.statusCode).toBe(200);
    })

    /** Test the recovery pin request */
    it("Request recovery Pin", async()=>{
        /** Ask for recovery pin */
        const res = await rq.post('/auth/password/recover').send({email:userStub.email});
        /** Check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** Check the response status code */
        expect(res.statusCode).toBe(200);
        /** Get the pin from user */
        const user = (await UserWrapper.find({email:userStub.email}));
        /** Check if pin is not undefined */
        expect(typeof user.pwResetPin).toBeDefined()
    })
})