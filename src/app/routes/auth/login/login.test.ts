
import request from 'supertest';
import crypto from '../../../helpers/crypto';
import AppModule from '../../../index';
import { wrapper } from '../../../models';
import dbService from '../../../services/db';
import {userStubModel} from '../../../tests/user.stub';

const userStub = userStubModel
const rq = request(AppModule);
var UserWrapper:any = undefined;

describe("responds to /auth/login",()=>{
    beforeAll(async()=>{
        /** Load the test database */
        await dbService.loadDatabase(true);
        /** Load the user collection wrapper */
        UserWrapper = new wrapper.user();
        /** Create a user for testing */
        await UserWrapper.create(userStub)
        return;
    })
    /** delete user already created for testing */
    afterAll(async()=>{
        return await UserWrapper.delete({email:userStub.email});
    })
    /** Test user login without verified email */
    it("Login without validating email", async()=>{
        /** get login */
        const res = await rq.post('/auth/login/email').send({email:userStub.email, password:userStub.password});
        /** check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** check response status code */
        expect(res.statusCode).toBe(400);
        /** check response body */
        expect(res.body).toEqual(['EMAIL_NOT_VERIFIED']);
    })

    /** Test user login with verified email */
    it("Logn with verified email",async()=>{
        /** Update the validity of email */
        await UserWrapper.update({email:userStub.email}, {emailVerified:true});
        /** Try to login with endpoint */
        const res = await rq.post('/auth/login/email').send({email:userStub.email, password:userStub.password});
        /** check the response content type */
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        /** check the response status code */
        expect(res.statusCode).toBe(200);
        /** check if the password must be changed after login */
        expect(res.body.mustChangePassword).toEqual(false)
    })
})